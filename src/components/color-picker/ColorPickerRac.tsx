import type { ColorChannel } from "@react-types/color";
import * as React from "react";
import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
  ColorSlider as AriaColorSlider,
  type ColorSliderProps as AriaColorSliderProps,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchProps as AriaColorSwatchProps,
  ColorThumb as AriaColorThumb,
  type ColorThumbProps as AriaColorThumbProps,
  SliderOutput as AriaSliderOutput,
  type SliderOutputProps as AriaSliderOutputProps,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
  ColorPickerStateContext,
  composeRenderProps,
  parseColor,
} from "react-aria-components";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import selectStyles from "@/components/select/Select.module.css";
import { cx } from "@/internal/cx";
import type { InputSize } from "@/internal/states";

import styles from "./ColorPicker.module.css";

export type { Color as ColorPickerColorValue, ColorPickerRenderProps } from "react-aria-components";
export type ColorPickerRootProps = AriaColorPickerProps;
export type ColorValueFormat = "hsl" | "rgb" | "hex";

export type ColorPickerHexInputProps = {
  size?: InputSize;
  label?: React.ReactNode;
  className?: string;
};

export type ColorPickerFormatProviderProps = {
  children: React.ReactNode;
  defaultFormat?: ColorValueFormat;
};

export { parseColor };

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

const CHECKER_GRADIENT =
  "repeating-conic-gradient(var(--prime-sys-color-border-inverse) 0deg 90deg, color-mix(in srgb, var(--prime-sys-color-content-primary) 22%, transparent) 90deg 180deg)";
const CHECKER_BG = `${CHECKER_GRADIENT} 0% 0% / var(--prime-sys-unit-0p5rem) var(--prime-sys-unit-0p5rem)`;
const TRIGGER_SWATCH_FALLBACK_FILL =
  "color-mix(in srgb, var(--prime-sys-color-content-primary) 12%, transparent)";

type ColorPickerCtx = NonNullable<React.ContextType<typeof ColorPickerStateContext>>;

const CHANNEL_ARIA: Partial<Record<ColorChannel, string>> = {
  hue: "Оттенок, градусы",
  saturation: "Насыщенность, проценты",
  lightness: "Яркость, проценты",
  alpha: "Непрозрачность, проценты",
  red: "Красный, 0–255",
  green: "Зелёный, 0–255",
  blue: "Синий, 0–255",
};

const ColorValueFormatContext = React.createContext<{
  format: ColorValueFormat;
  setFormat: (f: ColorValueFormat) => void;
} | null>(null);

function useColorValueFormat(): {
  format: ColorValueFormat;
  setFormat: (f: ColorValueFormat) => void;
} {
  const v = React.useContext(ColorValueFormatContext);
  if (!v) {
    throw new Error(
      "ColorPicker: оберните разметку в ColorPicker.FormatProvider для формата и полосы каналов.",
    );
  }
  return v;
}

function FormatProvider({ children, defaultFormat = "hsl" }: ColorPickerFormatProviderProps) {
  const [format, setFormat] = React.useState<ColorValueFormat>(defaultFormat);
  const value = React.useMemo(() => ({ format, setFormat }), [format]);
  return (
    <ColorValueFormatContext.Provider value={value}>{children}</ColorValueFormatContext.Provider>
  );
}

const FORMAT_SELECT_LABEL: Record<ColorValueFormat, string> = {
  hsl: "HSL",
  rgb: "RGB",
  hex: "Hex",
};

