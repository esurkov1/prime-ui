import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { rovingIndex } from "@/internal/rovingFocus";
import { type ControlSize, type PaletteColor, stepDown } from "@/internal/states";

import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { Divider } from "../divider/Divider";
import { ScrollContainer } from "../scroll-container/ScrollContainer";
import { Tooltip } from "../tooltip/Tooltip";
import styles from "./Tabs.module.css";

// ─── Shared ───────────────────────────────────────────────────────────────────

export type TabsLabels = {
  /** Name of the close button of a removable tab; `{label}` is the tab's title. */
  remove: string;
};

const TABS_LABELS: TabsLabels = {
  remove: "Закрыть вкладку «{label}»",
};

type TabsOrientation = "horizontal" | "vertical";

type TabsContextValue = {
  activeValue: string;
  /** A person's choice (click, arrows, closing the active tab): the folder glides to it. */
  select: (value: string) => void;
  /** Set by `select`; the list reads and clears it on the next commit. */
  userChangeRef: React.RefObject<boolean>;
  orientation: TabsOrientation;
  size: ControlSize;
  rootId: string;
  labels: TabsLabels;
};

const [TabsProvider, useTabsContext] = createComponentContext<TabsContextValue>("Tabs");

/**
 * How much of each tab a horizontal list shows: `full` everything; `compact` drops icons and
 * descriptions; `icon` keeps only icons (the label stays for screen readers and in a tooltip).
 */
type TabsCollapse = "full" | "compact" | "icon";

const CollapseContext = React.createContext<TabsCollapse>("full");

/** Id of the tab, so its label, count and description can be referenced from the tab. */
const TabIdContext = React.createContext<string | null>(null);

/** A value as an id fragment: idrefs are space-separated, so spaces and symbols are replaced. */
const idPart = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, "_");
const tabId = (rootId: string, value: string) => `prime-ui-kit-tab-${rootId}-${idPart(value)}`;
const panelId = (rootId: string, value: string) => `prime-ui-kit-panel-${rootId}-${idPart(value)}`;

