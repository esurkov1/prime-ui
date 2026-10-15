import * as React from "react";

import { Input } from "@/components/input/Input";
import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import {
  DEFAULT_ALIGN,
  DEFAULT_SIDE,
  type PositionAlign,
  type PositionSide,
} from "@/hooks/usePosition";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { FieldFrame, useFieldFrame } from "@/internal/FieldFrame";
import { useFieldCell } from "@/internal/fieldCell";
import { fieldLabelTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";
import {
  COLOR_PRESETS,
  type ColorPreset,
  parseHexColor,
  SwatchChip,
  SwatchContent,
  SwatchFill,
  type SwatchOption,
  sameColor,
  swatchClass,
  swatchGridClass,
  swatchTierClass,
  swatchTriggerClass,
  useBalancedColumns,
  useSwatchGrid,
  useSwatchOptions,
} from "@/internal/swatch";

import styles from "./ColorPresets.module.css";

export { COLOR_PRESETS, type ColorPreset };

export type ColorPresetsLabels = {
  /** Trigger name prefix: `aria-label` = "<trigger>: <color name>". */
  trigger: string;
  /** Accessible name of the swatch list when `Content` has no `label`. */
  list: string;
  /** The "no color" swatch (`allowEmpty`) and the trigger name for an empty value. */
  empty: string;
  /** Label of the hex field under the swatches (`allowCustom`). */
  custom: string;
  /** Error of the hex field when Enter finds no hex color in it. */
  customInvalid: string;
};

export const COLOR_PRESETS_LABELS: ColorPresetsLabels = {
  trigger: "Цвет",
  list: "Цвета",
  empty: "Без цвета",
  custom: "Свой цвет",
  customInvalid: "Введите цвет в формате #RRGGBB",
};

type Ctx = {
  value: string | null;
  select: (value: string | null) => void;
  close: () => void;
  options: SwatchOption[];
  selectedLabel: string;
  columns: number;
  size: ControlSize;
  disabled: boolean;
  allowCustom: boolean;
  labels: ColorPresetsLabels;
  triggerRef: React.RefObject<HTMLElement | null>;
  /** In a FieldList cell: the trigger id the cell label points at. */
  triggerId: string | undefined;
};

const [ColorPresetsProvider, useColorPresetsContext] = createComponentContext<Ctx>("ColorPresets");

export type ColorPresetsRootProps = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  presets?: readonly ColorPreset[];
  columns?: number;
  size?: ControlSize;
  disabled?: boolean;
  allowEmpty?: boolean;
  allowCustom?: boolean;
  closeOnSelect?: boolean;
  labels?: Partial<ColorPresetsLabels>;
  children: React.ReactNode;
};

function ColorPresetsRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  presets = COLOR_PRESETS,
  columns: columnsProp,
  size: sizeProp,
  disabled: disabledProp,
  allowEmpty = false,
  allowCustom = false,
  closeOnSelect = true,
  labels: labelsProp,
  children,
}: ColorPresetsRootProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useOpenState({
    open: openProp,
    defaultOpen,
    onOpenChange,
    disabled,
  });
  const triggerRef = React.useRef<HTMLElement | null>(null);
  // In a FieldList cell the column heading names the trigger, unless `labels.trigger` is given,
  // and the field frame shows it as the label when the list stacks its rows (`fieldCell`).
  const cell = useFieldCell();
  const cellLabel = cell?.label;
  const ids = useFieldFrame(undefined, {});
  const triggerId = cell ? ids.controlId : undefined;
  const labels = React.useMemo(
    () => ({
      ...COLOR_PRESETS_LABELS,
      ...(cellLabel ? { trigger: cellLabel } : null),
      ...labelsProp,
    }),
    [labelsProp, cellLabel],
  );
  const options = useSwatchOptions(presets, allowEmpty, labels.empty);
  // Up to 8 presets (+ "no color") fit one row; more wrap into rows of 8.
  const columns = Math.max(
    1,
    Math.round(columnsProp ?? (presets.length <= 8 ? options.length : 8)),
  );
  const selectedLabel =
    value == null ? labels.empty : (presets.find((p) => sameColor(p.value, value))?.label ?? value);

  // The panel does not trap focus, so a pick (like Escape and Tab) hands focus back explicitly
  // (foundation §8): a clicked trigger is not focused in every browser.
  const select = React.useCallback(
    (next: string | null) => {
      setValue(next);
      if (closeOnSelect) {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    },
    [setValue, setOpen, closeOnSelect],
  );
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      select,
      close,
      options,
      selectedLabel,
      columns,
      size,
      disabled,
      allowCustom,
      labels,
      triggerRef,
      triggerId,
    }),
    [
      value,
      select,
      close,
      options,
      selectedLabel,
      columns,
      size,
      disabled,
      allowCustom,
      labels,
      triggerId,
    ],
  );

  const popover = (
    <Popover.Root
      open={open}
      onOpenChange={setOpen}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      openOnArrow
    >
      {children}
    </Popover.Root>
  );

  return tier.provide(
    <ColorPresetsProvider value={ctx}>
      {cell ? (
        <FieldFrame size={size} ids={ids} disabled={disabled} optionalLabel="">
          {popover}
        </FieldFrame>
      ) : (
        popover
      )}
    </ColorPresetsProvider>,
  );
}
ColorPresetsRoot.displayName = "ColorPresets.Root";

