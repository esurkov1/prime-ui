import * as React from "react";
import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  type ColorSliderProps as AriaColorSliderProps,
  ColorThumb as AriaColorThumb,
  type ColorThumbProps as AriaColorThumbProps,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
  type Color,
  ColorPickerStateContext,
  ColorSliderStateContext,
  composeRenderProps,
  parseColor,
  useLocale,
} from "react-aria-components";
import { Button } from "@/components/button/Button";
import {
  ColorSwatches,
  type ColorSwatchesColorProps,
} from "@/components/color-swatches/ColorSwatches";
import type { HintTone } from "@/components/hint/Hint";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { useControllableState } from "@/hooks/useControllableState";
import { useDraft } from "@/hooks/useDraft";
import { Pipette } from "@/icons/glyphs/pipette";

import { AUTOFILL_OFF } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { FieldActionButton, type FieldActionButtonProps } from "@/internal/FieldAction";
import type { FieldRootDomProps } from "@/internal/FieldFrame";
import { fieldInputTextClass, fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";
import { checkerboardClass, SwatchChip } from "@/internal/swatch";

import styles from "./ColorPicker.module.css";

export type { Color as ColorPickerColorValue } from "react-aria-components";
export type ColorValueFormat = "hsl" | "rgb" | "hex";

declare global {
  interface Window {
    /** The EyeDropper API (Chromium); absent elsewhere. */
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

/** A color channel, from the React Aria types the kit already depends on. */
type ColorChannel = AriaColorSliderProps["channel"];

export type ColorPickerLabels = {
  /** `ColorPicker.FormatSelect` trigger. */
  format: string;
  /** `ColorPicker.EyeDropperButton` (also inside `ChannelStrip`). */
  eyeDropper: string;
  /** Hex field of `ChannelStrip` and the default `HexInput` label. */
  hex: string;
  /** `ColorPicker.SwatchButton`: its name and tooltip. */
  palette: string;
  hue: string;
  saturation: string;
  lightness: string;
  alpha: string;
  red: string;
  green: string;
  blue: string;
};

export const COLOR_PICKER_LABELS: ColorPickerLabels = {
  format: "Формат значений цвета",
  eyeDropper: "Пипетка",
  hex: "Hex",
  palette: "Открыть палитру",
  hue: "Оттенок, градусы",
  saturation: "Насыщенность, проценты",
  lightness: "Яркость, проценты",
  alpha: "Непрозрачность, проценты",
  red: "Красный, 0–255",
  green: "Зелёный, 0–255",
  blue: "Синий, 0–255",
};

export type ColorPickerRootProps = {
  value?: string | Color;
  defaultValue?: string | Color;
  onValueChange?: (color: Color) => void;
  format?: ColorValueFormat;
  defaultFormat?: ColorValueFormat;
  onFormatChange?: (format: ColorValueFormat) => void;
  size?: ControlSize;
  labels?: Partial<ColorPickerLabels>;
  children: React.ReactNode;
};

export type ColorPickerHexInputProps = FieldRootDomProps & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  children?: React.ReactNode;
};

export { parseColor };

/**
 * The kit's transparency checkerboard (`--swatch-checker` of `checkerboardClass` on the track) in
 * 8px cells under the alpha gradient. Inline because it is layered under the gradient that React
 * Aria computes per render.
 */
const CHECKER_LAYER = "var(--swatch-checker) 0% 0% / var(--prime-space-2) var(--prime-space-2)";

type ColorState = NonNullable<React.ContextType<typeof ColorPickerStateContext>>;

type ChannelLabelKey = Extract<ColorChannel, keyof ColorPickerLabels>;

const [ColorPickerProvider, useColorPickerContext] = createComponentContext<{
  format: ColorValueFormat;
  setFormat: (format: ColorValueFormat) => void;
  labels: ColorPickerLabels;
}>("ColorPicker");

/** The picker state; every part lives inside `ColorPicker.Root`, which provides it. */
function useColorState(): ColorState {
  const state = React.useContext(ColorPickerStateContext);
  if (!state) throw new Error("ColorPicker parts must be used inside <ColorPicker.Root>.");
  return state;
}

/** Hex text of a color: `#rrggbb`, or `#rrggbbaa` when it is not opaque. */
export function toHexText(color: Color): string {
  return color.toString(color.getChannelValue("alpha") < 1 ? "hexa" : "hex");
}

/**
 * Draft text of an input bound to the picker color: re-syncs when the color changes (unless the
 * input is focused) and commits on blur / Enter. `parse` returns the new color, or `null` for text
 * it cannot read — the draft then reverts to the current color.
 */
function useColorDraft(
  read: (color: Color) => string,
  parse: (text: string, color: Color) => Color | null,
) {
  const state = useColorState();
  const { inputRef, draft: text, setDraft: setText } = useDraft(read(state.color));

  const commit = () => {
    const next = parse(text.trim(), state.color);
    if (next) state.setColor(next);
    setText(read(next ?? state.color));
  };

  return { inputRef, text, setText, commit };
}

/** Enter commits the draft and leaves the field, like a blur. */
function onCommitKeyDown(commit: () => void) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commit();
    event.currentTarget.blur();
  };
}

