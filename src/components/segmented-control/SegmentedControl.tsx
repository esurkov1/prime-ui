import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import palette from "@/internal/palette.module.css";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize, PaletteColor } from "@/internal/states";

import { Badge } from "../badge/Badge";
import { ScrollContainer } from "../scroll-container/ScrollContainer";
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

const ENABLED_ITEM = '[role="radio"]:not([data-disabled="true"])';
const CHECKED_ITEM = '[role="radio"][aria-checked="true"]';

function setFlag(element: HTMLElement, name: string, on: boolean) {
  if (on) element.setAttribute(name, "true");
  else element.removeAttribute(name);
}

/**
 * Thumb and edge fades follow layout, not React state: they are written straight to the DOM, so a
 * resize or a font swap never re-renders the group. The thumb lives inside the track (`.list`,
 * `overflow: clip`), so its box can never widen the scroll area of the viewport.
 */
function syncThumb(list: HTMLElement, thumb: HTMLElement, animate: boolean) {
  const active = list.querySelector<HTMLElement>(CHECKED_ITEM);
  if (!active) {
    setFlag(thumb, "data-visible", false);
    setFlag(thumb, "data-animate", false);
    return;
  }
  const left = `${active.offsetLeft}px`;
  const top = `${active.offsetTop}px`;
  const width = `${active.offsetWidth}px`;
  const height = `${active.offsetHeight}px`;
  const moved =
    thumb.style.left !== left ||
    thumb.style.top !== top ||
    thumb.style.width !== width ||
    thumb.style.height !== height;
  // Glide only into a user's choice; a layout change (resize, fonts, new items) snaps the thumb.
  if (moved) setFlag(thumb, "data-animate", animate && thumb.hasAttribute("data-visible"));
  thumb.style.left = left;
  thumb.style.top = top;
  thumb.style.width = width;
  thumb.style.height = height;
  if (active.dataset.color) thumb.dataset.color = active.dataset.color;
  else delete thumb.dataset.color;
  setFlag(thumb, "data-visible", true);
}

/**
 * Edge-fade flags go on the root: the fades are overlays on the still track, not a mask. While the
 * row glides to a chosen segment they follow the destination, not the current offset, so a fade
 * never sits over the segment being revealed.
 */
function syncOverflow(viewport: HTMLElement, scrollLeft = viewport.scrollLeft) {
  const root = viewport.parentElement;
  if (!root) return;
  const maxScroll = viewport.scrollWidth - viewport.clientWidth;
  setFlag(root, "data-overflow-start", scrollLeft > 1);
  setFlag(root, "data-overflow-end", maxScroll - scrollLeft > 1);
}

/**
 * Scroll offset that shows `item` clear of the edge fades (the neighbour stays under the fade), or
 * the current offset when it already is.
 */
function revealOffset(viewport: HTMLElement, item: HTMLElement): number {
  const root = viewport.parentElement;
  const fade = root ? Number.parseFloat(getComputedStyle(root, "::before").width) || 0 : 0;
  const view = viewport.scrollLeft;
  const start = item.offsetLeft;
  const end = start + item.offsetWidth;
  let left = view;
  if (start - fade < view) left = start - fade;
  else if (end + fade > view + viewport.clientWidth) left = end + fade - viewport.clientWidth;
  return Math.min(Math.max(left, 0), viewport.scrollWidth - viewport.clientWidth);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SegmentedControlRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: ControlSize;
  /** Stretch to the container width; segments share it equally and truncate their labels. */
  fullWidth?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function SegmentedControlRoot({
  value,
  defaultValue = "",
  onValueChange,
  disabled = false,
  size: sizeProp,
  fullWidth = false,
  children,
  className,
  onKeyDown,
  ...rest
}: SegmentedControlRootProps) {
  const size = useControlSize(sizeProp);
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
  const [firstEnabled, setFirstEnabled] = React.useState("");

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
    syncThumb(list, thumb, userChange && !prefersReducedMotion());
    // The first enabled item is the tab stop only while nothing is selected; with a value no
    // state is written, so a commit never schedules another render.
    if (!selectedValue) {
      setFirstEnabled(list.querySelector<HTMLElement>(ENABLED_ITEM)?.dataset.value ?? "");
    }

    // A chosen segment in a scrolling row is brought into view (only the row scrolls, not the page).
    const active = list.querySelector<HTMLElement>(CHECKED_ITEM);
    if (userChange && active && viewport.scrollWidth > viewport.clientWidth) {
      const left = revealOffset(viewport, active);
      if (Math.abs(left - viewport.scrollLeft) >= 1 && typeof viewport.scrollTo === "function") {
        scrollTargetRef.current = left;
        viewport.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    }
    syncOverflow(viewport, scrollTargetRef.current ?? undefined);
  });

  // Layout changes outside React: container resize, font load, two-line height.
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !list || !thumb || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      scrollTargetRef.current = null;
      syncThumb(list, thumb, false);
      syncOverflow(viewport);
    });
    ro.observe(viewport);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
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
      <div
        {...rest}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={cx(styles.root, className)}
        onKeyDown={handleKeyDown}
        {...toDataAttributes({
          size,
          disabled: disabled || undefined,
          "full-width": fullWidth || undefined,
        })}
      >
        {/* Edge fades are overlays on the still root (see CSS), so the viewport scrolls without a mask. */}
        <ScrollContainer
          ref={viewportRef}
          axis="horizontal"
          scrollbar="hidden"
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
          <div ref={listRef} className={styles.list}>
            {/* First in DOM order so it always paints below the segments. */}
            <div
              ref={thumbRef}
              className={cx(palette.hue, styles.thumb)}
              aria-hidden="true"
              onTransitionEnd={(event) => {
                if (event.target === event.currentTarget && event.propertyName === "left") {
                  setFlag(event.currentTarget, "data-animate", false);
                }
              }}
            />
            <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
          </div>
        </ScrollContainer>
      </div>
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
  /**
   * Palette hue of the option (e.g. a status): a dot of that hue before the content, and while
   * selected the sliding thumb takes a soft fill of the hue with a ring of it.
   */
  color?: PaletteColor;
  /**
   * Text, `SegmentedControl.Icon`, `SegmentedControl.Label`, `SegmentedControl.Count`,
   * `SegmentedControl.Description`. A description makes the segment two-line. Only an icon makes the
   * segment square: give it `aria-label` (and wrap it in a Tooltip).
   */
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

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

