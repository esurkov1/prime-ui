import * as React from "react";

import { Avatar, type AvatarRootProps } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { OFF_CANVAS_QUERY } from "@/hooks/breakpoints";
import { useControllableState } from "@/hooks/useControllableState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useModalLayer } from "@/hooks/useModalLayer";
import { usePresence } from "@/hooks/usePresence";
import { Icon, type IconName } from "@/icons";
import { AnchorRectProvider, type AnchorRectResolver } from "@/internal/AnchorRectContext";
import { ControlSizeProvider, useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { useDisclosure } from "@/internal/Disclosure";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconSlotClass } from "@/internal/iconBox";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import { nodeText } from "@/internal/nodeText";
import { LayerProvider } from "@/internal/overlay/layerStack";
import overlayMotion from "@/internal/overlayMotion.module.css";
import press from "@/internal/press.module.css";
import { RowAction } from "@/internal/RowAction";
import { rovingIndex } from "@/internal/rovingFocus";
import sheet from "@/internal/sheet.module.css";
import { Slot, slotChild } from "@/internal/slot";
import {
  type ControlSize,
  compactTier,
  type PaletteColor,
  tierMappings,
  type Variant,
} from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { touchTargetRowClass } from "@/internal/touchTarget";
import {
  type AppShellNavState,
  useAppShellNav,
  useAppShellNavPublisher,
} from "@/layout/app-shell/AppShell";

import styles from "./Sidebar.module.css";

/** Desktop rail mode: full width, icon rail, or collapsed to zero width. */
export type SidebarMode = "expanded" | "compact" | "hidden";

export type SidebarLabels = {
  /** `aria-label` of the `<nav>` landmark. */
  navigation: string;
  /** Toggle label while the rail is expanded. */
  collapse: string;
  /** Toggle label while the rail is compact or hidden. */
  expand: string;
  /** Toggle label while the off-canvas panel is open. */
  close: string;
};

export const SIDEBAR_LABELS: SidebarLabels = {
  navigation: "Навигация",
  collapse: "Свернуть панель",
  expand: "Развернуть панель",
  close: "Закрыть навигацию",
};

/** Hover intent before a compact flyout opens, and the grace period to travel into it. */
const FLYOUT_OPEN_DELAY_MS = 120;
const FLYOUT_CLOSE_DELAY_MS = 300;

/** Rows the rail clips to their icon box: their layers anchor to the visible part. */
const RAIL_ROWS = `.${styles.item}, .${styles.account}, .${styles.brand}, .${styles.groupLabel}`;

type SidebarContextValue = {
  /** Stored open state of groups and sub-lists (`persistKey`), or `null`. */
  persist: SidebarPersist | null;
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  /** Off-canvas panel state (only while `offCanvas`). */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** expanded ↔ compact on desktop (hidden → expanded); open ↔ closed off-canvas. */
  toggle: () => void;
  /** True while the sidebar is an off-canvas panel (`offCanvas="always"`, or `"auto"` below 768px). */
  offCanvas: boolean;
  size: ControlSize;
  navId: string;
  labels: SidebarLabels;
};

const [SidebarProvider, useSidebar] = createComponentContext<SidebarContextValue>("Sidebar");

/** True inside `Sidebar.Root`: a `Sidebar.Toggle` outside it works from the shell's navigation. */
const InSidebarContext = React.createContext(false);

// ─── Persisted state ──────────────────────────────────────────────────────────

type SidebarStored = { mode?: SidebarMode; open?: Record<string, boolean> };

type SidebarPersist = {
  read: (id: string) => boolean | undefined;
  write: (id: string, open: boolean) => void;
};

/** The stored state under `key`; storage may be missing, blocked or hold anything. */
function readStored(key: string): SidebarStored {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    return value !== null && typeof value === "object" ? (value as SidebarStored) : {};
  } catch {
    return {};
  }
}

function writeStored(key: string, update: (stored: SidebarStored) => SidebarStored) {
  try {
    window.localStorage.setItem(key, JSON.stringify(update(readStored(key))));
  } catch {
    // Storage full or blocked: the sidebar works, it just will not remember.
  }
}

/**
 * The modes a reload restores. Never `hidden`: the way back from it is a toggle outside the rail,
 * which a page may not have — a restored hidden rail would strand the person.
 */
const STORED_MODES: readonly SidebarMode[] = ["expanded", "compact"];

/**
 * An uncontrolled open state that `persistKey` remembers: the stored value wins over
 * `defaultOpen`, every change is written back. Controlled (`open` given), nothing is stored.
 */
function usePersistedOpen(
  id: string,
  openProp: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined,
) {
  const { persist } = useSidebar();
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: (id ? persist?.read(id) : undefined) ?? defaultOpen,
    onChange: onOpenChange,
  });
  React.useEffect(() => {
    if (persist && id && openProp === undefined) persist.write(id, open);
  }, [persist, id, openProp, open]);
  return [open, setOpen] as const;
}

export { useSidebar };

/** Inside a rail flyout the rows are full rows again: a sub-list there unfolds inline. */
const InFlyoutRailContext = React.createContext(false);

/** The desktop icon rail: labels are gone, items show tooltips, sub-lists open as flyouts. */
function useRail(): boolean {
  const { mode, offCanvas } = useSidebar();
  const inFlyout = React.useContext(InFlyoutRailContext);
  return mode === "compact" && !offCanvas && !inFlyout;
}

/** Items rendered inside a compact flyout: no rail tooltips; navigating closes the flyout. */
const FlyoutContext = React.createContext<{ close: () => void } | null>(null);

/**
 * True while the region holds the current page (`aria-current="page"`), whoever set it: the
 * `current` prop or a router link. Watches the attribute, so route changes are picked up.
 */
function useActivePath(ref: React.RefObject<HTMLElement | null>): boolean {
  const [active, setActive] = React.useState(false);
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const check = () => setActive(node.querySelector('[aria-current="page"]') !== null);
    check();
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(check);
    observer.observe(node, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-current"],
    });
    return () => observer.disconnect();
  }, [ref]);
  return active;
}