export type ColorPresetsSwatchProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The current color as a small square for a custom trigger (e.g. inside `Button.Root`), at the
 * host's icon size; `aria-hidden` — the trigger carries the name.
 */
function Swatch(props: ColorPresetsSwatchProps) {
  const { value } = useColorPresetsContext();
  return <SwatchChip {...props} value={value} />;
}
Swatch.displayName = "ColorPresets.Swatch";

export type ColorPresetsTriggerProps = {
  children: React.ReactElement;
};

/**
 * A slot: clones its one child into the panel's trigger. Name «<labels.trigger>: <color name>»,
 * `disabled` from the root, ArrowDown / ArrowUp open the panel (the Popover's `openOnArrow`); the
 * child's own `aria-label`, `disabled` and handlers win (Slot merge rules).
 */
function Trigger({ children }: ColorPresetsTriggerProps) {
  const { disabled, labels, selectedLabel, triggerRef, triggerId } = useColorPresetsContext();
  return (
    <Popover.Trigger>
      <Slot
        ref={triggerRef}
        {...(triggerId ? { id: triggerId } : null)}
        disabled={disabled || undefined}
        aria-label={`${labels.trigger}: ${selectedLabel}`}
      >
        {children}
      </Slot>
    </Popover.Trigger>
  );
}
Trigger.displayName = "ColorPresets.Trigger";

export type ColorPresetsSwatchButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/** The kit square swatch button of the root tier: the current color, for `ColorPresets.Trigger`. */
function SwatchButton({ className, ...rest }: ColorPresetsSwatchButtonProps) {
  const { value, size } = useColorPresetsContext();
  return (
    <button
      type="button"
      {...rest}
      data-size={size}
      className={cx(fieldTierClass, swatchTriggerClass, className)}
    >
      <SwatchFill value={value} />
    </button>
  );
}
SwatchButton.displayName = "ColorPresets.SwatchButton";

export type ColorPresetsContentProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "role"
> & {
  label?: React.ReactNode;
  align?: PositionAlign;
  side?: PositionSide;
  /** The floating panel. */
  ref?: React.Ref<HTMLDivElement>;
};

/** Floating panel (Popover overlay contract) with the swatch grid: `role="listbox"`. */
function Content({
  label,
  align = DEFAULT_ALIGN,
  side = DEFAULT_SIDE,
  ...rest
}: ColorPresetsContentProps) {
  const { size } = useColorPresetsContext();
  return (
    <Popover.Content {...rest} align={align} side={side} size={size}>
      <SwatchList label={label} />
    </Popover.Content>
  );
}
Content.displayName = "ColorPresets.Content";

