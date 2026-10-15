import * as React from "react";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { Button, type ButtonRootProps } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { useLabels } from "@/internal/labels";
import { namedRole } from "@/internal/namedRole";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { stickySurfaceClass } from "@/internal/sticky";
import textRole from "@/internal/textRole.module.css";
import { useAppShellNav } from "@/layout/app-shell/AppShell";

import styles from "./Page.module.css";

// ─── Labels and the page context ─────────────────────────────────────────────

export type PageLabels = {
  /** Name of the menu button the top bar draws while the shell's Sidebar is off-canvas. */
  menu: string;
  /** Name of the «⋯» button the top bar's actions fold into when the row runs out of width. */
  more: string;
  /** Name of `Page.BackButton` (back from the detail to the list on a narrow split). */
  back: string;
};

export const PAGE_LABELS: PageLabels = {
  menu: "Открыть меню",
  more: "Ещё действия",
  back: "Назад к списку",
};

/** The title of the page as written in the flow: what the top bar repeats once it scrolls away. */
type Heading = {
  element: HTMLElement | null;
  title: React.ReactNode;
  description: React.ReactNode;
};

type HeadingStore = {
  get: () => Heading;
  set: (patch: Partial<Heading>) => void;
  subscribe: (listener: () => void) => () => void;
};

const EMPTY_HEADING: Heading = { element: null, title: null, description: null };

/**
 * A store outside React: the flow title writes into it on every render, and only the top bar's
 * echo of the title reads it — the page around them never re-renders for it.
 */
function createHeadingStore(): HeadingStore {
  let state = EMPTY_HEADING;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(patch) {
      const keys = Object.keys(patch) as (keyof Heading)[];
      if (keys.every((key) => Object.is(state[key], patch[key]))) return;
      state = { ...state, ...patch };
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const noSubscribe = () => () => {};

type PageContextValue = { labels: PageLabels; heading: HeadingStore };

const PageContext = React.createContext<PageContextValue | null>(null);
PageContext.displayName = "PageContext";

function usePageLabels(): PageLabels {
  return React.useContext(PageContext)?.labels ?? PAGE_LABELS;
}

function useHeading(store: HeadingStore | undefined): Heading {
  return React.useSyncExternalStore(
    store?.subscribe ?? noSubscribe,
    () => store?.get() ?? EMPTY_HEADING,
    () => EMPTY_HEADING,
  );
}

/** Where a header stands: in the page's top bar (compact) or in the page flow (the document). */
type Place = "flow" | "bar";

const PlaceContext = React.createContext<Place>("flow");

type BarContextValue = { collapse: boolean; collapsed: boolean };

const BarContext = React.createContext<BarContextValue>({ collapse: false, collapsed: false });

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

// ─── Root ────────────────────────────────────────────────────────────────────

/** Cap of the page column. */
export type PageMaxWidth = "full" | "readable" | "wide";

export type PageRootProps = DivProps & {
  maxWidth?: PageMaxWidth;
  fill?: boolean;
  labels?: Partial<PageLabels>;
};

/**
 * The page: the column inside `AppShell.Main` that holds the top bar, the header and the body. In
 * the shell it takes the shell's gutters and top air (`--page-gutter`, `--page-top` from main);
 * outside it brings none. `maxWidth` caps and centres everything but the top bar, which runs the
 * width of the panel.
 */
function PageRoot({
  maxWidth = "full",
  fill = false,
  labels: labelsProp,
  className,
  ...rest
}: PageRootProps) {
  const labels = useLabels(PAGE_LABELS, labelsProp);
  const [heading] = React.useState(createHeadingStore);
  const value = React.useMemo(() => ({ labels, heading }), [labels, heading]);

  return (
    <PageContext.Provider value={value}>
      <div
        {...rest}
        role={namedRole(rest, "region")}
        className={cx(styles.root, className)}
        {...toDataAttributes({
          "max-width": maxWidth === "full" ? undefined : maxWidth,
          fill: fill || undefined,
        })}
      />
    </PageContext.Provider>
  );
}
PageRoot.displayName = "Page.Root";

// ─── Top bar ─────────────────────────────────────────────────────────────────

/** The nearest ancestor that scrolls (the root of an `IntersectionObserver`); `null` — the window. */
function scrollParent(node: HTMLElement): HTMLElement | null {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) return parent;
  }
  return null;
}