const cssLength = (length: number | string | undefined) =>
  typeof length === "number" ? `${length}px` : length;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TabsRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Default `horizontal`. A vertical list stacks above the panel in containers narrower than 600px. */
  orientation?: TabsOrientation;
  size?: ControlSize;
  /** Text and icon colour of the active tab. Default `neutral`: primary text, accent icon. */
  tone?: "neutral" | "accent";
  /**
   * Horizontal tabs fill the list and tend to equal widths, never narrower than their content.
   * Default `true`; `false` sizes each tab to its content.
   */
  fullWidth?: boolean;
  /** Narrowest a horizontal tab with a label gets (px or a CSS length); never below its content. */
  minItemWidth?: number | string;
  /** Widest a horizontal tab gets (px or a CSS length); a longer label ends with an ellipsis. */
  maxItemWidth?: number | string;
  labels?: Partial<TabsLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  size = "m",
  tone = "neutral",
  fullWidth = true,
  minItemWidth,
  maxItemWidth,
  labels,
  children,
  className,
  style,
  ...rest
}: TabsRootProps) {
  const rootId = React.useId();
  const [activeValue, setActiveValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const removeLabel = labels?.remove ?? TABS_LABELS.remove;
  const userChangeRef = React.useRef(false);

  const select = React.useCallback(
    (next: string) => {
      if (next === activeValue) return;
      userChangeRef.current = true;
      setActiveValue(next);
    },
    [activeValue, setActiveValue],
  );

  const context = React.useMemo<TabsContextValue>(
    () => ({
      activeValue,
      select,
      userChangeRef,
      orientation,
      size,
      rootId,
      labels: { remove: removeLabel },
    }),
    [activeValue, select, orientation, size, rootId, removeLabel],
  );

  // The defaults scale with the tier in CSS; a prop overrides them on the root.
  const widths = {
    ...(minItemWidth !== undefined && { "--tabs-item-min": cssLength(minItemWidth) }),
    ...(maxItemWidth !== undefined && { "--tabs-item-max": cssLength(maxItemWidth) }),
  };

  return (
    <TabsProvider value={context}>
      <div
        {...rest}
        className={cx(styles.root, className)}
        style={{ ...style, ...widths } as React.CSSProperties}
        {...toDataAttributes({ orientation, size, tone, "full-width": fullWidth })}
      >
        {/* The root is the size container for the vertical → row switch; the layout sits inside. */}
        <div className={styles.layout}>{children}</div>
      </div>
    </TabsProvider>
  );
}
TabsRoot.displayName = "Tabs.Root";

// ─── List layout ──────────────────────────────────────────────────────────────

const itemsOf = (list: HTMLElement) => [
  ...list.querySelectorAll<HTMLElement>(`:scope > .${styles.item}`),
];

const tabOf = (item: HTMLElement) => item.querySelector<HTMLElement>('[role="tab"]');

/**
 * Whether the tabs fit the list without scrolling, from the tabs' own extent. `scrollWidth`
 * would also count the folder's flares, which hang past the active tab.
 */
function itemsFit(list: HTMLElement): boolean {
  let end = 0;
  for (const child of list.children) {
    const element = child as HTMLElement;
    if (element.dataset.indicator !== undefined) continue;
    end = Math.max(end, element.offsetLeft + element.offsetWidth);
  }
  return end <= list.clientWidth + 0.5;
}

/**
 * Whether a label or description is cut only because its tab was squeezed. A tab already at its
 * `maxItemWidth` cuts a long label by design, so that does not count.
 */
function textSqueezed(list: HTMLElement): boolean {
  for (const text of list.querySelectorAll<HTMLElement>(
    `.${styles.labelText}, .${styles.description}`,
  )) {
    if (text.scrollWidth <= text.clientWidth + 0.5) continue;
    const item = text.closest<HTMLElement>(`.${styles.item}`);
    if (!item) continue;
    const max = Number.parseFloat(getComputedStyle(item).maxWidth);
    if (!(item.offsetWidth >= max - 0.5)) return true;
  }
  return false;
}

/**
 * The widest collapse level at which a horizontal list fits with uncut text. Each level is
 * applied to the DOM and measured in place, widest first: icons and descriptions go before a
 * label is cut, then labels (icon-only needs an icon on every tab). When nothing fits, the last
 * level stays: tabs shrink to `minItemWidth` (or a square of icons) and the list scrolls.
 */
function fitCollapse(list: HTMLElement): TabsCollapse {
  const items = itemsOf(list);
  const levels: TabsCollapse[] = ["full"];
  if (items.some((item) => item.querySelector(`.${styles.icon}, .${styles.description}`))) {
    levels.push("compact");
  }
  if (items.length > 0 && items.every((item) => item.querySelector(`.${styles.icon}`))) {
    levels.push("icon");
  }
  for (const level of levels) {
    list.dataset.collapse = level;
    if (itemsFit(list) && (level === "icon" || !textSqueezed(list))) return level;
  }
  return levels[levels.length - 1];
}

/**
 * Moves the indicator behind the active tab and keeps one tab stop: the active tab, or the first
 * enabled one while nothing is active. A flare that would hang past the list edge is dropped:
 * it would be clipped at the start and add a scroll overflow at the end. With `animate`, a move
 * of a visible indicator glides (`data-animate`); every other placement snaps.
 */
function placeIndicator(
  list: HTMLElement,
  indicator: HTMLElement,
  activeValue: string,
  animate: boolean,
): void {
  const items = itemsOf(list);
  const tabs = items.map(tabOf).filter((tab): tab is HTMLElement => tab !== null);
  const activeTab = tabs.find((tab) => tab.dataset.value === activeValue);
  const stop = activeTab ?? tabs.find((tab) => tab.dataset.disabled !== "true");
  for (const tab of tabs) tab.tabIndex = tab === stop ? 0 : -1;

  const box = activeTab?.parentElement;
  if (!box) {
    indicator.dataset.visible = "false";
    delete indicator.dataset.animate;
    return;
  }
  const left = box.offsetLeft;
  const right = left + box.offsetWidth;
  const flare = Number.parseFloat(getComputedStyle(indicator, "::after").width) || 0;
  const transform = `translate(${left}px, ${box.offsetTop}px)`;
  const width = `${box.offsetWidth}px`;
  const height = `${box.offsetHeight}px`;
  const moved =
    indicator.style.transform !== transform ||
    indicator.style.width !== width ||
    indicator.style.height !== height;
  if (moved) {
    if (animate && indicator.dataset.visible === "true") indicator.dataset.animate = "true";
    else delete indicator.dataset.animate;
  }
  indicator.style.transform = transform;
  indicator.style.width = width;
  indicator.style.height = height;
  indicator.dataset.edgeStart = String(left - flare < 0);
  indicator.dataset.edgeEnd = String(box === items.at(-1) && right + flare > list.clientWidth);
  indicator.dataset.visible = String(box.offsetWidth > 0 && box.offsetHeight > 0);
}

/**
 * Scrolls the list (never the page: `scrollIntoView` would scroll it too) so the active tab is in
 * view. Smooth only after a person's choice; on mount and outside changes it jumps.
 */
function revealActive(list: HTMLElement, smooth: boolean): void {
  if (list.scrollWidth <= list.clientWidth || typeof list.scrollTo !== "function") return;
  const box = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.parentElement;
  if (!box) return;
  const start = box.offsetLeft;
  const end = start + box.offsetWidth;
  const left =
    start < list.scrollLeft
      ? start
      : end > list.scrollLeft + list.clientWidth
        ? end - list.clientWidth
        : null;
  if (left !== null) list.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
}

/**
 * Fits the collapse level and places the indicator before paint, and again whenever the list or
 * a tab changes size (a container resize, a label or count changing, fonts loading) or tabs are
 * added or removed. Measuring writes to the DOM; React re-renders only when the level changes.
 * Only the commit of a person's choice glides the indicator and scrolls the list smoothly.
 */
function useListLayout(
  listRef: React.RefObject<HTMLElement | null>,
  indicatorRef: React.RefObject<HTMLElement | null>,
  userChangeRef: React.RefObject<boolean>,
  activeValue: string,
  horizontal: boolean,
): TabsCollapse {
  const [collapse, setCollapse] = React.useState<TabsCollapse>("full");

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const layout = (animate: boolean) => {
      const level = horizontal ? fitCollapse(list) : "full";
      list.dataset.collapse = level;
      setCollapse(level);
      placeIndicator(list, indicator, activeValue, animate);
    };
    const relayout = () => layout(false);

    const userChange = userChangeRef.current && !prefersReducedMotion();
    userChangeRef.current = false;

    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(relayout);
    const observe = () => {
      resize?.disconnect();
      resize?.observe(list);
      for (const item of itemsOf(list)) resize?.observe(item);
    };
    // Tabs added or removed; a tab turning disabled moves the tab stop.
    const mutations = new MutationObserver(() => {
      observe();
      relayout();
    });
    mutations.observe(list, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-disabled"],
    });

    observe();
    layout(userChange);
    revealActive(list, userChange);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [listRef, indicatorRef, userChangeRef, activeValue, horizontal]);

  // A choice the owner did not apply (a controlled value kept as is) must not make a later
  // outside change glide.
  React.useLayoutEffect(() => {
    userChangeRef.current = false;
  });

  return collapse;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export type TabsListProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

