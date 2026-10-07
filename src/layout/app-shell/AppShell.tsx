import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";

import styles from "./AppShell.module.css";

export type AppShellRootProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  /** Viewport-high shell: only `AppShell.Main` scrolls. Otherwise the document scrolls. */
  fillViewport?: boolean;
};

export type AppShellNavProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Navigation column (usually `Sidebar.Root`); sits on the canvas. */
function AppShellNav({ className, ...rest }: AppShellNavProps) {
  return <div {...rest} className={cx(styles.nav, className)} />;
}
AppShellNav.displayName = "AppShell.Nav";

/**
 * Grid: navigation column | content panel. Everything that is not `AppShell.Nav` goes into the
 * content panel (`bg-surface`, inset from the window on wide screens).
 */
function AppShellRoot({ fillViewport = false, className, children, ...rest }: AppShellRootProps) {
  const items = React.Children.toArray(children);
  const isNav = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppShellNav;
  const nav = items.filter(isNav);
  const panel = items.filter((child) => !isNav(child));

  return (
    <div
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ "fill-viewport": fillViewport || undefined })}
    >
      {nav}
      <div className={styles.panel}>{panel}</div>
    </div>
  );
}
AppShellRoot.displayName = "AppShell.Root";

export type AppShellHeaderProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

/** Top bar of the content panel (breadcrumbs, page actions, mobile menu button). Sticky. */
function AppShellHeader({ className, ...rest }: AppShellHeaderProps) {
  return <header {...rest} className={cx(styles.header, className)} />;
}
AppShellHeader.displayName = "AppShell.Header";

/** `full` (default): the whole panel with responsive gutters; `contained`: centered, up to `--prime-layout-content-max-width` (long-read pages). */
export type AppShellContentWidth = "contained" | "full";

export type AppShellMainProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
  contentWidth?: AppShellContentWidth;
};

/** `<main>` with the canonical gutters; scrolls inside the panel when `fillViewport` is set. */
function AppShellMain({ contentWidth = "full", className, children, ...rest }: AppShellMainProps) {
  return (
    <ScrollContainer
      {...rest}
      as="main"
      axis="vertical"
      overscrollBehavior="contain"
      className={cx(styles.main, className)}
      data-content-width={contentWidth}
    >
      {children}
    </ScrollContainer>
  );
}
AppShellMain.displayName = "AppShell.Main";

export type AppShellTemplateProps = Omit<AppShellRootProps, "children" | "ref"> & {
  /** Forwarded to the `<main>`. */
  ref?: React.Ref<HTMLElement>;
  /** Navigation column content, usually `Sidebar.Root`. */
  nav?: React.ReactNode;
  /** `AppShell.Header` content; no header row when omitted. */
  header?: React.ReactNode;
  children?: React.ReactNode;
  mainProps?: Omit<AppShellMainProps, "children" | "ref">;
  /** Main scrolls back to the top whenever this value changes (pass the router pathname). */
  scrollResetKey?: unknown;
};

/** Root + Nav + Header + Main in one; main scrolls to the top when `scrollResetKey` changes. */
function AppShellTemplate({
  ref,
  nav,
  header,
  children,
  mainProps,
  scrollResetKey,
  ...rootProps
}: AppShellTemplateProps) {
  const mainRef = React.useRef<HTMLElement>(null);
  const setMainRef = React.useMemo(() => mergeRefs(mainRef, ref), [ref]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the key is the trigger, not an input
  React.useLayoutEffect(() => {
    const main = mainRef.current;
    if (main) main.scrollTop = 0;
  }, [scrollResetKey]);

  return (
    <AppShellRoot {...rootProps}>
      {nav == null ? null : <AppShellNav>{nav}</AppShellNav>}
      {header == null ? null : <AppShellHeader>{header}</AppShellHeader>}
      <AppShellMain {...mainProps} ref={setMainRef}>
        {children}
      </AppShellMain>
    </AppShellRoot>
  );
}
AppShellTemplate.displayName = "AppShell.Template";

export const AppShell = {
  Root: AppShellRoot,
  Nav: AppShellNav,
  Header: AppShellHeader,
  Main: AppShellMain,
  Template: AppShellTemplate,
};
