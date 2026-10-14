import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";

import styles from "./PageContent.module.css";

/** Cap of the page column inside `main`. */
export type PageContentMaxWidth = "full" | "readable" | "wide";

export type PageContentRootProps = React.HTMLAttributes<HTMLDivElement> & {
  maxWidth?: PageContentMaxWidth;
  /**
   * The page takes the height of the panel (`AppShell.Root fillViewport`): the body gets what the
   * header leaves, for a full-height table, board, chat or `PageContent.Split`.
   */
  fill?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function PageContentRoot({
  maxWidth = "full",
  fill = false,
  className,
  ...rest
}: PageContentRootProps) {
  return (
    <div
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({
        "max-width": maxWidth === "full" ? undefined : maxWidth,
        fill: fill || undefined,
      })}
    />
  );
}
PageContentRoot.displayName = "PageContent.Root";

export type PageContentPageProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

/** The whole page as a `<section>` (full panel width): `Header` with the one h1, then `Body`. */
function PageContentPage({ className, ...rest }: PageContentPageProps) {
  return <section className={cx(styles.page, className)} {...rest} />;
}
PageContentPage.displayName = "PageContent.Page";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageContentActionsProps = DivProps;

/** Page-level actions (buttons) next to the title; wrap below the heading on narrow columns. */
function PageContentActions({ className, ...rest }: PageContentActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
PageContentActions.displayName = "PageContent.Actions";

export type PageContentHeaderProps = DivProps;

function isActions(child: React.ReactNode) {
  return React.isValidElement(child) && child.type === PageContentActions;
}

/** Splits children into `PageContent.Actions` and the rest (compares element types). */
function splitActions(children: React.ReactNode) {
  const items = React.Children.toArray(children);
  return {
    actions: items.filter(isActions),
    rest: items.filter((child) => !isActions(child)),
  };
}

/** Title and description stack on the left; `PageContent.Actions` children go to the end. */
function PageContentHeader({ className, children, ...rest }: PageContentHeaderProps) {
  const { actions, rest: heading } = splitActions(children);

  return (
    <div
      className={cx(styles.header, className)}
      data-has-actions={actions.length > 0 ? "true" : undefined}
      {...rest}
    >
      <div className={styles.heading}>{heading}</div>
      {actions}
    </div>
  );
}
PageContentHeader.displayName = "PageContent.Header";

export type PageContentTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

function PageContentTitle({ className, ...rest }: PageContentTitleProps) {
  return <h1 className={cx(styles.title, className)} {...rest} />;
}
PageContentTitle.displayName = "PageContent.Title";

export type PageContentDescriptionMeasure = "readable" | "full";

export type PageContentDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** `readable` — max ~65ch; `full` — the full width of the parent (e.g. an already padded `main`). */
  measure?: PageContentDescriptionMeasure;
  ref?: React.Ref<HTMLParagraphElement>;
};

function PageContentDescription({
  className,
  measure = "readable",
  ...rest
}: PageContentDescriptionProps) {
  return (
    <p
      className={cx(styles.description, className)}
      {...rest}
      {...toDataAttributes({ measure: measure === "full" ? "full" : undefined })}
    />
  );
}
PageContentDescription.displayName = "PageContent.Description";

export type PageContentBodyProps = DivProps;

function PageContentBody({ className, ...rest }: PageContentBodyProps) {
  return <div className={cx(styles.body, className)} {...rest} />;
}
PageContentBody.displayName = "PageContent.Body";

/** Where the heading of a section stands: over its content or in a column beside it. */
export type PageContentSectionLayout = "stack" | "aside";

export type PageContentSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The visible heading of the section (an `h2`). */
  label: React.ReactNode;
  /** One line of context under the heading. */
  description?: React.ReactNode;
  /**
   * `stack` — the heading over the content; `aside` — a heading column beside the content (a
   * settings page), dropping above it once the content would get narrower than 30rem.
   */
  layout?: PageContentSectionLayout;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A titled section of the page: an `h2` heading (with an optional description and
 * `PageContent.Actions` at its end) over its content. Sections stand further apart than the plain
 * blocks of the body, so the air shows where a new topic starts.
 */
