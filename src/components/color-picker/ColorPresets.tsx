import * as React from "react";

import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { useControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { mergeRefs } from "@/internal/mergeRefs";
import { gridIndex } from "@/internal/rovingFocus";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";
import {
  COLOR_PRESETS,
  type ColorPreset,
  SwatchChip,
  SwatchContent,
  SwatchFill,
  type SwatchOption,
  sameColor,
  swatchClass,
  swatchTierClass,
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
};

const COLOR_PRESETS_LABELS: ColorPresetsLabels = {
  trigger: "Цвет",
  list: "Цвета",
  empty: "Без цвета",
};

/** Viewport width below which l / xl grids wrap to half the columns (foundation §9 breakpoint). */
const NARROW_QUERY = "(max-width: 479px)";

type Ctx = {
  value: string | null;
  select: (value: string | null) => void;
  close: () => void;
  options: SwatchOption[];
  selectedLabel: string;
  columns: number;
  size: ControlSize;
  disabled: boolean;
  labels: ColorPresetsLabels;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const [ColorPresetsProvider, useColorPresetsContext] = createComponentContext<Ctx>("ColorPresets");

export type ColorPresetsRootProps = {
  /** Controlled color; `null` — no color. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Swatches in panel order. Default: `COLOR_PRESETS` (16). */
  presets?: readonly ColorPreset[];
  /** Grid columns. Default: one row for up to 8 presets (+ "no color"), else 8; 16 → 8 × 2. */
  columns?: number;
  /** Tier of the trigger, swatches and panel. Default: the host tier, else `m`. */
  size?: ControlSize;
  disabled?: boolean;
  /** Adds the "no color" swatch after the presets (value `null`); hue rows stay aligned. */
  allowEmpty?: boolean;
  /** Close the panel after a pick (focus returns to the trigger). Default `true`. */
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
  presets = COLOR_PRESETS,
  columns: columnsProp,
  size: sizeProp,
  disabled = false,
  allowEmpty = false,
  closeOnSelect = true,
  labels: labelsProp,
  children,
}: ColorPresetsRootProps) {
  const size = useControlSize(sizeProp);
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const labels = React.useMemo(() => ({ ...COLOR_PRESETS_LABELS, ...labelsProp }), [labelsProp]);
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
      labels,
      triggerRef,
    }),
    [value, select, close, options, selectedLabel, columns, size, disabled, labels],
  );

  return (
    <ColorPresetsProvider value={ctx}>
      <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
        {children}
      </Popover.Root>
    </ColorPresetsProvider>
  );
}
ColorPresetsRoot.displayName = "ColorPresets.Root";

export type ColorPresetsSwatchProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The current color as a small square for a custom trigger (e.g. inside `Button.Root`). Sized from
 * the host's `--prime-icon-size`; `aria-hidden` — the trigger carries the name.
 */
function Swatch(props: ColorPresetsSwatchProps) {
  const { value } = useColorPresetsContext();
  return <SwatchChip {...props} value={value} />;
}
Swatch.displayName = "ColorPresets.Swatch";

export type ColorPresetsTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "value"
> & {
  /**
   * `false` (default) — the kit square swatch button of the Root tier. `true` — `children` (one
   * element, e.g. `Button.Root` with `ColorPresets.Swatch`) becomes the trigger.
   */
  asChild?: boolean;
  children?: React.ReactElement;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Opens the panel. Name: `aria-label` ?? "<labels.trigger>: <color name>". */
function Trigger({
  asChild = false,
  children,
  className,
  onKeyDown,
  "aria-label": ariaLabel,
  ref: forwardedRef,
  ...rest
}: ColorPresetsTriggerProps) {
  const { value, size, disabled, labels, selectedLabel, triggerRef } = useColorPresetsContext();
  const ref = React.useMemo(
    () => mergeRefs<HTMLButtonElement>(forwardedRef, triggerRef as React.Ref<HTMLButtonElement>),
    [forwardedRef, triggerRef],
  );
  const name = ariaLabel ?? `${labels.trigger}: ${selectedLabel}`;

  if (asChild && children) {
    return (
      <Popover.Trigger>
        {/* The child's own `aria-label` / `disabled` win over these (Slot merge rules). */}
        <Slot {...rest} ref={ref} disabled={disabled || undefined} aria-label={name}>
          {children}
        </Slot>
      </Popover.Trigger>
    );
  }

  return (
    <Popover.Trigger>
      <button
        type="button"
        {...rest}
        ref={ref}
        aria-label={name}
        disabled={disabled}
        data-size={size}
        className={cx(fieldTierClass, styles.trigger, className)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <SwatchFill value={value} />
      </button>
    </Popover.Trigger>
  );
}
Trigger.displayName = "ColorPresets.Trigger";

export type ColorPresetsContentProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "role"
> & {
  /** Visible heading above the grid; also the list's accessible name (else `labels.list`). */
  label?: React.ReactNode;
  align?: PositionAlign;
  side?: PositionSide;
  /** The floating panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function useNarrowViewport() {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return narrow;
}

/** Floating panel (Popover overlay contract) with the swatch grid: `role="listbox"`. */
function Content({ label, align = "start", side = "bottom", ...rest }: ColorPresetsContentProps) {
  const { size } = useColorPresetsContext();
  return (
    <Popover.Content {...rest} align={align} side={side} size={size}>
      <SwatchList label={label} />
    </Popover.Content>
  );
}
Content.displayName = "ColorPresets.Content";

function SwatchList({ label }: { label?: React.ReactNode }) {
  const { value, select, close, options, columns, size, labels, triggerRef } =
    useColorPresetsContext();
  const labelId = React.useId();
  const narrow = useNarrowViewport();
  // l / xl rows of more than 4 do not fit a 320px screen: wrap to half the columns.
  const wraps = narrow && (size === "l" || size === "xl") && columns > 4;
  const cols = wraps ? Math.ceil(columns / 2) : columns;

  const selectedIndex = options.findIndex((o) => sameColor(o.value, value));
  const [active, setActive] = React.useState(Math.max(0, selectedIndex));
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  // Opening moves focus to the selected swatch (or the first one): the roving tab stop.
  // biome-ignore lint/correctness/useExhaustiveDependencies: focus once on mount
  React.useEffect(() => {
    itemRefs.current[Math.max(0, selectedIndex)]?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
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
    const next = gridIndex(event.key, active, options.length, cols);
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    itemRefs.current[next]?.focus();
  };

  return (
    <div className={styles.body}>
      {label != null ? (
        <div id={labelId} className={styles.label} data-size={size}>
          {label}
        </div>
      ) : null}
      <div
        role="listbox"
        aria-label={label != null ? undefined : labels.list}
        aria-labelledby={label != null ? labelId : undefined}
        className={cx(swatchTierClass, styles.grid)}
        data-size={size}
        style={{ "--cpr-columns": cols } as React.CSSProperties}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        {options.map((option, i) => {
          const selected = i === selectedIndex;
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the listbox (roving tabindex)
            <div
              key={option.value ?? "empty"}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
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
    </div>
  );
}

export const ColorPresets = {
  Root: ColorPresetsRoot,
  Trigger,
  Swatch,
  Content,
};
