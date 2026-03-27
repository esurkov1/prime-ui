import * as React from "react";
import { useLayoutEffect } from "react";
import { useInRouterContext, useLocation } from "react-router-dom";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";

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
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const AppShellMain = React.forwardRef<HTMLElement, AppShellMainProps>(function AppShellMain(
  { className, children, ...rest },
  forwardedRef,
) {
  return (
    <ScrollContainer
      as="main"
      ref={forwardedRef}
      axis="vertical"
      overscrollBehavior="contain"
      className={cx(styles.layoutMain, className)}
      data-layout-region="main"
      {...rest}
    >
      {children}
    </ScrollContainer>
  );
});
AppShellMain.displayName = "AppShell.Main";

export type AppShellMainInsetProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AppShellMainInset = React.forwardRef<HTMLDivElement, AppShellMainInsetProps>(
  function AppShellMainInset({ className, children, ...rest }, forwardedRef) {
    return (
      <div
        ref={forwardedRef}
        className={cx(styles.layoutMainInset, className)}
        data-app-shell-main-inset=""
        {...rest}
      >
        {children}
      </div>
    );
  },
);
AppShellMainInset.displayName = "AppShell.MainInset";

function AppShellMainRouteScrollReset({
  mainRef,
}: {
  mainRef: React.RefObject<HTMLElement | null>;
}) {
  const { pathname } = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: сброс прокрутки main при смене маршрута
  useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
    const mainElementRef = React.useRef<HTMLElement>(null);
    const setMainRef = React.useMemo(() => mergeRefs(mainElementRef, forwardedRef), [forwardedRef]);
    const inRouter = useInRouterContext();

    return (
      <AppShellRoot
        fillViewport={fillViewport}
        className={className}
        {...rootRest}
        data-layout-template="app"
      >
        <AppShellNav {...navProps}>{nav}</AppShellNav>
        <AppShellMain ref={setMainRef} {...mainProps}>
          <AppShellMainInset>{children}</AppShellMainInset>
          {inRouter ? <AppShellMainRouteScrollReset mainRef={mainElementRef} /> : null}
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
  MainInset: AppShellMainInset,
  Template: AppShellTemplate,
};
