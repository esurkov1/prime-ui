import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { namedRole } from "@/internal/namedRole";
import type { TagRef } from "@/internal/polymorphic";
import textRole from "@/internal/textRole.module.css";

import styles from "./PageContent.module.css";

/** Cap of the page column inside `main`. */
export type PageContentMaxWidth = "full" | "readable" | "wide";

/** The element of the page column: a plain column, or a `<section>` that a heading names. */
export type PageContentRootAs = "div" | "section";

export type PageContentRootProps = React.HTMLAttributes<HTMLElement> & {
  as?: PageContentRootAs;
  maxWidth?: PageContentMaxWidth;
  fill?: boolean;
  ref?: React.Ref<HTMLElement>;
};

function PageContentRoot({
  as: Tag = "div",
  maxWidth = "full",
  fill = false,
  className,
  ref,
  ...rest
}: PageContentRootProps) {
  return (
    <Tag
      className={cx(styles.root, className)}
      ref={ref as TagRef<PageContentRootAs>}
      {...rest}
      {...toDataAttributes({
        "max-width": maxWidth === "full" ? undefined : maxWidth,
        fill: fill || undefined,
      })}
    />
  );
}
PageContentRoot.displayName = "PageContent.Root";

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
  return <h1 className={cx(textRole.headingM, styles.title, className)} {...rest} />;
}
PageContentTitle.displayName = "PageContent.Title";

export type PageContentDescriptionMeasure = "readable" | "full";

export type PageContentDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
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
      className={cx(textRole.bodyM, styles.description, className)}
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
  label: React.ReactNode;
  description?: React.ReactNode;
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
  span?: PageContentCellSpan;
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

export const PAGE_CONTENT_LABELS: PageContentLabels = {
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

const [SplitProvider, useSplit] = createComponentContext<SplitContextValue>("PageContent.Split");

const isHidden = (node: HTMLElement | null) =>
  node === null || getComputedStyle(node).display === "none";

export type PageContentSplitProps = DivProps & {
  open?: boolean;
  defaultOpen?: boolean;
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
PageContentSplit.displayName = "PageContent.Split";

/** Which pane of the split a panel is. */
export type PageContentPanelKind = "list" | "detail";

export type PageContentPanelProps = DivProps & {
  kind: PageContentPanelKind;
};

/**
 * A pane of the split. `list` — a fixed column on a wide split, the whole split while the detail
 * is closed; it remembers the control that had focus, so going back returns there. `detail` — the
 * rest of a wide split; on a narrow one it replaces the list while open.
 */
function PageContentPanel({
  kind,
  className,
  ref,
  onFocus,
  onAnimationEnd,
  ...rest
}: PageContentPanelProps) {
  const split = useSplit("PageContent.Panel");
  const mergedRef = useMergedRefs(kind === "list" ? split.listRef : split.detailRef, ref);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the list pane only records which control had focus (focus bubbles from it), so going back can return there; it handles no input.
    <div
      tabIndex={-1}
      {...rest}
      // A named pane is a region landmark: a name on a plain `<div>` reaches no one.
      role={namedRole(rest, "region")}
      ref={mergedRef}
      className={cx(
        styles.pane,
        kind === "list" ? styles.list : styles.detail,
        split.entering === kind && enterMotion.enterBase,
        className,
      )}
      data-kind={kind}
      onFocus={(event) => {
        onFocus?.(event);
        if (kind === "list" && event.target !== event.currentTarget) {
          split.lastListFocus.current = event.target;
        }
      }}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event);
        if (event.target === event.currentTarget) split.endEnter();
      }}
    />
  );
}
PageContentPanel.displayName = "PageContent.Panel";

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
  Header: PageContentHeader,
  Actions: PageContentActions,
  Title: PageContentTitle,
  Description: PageContentDescription,
  Body: PageContentBody,
  Section: PageContentSection,
  Grid: PageContentGrid,
  Cell: PageContentCell,
  Split: PageContentSplit,
  Panel: PageContentPanel,
  BackButton: PageContentBackButton,
};