/**
 * Whether the flow title has scrolled out under the bar: it is above the bar's bottom edge and no
 * part of it shows. Follows the bar's height, so the edge moves with it.
 */
function useCollapsed(
  enabled: boolean,
  barRef: React.RefObject<HTMLElement | null>,
  store: HeadingStore | undefined,
): boolean {
  const { element } = useHeading(store);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const bar = barRef.current;
    if (!enabled || !element || !bar || typeof IntersectionObserver === "undefined") {
      setCollapsed(false);
      return;
    }
    const root = scrollParent(bar);
    let observer: IntersectionObserver | null = null;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          const edge = entry.rootBounds?.top ?? 0;
          setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < edge);
        },
        { root, rootMargin: `${-bar.offsetHeight}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(element);
    };
    observe();
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(observe);
    resize?.observe(bar);
    return () => {
      observer?.disconnect();
      resize?.disconnect();
    };
  }, [enabled, element, barRef]);

  return enabled && collapsed;
}

export type PageTopBarProps = React.HTMLAttributes<HTMLElement> & {
  sticky?: boolean;
  collapse?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * The page's strip at its top edge, across the panel: a `Page.Header` (the title row) and / or a
 * `Page.Toolbar` (the row of the page's tools under it). Sticky inside the scroller of the page;
 * while the shell's Sidebar is off-canvas it starts with the menu button that opens it. With
 * `collapse` it repeats the flow `Page.Title` (and its description) once that title scrolls out
 * under the bar.
 */
function PageTopBar({
  sticky = true,
  collapse = false,
  className,
  children,
  ref,
  ...rest
}: PageTopBarProps) {
  const page = React.useContext(PageContext);
  const nav = useAppShellNav();
  const barRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(barRef, ref);
  const collapsed = useCollapsed(collapse, barRef, page?.heading);
  const bar = React.useMemo(() => ({ collapse, collapsed }), [collapse, collapsed]);
  const rows = flattenChildren(children);
  // The title repeats in the bar's title row: a bar without one gets a row of its own for it.
  const titleRow = collapse && !rows.some((row) => isPart(row, PageHeader));

  return (
    <PlaceContext.Provider value="bar">
      <BarContext.Provider value={bar}>
        <header
          {...rest}
          ref={mergedRef}
          className={cx(styles.topBar, sticky && stickySurfaceClass, className)}
          {...toDataAttributes({
            sticky: sticky || undefined,
            collapsed: collapse ? collapsed : undefined,
          })}
        >
          {nav?.offCanvas ? <MenuButton /> : null}
          <div className={styles.rows}>
            {titleRow ? <PageHeader /> : null}
            {rows}
          </div>
        </header>
      </BarContext.Provider>
    </PlaceContext.Provider>
  );
}
PageTopBar.displayName = "Page.TopBar";

/** Opens the shell's off-canvas Sidebar: `aria-expanded` and `aria-controls` from the shell. */
function MenuButton() {
  const labels = usePageLabels();
  const nav = useAppShellNav();
  if (!nav?.offCanvas) return null;
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      aria-label={labels.menu}
      aria-expanded={nav.open}
      aria-controls={nav.navId}
      className={styles.menuButton}
      onClick={() => nav.setOpen(!nav.open)}
    >
      <Button.Icon>
        <Icon name="nav.menu" />
      </Button.Icon>
    </Button.Root>
  );
}

/**
 * The flow title repeated in the bar's title row: a visual echo (`aria-hidden`, `inert`) — the
 * heading itself is the `<h1>` in the flow. It rises in while the title is out of view.
 */
function TitleEcho({ separator }: { separator: boolean }) {
  const page = React.useContext(PageContext);
  const { collapsed } = React.useContext(BarContext);
  const { title, description } = useHeading(page?.heading);
  if (title == null) return null;
  return (
    <div
      aria-hidden="true"
      inert
      className={styles.echo}
      {...toDataAttributes({ visible: collapsed || undefined })}
    >
      {separator ? <Divider orientation="vertical" inset /> : null}
      <div className={styles.titleBlock}>
        <span className={cx(textRole.titleS, styles.barTitle)}>{title}</span>
        {description == null ? null : (
          <span className={cx(textRole.caption, styles.barDescription)}>{description}</span>
        )}
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

export type PageHeaderProps = DivProps;

/**
 * The title block and the page's actions in one row: an optional `Breadcrumb` path, `Page.Title`,
 * `Page.Description`, then `Page.Actions` at the end. In `Page.TopBar` it is compact — the path,
 * a separator and the title on one line, actions folding into «⋯»; in the page flow it is the
 * large document header — the path over the title, actions wrapping under it on a narrow column.
 */
function PageHeader({ className, children, ...rest }: PageHeaderProps) {
  const place = React.useContext(PlaceContext);
  const { collapse } = React.useContext(BarContext);
  const items = flattenChildren(children);
  const actions = items.filter((item) => isPart(item, PageActions));
  const path = items.filter((item) => isPart(item, Breadcrumb.Root));
  const heading = items.filter(
    (item) => !isPart(item, PageActions) && !isPart(item, Breadcrumb.Root),
  );
  const hasTitle = heading.some((item) => isPart(item, PageTitle));
  const hasPath = path.length > 0;

  let title: React.ReactNode = null;
  if (place === "bar" && collapse && !hasTitle) {
    title = <TitleEcho separator={hasPath} />;
  } else if (heading.length > 0) {
    title = (
      <>
        {place === "bar" && hasPath ? <Divider orientation="vertical" inset /> : null}
        <div className={styles.titleBlock}>{heading}</div>
      </>
    );
  }

  return (
    <div
      {...rest}
      className={cx(styles.header, className)}
      data-place={place}
      data-has-actions={actions.length > 0 ? "true" : undefined}
    >
      <div className={styles.heading}>
        {hasPath ? <div className={styles.path}>{path}</div> : null}
        {title}
      </div>
      {actions}
    </div>
  );
}
PageHeader.displayName = "Page.Header";

export type PageTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * The page's `<h1>`: title-s in the top bar (it truncates), heading-m in the flow. A flow title
 * is what a `collapse` top bar repeats once it scrolls away.
 */
function PageTitle({ className, children, ref, ...rest }: PageTitleProps) {
  const place = React.useContext(PlaceContext);
  const page = React.useContext(PageContext);
  const store = place === "flow" ? page?.heading : undefined;
  const register = React.useCallback(
    (node: HTMLHeadingElement | null) => store?.set({ element: node }),
    [store],
  );
  const mergedRef = useMergedRefs(register, ref);
  React.useLayoutEffect(() => {
    store?.set({ title: children });
  });
  React.useLayoutEffect(() => () => store?.set({ title: null }), [store]);

  return (
    <h1
      {...rest}
      ref={mergedRef}
      className={cx(
        place === "bar" ? textRole.titleS : textRole.headingM,
        place === "bar" ? styles.barTitle : styles.title,
        className,
      )}
    >
      {children}
    </h1>
  );
}
PageTitle.displayName = "Page.Title";

export type PageDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** One line of context that carries data (a period, a count): truncates in the bar, wraps in the flow. */
function PageDescription({ className, children, ...rest }: PageDescriptionProps) {
  const place = React.useContext(PlaceContext);
  const page = React.useContext(PageContext);
  const store = place === "flow" ? page?.heading : undefined;
  React.useLayoutEffect(() => {
    store?.set({ description: children });
  });
  React.useLayoutEffect(() => () => store?.set({ description: null }), [store]);

  return (
    <p
      {...rest}
      className={cx(
        place === "bar" ? textRole.caption : textRole.bodyM,
        place === "bar" ? styles.barDescription : styles.description,
        className,
      )}
    >
      {children}
    </p>
  );
}
PageDescription.displayName = "Page.Description";

// ─── Actions ─────────────────────────────────────────────────────────────────

export type PageActionsProps = DivProps;

/**
 * The page's buttons at the end of a header (or of a `Page.Section` heading). In the flow they
 * wrap under the title on a narrow column; in the top bar they keep one line and, when it runs out
 * of width, the trailing secondary Buttons fold into a «⋯» menu — the first solid Button (the
 * primary action) and anything that is not a `Button.Root` stay.
 */
function PageActions(props: PageActionsProps) {
  const place = React.useContext(PlaceContext);
  if (place === "bar") return <BarActions {...props} />;
  const { className, ...rest } = props;
  return <div {...rest} className={cx(styles.actions, className)} />;
}
PageActions.displayName = "Page.Actions";

const isButton = (node: React.ReactNode): node is React.ReactElement<ButtonRootProps> =>
  isPart(node, Button.Root);

const keyOf = (node: React.ReactNode, index: number) =>
  React.isValidElement(node) && node.key != null ? String(node.key) : `#${index}`;

const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
  a.size === b.size && [...a].every((key) => b.has(key));

const NONE: ReadonlySet<string> = new Set();

/** A folded Button as a menu item: its icon, its name, its click, its disabled state and tone. */
function menuItem(button: React.ReactElement<ButtonRootProps>, key: string) {
  const props = button.props;
  const own = props.asChild
    ? (props.children as React.ReactElement<{ children?: React.ReactNode }>)
    : null;
  const { parts: icons, rest: text } = splitParts<{ children?: React.ReactNode }>(
    own ? own.props.children : props.children,
    Button.Icon,
  );
  const icon = icons[0]?.props.children;
  const content = (
    <>
      {icon ? <Dropdown.ItemIcon>{icon}</Dropdown.ItemIcon> : null}
      {props["aria-label"] ?? text}
    </>
  );
  return (
    <Dropdown.Item
      key={key}
      asChild={own !== null}
      disabled={props.disabled || props.loading}
      tone={props.tone === "danger" ? "danger" : "neutral"}
      onClick={own ? undefined : props.onClick}
    >
      {own ? React.cloneElement(own, undefined, content) : content}
    </Dropdown.Item>
  );
}

function BarActions({ className, children, ref, ...rest }: PageActionsProps) {
  const labels = usePageLabels();
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(nodeRef, ref);
  const [folded, setFolded] = React.useState<ReadonlySet<string>>(NONE);
  const widths = React.useRef(new Map<string, number>());

  const items = flattenChildren(children);
  const keys = items.map(keyOf);
  const primary = items.findIndex(
    (item) => isButton(item) && (item.props.variant ?? "solid") === "solid",
  );
  const movable = items.map((item, index) => isButton(item) && index !== primary);
  const latest = React.useRef({ keys, movable });
  latest.current = { keys, movable };

  const fit = React.useCallback(() => {
    const node = nodeRef.current;
    const header = node?.parentElement;
    if (!node || !header) return;
    for (const child of Array.from(node.children) as HTMLElement[]) {
      const key = child.dataset.key;
      if (key !== undefined && !child.hidden) widths.current.set(key, child.offsetWidth);
    }
    const { keys: all, movable: canMove } = latest.current;
    const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 0;
    const headerStyle = getComputedStyle(header);
    const inner =
      header.clientWidth -
      (Number.parseFloat(headerStyle.paddingInlineStart) || 0) -
      (Number.parseFloat(headerStyle.paddingInlineEnd) || 0);
    // The title keeps at least this much before an action folds; below it the title truncates.
    const keep = readCssLengthPx("--prime-space-24", 96) * 1.5;
    const room = inner - (Number.parseFloat(headerStyle.columnGap) || 0) - keep;
    const width = (list: string[]) =>
      list.reduce((sum, key) => sum + (widths.current.get(key) ?? 0), 0) +
      gap * Math.max(list.length - 1, 0);

    const next = new Set<string>();
    if (width(all) > room) {
      const more = readCssLengthPx("--prime-control-m-height", 32) + gap;
      for (let index = all.length - 1; index >= 0; index--) {
        const key = all[index] as string;
        if (!canMove[index] || !widths.current.has(key)) continue;
        next.add(key);
        if (width(all.filter((key) => !next.has(key))) + more <= room) break;
      }
    }
    setFolded((prev) => (sameSet(prev, next) ? prev : next));
  }, []);

  React.useLayoutEffect(() => {
    headerRef.current = nodeRef.current?.parentElement ?? null;
  });
  // Measure after every render: a new or changed action shows first and is measured in place.
  React.useLayoutEffect(fit);
  useResizeEffect(headerRef, fit);
  useResizeEffect(nodeRef, fit, { children: true });

  const firstFolded = keys.findIndex((key) => folded.has(key));
  const more =
    firstFolded >= 0 ? (
      <div key="more" className={styles.actionItem}>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" aria-label={labels.more}>
              <Button.Icon>
                <Icon name="action.more" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            {items.map((item, index) =>
              folded.has(keys[index] as string) && isButton(item)
                ? menuItem(item, keys[index] as string)
                : null,
            )}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    ) : null;

  return (
    <div {...rest} ref={mergedRef} className={cx(styles.actions, className)}>
      {items.map((item, index) => {
        const key = keys[index] as string;
        return (
          <React.Fragment key={key}>
            {index === firstFolded ? more : null}
            <div className={styles.actionItem} data-key={key} hidden={folded.has(key)}>
              {item}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

export type PageToolsProps = DivProps;

/**
 * The page's tools: search and filter, sections, view options and the primary action, with the
 * active filters under the top row. It lays itself out from its own width — one row when wide,
 * stacked rows when narrow. Parts may be left out; whatever the JSX order, the DOM (and Tab) order
 * is Tools, Sections, View, Actions, Chips. Named (`aria-label`), it is a `group`.
 */
function PageTools({ className, children, ref, ...rest }: PageToolsProps) {
  const items = flattenChildren(children);
  const of = (Part: React.ElementType) => items.filter((child) => isPart(child, Part));
  const other = items.filter(
    (child) => !TOOLBAR_ORDER.some((Part) => isPart(child, Part)) && !isPart(child, PageToolsChips),
  );

  return (
    <div
      {...rest}
      ref={ref}
      role={namedRole(rest, "group")}
      className={cx(styles.toolbar, className)}
    >
      <div className={styles.toolbarLayout}>
        <div className={styles.toolbarBar}>
          {TOOLBAR_ORDER.flatMap(of)}
          {other}
        </div>
        {of(PageToolsChips)}
      </div>
    </div>
  );
}
PageTools.displayName = "Page.Toolbar";

export type PageToolsToolsProps = DivProps;

/** Search and filter button (`SmartFilter.Toolbar`): the first slot and the stretchy one. */
function PageToolsTools({ className, ...rest }: PageToolsToolsProps) {
  return <div {...rest} className={cx(styles.toolbarTools, className)} />;
}
PageToolsTools.displayName = "Page.ToolbarTools";

export type PageToolsSectionsProps = DivProps;

/** Sections of the page — a `fullWidth` SegmentedControl; after the Tools when wide, a full row when narrow. */
function PageToolsSections({ className, ...rest }: PageToolsSectionsProps) {
  return <div {...rest} className={cx(styles.toolbarSections, className)} />;
}
PageToolsSections.displayName = "Page.ToolbarSections";

export type PageToolsViewProps = DivProps;

/** How the data is shown: period, table / cards, columns. Its own full row when narrow. */
function PageToolsView({ className, ...rest }: PageToolsViewProps) {
  return <div {...rest} className={cx(styles.toolbarView, className)} />;
}
PageToolsView.displayName = "Page.ToolbarView";

export type PageToolsActionsProps = DivProps;

/** The primary action of the page: the top row's end at every width. */
function PageToolsActions({ className, ...rest }: PageToolsActionsProps) {
  return <div {...rest} className={cx(styles.toolbarActions, className)} />;
}
PageToolsActions.displayName = "Page.ToolbarActions";

export type PageToolsChipsProps = DivProps;

/** Active filters (`SmartFilter.Chips`) in their own row under the top row; gone while empty. */
function PageToolsChips({ className, ...rest }: PageToolsChipsProps) {
  return <div {...rest} className={cx(styles.toolbarChips, className)} />;
}
PageToolsChips.displayName = "Page.ToolbarChips";

/** The DOM and Tab order of the toolbar's slots: the reading order of the wide layout. */
const TOOLBAR_ORDER: React.ElementType[] = [
  PageToolsTools,
  PageToolsSections,
  PageToolsView,
  PageToolsActions,
];

// ─── Body, sections, grid ────────────────────────────────────────────────────

export type PageBodyProps = DivProps;

/** The page content: blocks of one screen 24 apart, a `Page.Section` 40 from its neighbours. */
function PageBody({ className, ...rest }: PageBodyProps) {
  return <div {...rest} className={cx(styles.body, className)} />;
}
PageBody.displayName = "Page.Body";

/** Where the heading of a section stands: over its content or in a column beside it. */
export type PageSectionLayout = "stack" | "aside";

export type PageSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  layout?: PageSectionLayout;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A titled section of the page: an `h2` heading (with an optional description and `Page.Actions`
 * at its end) over its content. Sections stand further apart than the plain blocks of the body,
 * so the air shows where a new topic starts.
 */
function PageSection({
  label,
  description,
  layout = "stack",
  className,
  children,
  ...rest
}: PageSectionProps) {
  const headingId = React.useId();
  const { parts: actions, rest: content } = splitParts(children, PageActions);

  return (
    <section
      aria-labelledby={headingId}
      {...rest}
      className={cx(styles.section, className)}
      {...toDataAttributes({ layout: layout === "aside" ? "aside" : undefined })}
    >
      <div
        className={styles.sectionHeader}
        data-has-actions={actions.length > 0 ? "true" : undefined}
      >
        <div className={styles.sectionHeading}>
          <h2 id={headingId} className={cx(textRole.titleM, styles.sectionTitle)}>
            {label}
          </h2>
          {description ? (
            <p className={cx(textRole.bodyS, styles.sectionDescription)}>{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className={styles.sectionContent}>{content}</div>
    </section>
  );
}
PageSection.displayName = "Page.Section";

export type PageGridProps = DivProps;

/**
 * The grid of the page's tiles (KPI cards, charts, panels): 12 columns, one gap on both axes.
 * Columns follow the grid's own width, so tiles fold on a narrow panel by themselves.
 */
function PageGrid({ className, ...rest }: PageGridProps) {
  return <div {...rest} className={cx(styles.grid, className)} />;
}
PageGrid.displayName = "Page.Grid";

/** Columns of 12 a cell spans on a wide grid. */
export type PageCellSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/** Rows a cell spans. */
export type PageCellRows = 1 | 2 | 3 | 4;

export type PageCellProps = DivProps & {
  span?: PageCellSpan;
  rows?: PageCellRows;
};

/** One tile place in `Page.Grid`; its child (a Card, a ChartFrame) fills it. */
function PageCell({ span = 12, rows = 1, className, ...rest }: PageCellProps) {
  return (
    <div
      {...rest}
      className={cx(styles.cell, className)}
      {...toDataAttributes({ span, rows: rows === 1 ? undefined : rows })}
    />
  );
}
PageCell.displayName = "Page.Cell";

// ─── List + detail ───────────────────────────────────────────────────────────

type SplitContextValue = {
  open: boolean;
  close: () => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  detailRef: React.RefObject<HTMLDivElement | null>;
  /** The pane that just came into view on a narrow split: it plays the enter motion once. */
  entering: "list" | "detail" | null;
  endEnter: () => void;
  /** The element that had focus in the list, so going back returns there. */
  lastListFocus: React.RefObject<HTMLElement | null>;
};

const [SplitProvider, useSplit] = createComponentContext<SplitContextValue>("Page.Split");

const isHidden = (node: HTMLElement | null) =>
  node === null || getComputedStyle(node).display === "none";

export type PageSplitProps = DivProps & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * List + detail (mail, a messenger, a ticket queue): two panes side by side from 48rem of its own
 * width, one at a time below it — the list, or the open detail with a back button. Takes the free
 * height of a filling page; each pane gives its last child the free height.
 */
function PageSplit({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: PageSplitProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const detailRef = React.useRef<HTMLDivElement | null>(null);
  const lastListFocus = React.useRef<HTMLElement | null>(null);
  const [entering, setEntering] = React.useState<"list" | "detail" | null>(null);
  const previousOpen = React.useRef(open);

  // A narrow split swaps its panes: the new one enters, and focus follows it — into the detail,
  // or back to where it was in the list. A wide split moves nothing.
  React.useLayoutEffect(() => {
    if (previousOpen.current === open) return;
    previousOpen.current = open;
    const list = listRef.current;
    const detail = detailRef.current;
    const narrow = isHidden(list) !== isHidden(detail);
    if (!narrow) return;
    setEntering(open ? "detail" : "list");
    if (open && detail && !isHidden(detail)) {
      if (!detail.contains(document.activeElement)) detail.focus({ preventScroll: true });
    } else if (!open && list && !isHidden(list)) {
      const target = lastListFocus.current;
      (target?.isConnected && list.contains(target) ? target : list).focus({
        preventScroll: true,
      });
    }
  }, [open]);

  const value = React.useMemo<SplitContextValue>(
    () => ({
      open,
      close: () => setOpen(false),
      listRef,
      detailRef,
      entering,
      endEnter: () => setEntering(null),
      lastListFocus,
    }),
    [open, setOpen, entering],
  );

  return (
    <SplitProvider value={value}>
      <div
        {...rest}
        className={cx(styles.split, className)}
        {...toDataAttributes({ open: open || undefined })}
      >
        <div className={styles.panes}>{children}</div>
      </div>
    </SplitProvider>
  );
}
PageSplit.displayName = "Page.Split";

type PaneKind = "list" | "detail";

function usePane(
  kind: PaneKind,
  part: string,
  { className, ref, onFocus, onAnimationEnd, ...rest }: DivProps,
) {
  const split = useSplit(part);
  const mergedRef = useMergedRefs(kind === "list" ? split.listRef : split.detailRef, ref);
  return {
    tabIndex: -1,
    ...rest,
    // A named pane is a region landmark: a name on a plain `<div>` reaches no one.
    role: namedRole(rest, "region"),
    ref: mergedRef,
    className: cx(
      styles.pane,
      kind === "list" ? styles.list : styles.detail,
      split.entering === kind && enterMotion.enterBase,
      className,
    ),
    onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (kind === "list" && event.target !== event.currentTarget) {
        split.lastListFocus.current = event.target;
      }
    },
    onAnimationEnd: (event: React.AnimationEvent<HTMLDivElement>) => {
      onAnimationEnd?.(event);
      if (event.target === event.currentTarget) split.endEnter();
    },
  };
}

export type PageListProps = DivProps;

/**
 * The list pane of the split: a fixed column on a wide split, the whole split while the detail is
 * closed. It remembers the control that had focus, so going back returns there.
 */
function PageList(props: PageListProps) {
  const pane = usePane("list", "Page.List", props);
  return <div {...pane} />;
}
PageList.displayName = "Page.List";

export type PageDetailProps = DivProps;

/** The detail pane of the split: the rest of a wide split; on a narrow one it replaces the list while open. */
function PageDetail(props: PageDetailProps) {
  const pane = usePane("detail", "Page.Detail", props);
  return <div {...pane} />;
}
PageDetail.displayName = "Page.Detail";

export type PageBackButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Back from the detail to the list: a soft neutral icon Button named by `labels.back`, shown only
 * while the split shows one pane. Put it at the start of the detail's header.
 */
function PageBackButton({ className, onClick, ...rest }: PageBackButtonProps) {
  const split = useSplit("Page.BackButton");
  const labels = usePageLabels();
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      aria-label={labels.back}
      {...rest}
      className={cx(styles.backButton, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) split.close();
      }}
    >
      <Button.Icon>
        <Icon name="nav.chevronLeft" />
      </Button.Icon>
    </Button.Root>
  );
}
PageBackButton.displayName = "Page.BackButton";

export const Page = {
  Root: PageRoot,
  TopBar: PageTopBar,
  Header: PageHeader,
  Title: PageTitle,
  Description: PageDescription,
  Actions: PageActions,
  Toolbar: PageTools,
  ToolbarTools: PageToolsTools,
  ToolbarSections: PageToolsSections,
  ToolbarView: PageToolsView,
  ToolbarActions: PageToolsActions,
  ToolbarChips: PageToolsChips,
  Body: PageBody,
  Section: PageSection,
  Grid: PageGrid,
  Cell: PageCell,
  Split: PageSplit,
  List: PageList,
  Detail: PageDetail,
  BackButton: PageBackButton,
};