/** Opens a disclosure when the current page moves into it, so the location is never hidden. */
function useOpenOnActivePath(
  enabled: boolean,
  active: boolean,
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  const wasActive = React.useRef(false);
  React.useLayoutEffect(() => {
    if (enabled && active && !wasActive.current && !open) setOpen(true);
    wasActive.current = active;
  }, [enabled, active, open, setOpen]);
}

function isElementOf<P>(
  node: React.ReactNode,
  type: React.ElementType,
): node is React.ReactElement<P> {
  return React.isValidElement(node) && node.type === type;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SidebarRootProps = React.ComponentPropsWithoutRef<"div"> & {
  size?: ControlSize;
  mode?: SidebarMode;
  defaultMode?: SidebarMode;
  onModeChange?: (mode: SidebarMode) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  offCanvas?: "auto" | "always" | "never";
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  persistKey?: string;
  labels?: Partial<SidebarLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * True from the render in which the rail moves between docked and off-canvas (a viewport crossing
 * the breakpoint, not a person's choice) until a frame has been painted in the new place: the rail
 * lands at its width at once instead of growing from 0 (`data-placing` turns its motion off).
 */
function usePlacementSwitch(offCanvas: boolean): boolean {
  const [previous, setPrevious] = React.useState(offCanvas);
  const [placing, setPlacing] = React.useState(false);
  if (previous !== offCanvas) {
    setPrevious(offCanvas);
    setPlacing(true);
  }
  React.useEffect(() => {
    if (!placing) return;
    // Two frames: the first paints the new place without motion, the second turns motion back on.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPlacing(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [placing]);
  return placing;
}

function SidebarRoot({
  children,
  className,
  size: sizeProp,
  mode: modeProp,
  defaultMode = "expanded",
  onModeChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  offCanvas: offCanvasProp = "auto",
  closeOnOutsideClick = true,
  closeOnEscape = true,
  persistKey,
  labels: labelsProp,
  ref,
  ...rest
}: SidebarRootProps) {
  const persist = React.useMemo<SidebarPersist | null>(
    () =>
      persistKey
        ? {
            read: (id) => readStored(persistKey).open?.[id],
            write: (id, open) =>
              writeStored(persistKey, (stored) => ({
                ...stored,
                open: { ...stored.open, [id]: open },
              })),
          }
        : null,
    [persistKey],
  );
  const storedMode = persistKey ? readStored(persistKey).mode : undefined;
  const labels = useLabels(SIDEBAR_LABELS, labelsProp);
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const narrow = useMediaQuery(OFF_CANVAS_QUERY, offCanvasProp === "auto");
  const offCanvas = offCanvasProp === "always" || narrow;
  const placing = usePlacementSwitch(offCanvas);

  const [mode, setMode] = useControllableState<SidebarMode>({
    value: modeProp,
    defaultValue: storedMode && STORED_MODES.includes(storedMode) ? storedMode : defaultMode,
    onChange: onModeChange,
  });

  // While hidden the panel keeps the look of the last visible mode: it clips out (and back in) as one piece.
  const lastVisibleRef = React.useRef<Exclude<SidebarMode, "hidden">>(
    mode === "hidden" ? "expanded" : mode,
  );
  if (mode !== "hidden") lastVisibleRef.current = mode;

  // A hidden rail is stored as the mode it left: a reload brings the rail back.
  const lastVisible = lastVisibleRef.current;
  React.useEffect(() => {
    if (persistKey && modeProp === undefined) {
      writeStored(persistKey, (stored) => ({ ...stored, mode: lastVisible }));
    }
  }, [persistKey, modeProp, lastVisible]);
  const [openState, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const open = offCanvas && openState;

  // Leaving the narrow viewport closes the off-canvas panel.
  React.useEffect(() => {
    if (!offCanvas) setOpen(false);
  }, [offCanvas, setOpen]);

  // The mode before the current one: coming back from hidden, the header toggle starts in place.
  const modeRef = React.useRef(mode);
  const previousModeRef = React.useRef(mode);
  if (modeRef.current !== mode) {
    previousModeRef.current = modeRef.current;
    modeRef.current = mode;
  }

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const { ref: panelRef, layer } = useModalLayer<HTMLElement>({
    open,
    closeOnEscape,
    closeOnOutsideClick,
    onDismiss: close,
  });
  // The scrim of the off-canvas panel fades in and out with it (`overlayMotion`).
  const scrim = usePresence(open);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRootRef = useMergedRefs<HTMLDivElement>(ref, rootRef);

  /*
   * Rows keep their full width on the rail and are clipped to the icon box, so a row's border box
   * reaches far past the rail edge. Layers of a row (compact tooltips, the sub-list flyout, a
   * Dropdown around the account) anchor to the visible part instead: the row up to the rail edge
   * less the rail padding — the icon box on the rail, the whole row when expanded, the moving cut
   * mid-motion.
   */
  const anchorRect = React.useCallback<AnchorRectResolver>((anchor, rect) => {
    const root = rootRef.current;
    if (!root || !root.contains(anchor) || !anchor.matches(RAIL_ROWS)) return rect;
    const nav = root.querySelector(":scope > nav");
    const pad = nav ? Number.parseFloat(getComputedStyle(nav).paddingLeft) || 0 : 0;
    const edge = root.getBoundingClientRect().right - pad;
    if (rect.right <= edge) return rect;
    const right = Math.max(rect.left, edge);
    const { top, bottom, left, height } = rect;
    return { top, bottom, left, right, width: right - left, height };
  }, []);

  const toggle = React.useCallback(() => {
    if (offCanvas) {
      setOpen((prev) => !prev);
      return;
    }
    setMode((prev) => (prev === "expanded" ? "compact" : "expanded"));
  }, [offCanvas, setMode, setOpen]);

  const navId = React.useId();
  // The rail is a surface beside the page: one layer above it (white on the light gray page).
  const depth = useNestedSurfaceDepth();

  // The shell around (if any) relays the navigation to its triggers outside the rail: the
  // menu button of the page's top bar, a Toggle outside the rail, a BottomNav «Ещё».
  const publishNav = useAppShellNavPublisher();
  const expanded = offCanvas ? open : mode === "expanded";
  const shellNav = React.useMemo<AppShellNavState>(
    () => ({ navId, offCanvas, open, setOpen, expanded, toggle }),
    [navId, offCanvas, open, setOpen, expanded, toggle],
  );
  React.useLayoutEffect(() => {
    if (!publishNav) return;
    publishNav(shellNav);
    return () => publishNav(null);
  }, [publishNav, shellNav]);

  const context = React.useMemo<SidebarContextValue>(
    () => ({ persist, mode, setMode, open, setOpen, toggle, offCanvas, size, navId, labels }),
    [persist, mode, setMode, open, setOpen, toggle, offCanvas, size, navId, labels],
  );

  return (
    <SidebarProvider value={context}>
      <InSidebarContext.Provider value={true}>
        <div
          {...rest}
          ref={mergedRootRef}
          className={cx(fieldTierClass, styles.root, className)}
          data-depth={depth}
          {...toDataAttributes({
            size,
            mode,
            "panel-mode": mode === "hidden" ? lastVisibleRef.current : mode,
            "from-hidden": (mode !== "hidden" && previousModeRef.current === "hidden") || undefined,
            "off-canvas": offCanvas || undefined,
            placing: placing || undefined,
            state: offCanvas ? (open ? "open" : "closed") : undefined,
          })}
        >
          {/* A press on the scrim is a press outside the panel: the layer dismisses it
              (`closeOnOutsideClick`). */}
          {offCanvas && scrim.mounted ? (
            <div
              role="presentation"
              className={cx(sheet.scrim, overlayMotion.scrim)}
              data-state={scrim.state}
              onAnimationEnd={scrim.onExitEnd}
            />
          ) : null}
          <nav
            ref={panelRef}
            id={navId}
            className={styles.panel}
            aria-label={labels.navigation}
            inert={(offCanvas && !open) || (!offCanvas && mode === "hidden") || undefined}
          >
            <LayerProvider value={offCanvas ? layer : null}>
              <AnchorRectProvider value={offCanvas ? null : anchorRect}>
                <SurfaceDepthProvider value={depth}>{tier.provide(children)}</SurfaceDepthProvider>
              </AnchorRectProvider>
            </LayerProvider>
          </nav>
        </div>
      </InSidebarContext.Provider>
    </SidebarProvider>
  );
}
SidebarRoot.displayName = "Sidebar.Root";

// ─── Regions ──────────────────────────────────────────────────────────────────

export type SidebarHeaderProps = React.ComponentProps<"div">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <div {...rest} className={cx(styles.header, className)} />;
}
SidebarHeader.displayName = "Sidebar.Header";

export type SidebarContentProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

/**
 * Scrolling middle region: a ScrollContainer with edge fades and no scrollbar (a classic bar
 * would take width and move the icons; the rail scrolls by wheel, touch and focus).
 */
function SidebarContent({ className, ...rest }: SidebarContentProps) {
  return <ScrollContainer {...rest} scrollbar="hidden" className={cx(styles.content, className)} />;
}
SidebarContent.displayName = "Sidebar.Content";

export type SidebarFooterProps = React.ComponentProps<"div">;

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return <div {...rest} className={cx(styles.footer, className)} />;
}
SidebarFooter.displayName = "Sidebar.Footer";

// ─── Group ────────────────────────────────────────────────────────────────────

export type SidebarGroupProps = Omit<React.ComponentProps<"div">, "role"> & {
  label?: React.ReactNode;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function SidebarGroup({
  className,
  label,
  collapsible = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  children,
  ...rest
}: SidebarGroupProps) {
  const labelId = React.useId();
  const bodyId = React.useId();
  const rail = useRail();
  const disclosure = collapsible && label !== undefined;
  const [open, setOpen] = usePersistedOpen(
    disclosure ? `group:${rest.id ?? nodeText(label)}` : "",
    openProp,
    defaultOpen,
    onOpenChange,
  );
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const active = useActivePath(bodyRef);
  // Off the rail a folded group would hide the current page, so it opens; on the rail it stays as
  // folded as the person left it — its `…` row already marks the active path.
  useOpenOnActivePath(disclosure && !rail, active, open, setOpen);
  // A folded group on the rail is one row; its items open beside it in a flyout.
  const folded = disclosure && rail && !open;
  const hue = disclosure ? attentionHue(children) : null;
  const flyout = useRailFlyout(folded);
  // Folded or unfolded by its heading on the rail: the `…` row swaps with the items in place
  // instead of growing on the rail's clock. A rail at mount swaps from the first click on (the
  // swap must already be set before the state changes, or the first fold animates the old way);
  // leaving the rail ends it, so entering the rail grows the row with the rail.
  const [swap, setSwap] = React.useState(rail);
  if (swap && !rail) setSwap(false);
  // The kit fold for the items and for the rail row; both stand still on mount, so a group that
  // opens for the current page appears open.
  const bodyFold = useDisclosure({ open });
  const railFold = useDisclosure({ open: folded });

  if (!disclosure) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a nav group of links, not a form fieldset
      <div
        {...rest}
        role="group"
        aria-labelledby={label === undefined ? undefined : labelId}
        className={cx(styles.group, className)}
      >
        {label === undefined ? null : (
          // On the rail the heading shows its first letters; the tooltip gives the whole name.
          <CompactTooltip text={nodeText(label)}>
            <div id={labelId} className={cx(textRole.caption, styles.groupLabel)}>
              <span className={styles.groupText}>{label}</span>
            </div>
          </CompactTooltip>
        )}
        {children}
      </div>
    );
  }

  const text = nodeText(label);
  return (
    // biome-ignore lint/a11y/useSemanticElements: a nav group of links, not a form fieldset
    <div
      {...rest}
      role="group"
      aria-labelledby={labelId}
      className={cx(styles.group, className)}
      data-collapsible="true"
    >
      <CompactTooltip text={text}>
        <button
          id={labelId}
          type="button"
          className={cx(
            textRole.caption,
            styles.groupLabel,
            styles.groupTrigger,
            touchTargetRowClass,
          )}
          aria-expanded={open}
          aria-controls={bodyId}
          // The chevron turns on the fold's clock once it moves (still on mount).
          data-mounted={bodyFold.root["data-mounted"]}
          // On the rail too it folds and unfolds the group (folded, the `…` row takes its place);
          // hovering it shows the whole name, which the rail cuts.
          onClick={() => {
            setSwap(rail);
            setOpen((prev) => !prev);
          }}
        >
          <span className={styles.groupText}>{label}</span>
          <AttentionDot hue={hue} shown={!open && !rail} inline />
          <Icon name="nav.chevronDown" className={styles.groupChevron} />
        </button>
      </CompactTooltip>
      {/* One place for the items and the rail row of a folded group: both sit in the same cell,
          so folding on the rail glides the height from the list to one row while the items fade
          into the `…` row. Off the rail the row stays folded and inert. */}
      <div
        className={styles.groupBody}
        {...toDataAttributes({ swap: (swap && rail) || undefined })}
      >
        <div
          className={cx(railFold.root.className, styles.groupRail)}
          data-state={railFold.root["data-state"]}
          data-mounted={railFold.root["data-mounted"]}
          inert={!folded || undefined}
          aria-hidden={!folded || undefined}
        >
          <div className={railFold.clip.className}>
            <div className={styles.groupItems}>
              <Popover.Root
                open={flyout.open}
                onOpenChange={(next) => {
                  if (!next) flyout.close(false);
                }}
              >
                <CompactTooltip
                  text={text}
                  canOpen={() => !flyout.pointerInside.current && !flyout.open}
                >
                  <Popover.Anchor>
                    <button
                      ref={flyout.triggerRef}
                      type="button"
                      className={styles.item}
                      aria-label={text}
                      aria-expanded={flyout.open}
                      aria-haspopup="dialog"
                      {...toDataAttributes({ "active-path": active || undefined })}
                      {...flyout.triggerHandlers}
                    >
                      <span className={cx(styles.icon, iconSlotClass)} aria-hidden="true">
                        <Icon name="action.more" />
                      </span>
                      <AttentionDot hue={hue} shown={folded} />
                    </button>
                  </Popover.Anchor>
                </CompactTooltip>
                {folded ? (
                  <RailFlyout flyout={flyout}>
                    <div className={styles.groupItems}>{children}</div>
                  </RailFlyout>
                ) : null}
              </Popover.Root>
            </div>
          </div>
        </div>
        <div
          ref={bodyRef}
          id={bodyId}
          className={bodyFold.root.className}
          data-state={bodyFold.root["data-state"]}
          data-mounted={bodyFold.root["data-mounted"]}
          inert={!open || undefined}
        >
          <div className={bodyFold.clip.className}>
            <div className={styles.groupItems}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
SidebarGroup.displayName = "Sidebar.Group";

// ─── Item parts ───────────────────────────────────────────────────────────────

export type SidebarItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * An item icon. Before the label it leads and stays in place in every mode; after the label it is
 * a quiet trailing glyph (an external link) that hides in compact mode.
 */
function SidebarItemIcon({ className, ...rest }: SidebarItemIconProps) {
  return (
    <span {...rest} className={cx(styles.icon, iconSlotClass, className)} aria-hidden="true" />
  );
}
SidebarItemIcon.displayName = "Sidebar.ItemIcon";

export type SidebarItemCountProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  children: React.ReactNode;
  color?: PaletteColor;
  variant?: Exclude<Variant, "ghost">;
  /** The number `<span>` (the Badge when it has a hue). */
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A count after the label: a plain muted number, or a `Badge` when it needs attention (`color`,
 * `variant`). In compact mode the number leaves the row (still read by screen readers) and a badge
 * leaves a dot of its hue on the icon.
 */
function SidebarItemCount({ children, color, variant, className, ...rest }: SidebarItemCountProps) {
  if (color === undefined && variant === undefined) {
    return (
      <span {...rest} className={cx(styles.count, styles.countPlain, className)}>
        {children}
      </span>
    );
  }
  const hue = color ?? "gray";
  return (
    <>
      <Badge.Root
        {...rest}
        color={hue}
        variant={variant ?? "soft"}
        className={cx(styles.count, className)}
      >
        {children}
      </Badge.Root>
      <ControlSizeProvider value="l">
        <Badge.Dot color={hue} className={styles.dot} />
      </ControlSizeProvider>
    </>
  );
}
SidebarItemCount.displayName = "Sidebar.ItemCount";

/**
 * The hue of the first count that needs attention (`Sidebar.ItemCount` with `color` or `variant`)
 * anywhere in a subtree, or `null`: a folded parent shows it as a dot.
 */
function attentionHue(node: React.ReactNode): PaletteColor | null {
  for (const child of React.Children.toArray(node)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) continue;
    if (isElementOf<SidebarItemCountProps>(child, SidebarItemCount)) {
      const { color, variant } = child.props;
      if (color !== undefined || variant !== undefined) return color ?? "gray";
      continue;
    }
    const inner = attentionHue(child.props.children);
    if (inner) return inner;
  }
  return null;
}

/**
 * The dot of a folded parent (a sub-list's row, a folded group): something inside needs
 * attention. It fades and scales in and out with the fold. `inline` sits after a heading's text;
 * otherwise it marks the row's icon like a count's rail dot.
 */
function AttentionDot({
  hue,
  shown,
  inline = false,
}: {
  hue: PaletteColor | null;
  shown: boolean;
  inline?: boolean;
}) {
  if (!hue) return null;
  return (
    <ControlSizeProvider value="l">
      <Badge.Dot
        color={hue}
        className={cx(styles.dot, inline && styles.dotInline)}
        data-attention={shown ? "shown" : "hidden"}
      />
    </ControlSizeProvider>
  );
}

export type SidebarItemShortcutProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Keyboard hint at the end of an item; hidden in compact mode. */
function SidebarItemShortcut({ children, className, ...rest }: SidebarItemShortcutProps) {
  return (
    <span {...rest} className={cx(styles.shortcut, className)} aria-hidden="true">
      {children}
    </span>
  );
}
SidebarItemShortcut.displayName = "Sidebar.ItemShortcut";

type SidebarItemActionBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "aria-label"
> & {
  label: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

/** A button that runs `onClick`, or with `asChild` the one link it renders as (a page, `mailto:`). */
export type SidebarItemActionProps = SidebarItemActionBaseProps &
  (
    | {
        asChild?: false;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        children?: React.ReactNode;
      }
    | { asChild: true; onClick?: never; children: React.ReactElement }
  );

/**
 * A small action at the end of the row (create, add): the kit row action (`internal/RowAction`, a
 * ghost icon Button one tier down), shown on hover and focus of the row. It sits next to the item
 * element, never inside it. With `asChild` it is a link with the same look.
 */
function SidebarItemAction({ label, children, className, ...rest }: SidebarItemActionProps) {
  const { size } = useSidebar();
  return (
    <RowAction
      {...rest}
      label={label}
      size={size}
      side="right"
      className={cx(styles.action, className)}
    >
      {children ?? <Icon name="action.add" />}
    </RowAction>
  );
}
SidebarItemAction.displayName = "Sidebar.ItemAction";
type ItemParts = {
  /** Plain text of the label (tooltip, flyout title). */
  text: string;
  label: React.ReactNode[];
  content: React.ReactNode;
  action: React.ReactElement | null;
};

/**
 * Parts go to their places: a leading icon, the label (clips and fades in compact), then the trail
 * (count, key hint, trailing icons) and `end`. An action leaves the element for the row.
 */
function splitItemChildren(children: React.ReactNode, end?: React.ReactNode): ItemParts {
  let leading: React.ReactNode = null;
  let count: React.ReactNode = null;
  let shortcut: React.ReactNode = null;
  let action: React.ReactElement | null = null;
  const label: React.ReactNode[] = [];
  const endIcons: React.ReactNode[] = [];
  for (const node of React.Children.toArray(children)) {
    if (isElementOf<Record<string, unknown>>(node, SidebarItemIcon)) {
      if (leading === null && label.length === 0) leading = node;
      else endIcons.push(React.cloneElement(node, { "data-edge": "end" }));
    } else if (isElementOf(node, SidebarItemCount)) count = node;
    else if (isElementOf(node, SidebarItemShortcut)) shortcut = node;
    else if (isElementOf(node, SidebarItemAction)) action = node as React.ReactElement;
    else label.push(node);
  }
  const trail = count !== null || shortcut !== null || endIcons.length > 0;
  return {
    text: nodeText(label).trim(),
    label,
    action,
    content: (
      <>
        {leading}
        <span className={styles.label}>{label}</span>
        {trail ? (
          <span className={styles.trail}>
            {count}
            {shortcut}
            {endIcons}
          </span>
        ) : null}
        {end}
      </>
    ),
  };
}

/**
 * Wraps an item in a tooltip that opens only on the rail. The tooltip is always mounted so
 * switching modes never remounts the item (focus stays on it). `canOpen` vetoes an opening.
 */
function CompactTooltip({
  text,
  canOpen,
  children,
}: {
  text: string;
  canOpen?: () => boolean;
  children: React.ReactElement;
}) {
  const rail = useRail();
  const inFlyout = React.useContext(FlyoutContext) !== null;
  const enabled = rail && !inFlyout && text.length > 0;
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip.Root
      open={enabled && open}
      onOpenChange={(next) => setOpen(enabled && next && (canOpen?.() ?? true))}
      delayDuration={0}
    >
      {/* Slot keeps the item's own `data-state="active"`: the trigger would overwrite it. */}
      <Tooltip.Trigger>
        <Slot>{children}</Slot>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">{text}</Tooltip.Content>
    </Tooltip.Root>
  );
}

/** A row that carries an action next to the item element (never nested inside it). */
function withAction(element: React.ReactElement, action: React.ReactElement | null) {
  if (!action) return element;
  return (
    <div className={styles.row}>
      {element}
      {action}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

type SidebarItemOwnProps = {
  current?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
};

export type SidebarItemProps = SidebarItemOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof SidebarItemOwnProps> & {
    href?: string;
    target?: string;
    rel?: string;
    ref?: React.Ref<HTMLElement>;
  };

/**
 * A row of the navigation: a link (`href`), a button, or the consumer's element (`asChild`, a
 * router link) — the kit's interactive element with its disabled guard. Activating it closes the
 * compact flyout and the off-canvas panel, unless `onClick` prevents the default.
 */
function SidebarItem({
  current = false,
  disabled = false,
  asChild = false,
  href,
  target,
  rel,
  className,
  children,
  onClick,
  ...rest
}: SidebarItemProps) {
  const { offCanvas, setOpen } = useSidebar();
  const flyout = React.useContext(FlyoutContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    flyout?.close();
    if (offCanvas) setOpen(false);
  };

  const shared = {
    ...rest,
    disabled,
    className: cx(styles.item, touchTargetRowClass, press.press, className),
    onClick: handleClick,
    "aria-current": current ? ("page" as const) : rest["aria-current"],
    ...toDataAttributes({
      state: current ? "active" : undefined,
      disabled: disabled || undefined,
    }),
  };

  const child = asChild ? slotChild(children, "Sidebar.Item") : null;
  const parts = splitItemChildren(child ? child.props.children : children);

  let element: React.ReactElement;
  if (child) {
    element = (
      <InteractiveElement {...shared} element="slot">
        {React.cloneElement(child, undefined, parts.content)}
      </InteractiveElement>
    );
  } else if (href !== undefined) {
    element = (
      <InteractiveElement {...shared} element="link" href={href} target={target} rel={rel}>
        {parts.content}
      </InteractiveElement>
    );
  } else {
    element = (
      <InteractiveElement {...shared} element="button">
        {parts.content}
      </InteractiveElement>
    );
  }

  const tooltipText = parts.text || (rest["aria-label"] ?? "");
  return withAction(<CompactTooltip text={tooltipText}>{element}</CompactTooltip>, parts.action);
}
SidebarItem.displayName = "Sidebar.Item";

// ─── Sub-list ─────────────────────────────────────────────────────────────────

type SubContextValue = {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  triggerId: string;
  contentId: string;
  regionRef: React.RefObject<HTMLDivElement | null>;
  /** A child is the current page. */
  active: boolean;
  /** The compact flyout. */
  flyout: RailFlyoutState;
  /** Hue of a child count that needs attention, for the parent's dot while folded. */
  hue: PaletteColor | null;
  /** The fold moves (one frame after mount): the parent's chevron turns with it. */
  moving: boolean;
};

const [SubProvider, useSubContext] = createComponentContext<SubContextValue>("Sidebar.Sub");

export type SidebarSubProps = React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Selector of the focusable rows inside a flyout (rows of a folded inline sub-list are inert). */
const FLYOUT_ITEMS = `.${styles.item}:not([data-disabled])`;

const flyoutItems = (flyout: HTMLElement) =>
  Array.from(flyout.querySelectorAll<HTMLElement>(FLYOUT_ITEMS)).filter(
    (item) => item.closest("[inert]") === null,
  );

/**
 * A flyout beside a rail row (a sub-list's parent, a folded group): it opens on hover after an
 * intent delay, on click and on `Enter` · `Space` · `→` (focusing its first row), and closes
 * after a grace period when the pointer leaves, on `←` / `Tab` (focus back on the row), on
 * `Escape` and when the rail goes away.
 */
function useRailFlyout(rail: boolean) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const flyoutRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const focusFirstRef = React.useRef(false);
  /** The pointer is over the row: the rail tooltip stays closed (the flyout names the row). */
  const pointerInside = React.useRef(false);
  const openTimer = React.useRef<number | undefined>(undefined);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const clearTimers = React.useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);
  React.useEffect(() => clearTimers, [clearTimers]);

  // Leaving the rail closes the flyout.
  React.useEffect(() => {
    if (!rail) setOpen(false);
  }, [rail]);

  // The flyout reaches the DOM through a portal a pass later: focus moves in once it is attached.
  const attach = React.useCallback((node: HTMLDivElement | null) => {
    flyoutRef.current = node;
    if (!node || !focusFirstRef.current) return;
    focusFirstRef.current = false;
    flyoutItems(node)[0]?.focus({ preventScroll: true });
  }, []);

  const show = React.useCallback(
    (focusFirst: boolean) => {
      clearTimers();
      if (focusFirst) {
        if (open && flyoutRef.current) {
          flyoutItems(flyoutRef.current)[0]?.focus({ preventScroll: true });
        } else {
          focusFirstRef.current = true;
        }
      }
      setOpen(true);
    },
    [clearTimers, open],
  );

  const close = React.useCallback(
    (returnFocus: boolean) => {
      clearTimers();
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
    },
    [clearTimers],
  );

  const hoverStart = React.useCallback(() => {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), FLYOUT_OPEN_DELAY_MS);
  }, [clearTimers]);

  const hoverEnd = React.useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => {
      // A keyboard user inside the flyout keeps it.
      if (flyoutRef.current?.contains(document.activeElement)) return;
      setOpen(false);
    }, FLYOUT_CLOSE_DELAY_MS);
  }, [clearTimers]);

  const keepOpen = React.useCallback(() => window.clearTimeout(closeTimer.current), []);

  const onFlyoutKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === "Tab") {
      // The flyout lives in a portal: Tab continues from the row.
      if (event.shiftKey) event.preventDefault();
      close(true);
      return;
    }
    const items = flyoutItems(event.currentTarget);
    const next = rovingIndex(
      event.key,
      items.indexOf(document.activeElement as HTMLElement),
      items.length,
      "vertical",
    );
    if (next === null) return;
    event.preventDefault();
    items[next]?.focus();
  };

  /** Props of the rail row: hover intent, click and keys that open the flyout. */
  const triggerHandlers = {
    onClick: () => show(false),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
        event.preventDefault();
        show(true);
      }
    },
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      pointerInside.current = true;
      hoverStart();
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      pointerInside.current = false;
      if (event.pointerType !== "touch") hoverEnd();
    },
  };

  const flyoutContext = React.useMemo(() => ({ close: () => close(false) }), [close]);

  return {
    open: rail && open,
    triggerRef,
    pointerInside,
    show,
    close,
    attach,
    keepOpen,
    hoverEnd,
    onFlyoutKeyDown,
    triggerHandlers,
    flyoutContext,
  };
}