/** The color of a CSS color text (hex, `rgb()`, `hsl()`), or `null` for text it cannot read. */
export function parseHex(text: string): Color | null {
  try {
    return parseColor(text);
  } catch {
    return null;
  }
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
      <Select.Root
        value={format}
        onValueChange={(value) => {
          if (isFormat(value)) setFormat(value);
        }}
      >
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

/** Channel value as shown in a cell: alpha in percent, the rest rounded in `space`. */
function displayChannelValue(color: Color, channel: ColorChannel, space: "hsl" | "rgb") {
  const raw = color.toFormat(space).getChannelValue(channel);
  return String(Math.round(channel === "alpha" ? raw * 100 : raw));
}

/** The color with `channel` set from the typed text (clamped to the channel range), or `null`. */
function parseChannelValue(
  text: string,
  color: Color,
  channel: ColorChannel,
  space: "hsl" | "rgb",
): Color | null {
  const n = Number.parseFloat(text.replace(",", "."));
  if (Number.isNaN(n)) return null;
  if (channel === "alpha")
    return color.withChannelValue("alpha", Math.min(100, Math.max(0, n)) / 100);
  const c = color.toFormat(space);
  const range = c.getChannelRange(channel);
  return c.withChannelValue(channel, Math.min(range.maxValue, Math.max(range.minValue, n)));
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
  const { inputRef, text, setText, commit } = useColorDraft(
    (color) => displayChannelValue(color, channel, space),
    (value, color) => parseChannelValue(value, color, channel, space),
  );

  return (
    <label className={cx(fieldTierClass, fieldSurfaceClass, styles.channelCell)} data-size="s">
      <input
        {...AUTOFILL_OFF}
        ref={inputRef}
        aria-label={labels[channel]}
        className={cx(fieldInputTextClass, styles.channelInput)}
        inputMode="decimal"
        value={text}
        onBlur={commit}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onCommitKeyDown(commit)}
      />
      {suffix ? <span className={styles.channelSuffix}>{suffix}</span> : null}
    </label>
  );
}

function StripHexField() {
  const { labels } = useColorPickerContext();
  const { inputRef, text, setText, commit } = useColorDraft(toHexText, parseHex);

  return (
    <label
      className={cx(fieldTierClass, fieldSurfaceClass, styles.channelCell, styles.channelCellHex)}
      data-size="s"
    >
      <input
        {...AUTOFILL_OFF}
        ref={inputRef}
        aria-label={labels.hex}
        autoCapitalize="off"
        autoCorrect="off"
        className={cx(fieldInputTextClass, styles.channelInput)}
        spellCheck={false}
        value={text}
        onBlur={commit}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onCommitKeyDown(commit)}
      />
    </label>
  );
}

export type ColorPickerChannelStripProps = DivProps;

