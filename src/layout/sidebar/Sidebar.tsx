import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";
import { rovingIndex } from "@/internal/rovingFocus";
import { Slot } from "@/internal/slot";
import type { ControlSize, PaletteColor, Variant } from "@/internal/states";

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
  /** Toggle label inside the off-canvas panel, and the scrim's label. */
  close: string;
};

const defaultLabels: SidebarLabels = {
  navigation: "Навигация",
  collapse: "Свернуть панель",
  expand: "Развернуть панель",
  close: "Закрыть навигацию",
};

/** Below this width an `offCanvas="auto"` sidebar leaves the layout and becomes an off-canvas panel. */
const MOBILE_QUERY = "(max-width: 767.98px)";

/** Hover intent before a compact flyout opens, and the grace period to travel into it. */
const FLYOUT_OPEN_DELAY_MS = 120;
const FLYOUT_CLOSE_DELAY_MS = 300;

/** One tier down: inline actions and counters inside an item row. */
const TIER_DOWN: Record<ControlSize, ControlSize> = { xs: "xs", s: "xs", m: "s", l: "m", xl: "l" };

type SidebarContextValue = {
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

export { useSidebar };

/** The desktop icon rail: labels are gone, items show tooltips, sub-lists open as flyouts. */
function useRail(): boolean {
  const { mode, offCanvas } = useSidebar();
  return mode === "compact" && !offCanvas;
}

/** Items rendered inside a compact flyout: no rail tooltips; navigating closes the flyout. */
const FlyoutContext = React.createContext<{ close: () => void } | null>(null);

function useMediaQuery(query: string, enabled: boolean): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!enabled || typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [enabled, query],
  );
  const getSnapshot = () =>
    enabled && typeof window !== "undefined" && !!window.matchMedia
      ? window.matchMedia(query).matches
      : false;
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

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

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SidebarRootProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Item tier: height, icon and text of `--prime-control-<size>-*`. */
  size?: ControlSize;
  mode?: SidebarMode;
  defaultMode?: SidebarMode;
  onModeChange?: (mode: SidebarMode) => void;
  /** The off-canvas panel (while the sidebar is off-canvas, see `offCanvas`). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When the rail becomes an off-canvas panel with a scrim and a focus trap, opened by `open`:
   * `auto` below 768px, `always` at any width (navigation behind a menu button), `never`.
   */
  offCanvas?: "auto" | "always" | "never";
  labels?: Partial<SidebarLabels>;
};

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarRootProps>(function SidebarRoot(
  {
    children,
    className,
    size = "m",
    mode: modeProp,
    defaultMode = "expanded",
    onModeChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    offCanvas: offCanvasProp = "auto",
    labels: labelsProp,
    ...rest
  },
  ref,
) {
  const labels = React.useMemo(() => ({ ...defaultLabels, ...labelsProp }), [labelsProp]);
  const narrow = useMediaQuery(MOBILE_QUERY, offCanvasProp === "auto");
  const offCanvas = offCanvasProp === "always" || narrow;

  const [mode, setMode] = useControllableState<SidebarMode>({
    value: modeProp,
    defaultValue: defaultMode,
    onChange: onModeChange,
  });
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

  // Disclosures that open on mount (the current page inside) appear in place, without motion.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /*
   * While hidden the panel keeps the width of the last visible mode, so it clips out (and back
   * in) as one piece instead of reflowing its items.
   */
  const lastVisibleRef = React.useRef<Exclude<SidebarMode, "hidden">>(
    mode === "hidden" ? "expanded" : mode,
  );
  if (mode !== "hidden") lastVisibleRef.current = mode;

  // The mode before the current one: coming back from hidden, the header toggle starts in place.
  const modeRef = React.useRef(mode);
  const previousModeRef = React.useRef(mode);
  if (modeRef.current !== mode) {
    previousModeRef.current = modeRef.current;
    modeRef.current = mode;
  }

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const panelRef = useOverlayModal<HTMLElement>(open, close);

  const toggle = React.useCallback(() => {
    if (offCanvas) {
      setOpen((prev) => !prev);
      return;
    }
    setMode((prev) => (prev === "expanded" ? "compact" : "expanded"));
  }, [offCanvas, setMode, setOpen]);

  const navId = React.useId();

  const context = React.useMemo<SidebarContextValue>(
    () => ({ mode, setMode, open, setOpen, toggle, offCanvas, size, navId, labels }),
    [mode, setMode, open, setOpen, toggle, offCanvas, size, navId, labels],
  );

  return (
    <SidebarProvider value={context}>
      <div
        {...rest}
        ref={ref}
        className={cx(styles.root, className)}
        {...toDataAttributes({
          size,
          mode,
          "panel-mode": mode === "hidden" ? lastVisibleRef.current : mode,
          "from-hidden": (mode !== "hidden" && previousModeRef.current === "hidden") || undefined,
          "off-canvas": offCanvas || undefined,
          state: offCanvas ? (open ? "open" : "closed") : undefined,
          ready: ready || undefined,
        })}
      >
        {offCanvas ? (
          <button
            type="button"
            className={styles.scrim}
            aria-label={labels.close}
            tabIndex={-1}
            onClick={close}
          />
        ) : null}
        <nav
          ref={panelRef as React.Ref<HTMLElement>}
          id={navId}
          className={styles.panel}
          aria-label={labels.navigation}
          inert={(offCanvas && !open) || (!offCanvas && mode === "hidden") || undefined}
        >
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </nav>
      </div>
    </SidebarProvider>
  );
});
SidebarRoot.displayName = "Sidebar.Root";

