import * as React from "react";

import { Button } from "@/components/button/Button";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import type { TagRef } from "@/internal/polymorphic";
import type { ControlSize, Tone } from "@/internal/states";
import { usePendingAction } from "@/internal/usePendingChanges";

import styles from "./EmptyPage.module.css";

type EmptyPageLayout = "default" | "fill" | "compact";

/** `neutral` — nothing here (yet); `danger` — the region failed to load. */
export type EmptyPageTone = Extract<Tone, "neutral" | "danger">;

export type EmptyPageLabels = {
  /** Text of `EmptyPage.RetryButton`. */
  retry: string;
};

export const EMPTY_PAGE_LABELS: EmptyPageLabels = { retry: "Повторить" };

type Ctx = { tone: EmptyPageTone; labels: EmptyPageLabels };

const EmptyPageContext = React.createContext<Ctx>({
  tone: "neutral",
  labels: EMPTY_PAGE_LABELS,
});

export type EmptyPageRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: ControlSize;
  /**
   * `default` — a block sized by its content.
   * `fill` — stretches to the parent's height and centers the content (inside a table, a scroll area, a card).
   * `compact` — a quiet state inside a menu, listbox or command list: panel padding, body-s title,
   * caption description, a small icon and no entrance motion.
   */
  layout?: EmptyPageLayout;
  /**
   * `danger` — the region's load failed: the icon tile turns danger and the root announces itself
   * (`role="alert"`, unless you pass a `role`). Default `neutral`.
   */
  tone?: EmptyPageTone;
  labels?: Partial<EmptyPageLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** Parts rise in on first render, except in `compact` (it appears on every keystroke). */
function EmptyPageRoot({
  size: sizeProp,
  layout = "default",
  tone = "neutral",
  labels,
  className,
  children,
  ...rest
}: EmptyPageRootProps) {
  const { size, provide } = useHostTier(sizeProp);
  const context: Ctx = { tone, labels: { ...EMPTY_PAGE_LABELS, ...labels } };
  return provide(
    <div
      className={cx(styles.root, layout !== "compact" && enterMotion.enterBaseChildren, className)}
      role={tone === "danger" ? "alert" : undefined}
      {...rest}
      {...toDataAttributes({
        size,
        layout: layout === "default" ? undefined : layout,
        tone: tone === "neutral" ? undefined : tone,
      })}
    >
      <EmptyPageContext.Provider value={context}>{children}</EmptyPageContext.Provider>
    </div>,
  );
}
EmptyPageRoot.displayName = "EmptyPage.Root";

export type EmptyPageIconProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Tile fill: `neutral`, `accent` — an invitation to start, `danger` — a failure. Default: the
   * root's `tone`.
   */
  tone?: Extract<Tone, "neutral" | "accent" | "danger">;
  ref?: React.Ref<HTMLDivElement>;
};

function EmptyPageIcon({ tone: toneProp, className, ...rest }: EmptyPageIconProps) {
  const { tone: rootTone } = React.useContext(EmptyPageContext);
  return (
    // The tile is decorative: the title says what the state is.
    <div
      aria-hidden="true"
      className={cx(styles.iconWrap, className)}
      data-tone={toneProp ?? rootTone}
      {...rest}
    />
  );
}
EmptyPageIcon.displayName = "EmptyPage.Icon";

type EmptyPageTitleAs = "h2" | "h3" | "h4" | "p";

export type EmptyPageTitleProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Tag that fits the outline; the look does not change. `p` inside menus, lists and table cells,
   * where a heading would break the page outline.
   */
  as?: EmptyPageTitleAs;
  ref?: React.Ref<HTMLElement>;
};

function EmptyPageTitle({ as: Tag = "h2", className, ref, ...rest }: EmptyPageTitleProps) {
  return (
    <Tag ref={ref as TagRef<EmptyPageTitleAs>} className={cx(styles.title, className)} {...rest} />
  );
}
EmptyPageTitle.displayName = "EmptyPage.Title";

export type EmptyPageDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

function EmptyPageDescription({ className, ...rest }: EmptyPageDescriptionProps) {
  return <p className={cx(styles.description, className)} {...rest} />;
}
EmptyPageDescription.displayName = "EmptyPage.Description";

export type EmptyPageActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

function EmptyPageActions({ className, ...rest }: EmptyPageActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
EmptyPageActions.displayName = "EmptyPage.Actions";

export type EmptyPageRetryButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  /**
   * Loads the region again. May return a Promise: while it is pending the button shows its loading
   * state and cannot be pressed twice. Resolve — the owner swaps the region to its data; reject —
   * the error state stays and the button is ready again.
   */
  onRetry: () => void | Promise<void>;
  ref?: React.Ref<HTMLButtonElement>;
};

/** The kit's «Повторить» for an error state: an outline neutral Button with the refresh icon. */
function EmptyPageRetryButton({ onRetry, children, disabled, ...rest }: EmptyPageRetryButtonProps) {
  const { labels } = React.useContext(EmptyPageContext);
  // One retry at a time; on a rejection the owner keeps the error state and says why, and the
  // button is ready for another try.
  const retry = usePendingAction(onRetry);

  return (
    <Button.Root
      {...rest}
      variant="outline"
      tone="neutral"
      loading={retry.pending}
      disabled={disabled}
      onClick={() => retry.run?.()}
    >
      <Button.Icon>
        <Icon name="action.refresh" />
      </Button.Icon>
      {children ?? labels.retry}
    </Button.Root>
  );
}
EmptyPageRetryButton.displayName = "EmptyPage.RetryButton";

export const EmptyPage = {
  Root: EmptyPageRoot,
  Icon: EmptyPageIcon,
  Title: EmptyPageTitle,
  Description: EmptyPageDescription,
  Actions: EmptyPageActions,
  RetryButton: EmptyPageRetryButton,
};
