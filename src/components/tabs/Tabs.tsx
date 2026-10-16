import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { BlockStackContext } from "@/internal/blockStack";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { useEnterOnAppear } from "@/internal/partPresence";
import { labelPlainText, useTextPartId, useTextParts } from "@/internal/parts";
import press from "@/internal/press.module.css";
import { rovingIndex } from "@/internal/rovingFocus";
import { SwitcherScroller } from "@/internal/SwitcherScroller";
import {
  endIndicatorGlide,
  placeIndicator,
  revealInScroller,
  selectionIndicatorClass,
  setFlag,
} from "@/internal/selectionIndicator";
import { type ControlSize, compactTier, type PaletteColor } from "@/internal/states";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";
import { type AsyncHandler, isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Tabs.module.css";

// ─── Shared ───────────────────────────────────────────────────────────────────

export type TabsLabels = {
  /** Name of the close button of a removable tab; `{label}` is the tab's title. */
  remove: string;
};

export const TABS_LABELS: TabsLabels = {
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
  /** Values whose panel is in the document: a tab points at its panel only then. */
  panels: ReadonlySet<string>;
  registerPanel: (value: string) => () => void;
};

const [TabsProvider, useTabsContext] = createComponentContext<TabsContextValue>("Tabs");

/**
 * How much of each tab a horizontal list shows: `full` everything; `compact` drops icons and
 * descriptions; `icon` keeps only icons (the label stays for screen readers and in a tooltip).
 */
type TabsCollapse = "full" | "compact" | "icon";

const CollapseContext = React.createContext<TabsCollapse>("full");

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
  orientation?: TabsOrientation;
  size?: ControlSize;
  tone?: "neutral" | "accent";
  fullWidth?: boolean;
  minItemWidth?: number | string;
  maxItemWidth?: number | string;
  labels?: Partial<TabsLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  size: sizeProp,
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
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const [panels, setPanels] = React.useState<ReadonlySet<string>>(() => new Set());
  const registerPanel = React.useCallback((panel: string) => {
    setPanels((prev) => new Set(prev).add(panel));
    return () =>
      setPanels((prev) => {
        const next = new Set(prev);
        next.delete(panel);
        return next;
      });
  }, []);
  const [activeValue, setActiveValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const resolvedLabels = useLabels(TABS_LABELS, labels);
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
      labels: resolvedLabels,
      panels,
      registerPanel,
    }),
    [activeValue, select, orientation, size, rootId, resolvedLabels, panels, registerPanel],
  );

  // The defaults scale with the tier in CSS; a prop overrides them on the root.
  const widths = {
    ...(minItemWidth !== undefined && { "--tabs-item-min": cssLength(minItemWidth) }),
    ...(maxItemWidth !== undefined && { "--tabs-item-max": cssLength(maxItemWidth) }),
  };

  // Tabs are a bar, not a surface: no layer of their own. The folder is the host's surface
  // (`layer-current` inherited), the panel is the host's content.
  return (
    <TabsProvider value={context}>
      <div
        {...rest}
        className={cx(fieldTierClass, styles.root, className)}
        style={{ ...style, ...widths } as React.CSSProperties}
        {...toDataAttributes({ orientation, size, tone, "full-width": fullWidth })}
      >
        {/* The root is the size container for the vertical → row switch; the layout sits inside. */}
        {tier.provide(<div className={styles.layout}>{children}</div>)}
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
 * A list that scrolls shows that more tabs follow (foundation §9): the tab cut by the end edge must
 * be cut through its content — a label fading out at the edge — not through its empty side, where
 * the fade has nothing to show. When it is not, the tabs held at `--tabs-item-min` widen
 * (`--tabs-peek`, 2% at a time, up to 30%) until the edge cuts a label. Measured at rest, from the
 * list's start; a list in a right-to-left page keeps the plain minimum.
 */
function peekNextTab(list: HTMLElement) {
  if (itemsFit(list) || getComputedStyle(list).direction === "rtl") return;
  const items = itemsOf(list);
  const edge = list.clientWidth;
  const fade = readCssLengthPx("--scroll-fade-depth", TOKEN_DEFAULTS["--prime-space-8"], list);
  /** Whether the edge cuts a tab's content: it starts clear of the fade and reaches into it. */
  const cutsContent = () => {
    const at = items.findIndex((item) => item.offsetLeft + item.offsetWidth > edge + 0.5);
    const tab = at >= 0 ? tabOf(items[at]) : null;
    if (!tab) return true;
    const content = (
      tab.querySelector<HTMLElement>(`.${styles.content}`) ?? tab
    ).getBoundingClientRect();
    const origin = list.getBoundingClientRect().left - list.scrollLeft;
    return content.left - origin < edge - fade / 4 && content.right - origin > edge - fade;
  };
  if (cutsContent()) return;
  for (let step = 1; step <= 15; step += 1) {
    list.style.setProperty("--tabs-peek", String(step / 50));
    if (cutsContent()) return;
  }
  list.style.removeProperty("--tabs-peek");
}

/** The item box of the active tab: what the folder covers and the list reveals. */
const activeBox = (list: HTMLElement, activeValue: string) =>
  itemsOf(list).find((item) => tabOf(item)?.dataset.value === activeValue) ?? null;

/**
 * Keeps one tab stop — the active tab, or the first enabled one while nothing is active — and
 * moves the folder behind the active tab (`placeIndicator`). The folder rises from the panel's top
 * edge in a row and reaches out of its side in a column (a vertical list in a narrow container is
 * a row again); a flare that would hang past the list edge is dropped: it would be clipped at the
 * start and add a scroll overflow at the end. Returns whether the list is a column.
 */
function placeFolder(
  list: HTMLElement,
  folder: HTMLElement,
  activeValue: string,
  animate: boolean,
): boolean {
  const items = itemsOf(list);
  const tabs = items.map(tabOf).filter((tab): tab is HTMLElement => tab !== null);
  const box = activeBox(list, activeValue);
  const stop = box ? tabOf(box) : tabs.find((tab) => tab.dataset.disabled !== "true");
  for (const tab of tabs) tab.tabIndex = tab === stop ? 0 : -1;

  const column = getComputedStyle(list).flexDirection.startsWith("column");
  const shown = box && box.offsetWidth > 0 && box.offsetHeight > 0 ? box : null;
  placeIndicator(folder, shown, animate);
  if (!shown) return column;
  folder.dataset.axis = column ? "y" : "x";
  const flare = Number.parseFloat(getComputedStyle(folder).scrollMarginTop) || 0;
  const left = shown.offsetLeft;
  const top = shown.offsetTop;
  // Positions are in the list's content box, so a scrolled list compares with its content end: the
  // last tab of a list that scrolls ends the content, and a flare there would only lengthen the
  // scroll by its own width (the last tab would never leave the end fade).
  const scrolls = !column && list.scrollWidth > list.clientWidth + 0.5;
  const start = column ? top - flare < 0 : left - flare < 0;
  const end =
    shown === items.at(-1) &&
    (column
      ? top + shown.offsetHeight + flare > list.clientHeight
      : scrolls || left + shown.offsetWidth + flare > list.clientWidth);
  setFlag(folder, "data-edge-start", start);
  setFlag(folder, "data-edge-end", end);
  return column;
}

/**
 * Fits the collapse level and places the folder before paint, and again whenever the list or a
 * tab changes size (a container resize, a label or count changing, fonts loading) or tabs are
 * added, removed or disabled. Measuring writes to the DOM; React re-renders only when the level
 * or the list's direction changes. Only the commit of a person's choice glides the folder and
 * scrolls the list smoothly (`revealInScroller`).
 */
function useListLayout(
  listRef: React.RefObject<HTMLElement | null>,
  folderRef: React.RefObject<HTMLElement | null>,
  userChangeRef: React.RefObject<boolean>,
  activeValue: string,
  horizontal: boolean,
): { collapse: TabsCollapse; column: boolean } {
  const [collapse, setCollapse] = React.useState<TabsCollapse>("full");
  const [column, setColumn] = React.useState(!horizontal);

  const layout = React.useCallback(
    (animate: boolean) => {
      const list = listRef.current;
      const folder = folderRef.current;
      if (!list || !folder) return;
      if (horizontal) list.style.removeProperty("--tabs-peek");
      const level = horizontal ? fitCollapse(list) : "full";
      list.dataset.collapse = level;
      if (horizontal) peekNextTab(list);
      setCollapse(level);
      setColumn(placeFolder(list, folder, activeValue, animate));
    },
    [listRef, folderRef, activeValue, horizontal],
  );

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const userChange = userChangeRef.current && !prefersReducedMotion();
    userChangeRef.current = false;
    layout(userChange);
    const box = activeBox(list, activeValue);
    if (box) revealInScroller(list, box, userChange);
    // Tabs added or removed; a tab turning disabled moves the tab stop.
    const mutations = new MutationObserver(() => layout(false));
    mutations.observe(list, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-disabled"],
    });
    return () => mutations.disconnect();
  }, [listRef, userChangeRef, activeValue, layout]);

  useResizeEffect(listRef, () => layout(false), { children: true });

  // A choice the owner did not apply (a controlled value kept as is) must not make a later
  // outside change glide.
  React.useLayoutEffect(() => {
    userChangeRef.current = false;
  });

  return { collapse, column };
}