// ─── Regions ──────────────────────────────────────────────────────────────────

export type SidebarHeaderProps = React.ComponentPropsWithoutRef<"div">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <div {...rest} className={cx(styles.header, className)} />;
}
SidebarHeader.displayName = "Sidebar.Header";

export type SidebarContentProps = React.HTMLAttributes<HTMLElement>;

/**
 * Scrolling middle region: a ScrollContainer with edge fades and no scrollbar (a classic bar
 * would take width and move the icons; the rail scrolls by wheel, touch and focus).
 */
const SidebarContent = React.forwardRef<HTMLElement, SidebarContentProps>(function SidebarContent(
  { className, ...rest },
  ref,
) {
  return (
    <ScrollContainer
      {...rest}
      ref={ref}
      fade
      scrollbar="hidden"
      className={cx(styles.content, className)}
    />
  );
});
SidebarContent.displayName = "Sidebar.Content";

export type SidebarFooterProps = React.ComponentPropsWithoutRef<"div">;

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return <div {...rest} className={cx(styles.footer, className)} />;
}
SidebarFooter.displayName = "Sidebar.Footer";

// ─── Group ────────────────────────────────────────────────────────────────────

export type SidebarGroupProps = Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
  /** Group heading. In compact mode it folds away. */
  label?: React.ReactNode;
  /** The heading becomes a disclosure button that shows and hides the items. Needs `label`. */
  collapsible?: boolean;
  /** Items shown (controlled; `collapsible` only). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
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
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const active = useActivePath(bodyRef);
  useOpenOnActivePath(disclosure, active, open, setOpen);

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
          <div id={labelId} className={styles.groupLabel}>
            <span className={styles.groupText}>{label}</span>
          </div>
        )}
        {children}
      </div>
    );
  }

  // The rail has no headings: its items always show.
  const shown = open || rail;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a nav group of links, not a form fieldset
    <div
      {...rest}
      role="group"
      aria-labelledby={labelId}
      className={cx(styles.group, className)}
      data-collapsible="true"
    >
      <button
        id={labelId}
        type="button"
        className={cx(styles.groupLabel, styles.groupTrigger)}
        aria-expanded={open}
        aria-controls={bodyId}
        inert={rail || undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.groupText}>{label}</span>
        <Icon name="nav.chevronDown" className={styles.groupChevron} />
      </button>
      <div
        ref={bodyRef}
        id={bodyId}
        className={styles.disclosure}
        data-state={shown ? "open" : "closed"}
        inert={!shown || undefined}
      >
        <div className={styles.disclosureClip}>
          <div className={styles.groupItems}>{children}</div>
        </div>
      </div>
    </div>
  );
}
SidebarGroup.displayName = "Sidebar.Group";

// ─── Item parts ───────────────────────────────────────────────────────────────

export type SidebarItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
};

/**
 * An item icon. Before the label it leads and stays in place in every mode; after the label it is
 * a quiet trailing glyph (an external link) that hides in compact mode.
 */
function SidebarItemIcon({ className, ...rest }: SidebarItemIconProps) {
  return <span {...rest} className={cx(styles.icon, className)} aria-hidden="true" />;
}
SidebarItemIcon.displayName = "Sidebar.ItemIcon";

