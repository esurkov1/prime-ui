import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { type OutletStore, useOutletEntries, useOutletStore } from "@/internal/slot";

import styles from "./AppShell.module.css";

// ─── Navigation and header outlet ────────────────────────────────────────────

/**
 * The navigation of the shell, as its Sidebar publishes it: what a menu button anywhere in the
 * shell needs (`AppHeader.MenuButton`, `Sidebar.Toggle` outside the rail, a BottomNav «Ещё»).
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

type ShellRegistry = {
  /** The Sidebar publishes its navigation (`null` when it leaves). */
  publishNav: (nav: AppShellNavState | null) => void;
  /** The header outlet: a page's own `AppHeader.Root` moves here. */
  headers: OutletStore;
};

const RegistryContext = React.createContext<ShellRegistry | null>(null);
RegistryContext.displayName = "AppShellRegistryContext";

const NavContext = React.createContext<AppShellNavState | null>(null);
NavContext.displayName = "AppShellNavContext";

/** True inside the header outlet: the header there is already in place. */
const InHeaderOutletContext = React.createContext(false);

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
export function useAppShellNavPublisher(): ShellRegistry["publishNav"] | null {
  return React.useContext(RegistryContext)?.publishNav ?? null;
}

/**
 * The outlet a page's `AppHeader.Root` moves into: the shell's header row. `null` outside a
 * shell, and in the outlet itself (the header there is in place).
 */
export function useAppShellHeaderOutlet(): OutletStore | null {
  const registry = React.useContext(RegistryContext);
  const inOutlet = React.useContext(InHeaderOutletContext);
  return inOutlet ? null : (registry?.headers ?? null);
}

/**
 * Starts a frame of its own inside a shell: a preview of a screen (`ExampleFrame`) is not the
 * page, so a header or a Sidebar in it stays in the preview instead of joining the shell around it.
 */
export function AppShellBoundary({ children }: { children?: React.ReactNode }) {
  return (
    <RegistryContext.Provider value={null}>
      <NavContext.Provider value={null}>
        <InHeaderOutletContext.Provider value={false}>{children}</InHeaderOutletContext.Provider>
      </NavContext.Provider>
    </RegistryContext.Provider>
  );
}

/** The header row of the panel: the latest page header, else the shell's own (`Template.header`). */
function HeaderOutlet({ store }: { store: OutletStore }) {
  const current = useOutletEntries(store).at(-1);
  if (!current) return null;
  return (
    <InHeaderOutletContext.Provider value={true}>
      <React.Fragment key={current.id}>{current.node}</React.Fragment>
    </InHeaderOutletContext.Provider>
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
 * content panel, which is the page itself (the layer around the shell): cards on it are the next
 * layer. The root owns the navigation state the Sidebar publishes and the header row the page's
 * `AppHeader.Root` moves into.
 */
function AppShellRoot({ fillViewport = false, className, children, ...rest }: AppShellRootProps) {
  const [nav, setNav] = React.useState<AppShellNavState | null>(null);
  const publishNav = React.useCallback(
    (next: AppShellNavState | null) => setNav((prev) => (sameNav(prev, next) ? prev : next)),
    [],
  );
  const headers = useOutletStore();
  const registry = React.useMemo(() => ({ publishNav, headers }), [publishNav, headers]);

  const items = React.Children.toArray(children);
  const isNav = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppShellNav;
  const navColumn = items.filter(isNav);
  const panel = items.filter((child) => !isNav(child));

  return (
    <RegistryContext.Provider value={registry}>
      <NavContext.Provider value={nav}>
        <InHeaderOutletContext.Provider value={false}>
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
              <HeaderOutlet store={headers} />
              {panel}
            </div>
          </div>
        </InHeaderOutletContext.Provider>
      </NavContext.Provider>
    </RegistryContext.Provider>
  );
}
AppShellRoot.displayName = "AppShell.Root";

export type AppShellFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Bottom bar of the content panel (`BottomNav` on a narrow shell). Sticky. */
function AppShellFooter({ className, ...rest }: AppShellFooterProps) {
  return <div {...rest} className={cx(styles.footer, className)} />;
}
AppShellFooter.displayName = "AppShell.Footer";

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
      edges="none"
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
  ref?: React.Ref<HTMLElement>;
  nav?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  mainProps?: Omit<AppShellMainProps, "children" | "ref">;
  scrollResetKey?: unknown;
};

/**
 * Root + Nav + the header + Main + Footer in one; main scrolls to the top when `scrollResetKey`
 * changes. `header` is the default header row: a page that renders its own `AppHeader.Root`
 * replaces it while it is on screen.
 */
function AppShellTemplate({
  ref,
  nav,
  header,
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
      {header}
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
  Template: AppShellTemplate,
};
