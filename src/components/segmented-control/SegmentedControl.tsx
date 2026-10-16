import * as React from "react";
import { Badge } from "@/components/badge/Badge";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconSlotClass } from "@/internal/iconBox";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import palette from "@/internal/palette.module.css";
import { labelPlainText, useTextPartId, useTextParts } from "@/internal/parts";
import { rovingIndex } from "@/internal/rovingFocus";
import { SwitcherScroller } from "@/internal/SwitcherScroller";
import {
  endIndicatorGlide,
  placeIndicator,
  revealInScroller,
  selectionIndicatorClass,
  setFlag,
} from "@/internal/selectionIndicator";
import { slotChild } from "@/internal/slot";
import type { ControlSize, PaletteColor } from "@/internal/states";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import styles from "./SegmentedControl.module.css";

// ─── Context ─────────────────────────────────────────────────────────────────

type SegmentedControlContextValue = {
  value: string;
  /** Value of the item that takes Tab focus (selected, or the first enabled one). */
  focusValue: string;
  onSelect: (value: string) => void;
  rootDisabled: boolean;
};

const [SegmentedControlProvider, useSegmentedControlContext] =
  createComponentContext<SegmentedControlContextValue>("SegmentedControl");

/**
 * How much of each segment the row shows: `full` everything at the tier's padding; `compact`
 * everything with tighter segment padding (a row a few pixels too wide keeps its last segment whole
 * instead of scrolling it under the edge fade); `icon` only icons (when even the compact row does
 * not fit and every segment has one) — the label stays for screen readers and in a tooltip.
 */
type SegmentedControlCollapse = "full" | "compact" | "icon";

const CollapseContext = React.createContext<SegmentedControlCollapse>("full");

const ITEM = `.${styles.item}`;
const ENABLED_ITEM = '[role="radio"]:not([data-disabled="true"])';
const CHECKED_ITEM = `${ITEM}[data-state="checked"]`;

/** The thumb takes the hue of the checked segment (`color`), or none. */
function syncThumbColor(thumb: HTMLElement, active: HTMLElement | null) {
  const color = active?.dataset.color;
  if (color === thumb.dataset.color) return;
  if (color) thumb.dataset.color = color;
  else delete thumb.dataset.color;
}

/**
 * The widest level at which the row fits its viewport: full, then compact; icons alone go only when
 * every segment has one — otherwise the compact row scrolls. The level is applied to the DOM and
 * measured in place, so React re-renders only when it changes. The viewport's scroll width is the
 * measure, not the list's: the list clips the thumb, whose whole-pixel geometry may reach a pixel
 * past the row — counted, it would flip the level on every commit in a host as wide as the row.
 * The 1px slack absorbs the rounding of a fractional row width, like the edge-fade flags.
 */
function fitCollapse(viewport: HTMLElement, list: HTMLElement): SegmentedControlCollapse {
  const fits = (level: SegmentedControlCollapse) => {
    list.dataset.collapse = level;
    return viewport.scrollWidth <= viewport.clientWidth + 1;
  };
  if (fits("full") || fits("compact")) return list.dataset.collapse as SegmentedControlCollapse;
  const items = list.querySelectorAll(ITEM);
  const icons = list.querySelectorAll(`${ITEM} > .${styles.icon}`);
  const level = items.length > 0 && icons.length === items.length ? "icon" : "compact";
  list.dataset.collapse = level;
  return level;
}

/**
 * Edge-fade flags go on the root: the fades are overlays on the still track, not a mask. While the
 * row glides to a chosen segment they follow the destination, not the current offset, so a fade
 * never sits over the segment being revealed.
 */
function syncOverflow(viewport: HTMLElement, scrollLeft = viewport.scrollLeft) {
  applyOverflow(viewport, measureOverflow(viewport, scrollLeft));
}

/** The read half of `syncOverflow`, for callers that batch it before their writes. */
function measureOverflow(viewport: HTMLElement, scrollLeft = viewport.scrollLeft) {
  const maxScroll = viewport.scrollWidth - viewport.clientWidth;
  // In RTL `scrollLeft` runs from 0 at the start to negative values toward the end.
  const offset = Math.abs(scrollLeft);
  return { start: offset > 1, end: maxScroll - offset > 1 };
}