export type SidebarItemCountProps = {
  /** The number (or a short status). */
  children: React.ReactNode;
  /** Badge hue: the count needs attention. Without `color` and `variant` it is a plain number. */
  color?: PaletteColor;
  /** Badge treatment (default `soft` once `color` is set). */
  variant?: Exclude<Variant, "ghost">;
  className?: string;
};

/**
 * A count after the label: a plain muted number, or a `Badge` when it needs attention (`color`,
 * `variant`). In compact mode the number leaves the row (still read by screen readers) and a badge
 * leaves a dot of its hue on the icon.
 */
function SidebarItemCount({ children, color, variant, className }: SidebarItemCountProps) {
  if (color === undefined && variant === undefined) {
    return <span className={cx(styles.count, styles.countPlain, className)}>{children}</span>;
  }
  const hue = color ?? "gray";
  return (
    <>
      <Badge.Root color={hue} variant={variant ?? "soft"} className={cx(styles.count, className)}>
        {children}
      </Badge.Root>
      <ControlSizeProvider value="l">
        <Badge.Dot
          className={styles.dot}
          style={{ color: `var(--prime-color-palette-${hue}-solid)` }}
        />
      </ControlSizeProvider>
    </>
  );
}
SidebarItemCount.displayName = "Sidebar.ItemCount";

export type SidebarItemShortcutProps = {
  /** A key hint, e.g. `<Kbd>⌘K</Kbd>`. */
  children: React.ReactNode;
  className?: string;
};

/** Keyboard hint at the end of an item; hidden in compact mode. */
function SidebarItemShortcut({ children, className }: SidebarItemShortcutProps) {
  return (
    <span className={cx(styles.shortcut, className)} aria-hidden="true">
      {children}
    </span>
  );
}
SidebarItemShortcut.displayName = "Sidebar.ItemShortcut";

