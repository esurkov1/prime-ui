import * as React from "react";
import { Button } from "@/components/button/Button";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { RefreshCw } from "@/icons/glyphs/refresh-cw";

import { ControlSizeProvider, useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { useEnterOnAppear } from "@/internal/partPresence";
import type { TagRef } from "@/internal/polymorphic";
import type { ControlSize, Tone } from "@/internal/states";
import { FRAME_DESCRIPTION, FRAME_TITLE } from "@/internal/surfaceFrame";
import textRole from "@/internal/textRole.module.css";
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

/*
 * The state stands on the frame scale of its tier (internal/surfaceFrame): the title and the
 * description take the frame roles, the tile and the actions the tier itself (32 · 40 · 48 · 56 ·
 * 64 tile); the `compact` state of a menu or a list is the quiet body-s / caption pair with the
 * smallest tile at any tier.
 */

type Ctx = {
  tone: EmptyPageTone;
  size: ControlSize;
  compact: boolean;
  labels: EmptyPageLabels;
};

const EmptyPageContext = React.createContext<Ctx>({
  tone: "neutral",
  size: "m",
  compact: false,
  labels: EMPTY_PAGE_LABELS,
});

export type EmptyPageRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: ControlSize;
  layout?: EmptyPageLayout;
  tone?: EmptyPageTone;
  labels?: Partial<EmptyPageLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Parts rise in when it appears on a shown page (a search or a filter that came to nothing), except
 * in `compact` (it appears on every keystroke); one that mounts with its page is just there.
 */
function EmptyPageRoot({
  size: sizeProp,
  layout = "default",
  tone = "neutral",
  labels,
  className,
  children,
  ref,
  ...rest
}: EmptyPageRootProps) {
  const { size, provide } = useHostTier(sizeProp);
  const mergedLabels = useLabels(EMPTY_PAGE_LABELS, labels);
  const appear = useEnterOnAppear<HTMLDivElement>(layout !== "compact");
  const mergedRef = useMergedRefs(appear.ref, ref);
  const context: Ctx = {
    tone,
    size,
    compact: layout === "compact",
    labels: mergedLabels,
  };
  return provide(
    <div
      className={cx(styles.root, appear.entering && enterMotion.enterBaseChildren, className)}
      role={tone === "danger" ? "alert" : undefined}
      {...rest}
      ref={mergedRef}
      {...toDataAttributes({
        size,
        layout: layout === "default" ? undefined : layout,
        tone: tone === "neutral" ? undefined : tone,
      })}
    >
      <EmptyPageContext.Provider value={context}>
        {/* The actions are as tall as the frame's controls (the tier itself). */}
        {layout === "compact" ? (
          children
        ) : (
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        )}
      </EmptyPageContext.Provider>
    </div>,
  );
}
EmptyPageRoot.displayName = "EmptyPage.Root";

export type EmptyPageIconProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: Extract<Tone, "neutral" | "accent" | "danger">;
  ref?: React.Ref<HTMLDivElement>;
};

/** The kit's icon tile on the tier scale (the `compact` state takes the smallest tile). */
function EmptyPageIcon({ tone: toneProp, className, ...rest }: EmptyPageIconProps) {
  const { tone: rootTone, size, compact } = React.useContext(EmptyPageContext);
  return (
    // The tile is decorative: the title says what the state is.
    <div
      aria-hidden="true"
      className={cx(iconBoxStyles.tile, iconSlotClass, styles.iconWrap, className)}
      data-tone={toneProp ?? rootTone}
      data-size={compact ? "xs" : size}
      {...rest}
    />
  );
}
EmptyPageIcon.displayName = "EmptyPage.Icon";

type EmptyPageTitleAs = "h2" | "h3" | "h4" | "p";

export type EmptyPageTitleProps = React.HTMLAttributes<HTMLElement> & {
  as?: EmptyPageTitleAs;
  ref?: React.Ref<HTMLElement>;
};

function EmptyPageTitle({ as: Tag = "h2", className, ref, ...rest }: EmptyPageTitleProps) {
  const { size, compact } = React.useContext(EmptyPageContext);
  return (
    <Tag
      ref={ref as TagRef<EmptyPageTitleAs>}
      className={cx(compact ? textRole.bodyS : FRAME_TITLE[size], styles.title, className)}
      {...rest}
    />
  );
}
EmptyPageTitle.displayName = "EmptyPage.Title";

export type EmptyPageDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

function EmptyPageDescription({ className, ...rest }: EmptyPageDescriptionProps) {
  const { size, compact } = React.useContext(EmptyPageContext);
  return (
    <p
      className={cx(
        compact ? textRole.caption : FRAME_DESCRIPTION[size],
        styles.description,
        className,
      )}
      {...rest}
    />
  );
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
  onRetry: () => void | Promise<void>;
  ref?: React.Ref<HTMLButtonElement>;
};

/** The kit's «Повторить» for an error state: a soft neutral Button with the refresh icon. */
function EmptyPageRetryButton({ onRetry, children, disabled, ...rest }: EmptyPageRetryButtonProps) {
  const { labels } = React.useContext(EmptyPageContext);
  // One retry at a time; on a rejection the owner keeps the error state and says why, and the
  // button is ready for another try.
  const retry = usePendingAction(onRetry);

  return (
    <Button.Root
      {...rest}
      variant="soft"
      tone="neutral"
      loading={retry.pending}
      disabled={disabled}
      onClick={() => retry.run?.()}
    >
      <Button.Icon>
        <RefreshCw />
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