function FormatSelect({ className }: { className?: string }) {
  const ctx = React.useContext(ColorValueFormatContext);
  if (!ctx) {
    return null;
  }
  const { format, setFormat } = ctx;

  return (
    <div className={cx(styles.formatSelectWrap, className)}>
      <Select.Root
        value={format}
        onChange={(v) => {
          if (v === "hsl" || v === "rgb" || v === "hex") {
            setFormat(v);
          }
        }}
      >
        <Select.Trigger aria-label="Формат значений цвета">
          <span className={selectStyles.triggerValue}>{FORMAT_SELECT_LABEL[format]}</span>
        </Select.Trigger>
        <Select.Content className={styles.formatSelectContent}>
          <Select.Item label="HSL" value="hsl">
            HSL
          </Select.Item>
          <Select.Item label="RGB" value="rgb">
            RGB
          </Select.Item>
          <Select.Item label="Hex" value="hex">
            Hex
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

function displayChannelValue(
  color: ColorPickerCtx["color"],
  channel: ColorChannel,
  space: "hsl" | "rgb",
) {
  const c = color.toFormat(space);
  const raw = c.getChannelValue(channel);
  if (channel === "alpha") {
    return String(Math.round(raw * 100));
  }
  return String(Math.round(raw));
}

function applyChannelValue(
  state: ColorPickerCtx,
  channel: ColorChannel,
  space: "hsl" | "rgb",
  text: string,
) {
  const trimmed = text.trim().replace(",", ".");
  const n = Number.parseFloat(trimmed);
  if (Number.isNaN(n)) {
    return;
  }
  if (channel === "alpha") {
    const pct = Math.min(100, Math.max(0, n));
    state.setColor(state.color.withChannelValue("alpha", pct / 100));
    return;
  }
  const c = state.color.toFormat(space);
  const range = c.getChannelRange(channel);
  const v = Math.min(range.maxValue, Math.max(range.minValue, n));
  state.setColor(c.withChannelValue(channel, v));
}

function ChannelField({
  channel,
  space,
  suffix,
}: {
  channel: ColorChannel;
  space: "hsl" | "rgb";
  suffix: string;
}) {
  const state = React.useContext(ColorPickerStateContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState(() =>
    state ? displayChannelValue(state.color, channel, space) : "",
  );
  const fingerprint = state ? state.color.toString("hexa") : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: см. HexInput — state стабилен, цвет по fingerprint
  React.useEffect(() => {
    if (!state) {
      return;
    }
    if (inputRef.current && document.activeElement === inputRef.current) {
      return;
    }
    setText(displayChannelValue(state.color, channel, space));
  }, [fingerprint]);

  if (!state) {
    return null;
  }

  const commit = () => {
    applyChannelValue(state, channel, space, text);
    setText(displayChannelValue(state.color, channel, space));
  };

  return (
    <div className={styles.channelCell}>
      <input
        ref={inputRef}
        aria-label={CHANNEL_ARIA[channel] ?? String(channel)}
        className={styles.channelInput}
        inputMode="decimal"
        value={text}
        onBlur={commit}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
            inputRef.current?.blur();
          }
        }}
      />
      <span className={styles.channelSuffix}>{suffix}</span>
    </div>
  );
}

function StripHexField() {
  const state = React.useContext(ColorPickerStateContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState(() => {
    if (!state) {
      return "";
    }
    const c = state.color;
    const a = c.getChannelValue("alpha");
    return c.toString(a < 1 ? "hexa" : "hex");
  });
  const fingerprint = state ? state.color.toString("hexa") : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: см. HexInput
  React.useEffect(() => {
    if (!state) {
      return;
    }
    if (inputRef.current && document.activeElement === inputRef.current) {
      return;
    }
    const c = state.color;
    const a = c.getChannelValue("alpha");
    setText(c.toString(a < 1 ? "hexa" : "hex"));
  }, [fingerprint]);

  if (!state) {
    return null;
  }

  const commit = () => {
    try {
      state.setColor(parseColor(text.trim()));
    } catch {
      const c = state.color;
      const a = c.getChannelValue("alpha");
      setText(c.toString(a < 1 ? "hexa" : "hex"));
    }
  };

  return (
    <div className={cx(styles.channelCell, styles.channelCellHex)}>
      <input
        ref={inputRef}
        aria-label="Hex"
        autoCapitalize="off"
        autoCorrect="off"
        className={styles.channelInput}
        spellCheck={false}
        value={text}
        onBlur={commit}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
            inputRef.current?.blur();
          }
        }}
      />
    </div>
  );
}