function SwatchList({ label }: { label?: React.ReactNode }) {
  const { value, select, close, options, columns, size, labels, triggerRef, allowCustom } =
    useColorPresetsContext();
  const labelId = React.useId();
  // The grid is `columns` wide while the panel has room; narrower (a 320px screen, touch-size
  // swatches) it wraps into balanced rows, and the arrows walk the rows on screen.
  const gridRef = React.useRef<HTMLDivElement>(null);
  const balanced = useBalancedColumns(gridRef, options.length, "[role='option']");

  const selectedIndex = options.findIndex((o) => sameColor(o.value, value));
  const [active, setActive] = React.useState(Math.max(0, selectedIndex));
  const grid = useSwatchGrid(options.length);

  // Opening moves focus to the selected swatch (or the first one): the roving tab stop.
  const [initial] = React.useState(Math.max(0, selectedIndex));
  React.useEffect(() => {
    grid.focus(initial);
  }, [grid.focus, initial]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // With the hex field Tab moves between the swatches and the field; the panel's edges close it.
    if (event.key === "Tab" && !allowCustom) {
      // Leave like a native select: focus goes back to the trigger, then Tab moves on from it.
      triggerRef.current?.focus({ preventScroll: true });
      close();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[active];
      if (option) select(option.value);
      return;
    }
    const next = grid.move(event, active, balanced ?? Math.min(columns, options.length));
    if (next !== null) setActive(next);
  };

  return (
    <div className={styles.body}>
      {label != null ? (
        <div
          id={labelId}
          className={cx(fieldTierClass, fieldLabelTextClass, styles.label)}
          data-size={size}
        >
          {label}
        </div>
      ) : null}
      <div
        role="listbox"
        aria-label={label != null ? undefined : labels.list}
        aria-labelledby={label != null ? labelId : undefined}
        ref={gridRef}
        className={cx(swatchTierClass, swatchGridClass, styles.grid)}
        data-size={size}
        data-base="item"
        style={
          {
            "--swatch-count": Math.min(columns, options.length),
            "--swatch-columns": balanced,
          } as React.CSSProperties
        }
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        {options.map((option, i) => {
          const selected = i === selectedIndex;
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the listbox (roving tabindex)
            <div
              key={option.value ?? "empty"}
              ref={grid.itemRef(i)}
              role="option"
              aria-selected={selected}
              aria-label={option.label}
              tabIndex={i === active ? 0 : -1}
              title={option.label}
              className={swatchClass}
              data-state={selected ? "checked" : "unchecked"}
              data-contrast={option.contrast}
              onClick={() => select(option.value)}
              onFocus={() => setActive(i)}
            >
              <SwatchContent value={option.value} selected={selected} />
            </div>
          );
        })}
      </div>
      {allowCustom ? <CustomColorField /> : null}
    </div>
  );
}

/**
 * Any color beyond the palette (`allowCustom`): a hex field under the swatches; its chip shows the
 * typed color once it reads as one, Enter picks it (an invalid text gets `labels.customInvalid`).
 */
function CustomColorField() {
  const { value, select, options, labels } = useColorPresetsContext();
  // A value that is no preset is the field's text when the panel opens.
  const [draft, setDraft] = React.useState(() =>
    value != null && !options.some((o) => sameColor(o.value, value)) ? value : "",
  );
  const [error, setError] = React.useState<string>();
  const typed = parseHexColor(draft);

  return (
    <Input.Root label={labels.custom} error={error} className={styles.custom}>
      <Input.Wrapper>
        <Input.Icon side="start">
          <SwatchChip value={typed ?? value} />
        </Input.Icon>
        <Input.Field
          value={draft}
          placeholder="#12A594"
          autoComplete="off"
          spellCheck={false}
          onValueChange={(next) => {
            setDraft(next);
            setError(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (typed) select(typed);
            else setError(labels.customInvalid);
          }}
        />
      </Input.Wrapper>
    </Input.Root>
  );
}

export const ColorPresets = {
  Root: ColorPresetsRoot,
  Trigger,
  SwatchButton,
  Swatch,
  Content,
};
