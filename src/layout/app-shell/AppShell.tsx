import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { useEnterOnAppear } from "@/internal/partPresence";
import { isPart } from "@/internal/parts";

import styles from "./AppShell.module.css";

// ─── Navigation ──────────────────────────────────────────────────────────────

/**
 * The navigation of the shell, as its Sidebar publishes it: what a menu button anywhere in the
 * shell needs (the menu button of `Page.TopBar`, `Sidebar.Toggle` outside the rail, a BottomNav
 * «Ещё»).
 */
export type AppShellNavState = {
  /** `id` of the navigation landmark, for `aria-controls`. */
  navId: string;
  /** The navigation is an off-canvas panel now (a phone, or `offCanvas="always"`). */
  offCanvas: boolean;
  /** The off-canvas panel is open. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** The navigation is in view: the off-canvas panel open, or the rail expanded. */
  expanded: boolean;
  /** Opens or closes the off-canvas panel; on screen, expands or folds the rail. */
  toggle: () => void;
};

type PublishNav = (nav: AppShellNavState | null) => void;

const PublishContext = React.createContext<PublishNav | null>(null);
PublishContext.displayName = "AppShellPublishContext";

const NavContext = React.createContext<AppShellNavState | null>(null);
NavContext.displayName = "AppShellNavContext";

const sameNav = (a: AppShellNavState | null, b: AppShellNavState | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    (Object.keys(a) as (keyof AppShellNavState)[]).every((key) => Object.is(a[key], b[key])));

/**
 * The navigation of the nearest `AppShell.Root`, as its Sidebar publishes it; `null` outside a
 * shell or before a Sidebar is in it. For a trigger of the navigation outside the rail.
 */
export function useAppShellNav(): AppShellNavState | null {
  return React.useContext(NavContext);
}

/** How the Sidebar publishes its navigation into the shell (`null` outside a shell). */
export function useAppShellNavPublisher(): PublishNav | null {
  return React.useContext(PublishContext);
}

/** Where the shell's floating actions stand: the corner of its bottom dock (`null` until mounted). */
type FabDock = { dock: HTMLElement | null };

const [FabDockProvider, useFabDock] = createComponentContext<FabDock>("AppShell");

/**
 * Starts a frame of its own inside a shell: a preview of a screen (`ExampleFrame`) is not the
 * page, so a Sidebar in it and the menu button of its top bar stay in the preview instead of
 * joining the shell around it.
 */
export function AppShellBoundary({ children }: { children?: React.ReactNode }) {
  return (
    <PublishContext.Provider value={null}>
      <NavContext.Provider value={null}>
        <FabDockProvider value={null}>{children}</FabDockProvider>
      </NavContext.Provider>
    </PublishContext.Provider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type AppShellRootProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  fillViewport?: boolean;
};

export type AppShellNavProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Navigation column (usually `Sidebar.Root`, a surface one layer above the page). */
function AppShellNav({ className, ...rest }: AppShellNavProps) {
  return <div {...rest} className={cx(styles.nav, className)} />;
}
AppShellNav.displayName = "AppShell.Nav";

/**
 * Grid: navigation column | content panel. Everything that is not `AppShell.Nav` goes into the
 * content panel — `AppShell.Main` with the page, and the phone footer — which is the page itself
 * (the layer around the shell): cards on it are the next layer. The panel ends in the dock, a
 * sticky bottom zone that holds the footer and, above it, the corner where `AppShell.Fab` stands
 * (wherever in the shell it is rendered). The root owns the navigation state the Sidebar
 * publishes.
 */
function AppShellRoot({ fillViewport = false, className, children, ...rest }: AppShellRootProps) {
  const [nav, setNav] = React.useState<AppShellNavState | null>(null);
  const publishNav = React.useCallback(
    (next: AppShellNavState | null) => setNav((prev) => (sameNav(prev, next) ? prev : next)),
    [],
  );

  const [dock, setDock] = React.useState<HTMLDivElement | null>(null);
  const fabDock = React.useMemo(() => ({ dock }), [dock]);

  const items = React.Children.toArray(children);
  const navColumn = items.filter((child) => isPart(child, AppShellNav));
  const footer = items.filter((child) => isPart(child, AppShellFooter));
  const panel = items.filter(
    (child) => !isPart(child, AppShellNav) && !isPart(child, AppShellFooter),
  );

  return (
    <PublishContext.Provider value={publishNav}>
      <NavContext.Provider value={nav}>
        <FabDockProvider value={fabDock}>
          <div
            {...rest}
            className={cx(styles.root, className)}
            {...toDataAttributes({
              "fill-viewport": fillViewport || undefined,
              nav: navColumn.length > 0 || undefined,
              "off-canvas": nav?.offCanvas || undefined,
            })}
          >
            {navColumn}
            <div className={styles.panel}>
              {panel}
              {/* After main: the floating actions come after the page in the focus order, before
                the phone navigation. */}
              <div className={styles.dock}>
                <div ref={setDock} className={styles.fabs} />
                {footer}
              </div>
            </div>
          </div>
        </FabDockProvider>
      </NavContext.Provider>
    </PublishContext.Provider>
  );
}
AppShellRoot.displayName = "AppShell.Root";

export type AppShellFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Bottom bar of the content panel (`BottomNav` on a narrow shell), in the sticky dock. */
function AppShellFooter({ className, ...rest }: AppShellFooterProps) {
  return <div {...rest} className={cx(styles.footer, className)} />;
}
AppShellFooter.displayName = "AppShell.Footer";

export type AppShellFabProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  children: React.ReactNode;
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The app's floating main action (an assistant, a quick create): a `Button shape="circle"` (`xl`,
 * solid neutral, the look of `BottomNav.Action`) that stands by itself in the bottom end corner of
 * the panel — above the footer bar or the floating BottomNav capsule, at the page gutter when no
 * bar is on screen, inside the safe area. It renders into the shell's dock from anywhere inside
 * `AppShell.Root` (a page may bring its own), so it sits over the page and its sticky parts and
 * under every overlay. Enters only when it appears on a shell already shown.
 */