/** Полоса каналов: слева пипетка из {@link EyeDropperButton}, справа — ячейки; иконку пипетки передайте `pipetteIcon`. */
function ChannelStripWithIcon({
  className,
  pipetteIcon,
}: {
  className?: string;
  pipetteIcon: React.ReactNode;
}) {
  const { format } = useColorValueFormat();

  return (
    <div className={cx(styles.channelStrip, className)}>
      <div className={styles.channelStripLead}>
        <EyeDropperButton className={styles.channelStripEyedropperBtn}>
          <Button.Icon>{pipetteIcon}</Button.Icon>
        </EyeDropperButton>
      </div>
      {format === "hex" ? (
        <StripHexField />
      ) : format === "hsl" ? (
        <>
          <ChannelField channel="hue" space="hsl" suffix="°" />
          <ChannelField channel="saturation" space="hsl" suffix="%" />
          <ChannelField channel="lightness" space="hsl" suffix="%" />
          <ChannelField channel="alpha" space="hsl" suffix="%" />
        </>
      ) : (
        <>
          <ChannelField channel="red" space="rgb" suffix="" />
          <ChannelField channel="green" space="rgb" suffix="" />
          <ChannelField channel="blue" space="rgb" suffix="" />
          <ChannelField channel="alpha" space="rgb" suffix="%" />
        </>
      )}
    </div>
  );
}

function ColorPickerRoot(props: AriaColorPickerProps) {
  return <AriaColorPicker {...props} />;
}

function Field({ className, ...props }: React.ComponentProps<typeof AriaColorField>) {
  return (
    <AriaColorField
      className={composeRenderProps(className, (c) => cx(styles.field, c))}
      {...props}
    />
  );
}

function Slider({ className, ...props }: AriaColorSliderProps) {
  return (
    <AriaColorSlider
      className={composeRenderProps(className, (c) => cx(styles.slider, c))}
      data-size="m"
      {...props}
    />
  );
}

function Area({ className, ...props }: AriaColorAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (c) => cx(styles.area, c))}
      {...props}
    />
  );
}

function SliderTrack({ className, style, ...props }: AriaSliderTrackProps) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (c) => cx(styles.sliderTrack, c))}
      style={(renderProps) => {
        const fromUser = typeof style === "function" ? style(renderProps) : style;
        const baseBg = renderProps.defaultStyle.background;
        const layered =
          renderProps.isDisabled || baseBg === undefined
            ? baseBg
            : `${String(baseBg)}, ${CHECKER_BG}`;
        return {
          ...renderProps.defaultStyle,
          ...fromUser,
          ...(layered !== undefined ? { background: layered } : null),
        };
      }}
      {...props}
    />
  );
}

function Thumb({ className, ...props }: AriaColorThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (c) => cx(styles.thumb, c))}
      {...props}
    />
  );
}

function AreaThumb({ className, ...props }: AriaColorThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (c) => cx(styles.thumbArea, c))}
      {...props}
    />
  );
}

function SwatchPicker({ className, ...props }: AriaColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (c) => cx(styles.swatchPicker, c))}
      {...props}
    />
  );
}

function SwatchPickerItem({ className, ...props }: AriaColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (c) => cx(styles.swatchItem, c))}
      {...props}
    />
  );
}

function Swatch({ className, style, ...props }: AriaColorSwatchProps) {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (c) => cx(styles.swatch, c))}
      style={(renderProps) => {
        const fromUser = typeof style === "function" ? style(renderProps) : style;
        const baseBg = renderProps.defaultStyle.background;
        return {
          ...renderProps.defaultStyle,
          ...fromUser,
          ...(baseBg !== undefined ? { background: `${String(baseBg)}, ${CHECKER_BG}` } : null),
        };
      }}
      {...props}
    />
  );
}

function Output(props: AriaSliderOutputProps) {
  return (
    <AriaSliderOutput
      {...props}
      className={composeRenderProps(props.className, (c) => cx(styles.sliderValue, c))}
    />
  );
}

function SliderMeta({ label }: { label: React.ReactNode }) {
  return (
    <div className={styles.sliderHeader}>
      <span className={styles.sliderLabel}>{label}</span>
      <Output />
    </div>
  );
}

