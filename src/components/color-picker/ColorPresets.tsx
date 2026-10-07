import * as React from "react";

import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { markContrast, sameColor } from "@/internal/colorSwatch";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import { gridIndex } from "@/internal/rovingFocus";
import type { ControlSize } from "@/internal/states";

import styles from "./ColorPresets.module.css";
import { SwatchCheck, SwatchFill, swatchClass } from "./swatch";

export type ColorPreset = {
  /** CSS color stored as the value (`onValueChange` returns it as is). */
  value: string;
  /** Human-readable name: the option's accessible name and the trigger's `aria-label` suffix. */
  label: string;
};

/**
 * Default quick colors: the kit palette primitives (`tokens/primitives.ts`).
 * Row 1 — step 500 of eight hues, row 2 — step 700 of the same hues.
 * Take `COLOR_PRESETS.slice(0, 8)` for a single row of eight.
 */
export const COLOR_PRESETS: readonly ColorPreset[] = [
  { value: "#ef4444", label: "Красный" },
  { value: "#f97316", label: "Оранжевый" },
  { value: "#eab308", label: "Жёлтый" },
  { value: "#22c55e", label: "Зелёный" },
  { value: "#14b8a6", label: "Бирюзовый" },
  { value: "#5068f5", label: "Синий" },
  { value: "#a855f7", label: "Фиолетовый" },
  { value: "#ec4899", label: "Розовый" },
  { value: "#b91c1c", label: "Тёмно-красный" },
  { value: "#c2410c", label: "Тёмно-оранжевый" },
  { value: "#a16207", label: "Горчичный" },
  { value: "#15803d", label: "Тёмно-зелёный" },
  { value: "#0f766e", label: "Тёмно-бирюзовый" },
  { value: "#2f4ae0", label: "Тёмно-синий" },
  { value: "#7e22ce", label: "Тёмно-фиолетовый" },
  { value: "#be185d", label: "Тёмно-розовый" },
];

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

type Option = { value: string | null; label: string; contrast: "light" | "dark" };

type Ctx = {
  value: string | null;
  select: (value: string | null) => void;
  close: () => void;
  options: Option[];
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
  /** Tier of the trigger, swatches and panel. */
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
  size = "m",
  disabled = false,
  allowEmpty = false,
  closeOnSelect = true,
  labels: labelsProp,
  children,
}: ColorPresetsRootProps) {
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

  const options = React.useMemo<Option[]>(
    () => [
      ...presets.map((p) => ({ ...p, contrast: markContrast(p.value) })),
      ...(allowEmpty ? [{ value: null, label: labels.empty, contrast: "dark" as const }] : []),
    ],
    [allowEmpty, presets, labels.empty],
  );
  // Up to 8 presets (+ "no color") fit one row; more wrap into rows of 8.
  const columns = Math.max(
    1,
    Math.round(columnsProp ?? (presets.length <= 8 ? options.length : 8)),
  );
  const selectedLabel =
    value == null ? labels.empty : (presets.find((p) => sameColor(p.value, value))?.label ?? value);

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

export type ColorPresetsSwatchProps = { className?: string };

/**
 * The current color as a small square for a custom trigger (e.g. inside `Button.Root`). Sized from
 * the host's `--prime-icon-size`; `aria-hidden` — the trigger carries the name.
 */
function Swatch({ className }: ColorPresetsSwatchProps) {
  const { value } = useColorPresetsContext();
  return (
    <span aria-hidden className={cx(styles.swatch, className)}>
      <SwatchFill value={value} />
    </span>
  );
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
};

/** Opens the panel. Name: `aria-label` ?? "<labels.trigger>: <color name>". */
const Trigger = React.forwardRef<HTMLButtonElement, ColorPresetsTriggerProps>(function Trigger(
  { asChild = false, children, className, onKeyDown, "aria-label": ariaLabel, ...rest },
  forwardedRef,
) {
  const { value, size, disabled, labels, selectedLabel, triggerRef } = useColorPresetsContext();
  const ref = React.useMemo(
    () => mergeRefs<HTMLButtonElement>(forwardedRef, triggerRef as React.Ref<HTMLButtonElement>),
    [forwardedRef, triggerRef],
  );
  const name = ariaLabel ?? `${labels.trigger}: ${selectedLabel}`;

  if (asChild && children) {
    const child = children as React.ReactElement<
      React.ButtonHTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;
    return (
      <Popover.Trigger>
        {React.cloneElement(child, {
          ...rest,
          ref: mergeRefs(child.props.ref, ref as React.Ref<HTMLElement>),
          disabled: disabled || child.props.disabled,
          "aria-label": child.props["aria-label"] ?? name,
        })}
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
        data-empty={value == null ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cx(styles.trigger, className)}
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
});
Trigger.displayName = "ColorPresets.Trigger";

export type ColorPresetsContentProps = {
  /** Visible heading above the grid; also the list's accessible name (else `labels.list`). */
  label?: React.ReactNode;
  align?: PositionAlign;
  side?: PositionSide;
  className?: string;
};

function useNarrowViewport() {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return narrow;
}

/** Floating panel (Popover overlay contract) with the swatch grid: `role="listbox"`. */
function Content({ label, align = "start", side = "bottom", className }: ColorPresetsContentProps) {
  const { size } = useColorPresetsContext();
  return (
    <Popover.Content align={align} side={side} size={size} insetGap="x2" className={className}>
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

  // Opening moves focus to the selected swatch (or the first one).
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
    <>
      {label != null ? (
        <div id={labelId} className={styles.label} data-size={size}>
          {label}
        </div>
      ) : null}
      <div
        role="listbox"
        aria-label={label != null ? undefined : labels.list}
        aria-labelledby={label != null ? labelId : undefined}
        className={styles.grid}
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
              <SwatchFill value={option.value} />
              {selected ? <SwatchCheck /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

export const ColorPresets = {
  Root: ColorPresetsRoot,
  Trigger,
  Swatch,
  Content,
};