function applyOverflow(viewport: HTMLElement, overflow: { start: boolean; end: boolean }) {
  const root = viewport.parentElement;
  if (!root) return;
  setFlag(root, "data-overflow-start", overflow.start);
  setFlag(root, "data-overflow-end", overflow.end);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SegmentedControlLabels = {
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const SEGMENTED_CONTROL_LABELS: SegmentedControlLabels = { optional: "необязательно" };

export type SegmentedControlRootProps = Omit<FieldRootDomProps, "dir"> &
  FieldFrameProps & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    size?: ControlSize;
    fullWidth?: boolean;
    invalid?: boolean;
    reserveSupportRow?: boolean;
    id?: string;
    labels?: Partial<SegmentedControlLabels>;
    children?: React.ReactNode;
  };

/**
 * The field: label · radiogroup track · hint or error. `className`, `ref` and the rest go to the
 * frame; `id`, `onKeyDown` and the `aria-label*` / `aria-describedby` names to the radiogroup.
 */
function SegmentedControlRoot({
  value,
  defaultValue = "",
  onValueChange,
  disabled: disabledProp = false,
  size: sizeProp,
  fullWidth = false,
  label,
  required = false,
  optional = false,
  hint,
  hintTone,
  error,
  invalid,
  reserveSupportRow = false,
  id,
  labels: labelsProp,
  children,
  className,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SegmentedControlRootProps) {
  const labels = useLabels(SEGMENTED_CONTROL_LABELS, labelsProp);
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const disabled = useInheritedDisabled(disabledProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid }, ariaDescribedBy);
  // Router links as segments make the row a navigation: links in the Tab order, the current one
  // `aria-current="page"`, no radio semantics or arrow-key selection (a link cannot be chosen by
  // focus).
  const links = hasLinkItems(children);
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const viewportRef = React.useRef<HTMLElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  /** Set by a click or arrow key; the next commit glides the thumb and reveals the item. */
  const userChangeRef = React.useRef(false);
  /** Offset the row is gliding to after a choice; `null` once it arrives or the user scrolls. */
  const scrollTargetRef = React.useRef<number | null>(null);
  /** The value the row last scrolled into view; `null` until the first commit. */
  const revealedValueRef = React.useRef<string | null>(null);
  const [firstEnabled, setFirstEnabled] = React.useState("");
  const [collapse, setCollapse] = React.useState<SegmentedControlCollapse>("full");

  const onSelect = React.useCallback(
    (nextValue: string) => {
      if (nextValue === selectedValue) return;
      userChangeRef.current = true;
      setSelectedValue(nextValue);
    },
    [selectedValue, setSelectedValue],
  );

  // After every commit: selection, items or their content may have changed.
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !list || !thumb) return;

    const userChange = userChangeRef.current;
    userChangeRef.current = false;
    setCollapse(fitCollapse(viewport, list));
    const active = list.querySelector<HTMLElement>(CHECKED_ITEM);
    placeIndicator(thumb, active, userChange && !prefersReducedMotion());
    syncThumbColor(thumb, active);
    // The first enabled item is the tab stop only while nothing is selected; with a value no
    // state is written, so a commit never schedules another render.
    if (!selectedValue) {
      setFirstEnabled(list.querySelector<HTMLElement>(ENABLED_ITEM)?.dataset.value ?? "");
    }

    // The selected segment of a scrolling row is brought into view on mount and whenever the value
    // changes (only the row scrolls, not the page). It glides only into a user's choice.
    const valueChanged = revealedValueRef.current !== selectedValue;
    revealedValueRef.current = selectedValue;
    if (valueChanged && active) {
      const smooth = userChange && !prefersReducedMotion();
      const left = revealInScroller(viewport, active, smooth);
      if (left !== null) scrollTargetRef.current = smooth ? left : null;
    }
    syncOverflow(viewport, scrollTargetRef.current ?? undefined);
  });

  // Layout changes outside React: container resize, font load, two-line height.
  useResizeEffect(
    viewportRef,
    () => {
      const viewport = viewportRef.current;
      const list = listRef.current;
      const thumb = thumbRef.current;
      if (!viewport || !list || !thumb) return;
      scrollTargetRef.current = null;
      setCollapse(fitCollapse(viewport, list));
      // Read the row before the thumb is written: a write in between would force a second layout
      // on every frame of a container resize (a sidebar collapsing beside the page).
      const overflow = measureOverflow(viewport);
      placeIndicator(thumb, list.querySelector<HTMLElement>(CHECKED_ITEM), false);
      applyOverflow(viewport, overflow);
    },
    { children: true },
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (links) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(ENABLED_ITEM));
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = rovingIndex(event.key, index, items.length, "both");
    if (event.defaultPrevented || next === null) return;
    const target = items[next];

    event.preventDefault();
    // The row reveals the segment itself (clear of the edge fades), so focus must not jump-scroll.
    target.focus({ preventScroll: true });
    onSelect(target.dataset.value ?? "");
  }

  const contextValue = React.useMemo<SegmentedControlContextValue>(
    () => ({
      value: selectedValue,
      focusValue: selectedValue || firstEnabled,
      onSelect,
      rootDisabled: disabled,
    }),
    [selectedValue, firstEnabled, onSelect, disabled],
  );

  return (
    <SegmentedControlProvider value={contextValue}>
      <FieldFrame
        {...rest}
        size={size}
        ids={ids}
        label={label}
        required={required}
        optional={optional}
        hint={hint}
        hintTone={hintTone}
        error={error}
        disabled={disabled}
        reserveSupportRow={reserveSupportRow}
        optionalLabel={labels.optional}
        group
        className={cx(styles.field, className)}
        data-full-width={fullWidth || undefined}
      >
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role switches to navigation when the segments are links */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: a radiogroup (or navigation) whose arrow keys move the selection */}
        <div
          id={ids.controlId}
          role={links ? "navigation" : "radiogroup"}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? ids.labelledBy}
          aria-describedby={ids.describedBy}
          aria-invalid={(!links && ids.invalid) || undefined}
          aria-required={(!links && required) || undefined}
          aria-disabled={(!links && disabled) || undefined}
          className={cx(fieldTierClass, styles.root)}
          onKeyDown={handleKeyDown}
          {...toDataAttributes({
            size,
            disabled: disabled || undefined,
            invalid: ids.invalid || undefined,
            "full-width": fullWidth || undefined,
          })}
        >
          {/* Edge fades are overlays on the still root (see CSS), so the row scrolls without a mask. */}
          <SwitcherScroller
            ref={viewportRef}
            edges="none"
            className={styles.viewport}
            onScroll={(event) => {
              const viewport = event.currentTarget;
              const target = scrollTargetRef.current;
              if (target !== null && Math.abs(viewport.scrollLeft - target) < 1) {
                scrollTargetRef.current = null;
              }
              syncOverflow(viewport, scrollTargetRef.current ?? undefined);
            }}
            // The user takes over scrolling: fades follow the real offset again.
            onWheel={() => {
              scrollTargetRef.current = null;
            }}
            onTouchStart={() => {
              scrollTargetRef.current = null;
            }}
          >
            <div ref={listRef} className={styles.list} data-collapse={collapse}>
              {/* First in DOM order so it always paints below the segments. */}
              <div
                ref={thumbRef}
                className={cx(selectionIndicatorClass, palette.hue, styles.thumb)}
                aria-hidden="true"
                onTransitionEnd={endIndicatorGlide}
              />
              {tier.provide(
                <CollapseContext.Provider value={collapse}>{children}</CollapseContext.Provider>,
              )}
            </div>
          </SwitcherScroller>
        </div>
      </FieldFrame>
    </SegmentedControlProvider>
  );
}