export type SidebarItemActionProps = {
  /** Accessible name and tooltip of the action («Создать задачу»). */
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** The glyph; a plus by default. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * A small action at the end of the row (create, add): a ghost icon Button one tier down, shown on
 * hover and focus of the row. It sits next to the item element, never inside it.
 */
function SidebarItemAction({
  label,
  onClick,
  disabled,
  children,
  className,
}: SidebarItemActionProps) {
  const { size } = useSidebar();
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size={TIER_DOWN[size]}
          className={cx(styles.action, className)}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          <Button.Icon>{children ?? <Icon name="action.add" />}</Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">{label}</Tooltip.Content>
    </Tooltip.Root>
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
    text: textOf(label).trim(),
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
  /** Current page: `aria-current="page"`. Links rendered by a router may set it themselves. */
  current?: boolean;
  disabled?: boolean;
  /** Render the single child element (e.g. a router link) as the item; its children are the content. */
  asChild?: boolean;
  /**
   * Label and parts: `Sidebar.ItemIcon` (leading, or trailing after the label),
   * `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`.
   */
  children?: React.ReactNode;
};

export type SidebarItemProps = SidebarItemOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof SidebarItemOwnProps> & {
    /** Renders an `<a>` instead of a `<button>`. */
    href?: string;
    target?: string;
    rel?: string;
  };

const SidebarItem = React.forwardRef<HTMLElement, SidebarItemProps>(function SidebarItem(
  {
    current = false,
    disabled = false,
    asChild = false,
    href,
    className,
    children,
    onClick,
    type,
    ...rest
  },
  ref,
) {
  const { offCanvas, setOpen } = useSidebar();
  const flyout = React.useContext(FlyoutContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    // Navigating closes the compact flyout and the off-canvas panel.
    flyout?.close();
    if (offCanvas && (href !== undefined || asChild)) setOpen(false);
  };

  const shared = {
    ...rest,
    className: cx(styles.item, className),
    onClick: handleClick,
    "aria-current": current ? ("page" as const) : rest["aria-current"],
    ...toDataAttributes({
      state: current ? "active" : undefined,
      disabled: disabled || undefined,
    }),
  };

  const child =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null;
  const parts = splitItemChildren(child ? child.props.children : children);

  let element: React.ReactElement;
  if (child) {
    element = (
      <Slot {...shared} ref={ref} aria-disabled={disabled || undefined}>
        {React.cloneElement(child, undefined, parts.content)}
      </Slot>
    );
  } else if (href !== undefined) {
    element = (
      <a
        {...(shared as React.ComponentPropsWithoutRef<"a">)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
      >
        {parts.content}
      </a>
    );
  } else {
    element = (
      <button
        {...shared}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        disabled={disabled}
      >
        {parts.content}
      </button>
    );
  }

  const tooltipText = parts.text || (rest["aria-label"] ?? "");
  return withAction(<CompactTooltip text={tooltipText}>{element}</CompactTooltip>, parts.action);
});
SidebarItem.displayName = "Sidebar.Item";

// ─── Sub-list ─────────────────────────────────────────────────────────────────

type SubContextValue = {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  regionRef: React.RefObject<HTMLDivElement | null>;
  /** A child is the current page. */
  active: boolean;
  /** Compact flyout. */
  flyoutOpen: boolean;
  openFlyout: (focusFirst: boolean) => void;
  hoverStart: () => void;
  hoverEnd: () => void;
  /** The pointer is over the trigger: the rail tooltip stays closed (the flyout names the item). */
  pointerInside: React.RefObject<boolean>;
};

const [SubProvider, useSubContext] = createComponentContext<SubContextValue>("Sidebar.Sub");

export type SidebarSubProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Children shown (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). A sub-list also opens by itself when a child becomes current. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Selector of the focusable rows inside a flyout. */
const FLYOUT_ITEMS = `.${styles.item}:not([data-disabled])`;

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
  const { size } = useSidebar();
  const rail = useRail();
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const regionRef = React.useRef<HTMLDivElement | null>(null);
  const flyoutRef = React.useRef<HTMLDivElement | null>(null);
  const active = useActivePath(regionRef);
  useOpenOnActivePath(true, active, open, setOpen);

  const [flyoutOpen, setFlyoutOpen] = React.useState(false);
  const focusFirstRef = React.useRef(false);
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
    if (!rail) setFlyoutOpen(false);
  }, [rail]);

  // The flyout reaches the DOM through a portal a pass later: focus moves in once it is attached.
  const attachFlyout = React.useCallback((node: HTMLDivElement | null) => {
    flyoutRef.current = node;
    if (!node || !focusFirstRef.current) return;
    focusFirstRef.current = false;
    node.querySelector<HTMLElement>(FLYOUT_ITEMS)?.focus({ preventScroll: true });
  }, []);

  const openFlyout = React.useCallback(
    (focusFirst: boolean) => {
      clearTimers();
      if (focusFirst) {
        if (flyoutOpen) {
          flyoutRef.current
            ?.querySelector<HTMLElement>(FLYOUT_ITEMS)
            ?.focus({ preventScroll: true });
        } else {
          focusFirstRef.current = true;
        }
      }
      setFlyoutOpen(true);
    },
    [clearTimers, flyoutOpen],
  );

  const closeFlyout = React.useCallback(
    (returnFocus: boolean) => {
      clearTimers();
      setFlyoutOpen(false);
      if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
    },
    [clearTimers],
  );

  const hoverStart = React.useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setFlyoutOpen(true), FLYOUT_OPEN_DELAY_MS);
  }, []);

  const hoverEnd = React.useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      // A keyboard user inside the flyout keeps it.
      if (flyoutRef.current?.contains(document.activeElement)) return;
      setFlyoutOpen(false);
    }, FLYOUT_CLOSE_DELAY_MS);
  }, []);

  const flyoutContext = React.useMemo(() => ({ close: () => closeFlyout(false) }), [closeFlyout]);

  const context = React.useMemo<SubContextValue>(
    () => ({
      open,
      setOpen,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      regionRef,
      active,
      flyoutOpen,
      openFlyout,
      hoverStart,
      hoverEnd,
      pointerInside,
    }),
    [open, setOpen, id, active, flyoutOpen, openFlyout, hoverStart, hoverEnd],
  );

  const nodes = React.Children.toArray(children);
  const trigger = nodes.find((node) =>
    isElementOf<SidebarSubTriggerProps>(node, SidebarSubTrigger),
  ) as React.ReactElement<SidebarSubTriggerProps> | undefined;
  const content = nodes.find((node) =>
    isElementOf<SidebarSubContentProps>(node, SidebarSubContent),
  ) as React.ReactElement<SidebarSubContentProps> | undefined;
  const title = trigger ? splitItemChildren(trigger.props.children).label : null;

  const onFlyoutKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      closeFlyout(true);
      return;
    }
    if (event.key === "Tab") {
      // The flyout lives in a portal: Tab continues from the parent item.
      if (event.shiftKey) event.preventDefault();
      closeFlyout(true);
      return;
    }
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FLYOUT_ITEMS));
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

  return (
    <SubProvider value={context}>
      <Popover.Root
        open={rail && flyoutOpen}
        onOpenChange={(next) => {
          if (!next) closeFlyout(false);
        }}
      >
        <div {...rest} className={cx(styles.sub, className)} data-state={open ? "open" : "closed"}>
          {children}
        </div>
        {rail && content ? (
          <Popover.Content
            ref={attachFlyout}
            side="right"
            align="start"
            size={size}
            flush
            className={styles.flyout}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") window.clearTimeout(closeTimer.current);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "touch") hoverEnd();
            }}
            onKeyDown={onFlyoutKeyDown}
          >
            <FlyoutContext.Provider value={flyoutContext}>
              <div className={styles.flyoutTitle} aria-hidden="true">
                {title}
              </div>
              <div className={styles.subList}>{subRows(content.props.children)}</div>
            </FlyoutContext.Provider>
          </Popover.Content>
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
  /** Label and parts, as in `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`. */
  children?: React.ReactNode;
};

