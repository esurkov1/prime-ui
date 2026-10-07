import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./EmptyPage.module.css";

type EmptyPageLayout = "default" | "fill" | "compact";

/** Parts rise in on first render, except in `compact` (it appears on every keystroke). */
const EmptyPageLayoutContext = React.createContext<EmptyPageLayout>("default");

function useEnterClass(): string | undefined {
  return React.useContext(EmptyPageLayoutContext) === "compact" ? undefined : enterMotion.enterBase;
}

export type EmptyPageRootProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Control height, type and spacing tier. Default `m`. */
  size?: ControlSize;
  /**
   * `default` — a block sized by its content.
   * `fill` — stretches to the parent's height and centers the content (inside a table, a scroll area, a card).
   * `compact` — a quiet state inside a menu, listbox or command list: panel padding, body-s title,
   * caption description, a small icon and no entrance motion.
   */
  layout?: EmptyPageLayout;
  ref?: React.Ref<HTMLDivElement>;
};

function EmptyPageRoot({
  size = "m",
  layout = "default",
  className,
  children,
  ...rest
}: EmptyPageRootProps) {
  return (
    <div
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({ size, layout: layout === "default" ? undefined : layout })}
    >
      <EmptyPageLayoutContext.Provider value={layout}>
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </EmptyPageLayoutContext.Provider>
    </div>
  );
}
EmptyPageRoot.displayName = "EmptyPage.Root";

export type EmptyPageIconProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tile fill: `neutral` (default), `accent` — an invitation to start, `danger` — a failure. */
  tone?: Extract<Tone, "neutral" | "accent" | "danger">;
};

function EmptyPageIcon({ tone = "neutral", className, ...rest }: EmptyPageIconProps) {
  return (
    <div className={cx(styles.iconWrap, useEnterClass(), className)} data-tone={tone} {...rest} />
  );
}
EmptyPageIcon.displayName = "EmptyPage.Icon";

export type EmptyPageTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

function EmptyPageTitle({ className, ...rest }: EmptyPageTitleProps) {
  return <h2 className={cx(styles.title, useEnterClass(), className)} {...rest} />;
}
EmptyPageTitle.displayName = "EmptyPage.Title";

export type EmptyPageDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

function EmptyPageDescription({ className, ...rest }: EmptyPageDescriptionProps) {
  return <p className={cx(styles.description, useEnterClass(), className)} {...rest} />;
}
EmptyPageDescription.displayName = "EmptyPage.Description";

export type EmptyPageActionsProps = React.HTMLAttributes<HTMLDivElement>;

function EmptyPageActions({ className, ...rest }: EmptyPageActionsProps) {
  return <div className={cx(styles.actions, useEnterClass(), className)} {...rest} />;
}
EmptyPageActions.displayName = "EmptyPage.Actions";

export const EmptyPage = {
  Root: EmptyPageRoot,
  Icon: EmptyPageIcon,
  Title: EmptyPageTitle,
  Description: EmptyPageDescription,
  Actions: EmptyPageActions,
};
