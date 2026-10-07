import type { ColorChannel } from "@react-types/color";
import * as React from "react";
import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
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
  type Color,
  ColorPickerStateContext,
  composeRenderProps,
  parseColor,
} from "react-aria-components";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";

import styles from "./ColorPicker.module.css";

export type { Color as ColorPickerColorValue } from "react-aria-components";
export type ColorValueFormat = "hsl" | "rgb" | "hex";

export type ColorPickerLabels = {
  /** `ColorPicker.FormatSelect` trigger. */
  format: string;
  /** `ColorPicker.EyeDropperButton` (also inside `ChannelStrip`). */
  eyeDropper: string;
  /** Hex field of `ChannelStrip` and the default `HexInput` label. */
  hex: string;
  hue: string;
  saturation: string;
  lightness: string;
  alpha: string;
  red: string;
  green: string;
  blue: string;
};

const COLOR_PICKER_LABELS: ColorPickerLabels = {
  format: "Формат значений цвета",
  eyeDropper: "Пипетка",
  hex: "Hex",
  hue: "Оттенок, градусы",
  saturation: "Насыщенность, проценты",
  lightness: "Яркость, проценты",
  alpha: "Непрозрачность, проценты",
  red: "Красный, 0–255",
  green: "Зелёный, 0–255",
  blue: "Синий, 0–255",
};

export type ColorPickerRootProps = {
  /** Controlled color: a CSS color string or a `Color` from `parseColor`. */
  value?: string | Color;
  defaultValue?: string | Color;
  onValueChange?: (color: Color) => void;
  /** Initial value format of `FormatSelect` and `ChannelStrip`. */
  defaultFormat?: ColorValueFormat;
  labels?: Partial<ColorPickerLabels>;
  children: React.ReactNode;
};

export type ColorPickerHexInputProps = {
  size?: ControlSize;
  label?: React.ReactNode;
  /**
   * Draws the focus ring on the focused field (default). `false` sets `data-focus-ring="false"` and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
  className?: string;
};

export { parseColor };

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

/** Transparency checkerboard drawn under color layers (token colors, 8px cells). */
const CHECKER_GRADIENT =
  "repeating-conic-gradient(var(--prime-color-bg-surface) 0deg 90deg, var(--prime-color-fill-strong) 90deg 180deg)";
const CHECKER_BG = `${CHECKER_GRADIENT} 0% 0% / var(--prime-space-2) var(--prime-space-2)`;
const TRIGGER_SWATCH_FALLBACK_FILL = "var(--prime-color-fill-strong)";

type ColorPickerCtx = NonNullable<React.ContextType<typeof ColorPickerStateContext>>;

type ChannelLabelKey = Extract<ColorChannel, keyof ColorPickerLabels>;

const [ColorPickerProvider, useColorPickerContext] = createComponentContext<{
  format: ColorValueFormat;
  setFormat: (f: ColorValueFormat) => void;
  labels: ColorPickerLabels;
}>("ColorPicker");

/** Hex text of the current color (`#rrggbb`, or `#rrggbbaa` with alpha). */
function toHexText(color: Color) {
  return color.toString(color.getChannelValue("alpha") < 1 ? "hexa" : "hex");
}

/**
 * Draft text for a hex input bound to the picker state: re-syncs when the color changes
 * (unless the input is focused) and commits on blur / Enter, reverting invalid input.
 */
function useHexDraft(inputRef: React.RefObject<HTMLInputElement | null>) {
  const state = React.useContext(ColorPickerStateContext);
  const [text, setText] = React.useState(() => (state ? toHexText(state.color) : ""));
  const fingerprint = state ? state.color.toString("hexa") : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: the RAC state object is stable; the color change is tracked by its fingerprint
  React.useEffect(() => {
    if (!state || (inputRef.current && document.activeElement === inputRef.current)) return;
    setText(toHexText(state.color));
  }, [fingerprint]);

  const commit = () => {
    if (!state) return;
    try {
      state.setColor(parseColor(text.trim()));
    } catch {
      setText(toHexText(state.color));
    }
  };

  return { state, text, setText, commit };
}

function FormatSelect({ className }: { className?: string }) {
  const { format, setFormat, labels } = useColorPickerContext();

  return (
    <div className={cx(styles.formatSelectWrap, className)}>
      <Select.Root
        value={format}
        onValueChange={(v) => {
          if (v === "hsl" || v === "rgb" || v === "hex") {
            setFormat(v);
          }
        }}
      >
        <Select.Trigger aria-label={labels.format}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
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
  channel: ChannelLabelKey;
  space: "hsl" | "rgb";
  suffix: string;
}) {
  const { labels } = useColorPickerContext();
  const state = React.useContext(ColorPickerStateContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState(() =>
    state ? displayChannelValue(state.color, channel, space) : "",
  );
  const fingerprint = state ? state.color.toString("hexa") : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: the RAC state object is stable; the color change is tracked by its fingerprint
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
    <label className={styles.channelCell}>
      <input
        ref={inputRef}
        aria-label={labels[channel]}
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
      {suffix ? <span className={styles.channelSuffix}>{suffix}</span> : null}
    </label>
  );
}

function StripHexField() {
  const { labels } = useColorPickerContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { state, text, setText, commit } = useHexDraft(inputRef);

  if (!state) {
    return null;
  }

  return (
    <label className={cx(styles.channelCell, styles.channelCellHex)}>
      <input
        ref={inputRef}
        aria-label={labels.hex}
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
    </label>
  );
}

export type ColorPickerChannelStripProps = {
  className?: string;
  /**
   * Draws the focus ring on the focused field (default). `false` sets `data-focus-ring="false"` and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
};

/** Channel row: eyedropper on the left, then the cells of the current format. */
function ChannelStrip({ className, focusRing = true }: ColorPickerChannelStripProps) {
  const { format } = useColorPickerContext();

  return (
    <div
      className={cx(styles.channelStrip, className)}
      data-focus-ring={focusRing ? undefined : "false"}
    >
      <div className={styles.channelStripLead}>
        <EyeDropperButton className={styles.channelStripEyedropperBtn} />
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

export type ColorPickerPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * `none` (default) — layout only, for use inside Popover / Card that already provide a surface.
   * `raised` — standalone floating panel: raised background, panel radius/padding, overlay shadow.
   */
  surface?: "none" | "raised";
};

/** Vertical stack for picker parts with the standard gap; optional raised surface. */
const Panel = React.forwardRef<HTMLDivElement, ColorPickerPanelProps>(function Panel(
  { surface = "none", className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(styles.panel, className)} data-surface={surface} {...rest} />;
});

Panel.displayName = "ColorPicker.Panel";

function ColorPickerRoot({
  value,
  defaultValue,
  onValueChange,
  defaultFormat = "hsl",
  labels: labelsProp,
  children,
}: ColorPickerRootProps) {
  const [format, setFormat] = React.useState<ColorValueFormat>(defaultFormat);
  const labels = React.useMemo(() => ({ ...COLOR_PICKER_LABELS, ...labelsProp }), [labelsProp]);
  const contextValue = React.useMemo(() => ({ format, setFormat, labels }), [format, labels]);

  return (
    <ColorPickerProvider value={contextValue}>
      <AriaColorPicker value={value} defaultValue={defaultValue} onChange={onValueChange}>
        {children}
      </AriaColorPicker>
    </ColorPickerProvider>
  );
}
ColorPickerRoot.displayName = "ColorPicker.Root";

export type ColorPickerFieldProps = React.ComponentProps<typeof AriaColorField> & {
  /**
   * Draws the focus ring on the focused field (default). `false` sets `data-focus-ring="false"` and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
};

function Field({ className, focusRing = true, ...props }: ColorPickerFieldProps) {
  return (
    <AriaColorField
      className={composeRenderProps(className, (c) => cx(styles.field, c))}
      data-focus-ring={focusRing ? undefined : "false"}
      {...props}
    />
  );
}

export type ColorPickerSliderProps = Omit<AriaColorSliderProps, "isDisabled"> & {
  disabled?: boolean;
};

function Slider({ className, disabled, ...props }: ColorPickerSliderProps) {
  return (
    <AriaColorSlider
      className={composeRenderProps(className, (c) => cx(styles.slider, c))}
      isDisabled={disabled}
      {...props}
    />
  );
}

export type ColorPickerAreaProps = Omit<AriaColorAreaProps, "isDisabled"> & {
  disabled?: boolean;
};

function Area({ className, disabled, ...props }: ColorPickerAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (c) => cx(styles.area, c))}
      isDisabled={disabled}
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

export type ColorPickerSwatchPickerProps = Omit<AriaColorSwatchPickerProps, "onChange"> & {
  onValueChange?: (color: Color) => void;
};

/** Preset group. Inside `Root` it follows the picker color; standalone it takes `value` itself. */
function SwatchPicker({ className, onValueChange, ...props }: ColorPickerSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (c) => cx(styles.swatchPicker, c))}
      onChange={onValueChange}
      {...props}
    />
  );
}

export type ColorPickerSwatchPickerItemProps = Omit<
  AriaColorSwatchPickerItemProps,
  "isDisabled"
> & {
  disabled?: boolean;
};

function SwatchPickerItem({ className, disabled, ...props }: ColorPickerSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (c) => cx(styles.swatchItem, c))}
      isDisabled={disabled}
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