/**
 * The parent row: a disclosure button with a chevron at the end. Expanded it shows / hides the
 * children; on the rail it opens the flyout (hover, click, `Enter` · `Space` · `→`).
 */
const SidebarSubTrigger = React.forwardRef<HTMLButtonElement, SidebarSubTriggerProps>(
  function SidebarSubTrigger(
    {
      className,
      children,
      disabled = false,
      onClick,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const sub = useSubContext();
    const rail = useRail();
    const parts = splitItemChildren(
      children,
      <Icon name="nav.chevronDown" className={styles.chevron} />,
    );
    const mergedRef = React.useMemo(
      () => mergeRefs<HTMLButtonElement>(ref, sub.triggerRef),
      [ref, sub.triggerRef],
    );

    const button = (
      <button
        {...rest}
        ref={mergedRef}
        id={sub.triggerId}
        type="button"
        disabled={disabled}
        className={cx(styles.item, className)}
        aria-expanded={rail ? sub.flyoutOpen : sub.open}
        aria-controls={rail ? undefined : sub.contentId}
        aria-haspopup={rail ? "dialog" : undefined}
        {...toDataAttributes({
          "active-path": sub.active || undefined,
          disabled: disabled || undefined,
        })}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (rail) sub.openFlyout(false);
          else sub.setOpen((prev) => !prev);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          const { key } = event;
          if (rail) {
            if (key === "Enter" || key === " " || key === "ArrowRight") {
              event.preventDefault();
              sub.openFlyout(true);
            }
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
          if (event.pointerType === "touch") return;
          sub.pointerInside.current = true;
          if (rail) sub.hoverStart();
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          sub.pointerInside.current = false;
          if (rail && event.pointerType !== "touch") sub.hoverEnd();
        }}
      >
        {parts.content}
      </button>
    );

    return (
      <CompactTooltip
        text={parts.text || (rest["aria-label"] ?? "")}
        canOpen={() => !sub.pointerInside.current && !sub.flyoutOpen}
      >
        <Popover.Anchor>{button}</Popover.Anchor>
      </CompactTooltip>
    );
  },
);
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

export type SidebarSubContentProps = Omit<React.ComponentPropsWithoutRef<"div">, "role">;

/** The children of a `Sidebar.Sub`: `Sidebar.Item`s on a faint guide line under the parent icon. */
function SidebarSubContent({ className, children, ...rest }: SidebarSubContentProps) {
  const sub = useSubContext();
  const rail = useRail();
  // On the rail the children live in the flyout; the inline copy stays folded and inert.
  const shown = sub.open && !rail;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a nav group of links, not a form fieldset
    <div
      {...rest}
      ref={sub.regionRef}
      id={sub.contentId}
      role="group"
      aria-labelledby={sub.triggerId}
      className={styles.disclosure}
      data-state={shown ? "open" : "closed"}
      inert={!shown || undefined}
    >
      <div className={styles.disclosureClip}>
        <div className={cx(styles.subList, className)}>{subRows(children)}</div>
      </div>
    </div>
  );
}
SidebarSubContent.displayName = "Sidebar.SubContent";

// ─── Brand ────────────────────────────────────────────────────────────────────

export type SidebarBrandLogoProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The product mark (`<img>`, `<svg>`); it fills a square on the icon axis. */
  children: React.ReactNode;
};

/** The product mark: stays on the icon axis in every mode. */
function SidebarBrandLogo({ className, ...rest }: SidebarBrandLogoProps) {
  return <span {...rest} className={cx(styles.brandLogo, className)} aria-hidden="true" />;
}
SidebarBrandLogo.displayName = "Sidebar.BrandLogo";