function TabsList({ children, className, ref, ...rest }: TabsListProps) {
  const { orientation, activeValue, select, userChangeRef, size } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(listRef, ref);
  const horizontal = orientation === "horizontal";
  const collapse = useListLayout(listRef, indicatorRef, userChangeRef, activeValue, horizontal);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    const tabs = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([data-disabled="true"])',
      ),
    ];
    const current = tabs.findIndex((tab) => tab.dataset.value === activeValue);
    // A vertical list turns into a row on narrow containers: it accepts both axes.
    const next = rovingIndex(event.key, current, tabs.length, horizontal ? "horizontal" : "both");
    if (next === null) return;
    event.preventDefault();
    select(tabs[next].dataset.value ?? "");
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
      data-indicator={horizontal ? "folder" : "pill"}
      data-collapse={collapse}
      onKeyDown={handleKeyDown}
    >
      {/* First in DOM order so it paints below the tab content. */}
      <div
        ref={indicatorRef}
        className={cx(styles.indicator, horizontal ? styles.indicatorFolder : styles.indicatorPill)}
        data-indicator=""
        aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === "transform") {
            delete event.currentTarget.dataset.animate;
          }
        }}
      />
      <ControlSizeProvider value={size}>
        <CollapseContext.Provider value={collapse}>{children}</CollapseContext.Provider>
      </ControlSizeProvider>
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
   * Makes the tab closable: a close button, `Delete` / `Backspace` on the focused tab and a middle
   * click. Closing the active tab first selects its neighbour; remove the item in this callback.
   */
  onRemove?: () => void;
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

/** The tab's title: plain text children or the children of its `Tabs.Label`. */
function labelOf(children: React.ReactNode): React.ReactNode {
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") return child;
    if (React.isValidElement<TabsLabelProps>(child) && child.type === TabsLabel) {
      return child.props.children;
    }
  }
  return null;
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