// ─── List ─────────────────────────────────────────────────────────────────────

export type TabsListProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

function TabsList({ children, className, ref, ...rest }: TabsListProps) {
  const { orientation, activeValue, select, userChangeRef } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const folderRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(listRef, ref);
  const horizontal = orientation === "horizontal";
  const { collapse, column } = useListLayout(
    listRef,
    folderRef,
    userChangeRef,
    activeValue,
    horizontal,
  );

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
    // The strip paints the band; the list inside scrolls and fades over it, the band never fades.
    // A column never scrolls sideways: no edge fade, or it would dim the folder where it joins
    // the panel.
    <div className={styles.strip}>
      <SwitcherScroller
        {...rest}
        ref={mergedRef}
        edges={column ? "none" : "fade"}
        role="tablist"
        aria-orientation={orientation}
        className={cx(styles.list, className)}
        data-collapse={collapse}
        onKeyDown={handleKeyDown}
      >
        {/* First in DOM order so it paints below the tab content. */}
        <div
          ref={folderRef}
          className={cx(selectionIndicatorClass, styles.folder)}
          data-indicator=""
          aria-hidden="true"
          onTransitionEnd={endIndicatorGlide}
        />
        <CollapseContext.Provider value={collapse}>{children}</CollapseContext.Provider>
      </SwitcherScroller>
    </div>
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
  onRemove?: AsyncHandler;
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
  const { activeValue, select, size, rootId, labels, panels } = useTabsContext();
  const collapse = React.useContext(CollapseContext);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  /** A promise from `onRemove` is pending: the close button shows it, the tab stays. */
  const [removing, setRemoving] = React.useState(false);
  const tabRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs(tabRef, ref);

  const isActive = activeValue === value;
  const id = tabId(rootId, value);
  const twoLine = hasChildOfType(children, TabsDescription);
  const parts = useTextParts();
  const removable = onRemove !== undefined && !disabled;
  const iconOnly = collapse === "icon";
  const label = labelOf(children);
  const labelText = typeof label === "string" || typeof label === "number" ? label : value;

  /**
   * Closes the tab; an active tab hands the selection — and focus, if it had it — on. A promise
   * from `onRemove` (a «discard changes?» confirm) keeps the tab and its selection while pending:
   * resolved, the hand-over happens; rejected, nothing changes.
   */
  function remove() {
    if (removing) return;
    const tab = tabRef.current;
    const list = tab?.closest<HTMLElement>('[role="tablist"]');
    let handOver = () => {};
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
      const hadFocus = tab.parentElement?.contains(document.activeElement) ?? false;
      handOver = () => {
        if (isActive && neighbour) select(neighbour.dataset.value ?? "");
        if (hadFocus) next?.focus();
      };
    }
    const result = onRemove?.();
    if (!isPromiseLike(result)) {
      handOver();
      return;
    }
    setRemoving(true);
    result.then(
      () => {
        setRemoving(false);
        handOver();
      },
      () => setRemoving(false),
    );
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
            aria-controls={panels.has(value) ? panelId(rootId, value) : undefined}
            aria-labelledby={parts.labelledBy}
            aria-describedby={parts.describedBy}
            aria-keyshortcuts={removable ? "Delete" : undefined}
            tabIndex={isActive ? 0 : -1}
            data-value={value}
            {...toDataAttributes({
              state: isActive ? "active" : "inactive",
              disabled: disabled || undefined,
              "two-line": twoLine || undefined,
            })}
            disabled={disabled}
            className={cx(styles.tab, press.pressHost, className)}
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
            <span className={cx(styles.content, press.pressPartCompact)}>
              {parts.provide(labelPlainText(children, TabsLabel))}
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
            size={compactTier(size)}
            tabIndex={-1}
            loading={removing}
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
    <span className={cx(iconSlotClass, styles.icon, className)} aria-hidden="true" {...rest}>
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
 * medium weight, so the row does not shift when a tab becomes active. In a list collapsed to
 * icons the visible title leaves the row and a VisuallyHidden copy keeps naming the tab.
 */
function TabsLabel({ children, className, ...rest }: TabsLabelProps) {
  const id = useTextPartId("label");
  const iconOnly = React.useContext(CollapseContext) === "icon";
  const text = typeof children === "string" || typeof children === "number" ? String(children) : "";
  return (
    <>
      <span
        id={id}
        className={cx(styles.label, className)}
        data-text={text || undefined}
        aria-hidden={iconOnly || undefined}
        {...rest}
      >
        <span className={styles.labelText}>{children}</span>
      </span>
      {iconOnly ? <VisuallyHidden>{children}</VisuallyHidden> : null}
    </>
  );
}
TabsLabel.displayName = "Tabs.Label";

export type TabsCountProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "color"> & {
  color?: PaletteColor;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Counter next to the label: a soft badge one tier below the tabs size. */
function TabsCount({ color = "gray", children, className, ...rest }: TabsCountProps) {
  const id = useTextPartId("count");
  return (
    <Badge.Root {...rest} id={id} color={color} className={cx(styles.count, className)}>
      {children}
    </Badge.Root>
  );
}
TabsCount.displayName = "Tabs.Count";

export type TabsDescriptionProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

function TabsDescription({ children, className, ...rest }: TabsDescriptionProps) {
  const id = useTextPartId("description");
  return (
    <span id={id} className={cx(styles.description, className)} {...rest}>
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
  keepMounted?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Mounted while its tab is active. With `keepMounted` a panel stays in the document once its tab
 * has been opened: hidden (out of the layout, the tab order and the accessibility tree) while
 * another tab is active, so its state — fetched data, a draft, a scroll position — survives.
 */
function TabsPanel({ value, keepMounted = false, ...rest }: TabsPanelProps) {
  const { activeValue } = useTabsContext();
  const active = activeValue === value;
  const [opened, setOpened] = React.useState(active);
  if (active && !opened) setOpened(true);
  if (!active && !(keepMounted && opened)) return null;
  return <TabsPanelContent value={value} active={active} {...rest} />;
}
TabsPanel.displayName = "Tabs.Panel";

/** The panel in the document: it tells its tab, which points at it (`aria-controls`) only then. */
function TabsPanelContent({
  value,
  active,
  children,
  className,
  ref,
  ...rest
}: Omit<TabsPanelProps, "keepMounted"> & { active: boolean }) {
  const { rootId, registerPanel } = useTabsContext();
  // In a dialog body the panel stacks its blocks the section step apart, like the body's sections.
  const stacked = React.useContext(BlockStackContext);
  React.useLayoutEffect(() => registerPanel(value), [registerPanel, value]);
  // The panel that mounts with the tabs is just there; one the tabs open later enters.
  const appear = useEnterOnAppear<HTMLDivElement>(active);
  const mergedRef = useMergedRefs(appear.ref, ref);
  return (
    <div
      {...rest}
      ref={mergedRef}
      role="tabpanel"
      id={panelId(rootId, value)}
      aria-labelledby={tabId(rootId, value)}
      // A kept panel of an inactive tab: `display: none` takes it out of every reading.
      hidden={!active || undefined}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG — a tabpanel is focusable so keyboard users can reach its content
      tabIndex={0}
      className={cx(styles.panel, className)}
    >
      {/* The content enters each time its tab opens it after the tabs are on screen: mounted
          anew, or a kept panel shown again. The panel shown on mount stands still. */}
      <div
        className={cx(styles.panelContent, appear.entering && enterMotion.enterBase)}
        data-stack={stacked || undefined}
      >
        {children}
      </div>
    </div>
  );
}

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
