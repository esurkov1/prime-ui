import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SidebarSize } from "@/internal/states";
import styles from "./Sidebar.module.css";
import { SidebarProvider } from "./sidebar-context";
import { SIDEBAR_MEDIA_QUERY_NARROW, SIDEBAR_MEDIA_QUERY_XS_HIDDEN } from "./sidebarLayout";

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"aside">, "children"> & {
  children: React.ReactNode;
  size?: SidebarSize;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  responsive?: boolean;
  /** Размещение в колонке навигации рядом с контентом (flex-слот). */
  sidebarSlot?: "page-nav";
};

function SidebarRoot({
  children,
  className,
  size = "m",
  open: openProp,
  defaultOpen = true,
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

  const [open, setOpenState] = useControllableState<boolean>({
    value: openProp,
    defaultValue: initialNarrowViewport ? false : defaultOpen,
    onChange: onOpenChange,
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
    if (isXsHiddenViewport) setOpenState(false);
  }, [isXsHiddenViewport, responsive, setOpenState]);

  React.useEffect(() => {
    if (responsive !== true) return;
    const prev = previousNarrowRef.current;
    if (prev === isNarrowViewport) return;
    previousNarrowRef.current = isNarrowViewport;
    setOpenState(!isNarrowViewport);
  }, [isNarrowViewport, responsive, setOpenState]);

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next);
    },
    [setOpenState],
  );

  const toggleOpen = React.useCallback(() => {
    setOpenState((prev) => !prev);
  }, [setOpenState]);

  const shouldShowInlineOverlay = responsive === true && isNarrowViewport && open;
  const shouldShowFloatingToggle =
    responsive === true && isNarrowViewport && open === false && !isXsHiddenViewport;

  const navPanelId = React.useId();

  const closeOverlay = React.useCallback(() => setOpen(false), [setOpen]);

  const navAreaRef = useOverlayModal<HTMLDivElement>(shouldShowInlineOverlay, closeOverlay);

  const contextValue = React.useMemo(
    () => ({
      size,
      open,
      setOpen,
      toggleOpen,
      navPanelId,
    }),
    [navPanelId, open, setOpen, size, toggleOpen],
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
        })}
      >
        <div ref={navAreaRef} className={styles.navArea}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть сайдбар"
            aria-hidden={shouldShowInlineOverlay ? undefined : true}
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          {children}
        </div>
        {shouldShowFloatingToggle ? (
          <button
            type="button"
            className={styles.floatingToggle}
            onClick={toggleOpen}
            aria-label={open ? "Скрыть сайдбар" : "Открыть сайдбар"}
            aria-controls={navPanelId}
          >
            {open ? (
              <PanelLeftClose size="1em" strokeWidth={2} />
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
