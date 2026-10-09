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

export type PageContentSectionProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

function PageContentSection({ className, ...rest }: PageContentSectionProps) {
  return <section className={cx(styles.section, className)} {...rest} />;
}
PageContentSection.displayName = "PageContent.Section";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageContentActionsProps = DivProps;

/** Page-level actions (buttons) next to the title; wrap below the heading on narrow columns. */
function PageContentActions({ className, ...rest }: PageContentActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
PageContentActions.displayName = "PageContent.Actions";

export type PageContentHeaderProps = DivProps;

/** Title and description stack on the left; `PageContent.Actions` children go to the end. */
function PageContentHeader({ className, children, ...rest }: PageContentHeaderProps) {
  const items = React.Children.toArray(children);
  const isActions = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === PageContentActions;
  const actions = items.filter(isActions);

  return (
    <div
      className={cx(styles.header, className)}
      data-has-actions={actions.length > 0 ? "true" : undefined}
      {...rest}
    >
      <div className={styles.heading}>{items.filter((child) => !isActions(child))}</div>
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
  Section: PageContentSection,
  Header: PageContentHeader,
  Actions: PageContentActions,
  Title: PageContentTitle,
  Description: PageContentDescription,
  Body: PageContentBody,
  Split: PageContentSplit,
  List: PageContentList,
  Detail: PageContentDetail,
  BackButton: PageContentBackButton,
};
