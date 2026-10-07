import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./EmptyPage.module.css";

export type EmptyPageRootProps = {
  /** Высота контролов, кегль и отступы; по умолчанию `m`. */
  size?: ControlSize;
  /**
   * `default` — a block sized by its content.
   * `fill` — stretches to the parent's height and centers the content (inside a table, a scroll area, a card).
   * `compact` — a quiet state inside a menu, listbox or command list: panel padding, body-s title,
   * caption description, a small icon and no entrance motion (it appears on every keystroke).
   */
  layout?: "default" | "fill" | "compact";
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const EmptyPageRoot = React.forwardRef<HTMLDivElement, EmptyPageRootProps>(function EmptyPageRoot(
  { size = "m", layout = "default", className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({
        size,
        layout: layout === "default" ? undefined : layout,
      })}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </div>
  );
});
EmptyPageRoot.displayName = "EmptyPage.Root";

export type EmptyPageIconProps = {
  /** Подложка иконки: `neutral` (по умолчанию), `accent` — приглашение к действию, `danger` — ошибка. */
  tone?: Extract<Tone, "neutral" | "accent" | "danger">;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function EmptyPageIcon({ tone = "neutral", className, children, ...rest }: EmptyPageIconProps) {
  return (
    <div className={cx(styles.iconWrap, className)} data-tone={tone} {...rest}>
      {children}
    </div>
  );
}
EmptyPageIcon.displayName = "EmptyPage.Icon";

export type EmptyPageTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const EmptyPageTitle = React.forwardRef<HTMLHeadingElement, EmptyPageTitleProps>(
  function EmptyPageTitle({ className, children, ...rest }, forwardedRef) {
    return (
      <h2 ref={forwardedRef} className={cx(styles.title, className)} {...rest}>
        {children}
      </h2>
    );
  },
);
EmptyPageTitle.displayName = "EmptyPage.Title";

export type EmptyPageDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

const EmptyPageDescription = React.forwardRef<HTMLParagraphElement, EmptyPageDescriptionProps>(
  function EmptyPageDescription({ className, children, ...rest }, forwardedRef) {
    return (
      <p ref={forwardedRef} className={cx(styles.description, className)} {...rest}>
        {children}
      </p>
    );
  },
);
EmptyPageDescription.displayName = "EmptyPage.Description";

export type EmptyPageActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function EmptyPageActions({ className, children, ...rest }: EmptyPageActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
EmptyPageActions.displayName = "EmptyPage.Actions";

export const EmptyPage = {
  Root: EmptyPageRoot,
  Icon: EmptyPageIcon,
  Title: EmptyPageTitle,
  Description: EmptyPageDescription,
  Actions: EmptyPageActions,
};
