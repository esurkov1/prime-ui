import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";

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

/** Below this width a `responsive` sidebar leaves the layout and becomes an off-canvas panel. */
const MOBILE_QUERY = "(max-width: 767.98px)";

type SidebarContextValue = {
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  /** Off-canvas panel state (narrow viewports only). */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** expanded ↔ compact on desktop (hidden → expanded); open ↔ closed off-canvas. */
  toggle: () => void;
  /** True while the sidebar is off-canvas (responsive and the viewport is narrower than 768px). */
  isMobile: boolean;
  size: ControlSize;
  navId: string;
  labels: SidebarLabels;
};

const [SidebarProvider, useSidebar] = createComponentContext<SidebarContextValue>("Sidebar");

export { useSidebar };

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

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SidebarRootProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Item tier: height, icon and text of `--prime-control-<size>-*`. */
  size?: ControlSize;
  mode?: SidebarMode;
  defaultMode?: SidebarMode;
  onModeChange?: (mode: SidebarMode) => void;
  /** Off-canvas panel on narrow viewports (responsive only). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Below 768px the rail becomes an off-canvas panel with a scrim and a focus trap. */
  responsive?: boolean;
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
    responsive = true,
    labels: labelsProp,
    ...rest
  },
  ref,
) {
  const labels = React.useMemo(() => ({ ...defaultLabels, ...labelsProp }), [labelsProp]);
  const isMobile = useMediaQuery(MOBILE_QUERY, responsive);

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
  const open = isMobile && openState;

  // Leaving the narrow viewport closes the off-canvas panel.
  React.useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile, setOpen]);

  /*
   * While hidden the panel keeps the width of the last visible mode, so it clips out (and back
   * in) as one piece instead of reflowing its items.
   */
  const lastVisibleRef = React.useRef<Exclude<SidebarMode, "hidden">>(
    mode === "hidden" ? "expanded" : mode,
  );
  if (mode !== "hidden") lastVisibleRef.current = mode;

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const panelRef = useOverlayModal<HTMLElement>(open, close);

  const toggle = React.useCallback(() => {
    if (isMobile) {
      setOpen((prev) => !prev);
      return;
    }
    setMode((prev) => (prev === "expanded" ? "compact" : "expanded"));
  }, [isMobile, setMode, setOpen]);

  const navId = React.useId();

  const context = React.useMemo<SidebarContextValue>(
    () => ({ mode, setMode, open, setOpen, toggle, isMobile, size, navId, labels }),
    [mode, setMode, open, setOpen, toggle, isMobile, size, navId, labels],
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
          mobile: isMobile || undefined,
          state: isMobile ? (open ? "open" : "closed") : undefined,
        })}
      >
        {isMobile ? (
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
          inert={(isMobile && !open) || (!isMobile && mode === "hidden") || undefined}
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

export type SidebarGroupProps = Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
  /** Group heading. In compact mode it fades out and leaves its spacing. */
  label?: React.ReactNode;
};

function SidebarGroup({ className, label, children, ...rest }: SidebarGroupProps) {
  const labelId = React.useId();
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
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
SidebarGroup.displayName = "Sidebar.Group";

// ─── Item parts ───────────────────────────────────────────────────────────────

export type SidebarItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
};

/** Leading icon of an item; stays in place in every mode. */
function SidebarItemIcon({ className, ...rest }: SidebarItemIconProps) {
  return <span {...rest} className={cx(styles.icon, className)} aria-hidden="true" />;
}
SidebarItemIcon.displayName = "Sidebar.ItemIcon";

export type SidebarItemCountProps = {
  /** The number (or a short status). */
  children: React.ReactNode;
  className?: string;
};

/**
 * Counter `Badge` after the label; in compact mode it gives way to a dot on the icon and stays
 * readable for screen readers.
 */
function SidebarItemCount({ children, className }: SidebarItemCountProps) {
  return (
    <>
      <Badge.Root className={cx(styles.count, className)}>{children}</Badge.Root>
      <ControlSizeProvider value="l">
        <Badge.Dot className={styles.dot} />
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

// ─── Item ─────────────────────────────────────────────────────────────────────

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

const PART_TYPES: React.ElementType[] = [SidebarItemIcon, SidebarItemCount, SidebarItemShortcut];

/** Parts go to their places; everything else is the label, which clips and fades in compact. */
function splitItemChildren(children: React.ReactNode) {
  const nodes = React.Children.toArray(children);
  const partOf = (type: React.ElementType) =>
    nodes.find((node) => React.isValidElement(node) && node.type === type);
  const label = nodes.filter(
    (node) => !(React.isValidElement(node) && PART_TYPES.includes(node.type as React.ElementType)),
  );
  return {
    label,
    content: (
      <>
        {partOf(SidebarItemIcon)}
        <span className={styles.label}>{label}</span>
        {partOf(SidebarItemCount)}
        {partOf(SidebarItemShortcut)}
      </>
    ),
  };
}

/**
 * Wraps an item in a tooltip that opens only in compact mode. The tooltip is always mounted so
 * switching modes never remounts the item (focus stays on it).
 */
function CompactTooltip({ text, children }: { text: string; children: React.ReactElement }) {
  const { mode, isMobile } = useSidebar();
  const enabled = mode === "compact" && !isMobile && text.length > 0;
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip.Root
      open={enabled && open}
      onOpenChange={(next) => setOpen(enabled && next)}
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

type SidebarItemOwnProps = {
  /** Current page: `aria-current="page"`. Links rendered by a router may set it themselves. */
  current?: boolean;
  disabled?: boolean;
  /** Render the single child element (e.g. a router link) as the item; its children are the content. */
  asChild?: boolean;
  /** Label and parts: `Sidebar.ItemIcon`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`. */
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
  const { isMobile, setOpen } = useSidebar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    // Navigating from the off-canvas panel closes it.
    if (!event.defaultPrevented && isMobile && (href !== undefined || asChild)) setOpen(false);
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
  const { label, content } = splitItemChildren(child ? child.props.children : children);

  let element: React.ReactElement;
  if (child) {
    element = (
      <Slot {...shared} ref={ref} aria-disabled={disabled || undefined}>
        {React.cloneElement(child, undefined, content)}
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
        {content}
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
        {content}
      </button>
    );
  }

  const tooltipText = textOf(label).trim() || (rest["aria-label"] ?? "");
  return <CompactTooltip text={tooltipText}>{element}</CompactTooltip>;
});
SidebarItem.displayName = "Sidebar.Item";

// ─── Toggle ───────────────────────────────────────────────────────────────────

export type SidebarToggleProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children" | "aria-label" | "aria-expanded" | "aria-controls"
>;

/**
 * Item-shaped toggle: expanded ↔ compact on desktop (hidden → expanded), closes the panel
 * off-canvas. Its label comes from `labels`.
 */
const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarToggle({ className, onClick, ...rest }, ref) {
    const { mode, isMobile, open, toggle, navId, labels } = useSidebar();
    const expanded = isMobile ? open : mode === "expanded";
    const label = isMobile ? labels.close : expanded ? labels.collapse : labels.expand;

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
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) toggle();
          }}
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
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Item: SidebarItem,
  ItemIcon: SidebarItemIcon,
  ItemCount: SidebarItemCount,
  ItemShortcut: SidebarItemShortcut,
  Toggle: SidebarToggle,
};
