import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";

import { Tooltip } from "@/components/tooltip/Tooltip";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
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

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  children?: React.ReactNode;
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
          {children}
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

export type SidebarContentProps = React.ComponentPropsWithoutRef<"div">;

/** Scrolling middle region. */
const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  function SidebarContent({ className, ...rest }, ref) {
    return <div {...rest} ref={ref} className={cx(styles.content, className)} />;
  },
);
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

// ─── Item ─────────────────────────────────────────────────────────────────────

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

type ItemInnerProps = {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  shortcut?: React.ReactNode;
  children?: React.ReactNode;
};

function ItemInner({ icon, badge, shortcut, children }: ItemInnerProps) {
  return (
    <>
      {icon === undefined ? null : (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {badge === undefined || badge === null ? null : <span className={styles.badge}>{badge}</span>}
      {shortcut === undefined ? null : (
        <span className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </span>
      )}
    </>
  );
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
  /** Leading icon; stays in place in every mode. */
  icon?: React.ReactNode;
  /** Counter or status; in compact mode it becomes a dot on the icon. */
  badge?: React.ReactNode;
  /** Keyboard hint (e.g. `<Kbd>`); hidden in compact mode. */
  shortcut?: React.ReactNode;
  /** Current page. Links rendered by a router may set `aria-current="page"` instead. */
  active?: boolean;
  disabled?: boolean;
  /**
   * Render the single child element (e.g. a router link) as the item; its children become the
   * label.
   */
  asChild?: boolean;
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
    icon,
    badge,
    shortcut,
    active = false,
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
    "aria-current": active ? ("page" as const) : rest["aria-current"],
    ...toDataAttributes({
      state: active ? "active" : undefined,
      disabled: disabled || undefined,
    }),
  };

  let element: React.ReactElement;
  let labelSource: React.ReactNode = children;

  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    labelSource = children.props.children;
    element = (
      <Slot {...shared} ref={ref} aria-disabled={disabled || undefined}>
        {React.cloneElement(
          children,
          undefined,
          <ItemInner icon={icon} badge={badge} shortcut={shortcut}>
            {children.props.children}
          </ItemInner>,
        )}
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
        <ItemInner icon={icon} badge={badge} shortcut={shortcut}>
          {children}
        </ItemInner>
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
        <ItemInner icon={icon} badge={badge} shortcut={shortcut}>
          {children}
        </ItemInner>
      </button>
    );
  }

  const tooltipText = textOf(labelSource).trim() || (rest["aria-label"] ?? "");
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
          <ItemInner icon={expanded ? <PanelLeftClose /> : <PanelLeftOpen />}>{label}</ItemInner>
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
  Toggle: SidebarToggle,
};
