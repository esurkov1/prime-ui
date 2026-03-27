import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { EmptyPageSize } from "@/internal/states";

import styles from "./EmptyPage.module.css";

export type { EmptyPageSize };

export type EmptyPageLayout = "default" | "fill";

export type EmptyPageRootProps = {
  /** Высота контролов, кегль и отступы; по умолчанию `m`. */
  size?: EmptyPageSize;
  /**
   * `fill` — блок растягивается по высоте родителя и центрирует содержимое (пустое состояние внутри таблицы, скролла, карточки).
   * `default` — компактный блок по содержимому.
   */
  layout?: EmptyPageLayout;
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
        layout: layout === "fill" ? "fill" : undefined,
      })}
    >
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </div>
  );
});
EmptyPageRoot.displayName = "EmptyPage.Root";

export type EmptyPageIconProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function EmptyPageIcon({ className, children, ...rest }: EmptyPageIconProps) {
  return (
    <div className={cx(styles.iconWrap, className)} {...rest}>
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
