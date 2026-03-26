import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SidebarSize } from "@/internal/states";

import styles from "./Sidebar.module.css";
import { SidebarProvider, type SidebarSide } from "./sidebar-context";
import {
  type LegacySidebarLayoutMode,
  normalizeSidebarMode,
  SIDEBAR_MEDIA_QUERY_NARROW,
  type SidebarLayoutMode,
} from "./sidebarLayout";

export type { SidebarLayoutMode, SidebarSide };

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"aside">, "children"> & {
  children: React.ReactNode;
  size?: SidebarSize;
  side?: SidebarSide;
  state?: SidebarLayoutMode;
  defaultState?: SidebarLayoutMode;
  onStateChange?: (state: SidebarLayoutMode) => void;
  /** @deprecated */
  mode?: SidebarLayoutMode | LegacySidebarLayoutMode;
  /** @deprecated */
  defaultMode?: SidebarLayoutMode | LegacySidebarLayoutMode;
  /** @deprecated */
  onModeChange?: (state: SidebarLayoutMode) => void;
  /** @deprecated */
  open?: boolean;
  /** @deprecated */
  defaultOpen?: boolean;
  /** @deprecated */
  onOpenChange?: (open: boolean) => void;
  responsive?: boolean;
  sidebarSlot?: "page-nav";
};

function initialMobileMatch(responsive: boolean): boolean {
  if (!responsive) return false;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW).matches;
}

