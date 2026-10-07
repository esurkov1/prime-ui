import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Tabs.module.css";

type TabsContextValue = {
  activeValue: string;
  onSelect: (value: string) => void;
  orientation: "horizontal" | "vertical";
  rootId: string;
  size: ControlSize;
};

const [TabsProvider, useTabsContext] = createComponentContext<TabsContextValue>("Tabs");

/** Ids of the trigger's text parts, used to keep the description out of the accessible name. */
type TriggerContextValue = { triggerId: string };

const TriggerContext = React.createContext<TriggerContextValue | null>(null);

function tabId(rootId: string, value: string) {
  return `prime-ui-kit-tab-${rootId}-${value}`;
}

function panelId(rootId: string, value: string) {
  return `prime-ui-kit-panel-${rootId}-${value}`;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TabsRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Default `horizontal`. A vertical list stacks above the panel in containers narrower than 600px. */
  orientation?: "horizontal" | "vertical";
  size?: ControlSize;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "children">;

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
        <div className={styles.layout}>{children}</div>
      </div>
    </TabsProvider>
  );
}
TabsRoot.displayName = "TabsRoot";

// ─── List ─────────────────────────────────────────────────────────────────────

export type TabsListProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

type IndicatorRect = { left: number; top: number; width: number; height: number };

const EMPTY_RECT: IndicatorRect = { left: 0, top: 0, width: 0, height: 0 };

function TabsList({ children, className, ...rest }: TabsListProps) {
  const { orientation, activeValue, onSelect, size } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState<IndicatorRect>(EMPTY_RECT);
  const [overflow, setOverflow] = React.useState({ start: false, end: false });

  const updateOverflow = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const maxScroll = list.scrollWidth - list.clientWidth;
    const start = list.scrollLeft > 1;
    const end = maxScroll - list.scrollLeft > 1;
    setOverflow((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    updateOverflow();
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    let next = EMPTY_RECT;
    if (active) {
      next = {
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
      };
      // The underline bar spans the trigger's content box so it lines up with the text.
      if (orientation === "horizontal") {
        const style = getComputedStyle(active);
        const padStart = Number.parseFloat(style.paddingLeft) || 0;
        const padEnd = Number.parseFloat(style.paddingRight) || 0;
        next = { ...next, left: next.left + padStart, width: next.width - padStart - padEnd };
      }
    }
    setIndicator((prev) =>
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height
        ? prev
        : next,
    );
  }, [updateOverflow, orientation]);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    updateIndicator();

    const mo = new MutationObserver(updateIndicator);
    mo.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-selected", "data-disabled"],
    });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateIndicator);
      ro.observe(list);
    }

    return () => {
      mo.disconnect();
      ro?.disconnect();
    };
  }, [updateIndicator]);

  // Keep the active tab visible inside a scrolling list.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !activeValue) return;
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!active || typeof active.scrollIntoView !== "function") return;
    if (list.scrollWidth <= list.clientWidth) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    active.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeValue]);

  // Horizontal: a bar on the list edge under the text. Vertical: a pill behind the active item.
  const isBar = orientation === "horizontal";
  const hasIndicator = indicator.width > 0 && indicator.height > 0;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([data-disabled="true"])',
      ),
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((tab) => tab.dataset.value === activeValue);
    // A vertical list may be shown as a horizontal row on narrow containers: accept both axes.
    const prevKeys = orientation === "horizontal" ? ["ArrowLeft"] : ["ArrowUp", "ArrowLeft"];
    const nextKeys = orientation === "horizontal" ? ["ArrowRight"] : ["ArrowDown", "ArrowRight"];

    let target: HTMLButtonElement | undefined;
    if (nextKeys.includes(event.key)) {
      target = tabs[(currentIndex + 1) % tabs.length];
    } else if (prevKeys.includes(event.key)) {
      target = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    } else if (event.key === "Home") {
      target = tabs[0];
    } else if (event.key === "End") {
      target = tabs[tabs.length - 1];
    }

    if (target) {
      event.preventDefault();
      onSelect(target.dataset.value ?? "");
      target.focus();
    }
  }

  return (
    <div
      {...rest}
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cx(styles.list, className)}
      {...toDataAttributes({
        indicator: isBar ? "bar" : "pill",
        "overflow-start": overflow.start || undefined,
        "overflow-end": overflow.end || undefined,
      })}
      onKeyDown={handleKeyDown}
      onScroll={updateOverflow}
    >
      {/* First in DOM order so it always paints below the triggers. */}
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
        data-visible={hasIndicator ? "true" : "false"}
      />
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </div>
  );
}
TabsList.displayName = "TabsList";