function HexInput({ size = "m", label = "Hex", className }: ColorPickerHexInputProps) {
  const state = React.useContext(ColorPickerStateContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState(() => {
    if (!state) {
      return "";
    }
    const c = state.color;
    const a = c.getChannelValue("alpha");
    return c.toString(a < 1 ? "hexa" : "hex");
  });
  const colorFingerprint = state ? state.color.toString("hexa") : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: объект state от RAC стабилен по ссылке; пересинхрон при смене цвета даёт только colorFingerprint
  React.useEffect(() => {
    if (!state) {
      return;
    }
    if (inputRef.current && document.activeElement === inputRef.current) {
      return;
    }
    const c = state.color;
    const a = c.getChannelValue("alpha");
    setText(c.toString(a < 1 ? "hexa" : "hex"));
  }, [colorFingerprint]);

  if (!state) {
    return null;
  }

  const commit = () => {
    try {
      state.setColor(parseColor(text.trim()));
    } catch {
      const c = state.color;
      const a = c.getChannelValue("alpha");
      setText(c.toString(a < 1 ? "hexa" : "hex"));
    }
  };

  return (
    <Input.Root className={className} label={label} size={size}>
      <Input.Wrapper>
        <Input.Field
          ref={inputRef}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={text}
          onBlur={commit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </Input.Wrapper>
    </Input.Root>
  );
}

const EyeDropperButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Button.Root>, "variant" | "mode" | "size">
>(function EyeDropperButton(
  { children, onClick, type = "button", "aria-label": ariaLabel, className, ...rest },
  forwardedRef,
) {
  const state = React.useContext(ColorPickerStateContext);
  const EyeDropperApi =
    typeof globalThis !== "undefined"
      ? (globalThis as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper
      : undefined;

  if (!state) {
    return null;
  }

  if (!EyeDropperApi) {
    return (
      <Button.Root
        ref={forwardedRef}
        aria-hidden
        className={cx(styles.eyeDropperSquare, className)}
        disabled
        mode="stroke"
        size="m"
        tabIndex={-1}
        type={type}
        variant="neutral"
        {...rest}
      >
        {children}
      </Button.Root>
    );
  }

  return (
    <Button.Root
      ref={forwardedRef}
      type={type}
      aria-label={ariaLabel ?? "Пипетка"}
      className={cx(styles.eyeDropperSquare, className)}
      mode="stroke"
      size="m"
      variant="neutral"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) {
          return;
        }
        void new EyeDropperApi()
          .open()
          .then((result) => state.setColor(parseColor(result.sRGBHex)))
          .catch(() => {});
      }}
      {...rest}
    >
      {children}
    </Button.Root>
  );
});

EyeDropperButton.displayName = "EyeDropperButton";

export type ColorPickerTriggerSwatchProps = {
  className?: string;
};

/** Квадратик текущего цвета из {@link ColorPickerStateContext}; для кнопки-триггера поповера и т.п. */
function TriggerSwatch({ className }: ColorPickerTriggerSwatchProps) {
  const state = React.useContext(ColorPickerStateContext);
  const colorCss = state != null ? state.color.toString("css") : TRIGGER_SWATCH_FALLBACK_FILL;
  return (
    <span aria-hidden className={cx(styles.triggerSwatch, className)}>
      <svg
        className={styles.triggerSwatchSvg}
        aria-hidden="true"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <rect width="1" height="1" fill={colorCss} />
      </svg>
    </span>
  );
}

TriggerSwatch.displayName = "ColorPicker.TriggerSwatch";

export const ColorPicker = {
  Root: ColorPickerRoot,
  TriggerSwatch,
  FormatProvider,
  FormatSelect,
  ChannelStrip: ChannelStripWithIcon,
  Field,
  HexInput,
  Area,
  AreaThumb,
  Slider,
  SliderMeta,
  SliderTrack,
  Thumb,
  Output,
  SwatchPicker,
  SwatchPickerItem,
  Swatch,
  EyeDropperButton,
};