type RailFlyoutState = ReturnType<typeof useRailFlyout>;

/** The flyout surface: just the rows (full rows, not the rail); the rail row names it. */
function RailFlyout({ flyout, children }: { flyout: RailFlyoutState; children: React.ReactNode }) {
  const { size } = useSidebar();
  return (
    <Popover.Content
      ref={flyout.attach}
      side="right"
      size={size}
      flush
      className={cx(fieldTierClass, styles.flyout)}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") flyout.keepOpen();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") flyout.hoverEnd();
      }}
      onKeyDown={flyout.onFlyoutKeyDown}
    >
      <InFlyoutRailContext.Provider value={true}>
        <FlyoutContext.Provider value={flyout.flyoutContext}>{children}</FlyoutContext.Provider>
      </InFlyoutRailContext.Provider>
    </Popover.Content>
  );
}

/**
 * A parent item with child items: `Sidebar.SubTrigger` + `Sidebar.SubContent`. Expanded, the
 * children unfold under the parent on a guide line; on the compact rail they open in a flyout.
 */
function SidebarSub({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: SidebarSubProps) {
  const rail = useRail();
  const trigger = React.Children.toArray(children).find((node) =>
    isElementOf<SidebarSubTriggerProps>(node, SidebarSubTrigger),
  );
  const [open, setOpen] = usePersistedOpen(
    `sub:${rest.id ?? (trigger ? splitItemChildren(trigger.props.children).text : "")}`,
    openProp,
    defaultOpen,
    onOpenChange,
  );
  const id = React.useId();
  const regionRef = React.useRef<HTMLDivElement | null>(null);
  const active = useActivePath(regionRef);
  useOpenOnActivePath(true, active, open, setOpen);
  const flyout = useRailFlyout(rail);

  const content = React.Children.toArray(children).find((node) =>
    isElementOf<SidebarSubContentProps>(node, SidebarSubContent),
  ) as React.ReactElement<SidebarSubContentProps> | undefined;
  const hue = content ? attentionHue(content.props.children) : null;
  // The fold of the inline children moves once mounted: the parent's chevron turns on its clock.
  const moving = useDisclosure({ open }).root["data-mounted"] !== undefined;

  const context = React.useMemo<SubContextValue>(
    () => ({
      open,
      setOpen,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      regionRef,
      active,
      flyout,
      hue,
      moving,
    }),
    [open, setOpen, id, active, flyout, hue, moving],
  );

  return (
    <SubProvider value={context}>
      <Popover.Root
        open={flyout.open}
        onOpenChange={(next) => {
          if (!next) flyout.close(false);
        }}
      >
        <div {...rest} className={className} data-state={open ? "open" : "closed"}>
          {children}
        </div>
        {rail && content ? (
          <RailFlyout flyout={flyout}>
            <div className={styles.groupItems}>{content.props.children}</div>
          </RailFlyout>
        ) : null}
      </Popover.Root>
    </SubProvider>
  );
}
SidebarSub.displayName = "Sidebar.Sub";

export type SidebarSubTriggerProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "aria-expanded" | "aria-controls"
> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The parent row: a disclosure button with a chevron at the end. Expanded it shows / hides the
 * children; on the rail it opens the flyout (hover, click, `Enter` · `Space` · `→`).
 */
function SidebarSubTrigger({
  className,
  children,
  disabled = false,
  onClick,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...rest
}: SidebarSubTriggerProps) {
  const sub = useSubContext();
  const rail = useRail();
  const parts = splitItemChildren(
    children,
    <Icon name="nav.chevronDown" className={styles.chevron} />,
  );
  const { flyout } = sub;
  const mergedRef = useMergedRefs<HTMLButtonElement>(ref, flyout.triggerRef);

  const button = (
    <button
      {...rest}
      ref={mergedRef}
      id={sub.triggerId}
      type="button"
      disabled={disabled}
      className={cx(styles.item, touchTargetRowClass, press.press, className)}
      aria-expanded={rail ? flyout.open : sub.open}
      aria-controls={rail ? undefined : sub.contentId}
      aria-haspopup={rail ? "dialog" : undefined}
      {...toDataAttributes({
        "active-path": sub.active || undefined,
        disabled: disabled || undefined,
        mounted: sub.moving || undefined,
      })}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (rail) flyout.triggerHandlers.onClick();
        else sub.setOpen((prev) => !prev);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const { key } = event;
        if (rail) {
          flyout.triggerHandlers.onKeyDown(event);
          return;
        }
        if (key === "ArrowRight" && !sub.open) {
          event.preventDefault();
          sub.setOpen(true);
        } else if (key === "ArrowLeft" && sub.open) {
          event.preventDefault();
          sub.setOpen(false);
        }
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (rail) flyout.triggerHandlers.onPointerEnter(event);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        flyout.triggerHandlers.onPointerLeave(event);
      }}
    >
      {parts.content}
      {/* Folded — inline, or always on the rail where the children live in the flyout. */}
      <AttentionDot hue={sub.hue} shown={rail || !sub.open} />
    </button>
  );

  return (
    <CompactTooltip
      text={parts.text || (rest["aria-label"] ?? "")}
      canOpen={() => !flyout.pointerInside.current && !flyout.open}
    >
      <Popover.Anchor>{button}</Popover.Anchor>
    </CompactTooltip>
  );
}
SidebarSubTrigger.displayName = "Sidebar.SubTrigger";