// ─── Trigger ──────────────────────────────────────────────────────────────────

export type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
  /**
   * Plain text, or parts: `Tabs.Icon`, `Tabs.Label`, `Tabs.Count`, `Tabs.Description`.
   * A `Tabs.Description` makes the trigger two-line and becomes its accessible description.
   */
  children: React.ReactNode;
  className?: string;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "children" | "type" | "role" | "onClick"
>;

function hasChildOfType(children: React.ReactNode, type: React.ElementType): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === type,
  );
}

/** Plain text children become a `Tabs.Label` so they get truncation and a stable bold width. */
function wrapText(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      String(child).trim() === "" ? (
        child
      ) : (
        <TabsLabel>{child}</TabsLabel>
      )
    ) : (
      child
    ),
  );
}

function TabsTrigger({ value, disabled = false, children, className, ...rest }: TabsTriggerProps) {
  const { activeValue, onSelect, rootId } = useTabsContext();
  const isSelected = activeValue === value;
  const id = tabId(rootId, value);
  const twoLine = hasChildOfType(children, TabsDescription);
  const hasCount = hasChildOfType(children, TabsCount);
  const triggerContext = React.useMemo(() => ({ triggerId: id }), [id]);

  return (
    <button
      {...rest}
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
      type="button"
    >
      <TriggerContext.Provider value={triggerContext}>{wrapText(children)}</TriggerContext.Provider>
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

// ─── Trigger parts ────────────────────────────────────────────────────────────

export type TabsIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function TabsIcon({ children, className, ...rest }: TabsIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}
TabsIcon.displayName = "TabsIcon";

export type TabsLabelProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/**
 * Trigger title; truncates with an ellipsis in a constrained row. Text labels reserve the width of
 * the medium weight, so the row does not shift when a tab becomes active.
 */
function TabsLabel({ children, className, ...rest }: TabsLabelProps) {
  const trigger = React.useContext(TriggerContext);
  const text = typeof children === "string" || typeof children === "number" ? String(children) : "";
  return (
    <span
      id={trigger ? `${trigger.triggerId}-label` : undefined}
      className={cx(styles.label, className)}
      data-text={text || undefined}
      {...rest}
    >
      <span className={styles.labelText}>{children}</span>
    </span>
  );
}
TabsLabel.displayName = "TabsLabel";

export type TabsCountProps = {
  /** Badge hue. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/** Counter next to the label: a soft badge one tier below the tabs size. */
function TabsCount({ color = "gray", children, className }: TabsCountProps) {
  const trigger = React.useContext(TriggerContext);
  return (
    <Badge.Root
      id={trigger ? `${trigger.triggerId}-count` : undefined}
      color={color}
      className={cx(styles.count, className)}
    >
      {children}
    </Badge.Root>
  );
}
TabsCount.displayName = "TabsCount";

export type TabsDescriptionProps = {
  /** Muted second line; wrap a key value in `<strong>` to emphasize it. */
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function TabsDescription({ children, className, ...rest }: TabsDescriptionProps) {
  const trigger = React.useContext(TriggerContext);
  return (
    <span
      id={trigger ? `${trigger.triggerId}-description` : undefined}
      className={cx(styles.description, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
TabsDescription.displayName = "TabsDescription";

// ─── Panel ────────────────────────────────────────────────────────────────────

export type TabsPanelProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

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
TabsPanel.displayName = "TabsPanel";

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Icon: TabsIcon,
  Label: TabsLabel,
  Count: TabsCount,
  Description: TabsDescription,
  Panel: TabsPanel,
};
