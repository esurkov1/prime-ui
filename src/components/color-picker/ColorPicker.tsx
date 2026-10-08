import type { ColorChannel } from "@react-types/color";
import * as React from "react";
import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  type ColorSliderProps as AriaColorSliderProps,
  ColorThumb as AriaColorThumb,
  type ColorThumbProps as AriaColorThumbProps,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
  type Color,
  ColorPickerStateContext,
  composeRenderProps,
  parseColor,
} from "react-aria-components";

import { Button } from "@/components/button/Button";
import { ColorSwatches, type ColorSwatchesProps } from "@/components/color-swatches/ColorSwatches";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { FieldRootDomProps } from "@/internal/FieldFrame";
import { fieldSurfaceClass } from "@/internal/fieldClasses";
import type { ControlSize } from "@/internal/states";
import { SwatchFill } from "@/internal/swatch";

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

export type ColorPickerHexInputProps = FieldRootDomProps & {
  size?: ControlSize;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message in the hint slot; implies `invalid`. */
  error?: React.ReactNode;
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

/**
 * Transparency checkerboard under the alpha track (token colors, 8px cells). Inline because it is
 * layered under the gradient that React Aria computes per render.
 */
const CHECKER_BG =
  "repeating-conic-gradient(var(--prime-color-bg-surface) 0deg 90deg, var(--prime-color-fill-strong) 90deg 180deg) 0% 0% / var(--prime-space-2) var(--prime-space-2)";

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

const FORMAT_LABELS: Record<ColorValueFormat, string> = { hsl: "HSL", rgb: "RGB", hex: "Hex" };

const isFormat = (value: string): value is ColorValueFormat => value in FORMAT_LABELS;

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  ref?: React.Ref<HTMLDivElement>;
};

export type ColorPickerFormatSelectProps = DivProps;

function FormatSelect({ className, ...rest }: ColorPickerFormatSelectProps) {
  const { format, setFormat, labels } = useColorPickerContext();

  return (
    <div {...rest} className={cx(styles.formatSelectWrap, className)}>
      <Select.Root value={format} onValueChange={(value) => isFormat(value) && setFormat(value)}>
        <Select.Trigger aria-label={labels.format}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {Object.entries(FORMAT_LABELS).map(([value, label]) => (
            <Select.Item key={value} label={label} value={value}>
              {label}
            </Select.Item>
          ))}
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
    <label className={cx(fieldSurfaceClass, styles.channelCell)}>
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
    <label className={cx(fieldSurfaceClass, styles.channelCell, styles.channelCellHex)}>
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

export type ColorPickerChannelStripProps = DivProps & {
  /**
   * Draws the focus ring on the focused field (default). `false` sets `data-focus-ring="false"` and
   * hides only the visual ring — focus, keyboard and ARIA are unchanged, the error ring still shows.
   * Turn it off only where focus is otherwise obvious; WCAG 2.4.7.
   */
  focusRing?: boolean;
};

/** Channel row: eyedropper on the left, then the cells of the current format. */
function ChannelStrip({ className, focusRing = true, ...rest }: ColorPickerChannelStripProps) {
  const { format } = useColorPickerContext();

  return (
    <div
      {...rest}
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

export type ColorPickerSliderProps = Omit<AriaColorSliderProps, "isDisabled"> & {
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
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
  ref?: React.Ref<HTMLDivElement>;
};

export type ColorPickerSliderTrackProps = AriaSliderTrackProps & {
  ref?: React.Ref<HTMLDivElement>;
};

export type ColorPickerThumbProps = AriaColorThumbProps & { ref?: React.Ref<HTMLDivElement> };

function Area({ className, disabled, ...props }: ColorPickerAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (c) => cx(styles.area, c))}
      isDisabled={disabled}
      {...props}
    />
  );
}

function SliderTrack({ className, style, ...props }: ColorPickerSliderTrackProps) {
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

function Thumb({ className, ...props }: ColorPickerThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (c) => cx(styles.thumb, c))}
      {...props}
    />
  );
}

function AreaThumb({ className, ...props }: ColorPickerThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (c) => cx(styles.thumbArea, c))}
      {...props}
    />
  );
}

export type ColorPickerSwatchesProps = Omit<
  ColorSwatchesProps,
  "value" | "defaultValue" | "onValueChange" | "allowEmpty" | "name"
>;

/**
 * Preset swatches bound to the picker color: picking one sets the color, editing the color
 * elsewhere moves the selection. The kit `ColorSwatches`, so presets carry names.
 */
function Swatches(props: ColorPickerSwatchesProps) {
  const state = React.useContext(ColorPickerStateContext);
  if (!state) return null;
  return (
    <ColorSwatches
      {...props}
      value={state.color.toString("hex")}
      onValueChange={(next) => next && state.setColor(parseColor(next))}
    />
  );
}

export type ColorPickerSliderMetaProps = DivProps & {
  /** The channel name. */
  label: React.ReactNode;
};

/** Slider heading: the label and the current channel value. */
function SliderMeta({ label, className, ...rest }: ColorPickerSliderMetaProps) {
  return (
    <div {...rest} className={cx(styles.sliderHeader, className)}>
      <span className={styles.sliderLabel}>{label}</span>
      <AriaSliderOutput className={styles.sliderValue} />
    </div>
  );
}

function HexInput({
  size = "m",
  label,
  hint,
  error,
  focusRing = true,
  className,
  ...rest
}: ColorPickerHexInputProps) {
  const { labels } = useColorPickerContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { state, text, setText, commit } = useHexDraft(inputRef);

  if (!state) {
    return null;
  }

  return (
    <Input.Root
      {...rest}
      className={className}
      label={label ?? labels.hex}
      hint={hint}
      error={error}
      size={size}
      focusRing={focusRing}
    >
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

export type ColorPickerTriggerSwatchProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Square of the current color, e.g. inside the popover trigger button. */
function TriggerSwatch({ className, ...rest }: ColorPickerTriggerSwatchProps) {
  const state = React.useContext(ColorPickerStateContext);
  return (
    <span {...rest} aria-hidden className={cx(styles.triggerSwatch, className)}>
      <SwatchFill value={state ? state.color.toString("css") : null} />
    </span>
  );
}

TriggerSwatch.displayName = "ColorPicker.TriggerSwatch";
Swatches.displayName = "ColorPicker.Swatches";

export const ColorPicker = {
  Root: ColorPickerRoot,
  Panel,
  TriggerSwatch,
  FormatSelect,
  ChannelStrip,
  HexInput,
  Area,
  AreaThumb,
  Slider,
  SliderMeta,
  SliderTrack,
  Thumb,
  Swatches,
  EyeDropperButton,
};