/** Channel row: eyedropper on the left, then the cells of the current format. */
function ChannelStrip({ className, ...rest }: ColorPickerChannelStripProps) {
  const { format } = useColorPickerContext();

  return (
    <div {...rest} className={cx(styles.channelStrip, className)}>
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
  surface?: "none" | "raised";
  ref?: React.Ref<HTMLDivElement>;
};

/** Vertical stack for picker parts with the standard gap; optional raised surface. */
function Panel({ surface = "none", className, children, ...rest }: ColorPickerPanelProps) {
  if (surface === "none") {
    return (
      <div className={cx(styles.panel, className)} data-surface={surface} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={cx(styles.panel, className)}
      data-surface={surface}
      data-depth="floating"
      {...rest}
    >
      <SurfaceDepthProvider value="floating">{children}</SurfaceDepthProvider>
    </div>
  );
}
Panel.displayName = "ColorPicker.Panel";

function ColorPickerRoot({
  value,
  defaultValue,
  onValueChange,
  format: formatProp,
  defaultFormat = "hsl",
  onFormatChange,
  size: sizeProp,
  labels: labelsProp,
  children,
}: ColorPickerRootProps) {
  const tier = useHostTier(sizeProp);
  const [format, setFormat] = useControllableState<ColorValueFormat>({
    value: formatProp,
    defaultValue: defaultFormat,
    onChange: onFormatChange,
  });
  const labels = useLabels(COLOR_PICKER_LABELS, labelsProp);
  const contextValue = React.useMemo(
    () => ({ format, setFormat, labels }),
    [format, setFormat, labels],
  );

  return tier.provide(
    <ColorPickerProvider value={contextValue}>
      <AriaColorPicker value={value} defaultValue={defaultValue} onChange={onValueChange}>
        {children}
      </AriaColorPicker>
    </ColorPickerProvider>,
  );
}
ColorPickerRoot.displayName = "ColorPicker.Root";

export type ColorPickerSliderProps = Omit<AriaColorSliderProps, "isDisabled"> & {
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/** The channel of the slider around a `SliderMeta`, which rounds its readout by it. */
const SliderChannelContext = React.createContext<ColorChannel | null>(null);

function Slider({ className, disabled, ...props }: ColorPickerSliderProps) {
  return (
    <SliderChannelContext.Provider value={props.channel}>
      <AriaColorSlider
        className={composeRenderProps(className, (c) => cx(styles.slider, c))}
        isDisabled={useInheritedDisabled(disabled)}
        {...props}
      />
    </SliderChannelContext.Provider>
  );
}

/**
 * The slider readout, rounded like the channel cells: whole degrees and numbers, whole percent of
 * alpha. React Aria formats the raw channel (a hex converted to hsl gives a hue of `151,03°`).
 */
function sliderValueLabel(color: Color, channel: ColorChannel, locale: string): string {
  const raw = color.getChannelValue(channel);
  const rounded = channel === "alpha" ? Math.round(raw * 100) / 100 : Math.round(raw);
  return color.withChannelValue(channel, rounded).formatChannelValue(channel, locale);
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
      className={composeRenderProps(className, (c) => cx(fieldTierClass, styles.area, c))}
      data-size="l"
      isDisabled={useInheritedDisabled(disabled)}
      {...props}
    />
  );
}

function SliderTrack({ className, style, ...props }: ColorPickerSliderTrackProps) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (c) => cx(checkerboardClass, styles.sliderTrack, c))}
      style={(renderProps) => {
        const fromUser = typeof style === "function" ? style(renderProps) : style;
        const baseBg = renderProps.defaultStyle.background;
        const layered =
          renderProps.isDisabled || baseBg === undefined
            ? baseBg
            : `${String(baseBg)}, ${CHECKER_LAYER}`;
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

/** The draggable thumb of `ColorPicker.Area` and of a `ColorPicker.SliderTrack`. */
function Thumb({ className, ...props }: ColorPickerThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (c) => cx(styles.thumb, c))}
      {...props}
    />
  );
}

export type ColorPickerSwatchesProps = Omit<
  ColorSwatchesColorProps,
  "mode" | "palette" | "value" | "defaultValue" | "onValueChange" | "allowEmpty" | "name"
>;

/**
 * Preset swatches bound to the picker color: picking one sets the color, editing the color
 * elsewhere moves the selection. The kit `ColorSwatches`, so presets carry names.
 */
function Swatches(props: ColorPickerSwatchesProps) {
  const state = useColorState();
  return (
    <ColorSwatches
      {...props}
      value={state.color.toString("hex")}
      onValueChange={(next) => {
        if (next) state.setColor(parseColor(next));
      }}
    />
  );
}
Swatches.displayName = "ColorPicker.Swatches";

export type ColorPickerSliderMetaProps = DivProps & {
  label: React.ReactNode;
};

/**
 * Slider heading: the label and the current channel value. The value is an `<output>` of its own:
 * React Aria's `SliderOutput` inside a color slider points `for` at an id no input carries.
 */
