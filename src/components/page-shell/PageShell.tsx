import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./PageShell.module.css";

export type PageShellRootProps = {
  fillViewport?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const PageShellRoot = React.forwardRef<HTMLDivElement, PageShellRootProps>(function PageShellRoot(
  { fillViewport = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({ "fill-viewport": fillViewport ? true : undefined })}
    >
      {children}
    </div>
  );
});
PageShellRoot.displayName = "PageShell.Root";

export type PageShellNavAreaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Слот слева в ряду `PageShell.Root` (flex). Семантический `aside` задаёт сам `Sidebar.Root`
 * или ваш блок навигации — иначе получается вложенный `<aside>` в `<aside>`.
 */
function PageShellNavArea({ className, children, ...rest }: PageShellNavAreaProps) {
  return (
    <div className={cx(styles.navArea, className)} {...rest}>
      {children}
    </div>
  );
}
PageShellNavArea.displayName = "PageShell.NavArea";

export type PageShellContentAreaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const PageShellContentArea = React.forwardRef<HTMLElement, PageShellContentAreaProps>(
  function PageShellContentArea({ className, children, ...rest }, forwardedRef) {
    return (
      <ScrollContainer
        as="main"
        ref={forwardedRef}
        axis="vertical"
        overscrollBehavior="contain"
        className={cx(styles.contentArea, className)}
        {...rest}
      >
        {children}
      </ScrollContainer>
    );
  },
);
PageShellContentArea.displayName = "PageShell.ContentArea";

export type PageShellApplicationProps = {
  fillViewport?: boolean;
  className?: string;
  /** Навигация: обычно `Sidebar.Root` или кастомный блок. */
  nav: React.ReactNode;
  children?: React.ReactNode;
  navProps?: Omit<PageShellNavAreaProps, "children">;
  contentProps?: Omit<PageShellContentAreaProps, "children">;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

const PageShellApplication = React.forwardRef<HTMLElement, PageShellApplicationProps>(
  function PageShellApplication(
    { fillViewport, className, nav, children, navProps, contentProps, ...rootRest },
    forwardedRef,
  ) {
    return (
      <PageShellRoot fillViewport={fillViewport} className={className} {...rootRest}>
        <PageShellNavArea {...navProps}>{nav}</PageShellNavArea>
        <PageShellContentArea ref={forwardedRef} {...contentProps}>
          {children}
        </PageShellContentArea>
      </PageShellRoot>
    );
  },
);
PageShellApplication.displayName = "PageShell.Application";

export const PageShell = {
  Root: PageShellRoot,
  NavArea: PageShellNavArea,
  ContentArea: PageShellContentArea,
  Application: PageShellApplication,
};