function defaultStateFromProps(
  responsive: boolean,
  isMobile: boolean,
  defaultOpen: boolean,
): SidebarLayoutMode {
  if (responsive && isMobile) return "hidden";
  return defaultOpen ? "expanded" : "hidden";
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarRootProps>(function SidebarRoot(
  {
    children,
    className,
    size = "m",
    side = "left",
    state,
    defaultState,
    onStateChange,
    mode,
    defaultMode,
    onModeChange,
    open,
    defaultOpen = true,
    onOpenChange,
    responsive = true,
    sidebarSlot,
    "aria-label": ariaLabel = "Sidebar",
    ...rest
  },
  ref,
) {
  const initialMobile = initialMobileMatch(Boolean(responsive));

  const modeControlled = mode === undefined ? undefined : normalizeSidebarMode(mode);
  const modeDefault = defaultMode === undefined ? undefined : normalizeSidebarMode(defaultMode);

  const controlledState =
    state ?? modeControlled ?? (open === undefined ? undefined : open ? "expanded" : "hidden");

  const resolvedDefaultState =
    defaultState ??
    modeDefault ??
    defaultStateFromProps(Boolean(responsive), initialMobile, Boolean(defaultOpen));

  const [layoutState, setLayoutState] = useControllableState<SidebarLayoutMode>({
    value: controlledState,
    defaultValue: resolvedDefaultState,
    onChange: (next) => {
      onStateChange?.(next);
      onModeChange?.(next);
      onOpenChange?.(next !== "hidden");
    },
  });

  const [isMobile, setIsMobile] = React.useState(initialMobile);
  const previousMobileRef = React.useRef(initialMobile);

  React.useEffect(() => {
    if (!responsive || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setIsMobile(false);
      previousMobileRef.current = false;
      return;
    }

    const query = window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW);
    const update = () => setIsMobile(query.matches);
    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, [responsive]);

  React.useEffect(() => {
    const wasMobile = previousMobileRef.current;
    if (wasMobile === isMobile || !responsive) return;
    previousMobileRef.current = isMobile;

    if (isMobile) {
      setLayoutState("hidden");
      return;
    }

    if (layoutState === "hidden" && defaultOpen) {
      setLayoutState("expanded");
    }
  }, [defaultOpen, isMobile, layoutState, responsive, setLayoutState]);

  const setState = React.useCallback(
    (next: SidebarLayoutMode) => {
      setLayoutState(next);
    },
    [setLayoutState],
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      setLayoutState(next ? "expanded" : "hidden");
    },
    [setLayoutState],
  );

  const toggleOpen = React.useCallback(() => {
    setLayoutState((prev) => {
      if (isMobile) {
        return prev === "hidden" ? "expanded" : "hidden";
      }
      if (prev === "expanded") return "compact";
      if (prev === "compact") return "expanded";
      return "expanded";
    });
  }, [isMobile, setLayoutState]);

  const openState = layoutState !== "hidden";
  const mobileOpen = Boolean(responsive) && isMobile && openState;
  const showFloatingToggle = isMobile ? !openState : true;

  const [floatingPortalReady, setFloatingPortalReady] = React.useState(false);
  React.useLayoutEffect(() => {
    setFloatingPortalReady(true);
  }, []);

  const closeMobile = React.useCallback(() => {
    setLayoutState("hidden");
  }, [setLayoutState]);

  const navAreaRef = useOverlayModal<HTMLDivElement>(mobileOpen, closeMobile);

  const navPanelId = React.useId();

  const floatingToggleLabel = React.useMemo(() => {
    if (isMobile) {
      return side === "left" ? "Открыть сайдбар" : "Открыть сайдбар справа";
    }

    if (layoutState === "expanded") {
      return side === "left" ? "Свернуть сайдбар" : "Свернуть сайдбар справа";
    }

    return side === "left" ? "Развернуть сайдбар" : "Развернуть сайдбар справа";
  }, [isMobile, layoutState, side]);

  const floatingToggleIcon = React.useMemo(() => {
    if (isMobile || layoutState === "hidden") {
      return side === "left" ? <PanelLeftOpen size="1em" /> : <PanelRightOpen size="1em" />;
    }

    if (layoutState === "expanded") {
      return side === "left" ? <PanelLeftClose size="1em" /> : <PanelRightClose size="1em" />;
    }

    return side === "left" ? <PanelLeftOpen size="1em" /> : <PanelRightOpen size="1em" />;
  }, [isMobile, layoutState, side]);

  const onFloatingToggleClick = React.useCallback(() => {
    if (isMobile) {
      setLayoutState("expanded");
      return;
    }
    toggleOpen();
  }, [isMobile, setLayoutState, toggleOpen]);

  const contextValue = React.useMemo(
    () => ({
      size,
      side,
      state: layoutState,
      setState,
      mode: layoutState,
      setMode: setState,
      open: openState,
      setOpen,
      toggleOpen,
      isMobile,
      navPanelId,
    }),
    [isMobile, layoutState, navPanelId, openState, setOpen, setState, side, size, toggleOpen],
  );

  return (
    <SidebarProvider value={contextValue}>
      <aside
        {...rest}
        ref={ref}
        className={cx(styles.root, className)}
        aria-label={ariaLabel}
        {...toDataAttributes({
          size,
          side,
          state: layoutState,
          open: openState,
          responsive: responsive ? true : undefined,
          mobile: isMobile ? true : undefined,
          "mobile-open": mobileOpen ? true : undefined,
          "sidebar-slot": sidebarSlot,
          "sidebar-mode": layoutState,
          "sidebar-root": true,
        })}
      >
        <div ref={navAreaRef} className={styles.navArea}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть сайдбар"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
            aria-hidden={mobileOpen ? undefined : true}
          />
          {children}
        </div>

        {showFloatingToggle && floatingPortalReady && typeof document !== "undefined"
          ? createPortal(
              <button
                type="button"
                className={styles.floatingToggle}
                onClick={onFloatingToggleClick}
                aria-label={floatingToggleLabel}
                aria-controls={navPanelId}
                data-side={side}
              >
                <span className={styles.menuIcon} aria-hidden="true">
                  {floatingToggleIcon}
                </span>
              </button>,
              document.body,
            )
          : null}
      </aside>
    </SidebarProvider>
  );
});

SidebarRoot.displayName = "SidebarRoot";

export { SidebarRoot };