/** Child rows on the guide line: each row draws its own branch of the line. */
function subRows(children: React.ReactNode) {
  return React.Children.toArray(children).map((child, index) => (
    <div
      key={React.isValidElement(child) && child.key != null ? child.key : index}
      className={styles.subRow}
    >
      {child}
    </div>
  ));
}

export type SidebarSubContentProps = Omit<React.ComponentProps<"div">, "role">;

/** The children of a `Sidebar.Sub`: `Sidebar.Item`s on a faint guide line under the parent icon. */
function SidebarSubContent({ className, children, ref, ...rest }: SidebarSubContentProps) {
  const sub = useSubContext();
  const { regionRef } = sub;
  const mergedRef = useMergedRefs(regionRef, ref);
  const rail = useRail();
  // On the rail the children live in the flyout; the inline copy stays folded and inert.
  const shown = sub.open && !rail;
  const fold = useDisclosure({ open: shown });
  return (
    // biome-ignore lint/a11y/useSemanticElements: a nav group of links, not a form fieldset
    <div
      {...rest}
      ref={mergedRef}
      id={sub.contentId}
      role="group"
      aria-labelledby={sub.triggerId}
      className={fold.root.className}
      data-state={fold.root["data-state"]}
      data-mounted={fold.root["data-mounted"]}
      inert={!shown || undefined}
    >
      <div className={fold.clip.className}>
        <div className={cx(styles.subList, className)}>{subRows(children)}</div>
      </div>
    </div>
  );
}
SidebarSubContent.displayName = "Sidebar.SubContent";