SegmentedControlRoot.displayName = "SegmentedControl.Root";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type SegmentedControlItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "children" | "type" | "role"
> & {
  value: string;
  disabled?: boolean;
  color?: PaletteColor;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Whether any segment is the consumer's element (`asChild`, a router link). */
function hasLinkItems(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<SegmentedControlItemProps>(child) &&
      child.type === SegmentedControlItem &&
      child.props.asChild === true,
  );
}

function isIconOnly(children: React.ReactNode): boolean {
  const nodes = React.Children.toArray(children);
  return (
    nodes.length > 0 &&
    nodes.every((node) => React.isValidElement(node) && node.type === SegmentedControlIcon)
  );
}

function hasChildOfType(children: React.ReactNode, type: React.ElementType): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === type,
  );
}

/** The segment's title: plain text children or the children of its `SegmentedControl.Label`. */
function labelOf(children: React.ReactNode): React.ReactNode {
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") return child;
    if (
      React.isValidElement<SegmentedControlLabelProps>(child) &&
      child.type === SegmentedControlLabel
    ) {
      return child.props.children;
    }
  }
  return null;
}

function SegmentedControlItem({
  value,
  disabled = false,
  color,
  asChild = false,
  children,
  className,
  onClick,
  ref,
  ...rest
}: SegmentedControlItemProps) {
  const ctx = useSegmentedControlContext();
  const collapse = React.useContext(CollapseContext);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const child = asChild ? slotChild(children, "SegmentedControl.Item") : null;
  // With `asChild` the segment's parts are the children of the consumer's element.
  const content = child ? child.props.children : children;
  const isChecked = ctx.value === value;
  const isDisabled = ctx.rootDisabled || disabled;
  const isTabStop = !isDisabled && ctx.focusValue === value;
  const twoLine = hasChildOfType(content, SegmentedControlDescription);
  const parts = useTextParts();
  const label = labelOf(content);

  const shared = {
    "aria-labelledby": parts.labelledBy,
    "aria-describedby": parts.describedBy,
    ...toDataAttributes({
      state: isChecked ? "checked" : "unchecked",
      disabled: isDisabled || undefined,
      "icon-only": isIconOnly(content) || undefined,
      "two-line": twoLine || undefined,
      value,
      color,
    }),
    className: cx(palette.hue, styles.item, touchTargetBlockClass, className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      if (!isDisabled && !event.defaultPrevented) ctx.onSelect(value);
    },
  };
  const inner = (
    <>
      {color ? <Badge.Dot className={styles.dot} /> : null}
      {parts.provide(labelPlainText(content, SegmentedControlLabel))}
    </>
  );

  const segment = child ? (
    // A link segment: in the Tab order like any link, the current one `aria-current="page"`.
    <InteractiveElement
      {...(rest as React.HTMLAttributes<HTMLElement>)}
      {...shared}
      ref={ref as React.Ref<HTMLElement>}
      element="slot"
      disabled={isDisabled}
      aria-current={isChecked ? "page" : undefined}
    >
      {React.cloneElement(child, undefined, inner)}
    </InteractiveElement>
  ) : (
    // biome-ignore lint/a11y/useSemanticElements: radiogroup of buttons with roving tabindex (WAI-ARIA APG)
    <button
      {...rest}
      {...shared}
      ref={ref}
      role="radio"
      type="button"
      aria-checked={isChecked}
      tabIndex={isTabStop ? 0 : -1}
      disabled={isDisabled}
    >
      {inner}
    </button>
  );

  // A segment with a title keeps one Tooltip around it, so the button never remounts (and never
  // loses focus) when the row collapses; it opens only while the title is hidden.
  if (label === null) return segment;
  return (
    <Tooltip.Root open={collapse === "icon" && tooltipOpen} onOpenChange={setTooltipOpen}>
      <Tooltip.Trigger>{segment}</Tooltip.Trigger>
      {collapse === "icon" ? <Tooltip.Content>{label}</Tooltip.Content> : null}
    </Tooltip.Root>
  );
}