function PageContentSection({
  label,
  description,
  layout = "stack",
  className,
  children,
  ...rest
}: PageContentSectionProps) {
  const headingId = React.useId();
  const { actions, rest: content } = splitActions(children);

  return (
    <section
      aria-labelledby={headingId}
      className={cx(styles.section, className)}
      {...rest}
      {...toDataAttributes({ layout: layout === "aside" ? "aside" : undefined })}
    >
      <div
        className={styles.sectionHeader}
        data-has-actions={actions.length > 0 ? "true" : undefined}
      >
        <div className={styles.sectionHeading}>
          <h2 id={headingId} className={styles.sectionTitle}>
            {label}
          </h2>
          {description ? <p className={styles.sectionDescription}>{description}</p> : null}
        </div>
        {actions}
      </div>
      <div className={styles.sectionContent}>{content}</div>
    </section>
  );
}
PageContentSection.displayName = "PageContent.Section";

export type PageContentGridProps = DivProps;

/**
 * The grid of the page's tiles (KPI cards, charts, panels): 12 columns, one gap on both axes.
 * Columns follow the grid's own width, so tiles fold on a narrow panel by themselves.
 */
function PageContentGrid({ className, ...rest }: PageContentGridProps) {
  return <div className={cx(styles.grid, className)} {...rest} />;
}
PageContentGrid.displayName = "PageContent.Grid";

/** Columns of 12 a cell spans on a wide grid. */
export type PageContentCellSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/** Rows a cell spans. */
export type PageContentCellRows = 1 | 2 | 3 | 4;

export type PageContentCellProps = DivProps & {
  /** Columns of 12 on a wide grid; a medium grid rounds to half or full, a narrow one to full. */
  span?: PageContentCellSpan;
  /** Rows the cell spans; its child fills the height. */
  rows?: PageContentCellRows;
};

/** One tile place in `PageContent.Grid`; its child (a Card, a ChartFrame) fills it. */
function PageContentCell({ span = 12, rows = 1, className, ...rest }: PageContentCellProps) {
  return (
    <div
      className={cx(styles.cell, className)}
      {...rest}
      {...toDataAttributes({ span, rows: rows === 1 ? undefined : rows })}
    />
  );
}
PageContentCell.displayName = "PageContent.Cell";

// ─── List + detail ──────────────────────────────────────────────────────────────────────────

export type PageContentLabels = {
  /** Name of `PageContent.BackButton` (back from the detail to the list on a narrow split). */
  back: string;
};

const PAGE_CONTENT_LABELS: PageContentLabels = {
  back: "Назад к списку",
};

type SplitContextValue = {
  open: boolean;
  close: () => void;
  labels: PageContentLabels;
  listRef: React.RefObject<HTMLDivElement | null>;
  detailRef: React.RefObject<HTMLDivElement | null>;
  /** The pane that just came into view on a narrow split: it plays the enter motion once. */
  entering: "list" | "detail" | null;
  endEnter: () => void;
  /** The element that had focus in the list, so going back returns there. */
  lastListFocus: React.RefObject<HTMLElement | null>;
};

const SplitContext = React.createContext<SplitContextValue | null>(null);

function useSplit(part: string): SplitContextValue {
  const value = React.useContext(SplitContext);
  if (value === null) {
    throw new Error(`[prime-ui-kit] \`${part}\` must be used inside \`PageContent.Split\`.`);
  }
  return value;
}

const isHidden = (node: HTMLElement | null) =>
  node === null || getComputedStyle(node).display === "none";