// ─── Brand ────────────────────────────────────────────────────────────────────

export type SidebarBrandLogoProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The product mark: stays on the icon axis in every mode. */
function SidebarBrandLogo({ className, ...rest }: SidebarBrandLogoProps) {
  return <span {...rest} className={cx(styles.brandLogo, className)} aria-hidden="true" />;
}
SidebarBrandLogo.displayName = "Sidebar.BrandLogo";

export type SidebarBrandProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  description?: React.ReactNode;
  href?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/**
 * Product block in `Sidebar.Header`: logo, name and a muted line; in compact only the logo stays.
 * A link with `href`, the consumer's element with `asChild`, a button with only `onClick` (one way
 * to reach it from the keyboard), else a static block. Activating it closes the off-canvas panel.
 */
function SidebarBrand({
  description,
  href,
  asChild = false,
  className,
  children,
  onClick,
  ...rest
}: SidebarBrandProps) {
  const { offCanvas, setOpen } = useSidebar();
  const child = asChild ? slotChild(children, "Sidebar.Brand") : null;
  const nodes = React.Children.toArray(child ? child.props.children : children);
  const logo = nodes.find((node) => isElementOf(node, SidebarBrandLogo));
  const name = nodes.filter((node) => !isElementOf(node, SidebarBrandLogo));
  const content = (
    <>
      {logo}
      <span className={styles.brandText}>
        <span className={styles.brandName}>{name}</span>
        {description == null ? null : (
          <span className={styles.brandDescription}>{description}</span>
        )}
      </span>
    </>
  );
  const shared = {
    ...rest,
    className: cx(styles.brand, className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented && offCanvas) setOpen(false);
    },
  };

  // No rail tooltip: the logo speaks for itself and a tooltip would cover the edge toggle. The name
  // stays in the link (faded, not removed), so it keeps its accessible name in every mode.
  if (child) {
    return (
      <InteractiveElement {...shared} element="slot">
        {React.cloneElement(child, undefined, content)}
      </InteractiveElement>
    );
  }
  if (href !== undefined) {
    return (
      <InteractiveElement {...shared} element="link" href={href}>
        {content}
      </InteractiveElement>
    );
  }
  if (onClick !== undefined) {
    return (
      <InteractiveElement {...shared} element="button">
        {content}
      </InteractiveElement>
    );
  }
  return (
    <InteractiveElement {...rest} className={shared.className} element="static">
      {content}
    </InteractiveElement>
  );
}
SidebarBrand.displayName = "Sidebar.Brand";