SegmentedControlItem.displayName = "SegmentedControl.Item";

// ─── Icon ─────────────────────────────────────────────────────────────────────

export type SegmentedControlIconProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function SegmentedControlIcon({ children, className, ...rest }: SegmentedControlIconProps) {
  return (
    <span className={cx(iconSlotClass, styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

SegmentedControlIcon.displayName = "SegmentedControl.Icon";

// ─── Label / Description ─────────────────────────────────────────────────────

export type SegmentedControlLabelProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/**
 * Segment title on one line; never truncated. Plain text children are wrapped automatically. In a
 * row collapsed to icons the visible title leaves the row and a VisuallyHidden copy keeps naming
 * the segment.
 */
function SegmentedControlLabel({ children, className, ...rest }: SegmentedControlLabelProps) {
  const id = useTextPartId("label");
  const iconOnly = React.useContext(CollapseContext) === "icon";
  return (
    <>
      <span
        id={id}
        className={cx(styles.label, className)}
        aria-hidden={iconOnly || undefined}
        {...rest}
      >
        {children}
      </span>
      {iconOnly ? <VisuallyHidden>{children}</VisuallyHidden> : null}
    </>
  );
}

SegmentedControlLabel.displayName = "SegmentedControl.Label";

export type SegmentedControlDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** Second line of a two-line segment; becomes the segment's accessible description. */
function SegmentedControlDescription({
  children,
  className,
  ...rest
}: SegmentedControlDescriptionProps) {
  const id = useTextPartId("description");
  return (
    <span id={id} className={cx(styles.description, className)} {...rest}>
      {children}
    </span>
  );
}

SegmentedControlDescription.displayName = "SegmentedControl.Description";

// ─── Count ────────────────────────────────────────────────────────────────────

export type SegmentedControlCountProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  color?: PaletteColor;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Counter after the label: a soft Badge one tier below the control. */
function SegmentedControlCount({
  color = "gray",
  children,
  className,
  ...rest
}: SegmentedControlCountProps) {
  const id = useTextPartId("count");
  return (
    <Badge.Root {...rest} id={id} color={color} className={cx(styles.count, className)}>
      {children}
    </Badge.Root>
  );
}

SegmentedControlCount.displayName = "SegmentedControl.Count";

// ─── Export ───────────────────────────────────────────────────────────────────

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
  Icon: SegmentedControlIcon,
  Label: SegmentedControlLabel,
  Count: SegmentedControlCount,
  Description: SegmentedControlDescription,
};