export type PageContentSplitProps = DivProps & {
  /**
   * The detail is open (a record is chosen). On a narrow split it takes the place of the list;
   * on a wide one both panes stay. Controlled.
   */
  open?: boolean;
  /** Initial open state, uncontrolled. */
  defaultOpen?: boolean;
  /** `PageContent.BackButton` closes the detail: `false`. */
  onOpenChange?: (open: boolean) => void;
  labels?: Partial<PageContentLabels>;
};

/**
 * List + detail (mail, a messenger, a ticket queue): two panes side by side from 48rem of its own
 * width, one at a time below it — the list, or the open detail with a back button. Takes the free
 * height of a filling page; each pane gives its last child the free height.
 */
function PageContentSplit({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  labels,
  className,
  children,
  ...rest
}: PageContentSplitProps) {
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
  const mergedLabels = React.useMemo(() => ({ ...PAGE_CONTENT_LABELS, ...labels }), [labels]);

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
      labels: mergedLabels,
      listRef,
      detailRef,
      entering,
      endEnter: () => setEntering(null),
      lastListFocus,
    }),
    [open, setOpen, mergedLabels, entering],
  );

  return (
    <SplitContext value={value}>
      <div
        {...rest}
        className={cx(styles.split, className)}
        {...toDataAttributes({ open: open || undefined })}
      >
        <div className={styles.panes}>{children}</div>
      </div>
    </SplitContext>
  );
}
PageContentSplit.displayName = "PageContent.Split";

export type PageContentListProps = DivProps;

/** The list pane: a fixed column on a wide split, the whole split while the detail is closed. */
function PageContentList({
  className,
  ref,
  onFocus,
  onAnimationEnd,
  ...rest
}: PageContentListProps) {
  const split = useSplit("PageContent.List");
  const mergedRef = useMergedRefs(split.listRef, ref);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the pane only records which list control had focus (focus bubbles from it), so going back can return there; it handles no input.
    <div
      tabIndex={-1}
      {...rest}
      ref={mergedRef}
      className={cx(
        styles.pane,
        styles.list,
        split.entering === "list" && enterMotion.enterBase,
        className,
      )}
      onFocus={(event) => {
        onFocus?.(event);
        if (event.target !== event.currentTarget) split.lastListFocus.current = event.target;
      }}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event);
        if (event.target === event.currentTarget) split.endEnter();
      }}
    />
  );
}
PageContentList.displayName = "PageContent.List";

export type PageContentDetailProps = DivProps;

/** The detail pane: the rest of a wide split; on a narrow one it replaces the list while open. */
function PageContentDetail({ className, ref, onAnimationEnd, ...rest }: PageContentDetailProps) {
  const split = useSplit("PageContent.Detail");
  const mergedRef = useMergedRefs(split.detailRef, ref);
  return (
    <div
      tabIndex={-1}
      {...rest}
      ref={mergedRef}
      className={cx(
        styles.pane,
        styles.detail,
        split.entering === "detail" && enterMotion.enterBase,
        className,
      )}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event);
        if (event.target === event.currentTarget) split.endEnter();
      }}
    />
  );
}
PageContentDetail.displayName = "PageContent.Detail";

export type PageContentBackButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Back from the detail to the list: a soft neutral icon Button named by `labels.back`, shown only
 * while the split shows one pane. Put it at the start of the detail's header.
 */
function PageContentBackButton({ className, onClick, ...rest }: PageContentBackButtonProps) {
  const split = useSplit("PageContent.BackButton");
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      aria-label={split.labels.back}
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
PageContentBackButton.displayName = "PageContent.BackButton";

export const PageContent = {
  Root: PageContentRoot,
  Page: PageContentPage,
  Header: PageContentHeader,
  Actions: PageContentActions,
  Title: PageContentTitle,
  Description: PageContentDescription,
  Body: PageContentBody,
  Section: PageContentSection,
  Grid: PageContentGrid,
  Cell: PageContentCell,
  Split: PageContentSplit,
  List: PageContentList,
  Detail: PageContentDetail,
  BackButton: PageContentBackButton,
};