export type SidebarBrandProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Muted second line under the name (workspace, plan). */
  description?: React.ReactNode;
  /** Renders an `<a>` (usually home). */
  href?: string;
  /** Render the single child element (e.g. a router link) as the brand; its children are the content. */
  asChild?: boolean;
  /** `Sidebar.BrandLogo` and the product name. */
  children?: React.ReactNode;
};

/** Product block in `Sidebar.Header`: logo, name and a muted line; in compact only the logo stays. */
const SidebarBrand = React.forwardRef<HTMLElement, SidebarBrandProps>(function SidebarBrand(
  { description, href, asChild = false, className, children, onClick, ...rest },
  ref,
) {
  const { offCanvas, setOpen } = useSidebar();
  const child =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null;
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

  if (child) {
    return (
      <CompactTooltip text={textOf(name).trim()}>
        <Slot {...shared} ref={ref}>
          {React.cloneElement(child, undefined, content)}
        </Slot>
      </CompactTooltip>
    );
  }
  if (href !== undefined) {
    return (
      <CompactTooltip text={textOf(name).trim()}>
        <a
          {...(shared as React.ComponentPropsWithoutRef<"a">)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
        >
          {content}
        </a>
      </CompactTooltip>
    );
  }
  return (
    <div {...rest} ref={ref as React.Ref<HTMLDivElement>} className={shared.className}>
      {content}
    </div>
  );
});
SidebarBrand.displayName = "Sidebar.Brand";

// ─── Account ──────────────────────────────────────────────────────────────────

export type SidebarAccountProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  /** Muted second line under the name (email, role). */
  description?: React.ReactNode;
  /** An `Avatar.Root` (sized to the tier by the slot) and the person's name. */
  children?: React.ReactNode;
};

/**
 * The signed-in person at the bottom of the rail: avatar, name, a muted line and a chevron. A
 * button, so it can be a `Dropdown.Trigger` child; in compact mode only the avatar stays.
 */
const SidebarAccount = React.forwardRef<HTMLButtonElement, SidebarAccountProps>(
  function SidebarAccount({ description, className, children, type, ...rest }, ref) {
    const nodes = React.Children.toArray(children);
    const avatar = nodes.find((node) => isElementOf(node, Avatar.Root));
    const name = nodes.filter((node) => node !== avatar);

    return (
      <CompactTooltip text={textOf(name).trim()}>
        <button
          {...rest}
          ref={ref}
          type={type ?? "button"}
          className={cx(styles.account, className)}
        >
          {/* The slot sizes the avatar to the tier (`--avatar-slot-size`); the name says who it is. */}
          {avatar ? (
            <span className={styles.accountAvatar} aria-hidden="true">
              {avatar}
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
  },
);
SidebarAccount.displayName = "Sidebar.Account";

// ─── Toggle ───────────────────────────────────────────────────────────────────

export type SidebarToggleProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children" | "aria-label" | "aria-expanded" | "aria-controls"
> & {
  /**
   * `item` — a row in the rail. `header` — a small icon button at the end of `Sidebar.Header`
   * while expanded that moves onto the rail's outer edge as a round button in compact mode.
   */
  variant?: "item" | "header";
};

/**
 * Toggles expanded ↔ compact on desktop (hidden → expanded) and closes the panel off-canvas. Its
 * label comes from `labels`.
 */
const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarToggle({ variant = "item", className, onClick, ...rest }, ref) {
    const { mode, offCanvas, open, toggle, navId, labels } = useSidebar();
    const expanded = offCanvas ? open : mode === "expanded";
    const label = offCanvas ? labels.close : expanded ? labels.collapse : labels.expand;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) toggle();
    };

    if (variant === "header") {
      // One element for both places: it rides the rail edge and changes shape with transforms.
      const onEdge = !offCanvas && mode === "compact";
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root
              {...rest}
              ref={ref}
              variant={onEdge ? "soft" : "ghost"}
              tone="neutral"
              size="xs"
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
          className={cx(styles.item, className)}
          aria-expanded={expanded}
          aria-controls={navId}
          aria-label={label}
          onClick={handleClick}
        >
          <SidebarItemIcon>
            <Icon name={expanded ? "nav.sidebarCollapse" : "nav.sidebarExpand"} />
          </SidebarItemIcon>
          <span className={styles.label}>{label}</span>
        </button>
      </CompactTooltip>
    );
  },
);
SidebarToggle.displayName = "Sidebar.Toggle";

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
