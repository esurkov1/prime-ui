import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./AppShell.module.css";

export type AppShellRootProps = {
  fillViewport?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AppShellRoot = React.forwardRef<HTMLDivElement, AppShellRootProps>(function AppShellRoot(
  { fillViewport = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(styles.layoutRoot, className)}
      {...rest}
      {...toDataAttributes({ "fill-viewport": fillViewport ? true : undefined })}
    >
      {children}
    </div>
  );
});
AppShellRoot.displayName = "AppShell.Root";

export type AppShellNavProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function AppShellNav({ className, children, ...rest }: AppShellNavProps) {
  return (
    <div className={cx(styles.layoutNav, className)} data-layout-region="nav" {...rest}>
      {children}
    </div>
  );
}
AppShellNav.displayName = "AppShell.Nav";

export type AppShellMainProps = {
  /** `plain` — только main; `surface` — карточка; `page` — поля страницы. */
  variant?: "plain" | "surface" | "page";
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const AppShellMain = React.forwardRef<HTMLElement, AppShellMainProps>(function AppShellMain(
  { variant = "plain", className, children, ...rest },
  forwardedRef,
) {
  return (
    <ScrollContainer
      as="main"
      ref={forwardedRef}
      axis="vertical"
      overscrollBehavior="contain"
      className={cx(
        styles.layoutMain,
        variant === "surface" && styles.layoutMainSurface,
        variant === "page" && styles.layoutMainPage,
        className,
      )}
      data-layout-region="main"
      {...rest}
    >
      {children}
    </ScrollContainer>
  );
});
AppShellMain.displayName = "AppShell.Main";

export type AppShellTemplateProps = {
  fillViewport?: boolean;
  className?: string;
  /** Навигация: `Sidebar.Root` или `nav`. */
  nav: React.ReactNode;
  children?: React.ReactNode;
  navProps?: Omit<AppShellNavProps, "children">;
  mainProps?: Omit<AppShellMainProps, "children">;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

const AppShellTemplate = React.forwardRef<HTMLElement, AppShellTemplateProps>(
  function AppShellTemplate(
    { fillViewport, className, nav, children, navProps, mainProps, ...rootRest },
    forwardedRef,
  ) {
    return (
      <AppShellRoot
        fillViewport={fillViewport}
        className={className}
        {...rootRest}
        data-layout-template="app"
      >
        <AppShellNav {...navProps}>{nav}</AppShellNav>
        <AppShellMain ref={forwardedRef} {...mainProps}>
          {children}
        </AppShellMain>
      </AppShellRoot>
    );
  },
);
AppShellTemplate.displayName = "AppShell.Template";

export const AppShell = {
  Root: AppShellRoot,
  Nav: AppShellNav,
  Main: AppShellMain,
  Template: AppShellTemplate,
};