// ─── Account ──────────────────────────────────────────────────────────────────

export type SidebarAccountProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  description?: React.ReactNode;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The signed-in person at the bottom of the rail: avatar, name, a muted line and a chevron. A
 * button, so it can be a `Dropdown.Trigger` child; in compact mode only the avatar stays.
 */
function SidebarAccount({ description, className, children, type, ...rest }: SidebarAccountProps) {
  const { size } = useSidebar();
  const nodes = React.Children.toArray(children);
  const avatar = nodes.find((node) => isElementOf<AvatarRootProps>(node, Avatar.Root));
  const name = nodes.filter((node) => node !== avatar);

  return (
    <CompactTooltip text={nodeText(name).trim()}>
      <button
        {...rest}
        type={type ?? "button"}
        className={cx(styles.account, touchTargetRowClass, press.press, className)}
      >
        {/* The avatar takes the rail's tier (`tierMappings.railAvatar`); the name says who it is. */}
        {avatar ? (
          <span className={styles.accountAvatar} aria-hidden="true">
            {React.cloneElement(avatar, { size: tierMappings.railAvatar[size] })}
          </span>
        ) : null}
        <span className={styles.accountText}>
          <span className={styles.accountName}>{name}</span>
          {description == null ? null : (
            <span className={styles.accountDescription}>{description}</span>
          )}
        </span>
        <Icon name="nav.chevronsUpDown" className={styles.accountChevron} />
      </button>
    </CompactTooltip>
  );
}
SidebarAccount.displayName = "Sidebar.Account";

