import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
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

const tabId = (rootId: string, value: string) => `prime-ui-kit-tab-${rootId}-${value}`;
const panelId = (rootId: string, value: string) => `prime-ui-kit-panel-${rootId}-${value}`;

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

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

type IndicatorRect = { left: number; top: number; width: number; height: number };

const EMPTY_RECT: IndicatorRect = { left: 0, top: 0, width: 0, height: 0 };

const sameRect = (a: IndicatorRect, b: IndicatorRect) =>
  a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;

function TabsList({ children, className, ...rest }: TabsListProps) {
  const { orientation, activeValue, onSelect, size } = useTabsContext();
  const listRef = React.useRef<HTMLElement>(null);
  const [indicator, setIndicator] = React.useState<IndicatorRect>(EMPTY_RECT);
  const isBar = orientation === "horizontal";

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      let next = EMPTY_RECT;
      if (active) {
        next = {
          left: active.offsetLeft,
          top: active.offsetTop,
          width: active.offsetWidth,
          height: active.offsetHeight,
        };
        // The underline bar spans the item's content box so it lines up with the text.
        if (isBar) {
          const style = getComputedStyle(active);
          const padStart = Number.parseFloat(style.paddingLeft) || 0;
          const padEnd = Number.parseFloat(style.paddingRight) || 0;
          next = { ...next, left: next.left + padStart, width: next.width - padStart - padEnd };
        }
      }
      setIndicator((prev) => (sameRect(prev, next) ? prev : next));
    };

    update();
    const mutations = new MutationObserver(update);
    mutations.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-selected", "data-disabled"],
    });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resize?.observe(list);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [isBar]);

  // Keep the active tab visible inside a scrolling list.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !activeValue || list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (typeof active?.scrollIntoView !== "function") return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    active.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
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

  const hasIndicator = indicator.width > 0 && indicator.height > 0;

  return (
    <ScrollContainer
      {...rest}
      ref={listRef}
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
        className={cx(styles.indicator, isBar ? styles.indicatorBar : styles.indicatorPill)}
        style={
          isBar
            ? { transform: `translateX(${indicator.left}px)`, width: indicator.width }
            : {
                transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                width: indicator.width,
                height: indicator.height,
              }
        }
        aria-hidden="true"
        data-visible={hasIndicator}
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

export type TabsCountProps = {
  /** Badge hue. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/** Counter next to the label: a soft badge one tier below the tabs size. */
function TabsCount({ color = "gray", children, className }: TabsCountProps) {
  const itemId = React.useContext(ItemIdContext);
  return (
    <Badge.Root
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
