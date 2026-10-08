import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize, PaletteColor } from "@/internal/states";

import { Badge } from "../badge/Badge";
import { ScrollContainer } from "../scroll-container/ScrollContainer";
import styles from "./Tabs.module.css";

type TabsContextValue = {
  activeValue: string;
  onSelect: (value: string) => void;
  orientation: "horizontal" | "vertical";
  rootId: string;
  size: ControlSize;
};

const [TabsProvider, useTabsContext] = createComponentContext<TabsContextValue>("Tabs");

/** Id of the item, used to keep the description out of the accessible name. */
const ItemIdContext = React.createContext<string | null>(null);

/** A value as an id fragment: idrefs are space-separated, so spaces and symbols are replaced. */
const idPart = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, "_");
const tabId = (rootId: string, value: string) => `prime-ui-kit-tab-${rootId}-${idPart(value)}`;
const panelId = (rootId: string, value: string) => `prime-ui-kit-panel-${rootId}-${idPart(value)}`;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TabsRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Default `horizontal`. A vertical list stacks above the panel in containers narrower than 600px. */
  orientation?: "horizontal" | "vertical";
  size?: ControlSize;
  ref?: React.Ref<HTMLDivElement>;
};

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  size = "m",
  children,
  className,
  ...rest
}: TabsRootProps) {
  const rootId = React.useId();
  const [activeValue, setActiveValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({ activeValue, onSelect: setActiveValue, orientation, rootId, size }),
    [activeValue, setActiveValue, orientation, rootId, size],
  );

  return (
    <TabsProvider value={contextValue}>
      <div
        {...rest}
        className={cx(styles.root, className)}
        {...toDataAttributes({ orientation, size })}
      >
        {/* The root is the size container for the vertical → row switch; the layout sits inside. */}
        <div className={styles.layout}>{children}</div>
      </div>
    </TabsProvider>
  );
}
TabsRoot.displayName = "Tabs.Root";

// ─── List ─────────────────────────────────────────────────────────────────────

export type TabsListProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Places the indicator under / behind the selected tab and keeps exactly one tab stop: the
 * selected tab, or the first enabled one while nothing is selected. Written straight to the DOM:
 * measuring never re-renders the items.
 */
function syncList(
  list: HTMLElement,
  indicator: HTMLElement,
  activeValue: string,
  isBar: boolean,
): void {
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
  const active = tabs.find((tab) => tab.dataset.value === activeValue);
  const stop = active ?? tabs.find((tab) => tab.dataset.disabled !== "true");
  for (const tab of tabs) tab.tabIndex = tab === stop ? 0 : -1;

  let left = active?.offsetLeft ?? 0;
  let width = active?.offsetWidth ?? 0;
  const top = active?.offsetTop ?? 0;
  const height = active?.offsetHeight ?? 0;
  // The underline bar spans the item's content box so it lines up with the text.
  if (active && isBar) {
    const style = getComputedStyle(active);
    const padStart = Number.parseFloat(style.paddingLeft) || 0;
    const padEnd = Number.parseFloat(style.paddingRight) || 0;
    left += padStart;
    width -= padStart + padEnd;
  }
  indicator.style.transform = isBar ? `translateX(${left}px)` : `translate(${left}px, ${top}px)`;
  indicator.style.width = `${width}px`;
  indicator.style.height = isBar ? "" : `${height}px`;
  indicator.dataset.visible = String(width > 0 && height > 0);
}

function TabsList({ children, className, ref, ...rest }: TabsListProps) {
  const { orientation, activeValue, onSelect, size } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(listRef, ref);
  const isBar = orientation === "horizontal";

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const update = () => syncList(list, indicator, activeValue, isBar);
    update();
    // Tabs added, removed, disabled or renamed, and the list resizing, move the indicator too.
    const mutations = new MutationObserver(update);
    mutations.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-disabled"],
    });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resize?.observe(list);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [activeValue, isBar]);

  // Keep the active tab visible inside a scrolling list. Only the list scrolls: `scrollIntoView`
  // would also scroll the page to the tabs (on mount too).
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !activeValue || list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!active) return;
    const start = active.offsetLeft;
    const end = start + active.offsetWidth;
    const left =
      start < list.scrollLeft
        ? start
        : end > list.scrollLeft + list.clientWidth
          ? end - list.clientWidth
          : null;
    if (left !== null) {
      list.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [activeValue]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([data-disabled="true"])',
      ),
    );
    const current = tabs.findIndex((tab) => tab.dataset.value === activeValue);
    // A vertical list turns into a row on narrow containers: it accepts both axes.
    const next = rovingIndex(event.key, current, tabs.length, isBar ? "horizontal" : "both");
    if (next === null) return;
    event.preventDefault();
    onSelect(tabs[next].dataset.value ?? "");
    tabs[next].focus();
  }

  return (
    <ScrollContainer
      {...rest}
      ref={mergedRef}
      axis="horizontal"
      fade
      scrollbar="hidden"
      role="tablist"
      aria-orientation={orientation}
      className={cx(styles.list, className)}
      data-indicator={isBar ? "bar" : "pill"}
      onKeyDown={handleKeyDown}
    >
      {/* First in DOM order so it always paints below the items. */}
      <div
        ref={indicatorRef}
        className={cx(styles.indicator, isBar ? styles.indicatorBar : styles.indicatorPill)}
        aria-hidden="true"
      />
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </ScrollContainer>
  );
}
TabsList.displayName = "Tabs.List";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type TabsItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "type" | "role" | "onClick"
> & {
  value: string;
  disabled?: boolean;
  /**
   * Plain text, or parts: `Tabs.Icon`, `Tabs.Label`, `Tabs.Count`, `Tabs.Description`.
   * A `Tabs.Description` makes the item two-line and becomes its accessible description.
   */
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

function hasChildOfType(children: React.ReactNode, type: React.ElementType): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === type,
  );
}