function SliderMeta({ label, className, ...rest }: ColorPickerSliderMetaProps) {
  const slider = React.useContext(ColorSliderStateContext);
  const channel = React.useContext(SliderChannelContext);
  const { locale } = useLocale();
  return (
    <div {...rest} className={cx(styles.sliderHeader, className)}>
      <span className={styles.sliderLabel}>{label}</span>
      <output className={styles.sliderValue} aria-live="off">
        {slider && channel ? sliderValueLabel(slider.value, channel, locale) : null}
      </output>
    </div>
  );
}

function HexInput({ label, hint, hintTone, error, children, ...rest }: ColorPickerHexInputProps) {
  const { labels } = useColorPickerContext();
  const { inputRef, text, setText, commit } = useColorDraft(toHexText, parseHex);

  return (
    <Input.Root {...rest} label={label ?? labels.hex} hint={hint} hintTone={hintTone} error={error}>
      <Input.Wrapper>
        <Input.Field
          ref={inputRef}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={text}
          onBlur={commit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onCommitKeyDown(commit)}
        />
        {children}
      </Input.Wrapper>
    </Input.Root>
  );
}
HexInput.displayName = "ColorPicker.HexInput";

export type ColorPickerEyeDropperButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button.Root>,
  "variant" | "tone" | "size" | "aria-label" | "shape" | "asChild"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Square soft button that opens the native EyeDropper (name: `labels.eyeDropper`). Without
 * browser support it renders disabled and hidden from assistive tech. Default icon: pipette.
 */
function EyeDropperButton({
  children,
  onClick,
  type = "button",
  className,
  ref,
  ...rest
}: ColorPickerEyeDropperButtonProps) {
  const { labels } = useColorPickerContext();
  const state = useColorState();
  // Read after hydration: the server renders the button unsupported, the browser says whether it is.
  const supported = React.useSyncExternalStore(subscribeNever, eyeDropperSupported, () => false);

  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      ref={ref}
      type={type}
      aria-label={labels.eyeDropper}
      aria-hidden={supported ? undefined : true}
      disabled={!supported}
      tabIndex={supported ? undefined : -1}
      className={cx(styles.eyeDropperSquare, className)}
      onClick={(e) => {
        onClick?.(e);
        const EyeDropperApi = window.EyeDropper;
        if (e.defaultPrevented || !EyeDropperApi) return;
        void new EyeDropperApi()
          .open()
          .then((result) => state.setColor(parseColor(result.sRGBHex)))
          .catch(() => {});
      }}
      {...rest}
    >
      {children ?? (
        <Button.Icon>
          <Pipette />
        </Button.Icon>
      )}
    </Button.Root>
  );
}
EyeDropperButton.displayName = "ColorPicker.EyeDropperButton";

/** The EyeDropper API never appears or goes while the page lives: nothing to subscribe to. */
const subscribeNever = () => () => {};
const eyeDropperSupported = () => window.EyeDropper !== undefined;

export type ColorPickerTriggerSwatchProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Square of the current color, e.g. inside the popover trigger button. */
function TriggerSwatch(props: ColorPickerTriggerSwatchProps) {
  const state = useColorState();
  return <SwatchChip {...props} value={state.color.toString("css")} />;
}
TriggerSwatch.displayName = "ColorPicker.TriggerSwatch";

export type ColorPickerSwatchButtonProps = Omit<
  FieldActionButtonProps,
  "label" | "children" | "asChild"
>;

/**
 * The current color as a button segment at the end of `HexInput` (named `labels.palette`, with a
 * tooltip): the hex and its swatch read as one field. Wrap it in `Popover.Trigger` to open a panel.
 */
function SwatchButton({ className, ...rest }: ColorPickerSwatchButtonProps) {
  const { labels } = useColorPickerContext();
  return (
    <FieldActionButton
      {...rest}
      label={labels.palette}
      className={cx(styles.swatchButton, className)}
    >
      <TriggerSwatch />
    </FieldActionButton>
  );
}
SwatchButton.displayName = "ColorPicker.SwatchButton";

export const ColorPicker = {
  Root: ColorPickerRoot,
  Panel,
  TriggerSwatch,
  SwatchButton,
  FormatSelect,
  ChannelStrip,
  HexInput,
  Area,
  Slider,
  SliderMeta,
  SliderTrack,
  Thumb,
  Swatches,
  EyeDropperButton,
};
