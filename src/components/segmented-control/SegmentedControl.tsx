import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor } from "@/internal/states";

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

type PillRect = { left: number; top: number; width: number; height: number; color?: string };

const EMPTY_RECT: PillRect = { left: 0, top: 0, width: 0, height: 0 };

const ENABLED_ITEM = '[role="radio"]:not([data-disabled="true"])';

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SegmentedControlRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: ControlSize;
  /** Stretch to the container width; segments share it equally and truncate their labels. */
  fullWidth?: boolean;
  /** Accessible name of the radiogroup (or use `aria-labelledby`). */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: React.ReactNode;
  className?: string;
};

function SegmentedControlRoot({
  value,
  defaultValue = "",
  onValueChange,
  disabled = false,
  size = "m",
  fullWidth = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
}: SegmentedControlRootProps) {
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = React.useState({ start: false, end: false });
  const [pill, setPill] = React.useState<PillRect>(EMPTY_RECT);
  // The pill slides only after a user change; layout changes (resize, fonts) snap it.
  const [animate, setAnimate] = React.useState(false);
  const [firstEnabled, setFirstEnabled] = React.useState("");

  const onSelect = React.useCallback(
    (nextValue: string) => {
      if (nextValue === selectedValue) return;
      if (!prefersReducedMotion()) setAnimate(true);
      setSelectedValue(nextValue);
    },
    [selectedValue, setSelectedValue],
  );

  const updateOverflow = React.useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const start = scroller.scrollLeft > 1;
    const end = maxScroll - scroller.scrollLeft > 1;
    setOverflow((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  const measure = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    updateOverflow();
    const first = root.querySelector<HTMLElement>(ENABLED_ITEM);
    setFirstEnabled(first?.dataset.value ?? "");
    const active = root.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]');
    const next = active
      ? {
          left: active.offsetLeft,
          top: active.offsetTop,
          width: active.offsetWidth,
          height: active.offsetHeight,
          color: active.dataset.color,
        }
      : EMPTY_RECT;
    setPill((prev) =>
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height &&
      prev.color === next.color
        ? prev
        : next,
    );
  }, [updateOverflow]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    measure();

    const mo = new MutationObserver(measure);
    mo.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-checked", "data-disabled", "data-color"],
    });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(root);
      for (const item of root.querySelectorAll('[role="radio"]')) ro.observe(item);
    }

    return () => {
      mo.disconnect();
      ro?.disconnect();
    };
  }, [measure]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(ENABLED_ITEM));
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);

    let target: HTMLButtonElement | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = items[(index + 1) % items.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = items[(index - 1 + items.length) % items.length];
    } else if (event.key === "Home") {
      target = items[0];
    } else if (event.key === "End") {
      target = items[items.length - 1];
    }
    if (!target) return;

    event.preventDefault();
    target.focus();
    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    onSelect(target.dataset.value ?? "");
  }

  const hasPill = pill.width > 0 && pill.height > 0;
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
        ref={rootRef}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={disabled || undefined}
        className={cx(styles.root, className)}
        onKeyDown={handleKeyDown}
        {...toDataAttributes({
          size,
          disabled: disabled || undefined,
          "full-width": fullWidth || undefined,
        })}
      >
        <div
          ref={scrollerRef}
          className={styles.scroller}
          onScroll={updateOverflow}
          {...toDataAttributes({
            "overflow-start": overflow.start || undefined,
            "overflow-end": overflow.end || undefined,
          })}
        >
          {/* First in DOM order so it always paints below the segments. */}
          <div
            className={styles.pill}
            style={{
              transform: `translate(${pill.left}px, ${pill.top}px)`,
              width: pill.width,
              height: pill.height,
            }}
            aria-hidden="true"
            {...toDataAttributes({
              visible: hasPill,
              animate: animate || undefined,
              color: pill.color,
            })}
            onTransitionEnd={(event) => {
              if (event.propertyName === "transform") setAnimate(false);
            }}
          />
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </div>
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

const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ value, disabled = false, color, children, className, onClick, ...rest }, ref) => {
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
        className={cx(styles.item, className)}
        onClick={(event) => {
          onClick?.(event);
          if (!isDisabled && !event.defaultPrevented) ctx.onSelect(value);
        }}
      >
        {color ? <span className={styles.dot} aria-hidden="true" /> : null}
        <ItemPartsContext.Provider value={parts}>{wrapText(children)}</ItemPartsContext.Provider>
      </button>
    );
  },
);

SegmentedControlItem.displayName = "SegmentedControl.Item";

// ─── Icon ─────────────────────────────────────────────────────────────────────

export type SegmentedControlIconProps = {
  children: React.ReactNode;
  className?: string;
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

export type SegmentedControlCountProps = {
  /** Badge hue. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/** Counter after the label: a soft Badge one tier below the control. */
function SegmentedControlCount({
  color = "gray",
  children,
  className,
}: SegmentedControlCountProps) {
  const parts = React.useContext(ItemPartsContext);
  return (
    <Badge.Root
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
