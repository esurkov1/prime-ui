import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
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
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const previousLayoutStateRef = React.useRef<SidebarLayoutMode>(layoutState);
  const [transitionPhase, setTransitionPhase] = React.useState<"to-compact" | "to-expanded" | null>(
    null,
  );

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

  React.useEffect(() => {
    if (isMobile) {
      previousLayoutStateRef.current = layoutState;
      setTransitionPhase(null);
      if (transitionTimerRef.current !== null) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      return;
    }

    const previousState = previousLayoutStateRef.current;
    previousLayoutStateRef.current = layoutState;

    const nextPhase =
      previousState === "expanded" && layoutState === "compact"
        ? "to-compact"
        : previousState === "compact" && layoutState === "expanded"
          ? "to-expanded"
          : null;

    if (transitionTimerRef.current !== null) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    if (nextPhase === null) {
      setTransitionPhase(null);
      return;
    }

    setTransitionPhase(nextPhase);
    transitionTimerRef.current = setTimeout(() => {
      setTransitionPhase(null);
      transitionTimerRef.current = null;
    }, 280);
  }, [isMobile, layoutState]);

  React.useEffect(
    () => () => {
      if (transitionTimerRef.current !== null) {
        clearTimeout(transitionTimerRef.current);
      }
    },
    [],
  );

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

  const closeMobile = React.useCallback(() => {
    setLayoutState("hidden");
  }, [setLayoutState]);

  const navAreaRef = useOverlayModal<HTMLDivElement>(mobileOpen, closeMobile);

  const navPanelId = React.useId();

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
          transitioning: transitionPhase ? true : undefined,
          "transition-phase": transitionPhase ?? undefined,
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

        {Boolean(responsive) && isMobile && !openState ? (
          <Button.Root
            size={size}
            variant="neutral"
            mode="ghost"
            className={styles.floatingToggle}
            onClick={() => setLayoutState("expanded")}
            aria-label={side === "left" ? "Открыть сайдбар" : "Открыть сайдбар справа"}
            aria-controls={navPanelId}
          >
            <Button.Icon>
              {side === "left" ? <PanelLeftOpen size="1em" /> : <PanelRightOpen size="1em" />}
            </Button.Icon>
          </Button.Root>
        ) : null}
      </aside>
    </SidebarProvider>
  );
});

SidebarRoot.displayName = "SidebarRoot";

export { SidebarRoot };