function TabsItem({
  value,
  disabled = false,
  onRemove,
  children,
  className,
  onKeyDown,
  onMouseDown,
  onAuxClick,
  ref,
  ...rest
}: TabsItemProps) {
  const { activeValue, select, size, rootId, labels } = useTabsContext();
  const collapse = React.useContext(CollapseContext);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const tabRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs(tabRef, ref);

  const isActive = activeValue === value;
  const id = tabId(rootId, value);
  const twoLine = hasChildOfType(children, TabsDescription);
  const hasCount = hasChildOfType(children, TabsCount);
  const removable = onRemove !== undefined && !disabled;
  const iconOnly = collapse === "icon";
  const label = labelOf(children);
  const labelText = typeof label === "string" || typeof label === "number" ? label : value;

  /** Closes the tab; an active tab first hands the selection — and focus, if it had it — on. */
  function remove() {
    const tab = tabRef.current;
    const list = tab?.closest<HTMLElement>('[role="tablist"]');
    if (tab && list) {
      const tabs = itemsOf(list)
        .map(tabOf)
        .filter(
          (t): t is HTMLElement => t === tab || (t !== null && t.dataset.disabled !== "true"),
        );
      const index = tabs.indexOf(tab);
      const neighbour = tabs[index + 1] ?? tabs[index - 1];
      const next = isActive
        ? neighbour
        : list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (isActive && neighbour) select(neighbour.dataset.value ?? "");
      if (tab.parentElement?.contains(document.activeElement)) next?.focus();
    }
    onRemove?.();
  }

  return (
    <div
      className={styles.item}
      role="presentation"
      {...toDataAttributes({
        state: isActive ? "active" : "inactive",
        disabled: disabled || undefined,
        removable: removable || undefined,
      })}
    >
      {/* The tooltip wraps every tab so the button is never remounted (and never loses focus)
          when the list collapses; it opens only while the label is hidden. */}
      <Tooltip.Root open={iconOnly && tooltipOpen} onOpenChange={setTooltipOpen}>
        <Tooltip.Trigger>
          <button
            {...rest}
            ref={mergedRef}
            type="button"
            role="tab"
            id={id}
            aria-selected={isActive}
            aria-controls={panelId(rootId, value)}
            aria-labelledby={twoLine ? cx(`${id}-label`, hasCount && `${id}-count`) : undefined}
            aria-describedby={twoLine ? `${id}-description` : undefined}
            aria-keyshortcuts={removable ? "Delete" : undefined}
            tabIndex={isActive ? 0 : -1}
            data-value={value}
            {...toDataAttributes({
              state: isActive ? "active" : "inactive",
              disabled: disabled || undefined,
              "two-line": twoLine || undefined,
            })}
            disabled={disabled}
            className={cx(styles.tab, className)}
            onClick={() => select(value)}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || !removable) return;
              if (event.key === "Delete" || event.key === "Backspace") {
                event.preventDefault();
                remove();
              }
            }}
            onMouseDown={(event) => {
              onMouseDown?.(event);
              // A middle press would start autoscroll; its click closes the tab instead.
              if (removable && event.button === 1) event.preventDefault();
            }}
            onAuxClick={(event) => {
              onAuxClick?.(event);
              if (event.defaultPrevented || !removable || event.button !== 1) return;
              event.preventDefault();
              remove();
            }}
          >
            <span className={styles.content}>
              <TabIdContext.Provider value={id}>{wrapText(children)}</TabIdContext.Provider>
            </span>
          </button>
        </Tooltip.Trigger>
        {iconOnly ? <Tooltip.Content>{label}</Tooltip.Content> : null}
      </Tooltip.Root>
      {removable ? (
        // Out of the tab order: the focused tab closes with Delete; the button is for the pointer.
        <span className={styles.remove}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            size={stepDown(size, 2)}
            tabIndex={-1}
            aria-label={formatLabel(labels.remove, { label: labelText })}
            onClick={remove}
          >
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        </span>
      ) : null}
    </div>
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
 * Tab title; truncates with an ellipsis in a narrow tab. Text labels reserve the width of the
 * medium weight, so the row does not shift when a tab becomes active.
 */
function TabsLabel({ children, className, ...rest }: TabsLabelProps) {
  const id = React.useContext(TabIdContext);
  const text = typeof children === "string" || typeof children === "number" ? String(children) : "";
  return (
    <span
      id={id ? `${id}-label` : undefined}
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
  const id = React.useContext(TabIdContext);
  return (
    <Badge.Root
      {...rest}
      id={id ? `${id}-count` : undefined}
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
  const id = React.useContext(TabIdContext);
  return (
    <span
      id={id ? `${id}-description` : undefined}
      className={cx(styles.description, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
TabsDescription.displayName = "Tabs.Description";

// ─── Separator ────────────────────────────────────────────────────────────────

export type TabsSeparatorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** A `Divider` hairline between groups of tabs, across the list; a tablist owns only tabs. */
function TabsSeparator({ className, ...rest }: TabsSeparatorProps) {
  const { orientation } = useTabsContext();
  return (
    <Divider
      {...rest}
      orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
      role="none"
      aria-hidden="true"
      className={cx(styles.separator, className)}
    />
  );
}
TabsSeparator.displayName = "Tabs.Separator";

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
      {/* Mounted per tab, so the content enters each time its tab opens it. */}
      <div className={cx(styles.panelContent, enterMotion.enterBase)}>{children}</div>
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
  Separator: TabsSeparator,
  Panel: TabsPanel,
};
