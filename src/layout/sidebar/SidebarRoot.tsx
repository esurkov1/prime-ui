import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SidebarSize } from "@/internal/states";

import styles from "./Sidebar.module.css";
import { SidebarProvider, type SidebarSide } from "./sidebar-context";
import { readStoredDesktopMode, writeStoredDesktopMode } from "./sidebarDesktopStorage";
import {
  type LegacySidebarLayoutMode,
  normalizeSidebarMode,
  SIDEBAR_MEDIA_QUERY_NARROW,
  type SidebarLayoutMode,
} from "./sidebarLayout";
import { useSidebarNarrowViewport } from "./useSidebarNarrowViewport";

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
  /**
   * Ключ `localStorage`: запоминаются только режимы рабочего стола `expanded` / `compact`.
   * На узком вьюпорте drawer при загрузке всегда закрыт; при возврате на широкий экран подставляется сохранённый режим.
   */
  persistStateKey?: string;
};

function computeInitialLayoutState(args: {
  responsive: boolean;
  defaultOpen: boolean;
  persistStateKey: string | undefined;
  defaultState: SidebarLayoutMode | undefined;
  modeDefault: SidebarLayoutMode | undefined;
}): SidebarLayoutMode {
  const isNarrow =
    args.responsive &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW).matches;

  if (args.defaultState !== undefined) {
    const normalized = normalizeSidebarMode(args.defaultState);
    if (args.responsive && isNarrow) return "hidden";
    return normalized;
  }
  if (args.modeDefault !== undefined) {
    const normalized = normalizeSidebarMode(args.modeDefault);
    if (args.responsive && isNarrow) return "hidden";
    return normalized;
  }
  if (args.responsive && isNarrow) return "hidden";
  if (args.persistStateKey && typeof window !== "undefined") {
    const stored = readStoredDesktopMode(args.persistStateKey);
    if (stored) return stored;
  }
  return args.defaultOpen ? "expanded" : "hidden";
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
    persistStateKey,
    sidebarSlot,
    "aria-label": ariaLabel = "Sidebar",
    ...rest
  },
  ref,
) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") {
        ref(node);
        return;
      }
      if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const modeControlled = mode === undefined ? undefined : normalizeSidebarMode(mode);
  const modeDefault = defaultMode === undefined ? undefined : normalizeSidebarMode(defaultMode);

  const controlledState =
    state ?? modeControlled ?? (open === undefined ? undefined : open ? "expanded" : "hidden");

  const initialLayoutDefaultRef = React.useRef<SidebarLayoutMode | null>(null);
  if (initialLayoutDefaultRef.current === null) {
    initialLayoutDefaultRef.current = computeInitialLayoutState({
      responsive: Boolean(responsive),
      defaultOpen: Boolean(defaultOpen),
      persistStateKey,
      defaultState,
      modeDefault,
    });
  }

  const resolvedDefaultState = initialLayoutDefaultRef.current;

  const initialLayoutForProgress = controlledState ?? resolvedDefaultState;

  const isMobile = useSidebarNarrowViewport(Boolean(responsive));

  const compactProgressInitial = !isMobile && initialLayoutForProgress === "compact" ? 1 : 0;

  const compactProgress = useMotionValue(compactProgressInitial);

  const [layoutState, setLayoutState] = useControllableState<SidebarLayoutMode>({
    value: controlledState,
    defaultValue: resolvedDefaultState,
    onChange: (next) => {
      onStateChange?.(next);
      onModeChange?.(next);
      onOpenChange?.(next !== "hidden");
    },
  });

  const previousMobileRef = React.useRef(isMobile);

  React.useEffect(() => {
    const wasMobile = previousMobileRef.current;
    if (wasMobile === isMobile || !responsive) return;
    previousMobileRef.current = isMobile;

    if (isMobile) {
      setLayoutState("hidden");
      return;
    }

    const stored = persistStateKey ? readStoredDesktopMode(persistStateKey) : null;
    if (stored === "expanded" || stored === "compact") {
      setLayoutState(stored);
      return;
    }

    if (layoutState === "hidden" && defaultOpen) {
      setLayoutState("expanded");
    }
  }, [defaultOpen, isMobile, layoutState, persistStateKey, responsive, setLayoutState]);

  React.useEffect(() => {
    if (!persistStateKey || controlledState !== undefined) return;
    if (isMobile) return;
    if (layoutState === "expanded" || layoutState === "compact") {
      writeStoredDesktopMode(persistStateKey, layoutState);
    }
  }, [controlledState, isMobile, layoutState, persistStateKey]);

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

  const compactProgressTarget = !isMobile && layoutState === "compact" ? 1 : 0;

  React.useEffect(() => {
    if (compactProgress.get() === compactProgressTarget) {
      return;
    }
    const controls = animate(compactProgress, compactProgressTarget, {
      duration: reducedMotion ? 0 : 0.24,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => controls.stop();
  }, [compactProgress, compactProgressTarget, reducedMotion]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (root == null) return;
    root.style.setProperty("--sb-progress", compactProgress.get().toString());
  }, [compactProgress]);

  useMotionValueEvent(compactProgress, "change", (value) => {
    const root = rootRef.current;
    if (root == null) return;
    root.style.setProperty("--sb-progress", value.toString());
  });

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
        ref={setRootRef}
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
      </aside>
    </SidebarProvider>
  );
});

SidebarRoot.displayName = "SidebarRoot";

export { SidebarRoot };