// ─── Toggle ───────────────────────────────────────────────────────────────────

export type SidebarToggleProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children" | "aria-label" | "aria-expanded" | "aria-controls"
> & {
  variant?: "item" | "header";
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Toggles expanded ↔ compact on desktop (hidden → expanded) and opens / closes the panel
 * off-canvas. Inside the rail it reads the Sidebar; anywhere else in an `AppShell` (a header, a
 * page toolbar) it reads the navigation the shell relays — the way back to a hidden rail. Its
 * label comes from the Sidebar `labels`.
 */
function SidebarToggle(props: SidebarToggleProps) {
  const inSidebar = React.useContext(InSidebarContext);
  return inSidebar ? <RailToggle {...props} /> : <ShellToggle {...props} />;
}
SidebarToggle.displayName = "Sidebar.Toggle";

/** The glyph of an item toggle: the panel folds while it is in view, unfolds otherwise. */
const toggleGlyph = (expanded: boolean): IconName =>
  expanded ? "nav.sidebarCollapse" : "nav.sidebarExpand";

/** The toggle in the rail: the Sidebar's own state, the rail's tooltip and edge motion. */
function RailToggle({ variant = "item", className, onClick, ref, ...rest }: SidebarToggleProps) {
  const { mode, offCanvas, open, toggle, navId, labels, size } = useSidebar();
  const expanded = offCanvas ? open : mode === "expanded";
  const label = offCanvas ? labels.close : expanded ? labels.collapse : labels.expand;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) toggle();
  };

  if (variant === "header") {
    // One disk for both places: it rides the rail edge and changes only by transforms.
    const onEdge = !offCanvas && mode === "compact";
    return (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root
            {...rest}
            ref={ref}
            variant={onEdge ? "soft" : "ghost"}
            tone="neutral"
            size={compactTier(size)}
            shape="circle"
            className={cx(styles.headerToggle, className)}
            aria-expanded={expanded}
            aria-controls={navId}
            aria-label={label}
            onClick={handleClick}
          >
            <Button.Icon>
              <Icon name="nav.chevronsLeft" className={styles.headerToggleIcon} />
            </Button.Icon>
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">{label}</Tooltip.Content>
      </Tooltip.Root>
    );
  }

  return (
    <CompactTooltip text={label}>
      <button
        {...rest}
        ref={ref}
        type="button"
        className={cx(styles.item, touchTargetRowClass, press.press, className)}
        aria-expanded={expanded}
        aria-controls={navId}
        aria-label={label}
        onClick={handleClick}
      >
        <SidebarItemIcon>
          <GlyphSwap>
            <Icon name={toggleGlyph(expanded)} />
          </GlyphSwap>
        </SidebarItemIcon>
        <span className={styles.label}>{label}</span>
      </button>
    </CompactTooltip>
  );
}

