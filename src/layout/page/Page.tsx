import * as React from "react";

import { Breadcrumb, type BreadcrumbRootProps } from "@/components/breadcrumb/Breadcrumb";
import { Button, type ButtonRootProps } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { Crossfade, type CrossfadeProps } from "@/components/crossfade/Crossfade";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import {
  type BarAction,
  type BarPlan,
  type BarWidths,
  planBar,
  stackHeading,
} from "@/internal/barPlan";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { iconLayout } from "@/internal/iconLayout";
import { useLabels } from "@/internal/labels";
import { useLeaveGuard } from "@/internal/leaveGuard";
import { namedRole } from "@/internal/namedRole";
import { nodeText } from "@/internal/nodeText";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { useSwapIn } from "@/internal/RegionSwap";
import { stickySurfaceClass } from "@/internal/sticky";
import { ToolChips, ToolRow } from "@/internal/ToolRow";
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
  /** Title of the confirm `Page.Guard` opens when a person leaves a `dirty` page. */
  leaveTitle: string;
  /** Its description. */
  leaveDescription: string;
  /** Its confirm button: leave and lose the changes. */
  leaveConfirm: string;
  /** Its cancel button: stay on the page. */
  leaveCancel: string;
};

export const PAGE_LABELS: PageLabels = {
  menu: "Открыть меню",
  more: "Ещё действия",
  back: "Назад к списку",
  leaveTitle: "Уйти без сохранения?",
  leaveDescription: "Изменения на странице пропадут.",
  leaveConfirm: "Уйти",
  leaveCancel: "Остаться",
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

type BarContextValue = { collapse: boolean; collapsed: boolean; plan: BarPlan };

const BarContext = React.createContext<BarContextValue>({
  collapse: false,
  collapsed: false,
  plan: "one",
});

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

const px = (value: string) => Number.parseFloat(value) || 0;
const widthOf = (node: Element | null) =>
  node ? Math.ceil(node.getBoundingClientRect().width) : 0;

/**
 * The natural widths of the bar's groups. The row is switched to its measuring layout for the
 * read — every group at its natural width on one line, every action whole and labelled — and
 * back, inside one layout effect, so the measuring layout is never painted.
 */
function measureBar(row: HTMLElement): BarWidths {
  const gap = px(getComputedStyle(row).columnGap);
  const iconed = Array.from(row.querySelectorAll<HTMLElement>("[data-button-label]"));
  // A folded path (Breadcrumb `data-collapsed`) is measured whole: its folding is the last step.
  const folded = Array.from(row.querySelectorAll<HTMLElement>("[data-collapsed]")).map(
    (node) => [node, node.getAttribute("data-collapsed") as string] as const,
  );
  // The tools are measured on one line at their natural widths, as on the bar's first line.
  const tools = row.querySelector<HTMLElement>(`:scope > .${styles.tools}`);
  const toolsFill = tools?.getAttribute("data-fill") ?? null;
  row.dataset.measure = "true";
  tools?.removeAttribute("data-fill");
  for (const node of iconed) node.removeAttribute("data-button-label");
  for (const [node] of folded) node.removeAttribute("data-collapsed");

  const actionsNode = row.querySelector<HTMLElement>(`:scope > .${styles.actions}`);
  const items = Array.from(
    actionsNode?.querySelectorAll<HTMLElement>(`:scope > .${styles.actionItem}[data-role]`) ?? [],
  );
  const square = Math.max(0, ...items.map((item) => item.offsetHeight));
  const widths: BarWidths = {
    heading: widthOf(row.querySelector(`:scope > .${styles.heading}`)),
    path: row.querySelector(`:scope > .${styles.heading} .${styles.path}`) !== null,
    tools: widthOf(tools),
    actions: items.map((item) => ({
      role: item.dataset.role as BarAction["role"],
      full: widthOf(item),
      icon: item.dataset.iconable === "true" ? square : null,
    })),
    more: square,
    gap,
    actionGap: actionsNode ? px(getComputedStyle(actionsNode).columnGap) : 0,
  };

  for (const node of iconed) node.setAttribute("data-button-label", "icon");
  for (const [node, value] of folded) node.setAttribute("data-collapsed", value);
  if (toolsFill !== null) tools?.setAttribute("data-fill", toolsFill);
  delete row.dataset.measure;
  return widths;
}

/**
 * The bar's plan: measured at natural widths after every render (a changed heading, tool or
 * action re-measures), re-chosen from those widths alone when the bar resizes, and re-measured
 * once web fonts load.
 */
function useBarPlan(
  rowRef: React.RefObject<HTMLDivElement | null>,
  rowsRef: React.RefObject<HTMLDivElement | null>,
): { plan: BarPlan; stacked: boolean } {
  const [plan, setPlan] = React.useState<BarPlan>("one");
  const [stacked, setStacked] = React.useState(false);
  const widths = React.useRef<BarWidths | null>(null);

  const decide = React.useCallback(() => {
    const rows = rowsRef.current;
    if (!widths.current || !rows) return;
    const next = planBar(widths.current, rows.clientWidth);
    setPlan((current) => (current === next ? current : next));
    setStacked(stackHeading(widths.current, rows.clientWidth, next));
  }, [rowsRef]);

  const measure = React.useCallback(() => {
    if (!rowRef.current) return;
    widths.current = measureBar(rowRef.current);
    decide();
  }, [rowRef, decide]);

  React.useLayoutEffect(measure);
  useResizeEffect(rowsRef, decide);
  React.useEffect(() => {
    const fonts = typeof document === "undefined" ? undefined : document.fonts;
    fonts?.addEventListener?.("loadingdone", measure);
    return () => fonts?.removeEventListener?.("loadingdone", measure);
  }, [measure]);

  return { plan, stacked };
}

export type PageTopBarProps = React.HTMLAttributes<HTMLElement> & {
  sticky?: boolean;
  collapse?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * The page's strip at its top edge, across the panel. Up to four groups in one grid —
 * `Page.Heading`, `Page.Tools`, `Page.Actions` on the first line, `Page.Chips` under them — laid
 * out by one plan chosen from their natural widths (`planBar`): one line while everything fits;
 * then the tools take a line of their own; then the buttons give way to their icons, secondary
 * first, and fold into «⋯»; only then does a heading with a path stack (path over title), and a
 * heading without one truncate. Sticky inside the scroller of
 * the page; while the shell's Sidebar is off-canvas it starts with the menu button. With
 * `collapse` it repeats the flow `Page.Title` once that title scrolls out under the bar.
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
  const rowsRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(barRef, ref);
  const collapsed = useCollapsed(collapse, barRef, page?.heading);
  const { plan, stacked } = useBarPlan(rowRef, rowsRef);
  const bar = React.useMemo(() => ({ collapse, collapsed, plan }), [collapse, collapsed, plan]);

  const items = flattenChildren(children);
  const of = (Part: React.ElementType) => items.filter((item) => isPart(item, Part));
  const headings = of(PageHeading);
  const other = items.filter((item) => !BAR_ORDER.some((Part) => isPart(item, Part)));

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
          <div ref={rowsRef} className={styles.rows}>
            <div
              ref={rowRef}
              className={styles.row}
              data-plan={plan}
              data-heading={stacked ? "stack" : undefined}
            >
              {/* The title repeats in the bar's heading: a bar without one gets it for the echo. */}
              {headings.length === 0 && collapse ? <PageHeading /> : headings}
              {of(PageTools)}
              {of(PageActions)}
              {of(PageChips)}
              {other}
            </div>
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
 * The chevron between the path and the title. The title is the page's `<h1>`, outside the path's
 * `<nav>`, so the Breadcrumb cannot draw it: the same glyph and colour, decorative.
 */
function PathSeparator() {
  return (
    <span aria-hidden="true" className={styles.pathSeparator}>
      <Icon name="nav.chevronRight" />
    </span>
  );
}

/**
 * The flow title repeated in a bar heading without a path: a visual echo (`aria-hidden`, `inert`)
 * — the heading itself is the `<h1>` in the flow. It rises in while the title is out of view.
 */
function TitleEcho() {
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
      <span className={cx(textRole.titleM, styles.barTitle)}>{title}</span>
      {description == null ? null : (
        <span className={cx(textRole.caption, styles.barDescription)}>{description}</span>
      )}
    </div>
  );
}

/**
 * The bar's path with the flow title as its last level while that title is out of view: the
 * title joins the Breadcrumb itself, so a path short of width folds its middle levels into «…»
 * (the Breadcrumb's own collapse) and the title stays readable, instead of every level being cut.
 * The level is a visual echo (`aria-hidden`, `inert`): the heading is the `<h1>` in the flow, the
 * path's own current level stays what assistive tech reads. It rises in and sinks out. A path
 * whose last level already names the page (a docs site: category › page, title = page) shows no
 * echo, so the name never stands twice in a row.
 */
const nameKey = (text: string) => text.replace(/\s+/g, "").toLocaleLowerCase();
const sameName = (a: string, b: string) => nameKey(a) !== "" && nameKey(a) === nameKey(b);

function PathEcho({ path }: { path: React.ReactNode }) {
  const page = React.useContext(PageContext);
  const { collapsed } = React.useContext(BarContext);
  const { title } = useHeading(page?.heading);
  const crumbs = React.isValidElement<BreadcrumbRootProps>(path)
    ? React.Children.toArray(path.props.children)
    : [];
  // A path that already ends at the page's own name gets no second copy of it — the same words
  // however spaced or cased («App Shell» and «AppShell» are one name).
  const repeats = title != null && sameName(nodeText(crumbs.at(-1)), nodeText(title));
  const presence = usePresence(collapsed && title != null && !repeats, { exitDuration: "fast" });
  // The title it showed stays while it sinks out.
  const shown = React.useRef(title);
  if (title != null) shown.current = title;
  if (!presence.mounted || !React.isValidElement<BreadcrumbRootProps>(path)) return path;
  return React.cloneElement(
    path,
    undefined,
    ...crumbs,
    <Breadcrumb.Item
      key="page-title-echo"
      current
      aria-hidden="true"
      inert
      className={presence.state === "open" ? enterMotion.enter : enterMotion.exit}
      onAnimationEnd={presence.onExitEnd}
    >
      {shown.current}
    </Breadcrumb.Item>,
  );
}

// ─── Header and heading ──────────────────────────────────────────────────────

export type PageHeaderProps = DivProps;

/**
 * The document header in the page flow (settings, long forms, overviews): a `Page.Heading` and
 * its `Page.Actions` in one row; the actions wrap under the heading on a narrow column. In a
 * `Page.TopBar` the same parts stand directly in the bar.
 */
function PageHeader({ className, children, ...rest }: PageHeaderProps) {
  const { parts: actions, rest: heading } = splitParts(children, PageActions);
  return (
    <div
      {...rest}
      className={cx(styles.header, className)}
      data-has-actions={actions.length > 0 ? "true" : undefined}
    >
      {heading}
      {actions}
    </div>
  );
}
PageHeader.displayName = "Page.Header";

export type PageHeadingProps = DivProps;

/**
 * The title group: an optional `Breadcrumb` path, `Page.Title`, `Page.Description`. In the bar
 * the title is the path's last level — the path, a chevron and the title on one line, the
 * description under the whole line, both truncating; in the flow the path stands over a large
 * title and the description wraps.
 */
function PageHeading({ className, children, ...rest }: PageHeadingProps) {
  const place = React.useContext(PlaceContext);
  const { collapse } = React.useContext(BarContext);
  const items = flattenChildren(children);
  const path = items.filter((item) => isPart(item, Breadcrumb.Root));
  const titles = items.filter((item) => isPart(item, PageTitle));
  const descriptions = items.filter((item) => isPart(item, PageDescription));
  const other = items.filter(
    (item) =>
      !isPart(item, Breadcrumb.Root) && !isPart(item, PageTitle) && !isPart(item, PageDescription),
  );
  const hasPath = path.length > 0;

  if (place === "flow") {
    return (
      <div {...rest} className={cx(styles.heading, className)} data-place="flow">
        {hasPath ? <div className={styles.path}>{path}</div> : null}
        {titles}
        {descriptions}
        {other}
      </div>
    );
  }

  const echo = titles.length === 0 && collapse;
  return (
    <div {...rest} className={cx(styles.heading, className)} data-place="bar">
      <div className={styles.headingLine}>
        {hasPath ? (
          <div className={styles.path} data-fill={titles.length === 0 ? "true" : undefined}>
            {echo
              ? path.map((item, index) =>
                  index === path.length - 1 ? (
                    <PathEcho key={keyOf(item, index)} path={item} />
                  ) : (
                    item
                  ),
                )
              : path}
          </div>
        ) : null}
        {hasPath && titles.length > 0 ? <PathSeparator /> : null}
        {titles}
        {other}
      </div>
      {descriptions}
      {echo && !hasPath ? <TitleEcho /> : null}
    </div>
  );
}
PageHeading.displayName = "Page.Heading";

export type PageTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * The page's `<h1>`: the last level of the path in the top bar (it truncates), a large title in
 * the flow. A flow title is what a `collapse` top bar repeats once it scrolls away.
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
        place === "bar" ? textRole.titleM : textRole.headingM,
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
  loading?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

/** One line of context that carries data (a period, a count): truncates in the bar, wraps in the flow. */
function PageDescription({ loading = false, className, children, ...rest }: PageDescriptionProps) {
  const place = React.useContext(PlaceContext);
  const page = React.useContext(PageContext);
  const store = place === "flow" ? page?.heading : undefined;
  // The line keeps its place while its data loads (a Skeleton in it), so the title beside it never
  // moves when the data arrives; the data then fades in under the same element.
  const swap = useSwapIn(loading ? "loading" : "data");
  React.useLayoutEffect(() => {
    store?.set({ description: loading ? null : children });
  });
  React.useLayoutEffect(() => () => store?.set({ description: null }), [store]);

  return (
    <p
      {...rest}
      key={swap.key}
      aria-busy={loading || undefined}
      className={cx(
        place === "bar" ? textRole.caption : textRole.bodyM,
        place === "bar" ? styles.barDescription : styles.description,
        swap.className,
        className,
      )}
    >
      {loading ? <Skeleton size="xs" className={styles.descriptionSkeleton} /> : children}
    </p>
  );
}
PageDescription.displayName = "Page.Description";

// ─── Actions ─────────────────────────────────────────────────────────────────

export type PageActionsProps = DivProps;

/**
 * The page's buttons: at the end of a `Page.Header` or a `Page.Section` heading in the flow (they
 * wrap under it on a narrow column), on the first line of a `Page.TopBar` at every width. In the
 * bar, when the line runs short, Buttons with an icon show only it — the secondary ones first,
 * then the primary (the first solid Button) — with their label as name and tooltip; then the
 * secondary Buttons fold into a «⋯» menu. Anything that is not a `Button.Root` stays as it is.
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

/** The content of a Button as written: its own children, or its child's with `asChild`. */
function buttonContent(button: React.ReactElement<ButtonRootProps>): React.ReactNode {
  const props = button.props;
  return props.asChild
    ? (props.children as React.ReactElement<{ children?: React.ReactNode }>).props.children
    : props.children;
}

/** A Button that shows a label beside an icon: it can give way to the icon alone. */
function isIconable(button: React.ReactElement<ButtonRootProps>): boolean {
  const layout = iconLayout(buttonContent(button), Button.Icon);
  return layout.leadingIcon || layout.trailingIcon;
}

/** The label of a Button: its `aria-label`, else the text of its content without the icons. */
function buttonLabel(button: React.ReactElement<ButtonRootProps>): string {
  const label = button.props["aria-label"];
  if (label) return label;
  const { rest } = splitParts(buttonContent(button), Button.Icon);
  return nodeText(rest).trim();
}

/** A folded Button as a menu item: its icon, its name, its click, its disabled state and tone. */
function menuItem(button: React.ReactElement<ButtonRootProps>, key: string) {
  const props = button.props;
  const own = props.asChild
    ? (props.children as React.ReactElement<{ children?: React.ReactNode }>)
    : null;
  const { parts: icons, rest: text } = splitParts<{ children?: React.ReactNode }>(
    buttonContent(button),
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

/**
 * The first Button inside an action that is not one itself: the Button of a trigger slot
 * (`Drawer.Trigger`, `Modal.Trigger`) written as the action. Searched depth-first through element
 * children, so the trigger comes before the layer's content.
 */
function nestedButton(node: React.ReactNode): React.ReactElement<ButtonRootProps> | null {
  for (const child of flattenChildren(node)) {
    if (isButton(child)) return child;
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) continue;
    const found = nestedButton(child.props.children);
    if (found) return found;
  }
  return null;
}

/** `node` with its Button `target` replaced by `wrap(target)`, the rest of the tree as is. */
function replaceButton(
  node: React.ReactNode,
  target: React.ReactElement,
  wrap: (button: React.ReactElement) => React.ReactElement,
): React.ReactNode {
  if (node === target) return wrap(target);
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return node;
  const { children } = node.props;
  if (children === undefined) return node;
  const next = React.Children.map(children, (child) => replaceButton(child, target, wrap));
  return React.cloneElement(node, undefined, ...(next ?? []));
}

type IconTooltipProps = {
  shown: boolean;
  label: string;
  children: React.ReactElement;
} & Record<string, unknown>;

/**
 * The tooltip of a Button that shows only its icon. Always mounted, open only while the label is
 * hidden, so the Button keeps its place in the tree (and its state, and focus) across plans. The
 * props a trigger slot clones onto it (handlers, `ref`, ARIA) pass on to the Button.
 */
function IconTooltip({ shown, label, children, ...slotProps }: IconTooltipProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip.Root open={shown && open} onOpenChange={setOpen}>
      <Tooltip.Trigger>{React.cloneElement(children, slotProps)}</Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

function BarActions({ className, children, ...rest }: PageActionsProps) {
  const labels = usePageLabels();
  const { plan } = React.useContext(BarContext);
  const items = flattenChildren(children);
  const keys = items.map(keyOf);
  // The Button of each action: the action itself, or the Button of a trigger slot written as it.
  const buttons = items.map((item) => (isButton(item) ? item : nestedButton(item)));
  const primary = buttons.findIndex(
    (button) => button !== null && (button.props.variant ?? "solid") === "solid",
  );
  // Only a plain Button folds into «⋯» (a trigger's layer cannot open from a menu item); a trigger
  // that is not the primary keeps its place and its label.
  const roleOf = (item: React.ReactNode, index: number): BarAction["role"] =>
    index === primary ? "primary" : isButton(item) ? "secondary" : "other";
  const folded = (item: React.ReactNode, index: number) =>
    plan === "fold" && roleOf(item, index) === "secondary";
  const iconOnly = (item: React.ReactNode, index: number) => {
    const role = roleOf(item, index);
    if (role === "other") return false;
    if (plan === "icons" || plan === "fold") return true;
    return plan === "icons-secondary" && role === "secondary";
  };
  const firstFolded = items.findIndex(folded);

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
              folded(item, index) && isButton(item) ? menuItem(item, keys[index] as string) : null,
            )}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    ) : null;

  return (
    <div {...rest} className={cx(styles.actions, className)}>
      {items.map((item, index) => {
        const key = keys[index] as string;
        const button = buttons[index] ?? null;
        const iconable = button !== null && roleOf(item, index) !== "other" && isIconable(button);
        const compact = iconable && iconOnly(item, index);
        const tooltip = (target: React.ReactElement) => (
          <IconTooltip shown={compact} label={button ? buttonLabel(button) : ""}>
            {target}
          </IconTooltip>
        );
        return (
          <React.Fragment key={key}>
            {index === firstFolded ? more : null}
            <div
              className={styles.actionItem}
              data-role={roleOf(item, index)}
              data-iconable={iconable ? "true" : undefined}
              data-button-label={compact ? "icon" : undefined}
              hidden={folded(item, index)}
            >
              {iconable && button ? replaceButton(item, button, tooltip) : item}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Tools and chips ─────────────────────────────────────────────────────────

export type PageToolsProps = DivProps;

/**
 * The page's tools — sections, search and filter, view — as kit controls in the order written, laid
 * out by the one tool row (`ToolRow`, as the DataTable `toolbar`). On the bar's first line each keeps
 * its natural width; on a line of their own a search takes the free room, switchers and pickers
 * keep their width at the end (a `SegmentedControl.Root` and a `Datepicker.Root` are `fullWidth`
 * unless set, so they fill a short line), and they wrap when one line is not enough. Named
 * (`aria-label`), it is a `group`.
 */
function PageTools({ className, ...rest }: PageToolsProps) {
  const place = React.useContext(PlaceContext);
  const { plan } = React.useContext(BarContext);
  return (
    <ToolRow
      {...rest}
      role={namedRole(rest, "group")}
      fill={place === "flow" || plan !== "one"}
      className={cx(styles.tools, className)}
    />
  );
}
PageTools.displayName = "Page.Tools";

export type PageChipsProps = DivProps;

/** Active filters (`SmartFilter.Chips`) on a line of their own under the bar; gone while empty. */
function PageChips({ className, ...rest }: PageChipsProps) {
  return <ToolChips {...rest} className={cx(styles.chips, className)} />;
}
PageChips.displayName = "Page.Chips";

/** The groups of the bar in their DOM (and Tab) order: the reading order of one line. */
const BAR_ORDER: React.ElementType[] = [PageHeading, PageTools, PageActions, PageChips];

// ─── Body, sections, grid ────────────────────────────────────────────────────

export type PageBodyProps = DivProps;

/** The page content: blocks of one screen 24 apart, a `Page.Section` 40 from its neighbours. */
function PageBody({ className, ...rest }: PageBodyProps) {
  return <div {...rest} className={cx(styles.body, className)} />;
}
PageBody.displayName = "Page.Body";

export type PageSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A titled section of the page: an `h2` heading (with an optional description and `Page.Actions`
 * at its end) over its content. Sections stand further apart than the plain blocks of the body,
 * so the air shows where a new topic starts.
 */
function PageSection({ label, description, className, children, ...rest }: PageSectionProps) {
  const headingId = React.useId();
  const { parts: actions, rest: content } = splitParts(children, PageActions);

  return (
    <section aria-labelledby={headingId} {...rest} className={cx(styles.section, className)}>
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

/** Where a cell stands in a wide + narrow pair: 2/3 or 1/3 of a mid-width grid. */
type CellPair = "wide" | "narrow";

const pairRole = (node: React.ReactNode): CellPair | undefined => {
  if (!isPart<PageCellProps>(node, PageCell)) return undefined;
  const span = node.props.span ?? 12;
  if (span >= 7 && span <= 11) return "wide";
  if (span === 4 || span === 5) return "narrow";
  return undefined;
};

/**
 * The grid of the page's tiles (KPI cards, charts, panels): 12 columns, one gap on both axes.
 * Columns follow the grid's own width, so tiles fold on a narrow panel by themselves. A wide cell
 * (span 7–11) written next to a narrow one (span 4–5) forms a pair that a mid-width grid lays out as
 * 2/3 + 1/3, so the row keeps no hole.
 */
function PageGrid({ className, children, ...rest }: PageGridProps) {
  const items = flattenChildren(children);
  const pairs = new Map<number, CellPair>();
  for (let index = 0; index < items.length - 1; index += 1) {
    const role = pairRole(items[index]);
    const next = pairRole(items[index + 1]);
    if (role && next && role !== next) {
      pairs.set(index, role);
      pairs.set(index + 1, next);
      index += 1;
    }
  }
  return (
    <div {...rest} className={cx(styles.grid, className)}>
      {items.map((item, index) => {
        const pair = pairs.get(index);
        return pair && React.isValidElement(item)
          ? React.cloneElement(item as React.ReactElement<DivProps & { "data-pair"?: CellPair }>, {
              "data-pair": pair,
            })
          : item;
      })}
    </div>
  );
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

/**
 * One tile place in `Page.Grid`; its child (a Card, a ChartFrame) fills it. A `Crossfade` child
 * fills it too (`fill` unless set), so a tile that swaps its states keeps the row's height.
 */
function PageCell({ span = 12, rows = 1, className, children, ...rest }: PageCellProps) {
  return (
    <div
      {...rest}
      className={cx(styles.cell, className)}
      {...toDataAttributes({ span, rows: rows === 1 ? undefined : rows })}
    >
      {React.Children.map(children, (child) =>
        isPart<CrossfadeProps>(child, Crossfade) && child.props.fill === undefined
          ? React.cloneElement(child, { fill: true })
          : child,
      )}
    </div>
  );
}
PageCell.displayName = "Page.Cell";

// ─── Guard ───────────────────────────────────────────────────────────────────

export type PageGuardProps = {
  busy?: boolean;
  dirty?: boolean;
};

/**
 * Holds the page from where its form state lives: put it anywhere inside the page. While it holds,
 * a press on a `Sidebar.Item`, a `BottomNav.Item` or a `Breadcrumb.Item` link stops before it
 * navigates — `busy` holds it, `dirty` asks «leave without saving?» and replays the press once the
 * person agrees — and the browser asks before the tab closes or reloads. Renders only the confirm.
 */
function PageGuard({ busy = false, dirty = false }: PageGuardProps) {
  const labels = usePageLabels();
  const [leave, setLeave] = React.useState<(() => void) | null>(null);
  const confirmed = React.useRef<(() => void) | null>(null);
  useLeaveGuard({ busy, dirty }, (next) => setLeave(() => next));

  // The navigation replays once the confirm has closed and given the page back (no longer inert).
  React.useEffect(() => {
    if (leave || !confirmed.current) return;
    const next = confirmed.current;
    confirmed.current = null;
    next();
  }, [leave]);

  return (
    <ConfirmDialog.Root
      open={leave !== null}
      onOpenChange={(open) => {
        if (!open) setLeave(null);
      }}
      title={labels.leaveTitle}
      description={labels.leaveDescription}
      confirmLabel={labels.leaveConfirm}
      labels={{ cancel: labels.leaveCancel }}
      onConfirm={() => {
        confirmed.current = leave;
      }}
    />
  );
}
PageGuard.displayName = "Page.Guard";

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
  Heading: PageHeading,
  Title: PageTitle,
  Description: PageDescription,
  Actions: PageActions,
  Tools: PageTools,
  Chips: PageChips,
  Body: PageBody,
  Section: PageSection,
  Grid: PageGrid,
  Cell: PageCell,
  Guard: PageGuard,
  Split: PageSplit,
  List: PageList,
  Detail: PageDetail,
  BackButton: PageBackButton,
};
