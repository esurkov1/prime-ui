import * as React from "react";
import { useInRouterContext, useLocation } from "react-router-dom";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";

import styles from "./AppShell.module.css";

export type AppShellRootProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Viewport-high shell: only `AppShell.Main` scrolls. Otherwise the document scrolls. */
  fillViewport?: boolean;
};

export type AppShellNavProps = React.HTMLAttributes<HTMLDivElement>;

/** Navigation column (usually `Sidebar.Root`); sits on the canvas. */
function AppShellNav({ className, ...rest }: AppShellNavProps) {
  return <div {...rest} className={cx(styles.nav, className)} />;
}
AppShellNav.displayName = "AppShell.Nav";

/**
 * Grid: navigation column | content panel. Everything that is not `AppShell.Nav` goes into the
 * content panel (`bg-surface`, inset from the window on wide screens).
 */
const AppShellRoot = React.forwardRef<HTMLDivElement, AppShellRootProps>(function AppShellRoot(
  { fillViewport = false, className, children, ...rest },
  ref,
) {
  const items = React.Children.toArray(children);
  const isNav = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppShellNav;
  const nav = items.filter(isNav);
  const panel = items.filter((child) => !isNav(child));

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(styles.root, className)}
      {...toDataAttributes({ "fill-viewport": fillViewport || undefined })}
    >
      {nav}
      <div className={styles.panel}>{panel}</div>
    </div>
  );
});
AppShellRoot.displayName = "AppShell.Root";

export type AppShellHeaderProps = React.HTMLAttributes<HTMLElement>;

/** Top bar of the content panel (breadcrumbs, page actions, mobile menu button). Sticky. */
const AppShellHeader = React.forwardRef<HTMLElement, AppShellHeaderProps>(function AppShellHeader(
  { className, ...rest },
  ref,
) {
  return <header {...rest} ref={ref} className={cx(styles.header, className)} />;
});
AppShellHeader.displayName = "AppShell.Header";

/** `full` (default): the whole panel with responsive gutters; `contained`: centered, up to `--prime-layout-content-max-width` (long-read pages). */
export type AppShellContentWidth = "contained" | "full";

export type AppShellMainProps = React.HTMLAttributes<HTMLElement> & {
  contentWidth?: AppShellContentWidth;
};

/** `<main>` with the canonical gutters; scrolls inside the panel when `fillViewport` is set. */
const AppShellMain = React.forwardRef<HTMLElement, AppShellMainProps>(function AppShellMain(
  { contentWidth = "full", className, children, ...rest },
  ref,
) {
  return (
    <ScrollContainer
      {...rest}
      as="main"
      ref={ref}
      axis="vertical"
      overscrollBehavior="contain"
      className={cx(styles.main, className)}
      data-content-width={contentWidth}
    >
      {children}
    </ScrollContainer>
  );
});
AppShellMain.displayName = "AppShell.Main";

function RouteScrollReset({ mainRef }: { mainRef: React.RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset main scroll on route change
  React.useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export type AppShellTemplateProps = Omit<AppShellRootProps, "children"> & {
  /** Navigation column content, usually `Sidebar.Root`. */
  nav?: React.ReactNode;
  /** `AppShell.Header` content; no header row when omitted. */
  header?: React.ReactNode;
  children?: React.ReactNode;
  mainProps?: Omit<AppShellMainProps, "children">;
};

/** Root + Nav + Header + Main in one; inside a router, main scrolls to top on route change. */
const AppShellTemplate = React.forwardRef<HTMLElement, AppShellTemplateProps>(
  function AppShellTemplate({ nav, header, children, mainProps, ...rootProps }, ref) {
    const mainRef = React.useRef<HTMLElement>(null);
    const setMainRef = React.useMemo(() => mergeRefs(mainRef, ref), [ref]);
    const inRouter = useInRouterContext();

    return (
      <AppShellRoot {...rootProps}>
        {nav == null ? null : <AppShellNav>{nav}</AppShellNav>}
        {header == null ? null : <AppShellHeader>{header}</AppShellHeader>}
        <AppShellMain {...mainProps} ref={setMainRef}>
          {children}
          {inRouter ? <RouteScrollReset mainRef={mainRef} /> : null}
        </AppShellMain>
      </AppShellRoot>
    );
  },
);
AppShellTemplate.displayName = "AppShell.Template";

export const AppShell = {
  Root: AppShellRoot,
  Nav: AppShellNav,
  Header: AppShellHeader,
  Main: AppShellMain,
  Template: AppShellTemplate,
};