/** Ids of an item's text parts: name = label + count, description = second line. */
const ItemPartsContext = React.createContext<{ itemId: string } | null>(null);

/** Text children get their own span so they can truncate in a `fullWidth` group. */
function wrapText(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) =>
    (typeof child === "string" || typeof child === "number") && String(child).trim() !== "" ? (
      <span className={styles.label}>{child}</span>
    ) : (
      child
    ),
  );
}

function SegmentedControlItem({
  value,
  disabled = false,
  color,
  children,
  className,
  onClick,
  ref,
  ...rest
}: SegmentedControlItemProps) {
  const ctx = useSegmentedControlContext();
  const isChecked = ctx.value === value;
  const isDisabled = ctx.rootDisabled || disabled;
  const isTabStop = !isDisabled && ctx.focusValue === value;
  const itemId = React.useId();
  const twoLine = hasChildOfType(children, SegmentedControlDescription);
  const hasCount = hasChildOfType(children, SegmentedControlCount);
  const parts = React.useMemo(() => ({ itemId }), [itemId]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: radiogroup of buttons with roving tabindex (WAI-ARIA APG)
    <button
      {...rest}
      ref={ref}
      role="radio"
      type="button"
      aria-checked={isChecked}
      aria-labelledby={twoLine ? cx(`${itemId}-label`, hasCount && `${itemId}-count`) : undefined}
      aria-describedby={twoLine ? `${itemId}-description` : undefined}
      {...toDataAttributes({
        state: isChecked ? "checked" : "unchecked",
        disabled: isDisabled || undefined,
        "icon-only": isIconOnly(children) || undefined,
        "two-line": twoLine || undefined,
        value,
        color,
      })}
      tabIndex={isTabStop ? 0 : -1}
      disabled={isDisabled}
      className={cx(palette.hue, styles.item, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!isDisabled && !event.defaultPrevented) ctx.onSelect(value);
      }}
    >
      {color ? <Badge.Dot className={styles.dot} /> : null}
      <ItemPartsContext.Provider value={parts}>{wrapText(children)}</ItemPartsContext.Provider>
    </button>
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
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
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

/** Segment title; truncates with an ellipsis. Plain text children are wrapped automatically. */
function SegmentedControlLabel({ children, className, ...rest }: SegmentedControlLabelProps) {
  const parts = React.useContext(ItemPartsContext);
  return (
    <span
      id={parts ? `${parts.itemId}-label` : undefined}
      className={cx(styles.label, className)}
      {...rest}
    >
      {children}
    </span>
  );
}

SegmentedControlLabel.displayName = "SegmentedControl.Label";

export type SegmentedControlDescriptionProps = {
  /** Muted second line; wrap the key value in `<strong>` to emphasize it. */
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
  const parts = React.useContext(ItemPartsContext);
  return (
    <span
      id={parts ? `${parts.itemId}-description` : undefined}
      className={cx(styles.description, className)}
      {...rest}
    >
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
  /** Badge hue. Default `gray`. */
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
  const parts = React.useContext(ItemPartsContext);
  return (
    <Badge.Root
      {...rest}
      id={parts ? `${parts.itemId}-count` : undefined}
      color={color}
      className={cx(styles.count, className)}
    >
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