/**
 * The toggle outside the rail: a soft icon Button that works from the shell's navigation; nothing
 * outside a shell with a Sidebar.
 */
function ShellToggle({ variant: _variant, onClick, ref, ...rest }: SidebarToggleProps) {
  const nav = useAppShellNav();
  if (!nav) return null;
  const label = nav.expanded
    ? nav.offCanvas
      ? SIDEBAR_LABELS.close
      : SIDEBAR_LABELS.collapse
    : SIDEBAR_LABELS.expand;
  return (
    <Button.Root
      {...rest}
      ref={ref}
      variant="soft"
      tone="neutral"
      aria-expanded={nav.expanded}
      aria-controls={nav.navId}
      aria-label={label}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) nav.toggle();
      }}
    >
      {/* The Button glyph cross-fades by itself. */}
      <Button.Icon>
        <Icon name={toggleGlyph(nav.expanded)} />
      </Button.Icon>
    </Button.Root>
  );
}

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Brand: SidebarBrand,
  BrandLogo: SidebarBrandLogo,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Item: SidebarItem,
  ItemIcon: SidebarItemIcon,
  ItemCount: SidebarItemCount,
  ItemShortcut: SidebarItemShortcut,
  ItemAction: SidebarItemAction,
  Sub: SidebarSub,
  SubTrigger: SidebarSubTrigger,
  SubContent: SidebarSubContent,
  Account: SidebarAccount,
  Toggle: SidebarToggle,
};