/** Plain text children become a `Tabs.Label` so they get truncation and a stable bold width. */
function wrapText(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) =>
    (typeof child === "string" || typeof child === "number") && String(child).trim() !== "" ? (
      <TabsLabel>{child}</TabsLabel>
    ) : (
      child
    ),
  );
}

function TabsItem({ value, disabled = false, children, className, ...rest }: TabsItemProps) {
  const { activeValue, onSelect, rootId } = useTabsContext();
  const isSelected = activeValue === value;
  const id = tabId(rootId, value);
  const twoLine = hasChildOfType(children, TabsDescription);
  const hasCount = hasChildOfType(children, TabsCount);

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={id}
      aria-selected={isSelected}
      aria-controls={panelId(rootId, value)}
      aria-labelledby={twoLine ? cx(`${id}-label`, hasCount && `${id}-count`) : undefined}
      aria-describedby={twoLine ? `${id}-description` : undefined}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      {...toDataAttributes({
        state: isSelected ? "active" : "inactive",
        disabled: disabled || undefined,
        "two-line": twoLine || undefined,
      })}
      disabled={disabled}
      className={cx(styles.tab, className)}
      onClick={() => onSelect(value)}
    >
      <ItemIdContext.Provider value={id}>{wrapText(children)}</ItemIdContext.Provider>
    </button>
  );
}
TabsItem.displayName = "Tabs.Item";

// ─── Item parts ───────────────────────────────────────────────────────────────

export type TabsIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function TabsIcon({ children, className, ...rest }: TabsIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}
TabsIcon.displayName = "Tabs.Icon";

export type TabsLabelProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Item title; truncates with an ellipsis in a constrained row. Text labels reserve the width of
 * the medium weight, so the row does not shift when a tab becomes active.
 */
function TabsLabel({ children, className, ...rest }: TabsLabelProps) {
  const itemId = React.useContext(ItemIdContext);
  const text = typeof children === "string" || typeof children === "number" ? String(children) : "";
  return (
    <span
      id={itemId ? `${itemId}-label` : undefined}
      className={cx(styles.label, className)}
      data-text={text || undefined}
      {...rest}
    >
      <span className={styles.labelText}>{children}</span>
    </span>
  );
}
TabsLabel.displayName = "Tabs.Label";

export type TabsCountProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "color"> & {
  /** Badge hue. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Counter next to the label: a soft badge one tier below the tabs size. */
function TabsCount({ color = "gray", children, className, ...rest }: TabsCountProps) {
  const itemId = React.useContext(ItemIdContext);
  return (
    <Badge.Root
      {...rest}
      id={itemId ? `${itemId}-count` : undefined}
      color={color}
      className={cx(styles.count, className)}
    >
      {children}
    </Badge.Root>
  );
}
TabsCount.displayName = "Tabs.Count";

export type TabsDescriptionProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Muted second line; wrap a key value in `<strong>` to emphasize it. */
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function TabsDescription({ children, className, ...rest }: TabsDescriptionProps) {
  const itemId = React.useContext(ItemIdContext);
  return (
    <span
      id={itemId ? `${itemId}-description` : undefined}
      className={cx(styles.description, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
TabsDescription.displayName = "Tabs.Description";

// ─── Panel ────────────────────────────────────────────────────────────────────

export type TabsPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  ref?: React.Ref<HTMLDivElement>;
};

function TabsPanel({ value, children, className, ...rest }: TabsPanelProps) {
  const { activeValue, rootId } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={panelId(rootId, value)}
      aria-labelledby={tabId(rootId, value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG — a tabpanel is focusable so keyboard users can reach its content
      tabIndex={0}
      className={cx(styles.panel, className)}
    >
      {children}
    </div>
  );
}
TabsPanel.displayName = "Tabs.Panel";

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Item: TabsItem,
  Icon: TabsIcon,
  Label: TabsLabel,
  Count: TabsCount,
  Description: TabsDescription,
  Panel: TabsPanel,
};
