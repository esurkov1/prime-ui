import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { TabsSize } from "@/internal/states";

import styles from "./Tabs.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabsOrientation = "horizontal" | "vertical";

export type { TabsSize };

type TabsContextValue = {
  activeValue: string;
  onSelect: (value: string) => void;
  orientation: TabsOrientation;
  rootId: string;
  size: TabsSize;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const [TabsProvider, useTabsContext] = createComponentContext<TabsContextValue>("Tabs");

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TabsRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  size?: TabsSize;
  children: React.ReactNode;
  className?: string;
};

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  size = "m",
  children,
  className,
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
      <div className={cx(styles.root, className)} data-orientation={orientation} data-size={size}>
        {children}
      </div>
    </TabsProvider>
  );
}
TabsRoot.displayName = "TabsRoot";

// ─── List ─────────────────────────────────────────────────────────────────────

export type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

function TabsList({ children, className }: TabsListProps) {
  const { orientation, rootId, activeValue, onSelect, size } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!active) {
      setIndicator({ left: 0, top: 0, width: 0, height: 0 });
      return;
    }
    setIndicator({
      left: active.offsetLeft,
      top: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight,
    });
  }, []);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    updateIndicator();

    const mo = new MutationObserver(updateIndicator);
    mo.observe(list, {
      subtree: true,
      childList: true,
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

  const isHorizontal = orientation === "horizontal";
  const hasIndicator = isHorizontal ? indicator.width > 0 : indicator.height > 0;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const listEl = event.currentTarget;
    const tabs = Array.from(
      listEl.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([data-disabled="true"])'),
    );

    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex(
      (tab) => tab.id === `prime-ui-kit-tab-${rootId}-${activeValue}`,
    );

    const isHorizontal = orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

    let targetTab: HTMLButtonElement | null = null;

    if (event.key === nextKey) {
      event.preventDefault();
      targetTab = tabs[(currentIndex + 1) % tabs.length];
    } else if (event.key === prevKey) {
      event.preventDefault();
      targetTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    } else if (event.key === "Home") {
      event.preventDefault();
      targetTab = tabs[0];
    } else if (event.key === "End") {
      event.preventDefault();
      targetTab = tabs[tabs.length - 1];
    }

    if (targetTab) {
      const tabValue = targetTab.dataset.value ?? "";
      onSelect(tabValue);
      targetTab.focus();
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={cx(styles.list, className)}
      onKeyDown={handleKeyDown}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      <div
        className={cx(
          styles.indicator,
          isHorizontal ? styles.indicatorHorizontal : styles.indicatorVertical,
        )}
        style={
          isHorizontal
            ? {
                transform: `translate3d(${indicator.left}px, 0, 0)`,
                width: `${indicator.width}px`,
              }
            : {
                transform: `translate3d(0, ${indicator.top}px, 0)`,
                height: `${indicator.height}px`,
              }
        }
        aria-hidden="true"
        data-visible={hasIndicator ? "true" : "false"}
      />
    </div>
  );
}
TabsList.displayName = "TabsList";

// ─── Tab ──────────────────────────────────────────────────────────────────────

export type TabsTabProps = {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

function TabsTab({ value, disabled = false, children, className }: TabsTabProps) {
  const { activeValue, onSelect, rootId } = useTabsContext();
  const isSelected = activeValue === value;

  return (
    <button
      role="tab"
      id={`prime-ui-kit-tab-${rootId}-${value}`}
      aria-selected={isSelected}
      aria-controls={`prime-ui-kit-panel-${rootId}-${value}`}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      data-disabled={disabled ? "true" : undefined}
      disabled={disabled}
      className={cx(styles.tab, className)}
      onClick={() => {
        if (!disabled) onSelect(value);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
TabsTab.displayName = "TabsTab";

// ─── Icon (слот под глиф, как Button.Icon) ───────────────────────────────────

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

// ─── Label (подпись в триггере; наследует кегль через правила .root .tab * в CSS) ─

export type TabsLabelProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function TabsLabel({ children, className, ...rest }: TabsLabelProps) {
  return (
    <span className={cx(styles.label, className)} {...rest}>
      {children}
    </span>
  );
}

TabsLabel.displayName = "TabsLabel";

// ─── Panel ────────────────────────────────────────────────────────────────────

export type TabsPanelProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

function TabsPanel({ value, children, className }: TabsPanelProps) {
  const { activeValue, rootId } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`prime-ui-kit-panel-${rootId}-${value}`}
      aria-labelledby={`prime-ui-kit-tab-${rootId}-${value}`}
      className={cx(styles.panel, className)}
    >
      {children}
    </div>
  );
}
TabsPanel.displayName = "TabsPanel";

// ─── Export ───────────────────────────────────────────────────────────────────

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Icon: TabsIcon,
  Label: TabsLabel,
  Panel: TabsPanel,
};
