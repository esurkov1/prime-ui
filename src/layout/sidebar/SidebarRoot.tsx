import { ChevronsRight, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SidebarSize } from "@/internal/states";
import styles from "./Sidebar.module.css";
import { SidebarProvider } from "./sidebar-context";
import {
  type SidebarLayoutMode,
  SIDEBAR_MEDIA_QUERY_NARROW,
  SIDEBAR_MEDIA_QUERY_XS_HIDDEN,
} from "./sidebarLayout";

export type { SidebarLayoutMode };

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"aside">, "children"> & {
  children: React.ReactNode;
  size?: SidebarSize;
  /** Узкая раскладка: `hidden` | `compact` | `expand`. Имеет приоритет над `open`, если задано. */
  mode?: SidebarLayoutMode;
  defaultMode?: SidebarLayoutMode;
  onModeChange?: (mode: SidebarLayoutMode) => void;
  /** Совместимость: `false` = hidden, `true` = expand (не compact). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  responsive?: boolean;
  /** Размещение в колонке навигации рядом с контентом (flex-слот). */
  sidebarSlot?: "page-nav";
};

function resolveInitialMode(
  responsive: boolean,
  narrow: boolean,
  defaultOpen: boolean,
): SidebarLayoutMode {
  if (responsive && narrow) return "hidden";
  return defaultOpen ? "expand" : "hidden";
}

function SidebarRoot({
  children,
  className,
  size = "m",
  mode: modeProp,
  defaultMode,
  open: openProp,
  defaultOpen = true,
  onModeChange,
  onOpenChange,
  responsive = true,
  sidebarSlot,
  "aria-label": ariaLabel = "Sidebar",
  ...rest
}: SidebarRootProps) {
  const initialNarrowViewport =
    responsive === true &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW).matches;

  const initialXsHiddenViewport =
    responsive === true &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SIDEBAR_MEDIA_QUERY_XS_HIDDEN).matches;

  const modeFromOpenProp =
    openProp === undefined ? undefined : openProp ? "expand" : "hidden";
  const modeControlledValue = modeProp !== undefined ? modeProp : modeFromOpenProp;

  const defaultModeResolved =
    defaultMode ??
    resolveInitialMode(Boolean(responsive), initialNarrowViewport, defaultOpen);

  const [mode, setModeState] = useControllableState<SidebarLayoutMode>({
    value: modeControlledValue,
    defaultValue: defaultModeResolved,
    onChange: (next) => {
      onModeChange?.(next);
      onOpenChange?.(next !== "hidden");
    },
  });

  const [isNarrowViewport, setIsNarrowViewport] = React.useState(initialNarrowViewport);
  const previousNarrowRef = React.useRef(initialNarrowViewport);

  const [isXsHiddenViewport, setIsXsHiddenViewport] = React.useState(initialXsHiddenViewport);
  const previousXsRef = React.useRef(initialXsHiddenViewport);

  React.useEffect(() => {
    if (
      responsive !== true ||
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setIsNarrowViewport(false);
      previousNarrowRef.current = false;
      return;
    }

    const query = window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW);
    const update = () => setIsNarrowViewport(query.matches);
    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, [responsive]);

  React.useEffect(() => {
    if (
      responsive !== true ||
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setIsXsHiddenViewport(false);
      previousXsRef.current = false;
      return;
    }

    const query = window.matchMedia(SIDEBAR_MEDIA_QUERY_XS_HIDDEN);
    const update = () => setIsXsHiddenViewport(query.matches);
    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, [responsive]);

  React.useEffect(() => {
    if (responsive !== true) return;
    const prev = previousXsRef.current;
    if (prev === isXsHiddenViewport) return;
    previousXsRef.current = isXsHiddenViewport;
    if (isXsHiddenViewport) setModeState("hidden");
  }, [isXsHiddenViewport, responsive, setModeState]);

  React.useEffect(() => {
    if (responsive !== true) return;
    const prev = previousNarrowRef.current;
    if (prev === isNarrowViewport) return;
    previousNarrowRef.current = isNarrowViewport;
    setModeState(isNarrowViewport ? "hidden" : "expand");
  }, [isNarrowViewport, responsive, setModeState]);

  React.useEffect(() => {
    if (!isNarrowViewport && mode === "compact") {
      setModeState("expand");
    }
  }, [isNarrowViewport, mode, setModeState]);

  const setMode = React.useCallback(
    (next: SidebarLayoutMode) => {
      setModeState(next);
    },
    [setModeState],
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      setModeState(next ? "expand" : "hidden");
    },
    [setModeState],
  );

  /** Скрыть полностью из expand и compact; из hidden открыть compact. */
  const toggleOpen = React.useCallback(() => {
    setModeState((prev) => {
      if (prev === "expand" || prev === "compact") return "hidden";
      return "compact";
    });
  }, [setModeState]);

  const open = mode !== "hidden";

  const shouldShowInlineOverlay =
    responsive === true && isNarrowViewport && mode === "expand";
  const shouldShowFloatingToggle =
    responsive === true &&
    isNarrowViewport &&
    !isXsHiddenViewport &&
    (mode === "hidden" || mode === "compact");

  const navPanelId = React.useId();

  const closeOverlay = React.useCallback(() => setMode("hidden"), [setMode]);

  const navAreaRef = useOverlayModal<HTMLDivElement>(shouldShowInlineOverlay, closeOverlay);

  const handleFloatingClick = React.useCallback(() => {
    setModeState((prev) => {
      if (prev === "hidden") return "compact";
      if (prev === "compact") return "expand";
      return prev;
    });
  }, [setModeState]);

  const contextValue = React.useMemo(
    () => ({
      size,
      mode,
      setMode,
      open,
      setOpen,
      toggleOpen,
      navPanelId,
    }),
    [mode, navPanelId, open, setMode, setOpen, size, toggleOpen],
  );

  return (
    <SidebarProvider value={contextValue}>
      <aside
        {...rest}
        className={cx(styles.root, className)}
        aria-label={ariaLabel}
        {...toDataAttributes({
          size,
          open,
          responsive: responsive ? true : undefined,
          "sidebar-slot": sidebarSlot,
          "sidebar-mode": responsive && isNarrowViewport ? mode : undefined,
        })}
      >
        <div ref={navAreaRef} className={styles.navArea}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть сайдбар"
            aria-hidden={shouldShowInlineOverlay ? undefined : true}
            tabIndex={-1}
            onClick={() => setMode("hidden")}
          />
          {children}
        </div>
        {shouldShowFloatingToggle ? (
          <button
            type="button"
            className={styles.floatingToggle}
            onClick={handleFloatingClick}
            aria-label={
              mode === "hidden"
                ? "Открыть сайдбар (компактно)"
                : "Развернуть сайдбар на весь экран"
            }
            aria-controls={navPanelId}
          >
            {mode === "compact" ? (
              <ChevronsRight size="1em" strokeWidth={2} />
            ) : (
              <PanelLeftOpen size="1em" strokeWidth={2} />
            )}
          </button>
        ) : null}
      </aside>
    </SidebarProvider>
  );
}

SidebarRoot.displayName = "SidebarRoot";

export { SidebarRoot };