function AppShellFab({ className, children, ...rest }: AppShellFabProps) {
  const { dock } = useFabDock("AppShell.Fab");
  const appear = useEnterOnAppear<HTMLDivElement>();
  if (!dock) return null;
  return createPortal(
    <div ref={appear.ref} className={cx(styles.fab, appear.entering && enterMotion.enter)}>
      <Button.Root
        {...rest}
        shape="circle"
        size="xl"
        variant="solid"
        tone="neutral"
        className={className}
      >
        <Button.Icon>{children}</Button.Icon>
      </Button.Root>
    </div>,
    dock,
  );
}
AppShellFab.displayName = "AppShell.Fab";

export type AppShellMainProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

/**
 * `<main>`, where the page renders: it hands the page the shell's gutters and top air
 * (`Page.Root` takes them) and keeps the bottom air; scrolls inside the panel when `fillViewport`
 * is set, so a sticky `Page.TopBar` sticks to its top.
 */
function AppShellMain({ className, children, ...rest }: AppShellMainProps) {
  return (
    <ScrollContainer
      {...rest}
      as="main"
      axis="vertical"
      edges="none"
      className={cx(styles.main, className)}
    >
      {children}
    </ScrollContainer>
  );
}
AppShellMain.displayName = "AppShell.Main";

export type AppShellTemplateProps = Omit<AppShellRootProps, "children" | "ref"> & {
  ref?: React.Ref<HTMLElement>;
  nav?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  mainProps?: Omit<AppShellMainProps, "children" | "ref">;
  scrollResetKey?: unknown;
};

/** Root + Nav + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes. */
function AppShellTemplate({
  ref,
  nav,
  footer,
  children,
  mainProps,
  scrollResetKey,
  ...rootProps
}: AppShellTemplateProps) {
  const mainRef = React.useRef<HTMLElement>(null);
  const setMainRef = useMergedRefs(mainRef, ref);

  // The key is the trigger, not an input: compare it with the last one.
  const resetKeyRef = React.useRef(scrollResetKey);
  React.useLayoutEffect(() => {
    if (Object.is(resetKeyRef.current, scrollResetKey)) return;
    resetKeyRef.current = scrollResetKey;
    const main = mainRef.current;
    if (main) main.scrollTop = 0;
  });

  return (
    <AppShellRoot {...rootProps}>
      {nav == null ? null : <AppShellNav>{nav}</AppShellNav>}
      <AppShellMain {...mainProps} ref={setMainRef}>
        {children}
      </AppShellMain>
      {footer == null ? null : <AppShellFooter>{footer}</AppShellFooter>}
    </AppShellRoot>
  );
}
AppShellTemplate.displayName = "AppShell.Template";

export const AppShell = {
  Root: AppShellRoot,
  Nav: AppShellNav,
  Main: AppShellMain,
  Footer: AppShellFooter,
  Fab: AppShellFab,
  Template: AppShellTemplate,
};