function HexInput({ size = "m", label, focusRing = true, className }: ColorPickerHexInputProps) {
  const { labels } = useColorPickerContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { state, text, setText, commit } = useHexDraft(inputRef);

  if (!state) {
    return null;
  }

  return (
    <Input.Root className={className} label={label ?? labels.hex} size={size} focusRing={focusRing}>
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

export type ColorPickerEyeDropperButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button.Root>,
  "variant" | "tone" | "size" | "aria-label"
>;

/**
 * Square soft button that opens the native EyeDropper (name: `labels.eyeDropper`). Without
 * browser support it renders disabled and hidden from assistive tech. Default icon: pipette.
 */
const EyeDropperButton = React.forwardRef<HTMLButtonElement, ColorPickerEyeDropperButtonProps>(
  function EyeDropperButton(
    { children, onClick, type = "button", className, ...rest },
    forwardedRef,
  ) {
    const { labels } = useColorPickerContext();
    const state = React.useContext(ColorPickerStateContext);
    const content = children ?? (
      <Button.Icon>
        <Icon name="action.eyedropper" />
      </Button.Icon>
    );
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
          variant="soft"
          tone="neutral"
          ref={forwardedRef}
          aria-hidden
          className={cx(styles.eyeDropperSquare, className)}
          disabled
          tabIndex={-1}
          type={type}
          {...rest}
        >
          {content}
        </Button.Root>
      );
    }

    return (
      <Button.Root
        variant="soft"
        tone="neutral"
        ref={forwardedRef}
        type={type}
        aria-label={labels.eyeDropper}
        className={cx(styles.eyeDropperSquare, className)}
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
        {content}
      </Button.Root>
    );
  },
);

EyeDropperButton.displayName = "ColorPicker.EyeDropperButton";

export type ColorPickerTriggerSwatchProps = {
  className?: string;
};

/** Square of the current color, e.g. inside the popover trigger button. */
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
  Panel,
  TriggerSwatch,
  FormatSelect,
  ChannelStrip,
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
