import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { useOverlayModal } from "@/hooks/useOverlayModal";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { SidebarSize } from "@/internal/states";
import styles from "./Sidebar.module.css";
import type { SidebarVariant } from "./sidebar-context";
import { SidebarProvider } from "./sidebar-context";
import { SIDEBAR_MEDIA_QUERY_COMPACT, SIDEBAR_MEDIA_QUERY_NARROW } from "./sidebarLayout";

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"aside">, "children"> & {
  children: React.ReactNode;
  size?: SidebarSize;
  variant?: SidebarVariant;
  defaultVariant?: SidebarVariant;
  onVariantChange?: (variant: SidebarVariant) => void;
  activeSection?: string;
  defaultActiveSection?: string;
  onActiveSectionChange?: (section: string) => void;
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
  variant: variantProp,
  defaultVariant = "double",
  onVariantChange,
  activeSection: activeSectionProp,
  defaultActiveSection,
  onActiveSectionChange,
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

  const initialCompactViewport =
    responsive === true &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SIDEBAR_MEDIA_QUERY_COMPACT).matches;

  const [variant, setVariantState] = useControllableState<SidebarVariant>({
    value: variantProp,
    defaultValue: defaultVariant,
    onChange: onVariantChange,
  });

  const [activeSection, setActiveSection] = useControllableState<string | null>({
    value: activeSectionProp,
    defaultValue: defaultActiveSection ?? null,
    onChange: (nextSection) => {
      if (nextSection !== null) {
        onActiveSectionChange?.(nextSection);
      }
    },
  });

  const [open, setOpenState] = useControllableState<boolean>({
    value: openProp,
    defaultValue: initialNarrowViewport || initialCompactViewport ? false : defaultOpen,
    onChange: onOpenChange,
  });

  /** Открытие с левого края (peek): при уходе с `NavPanel` закрываем; явный toggle — «закреплённое» открытие. */
  const openedByEdgePeekRef = React.useRef(false);

  const [canEdgePeekHover, setCanEdgePeekHover] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanEdgePeekHover(mq.matches);
    update();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const [isNarrowViewport, setIsNarrowViewport] = React.useState(initialNarrowViewport);
  const [isCompactViewport, setIsCompactViewport] = React.useState(initialCompactViewport);

  React.useEffect(() => {
    if (
      responsive !== true ||
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setIsNarrowViewport(false);
      setIsCompactViewport(false);
      return;
    }

    const narrowQuery = window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW);
    const compactQuery = window.matchMedia(SIDEBAR_MEDIA_QUERY_COMPACT);

    const update = () => {
      setIsNarrowViewport(narrowQuery.matches);
      setIsCompactViewport(compactQuery.matches);
    };
    update();

    if (typeof narrowQuery.addEventListener === "function") {
      narrowQuery.addEventListener("change", update);
      compactQuery.addEventListener("change", update);
      return () => {
        narrowQuery.removeEventListener("change", update);
        compactQuery.removeEventListener("change", update);
      };
    }

    narrowQuery.addListener(update);
    compactQuery.addListener(update);
    return () => {
      narrowQuery.removeListener(update);
      compactQuery.removeListener(update);
    };
  }, [responsive]);

  React.useEffect(() => {
    if (responsive !== true) return;
    openedByEdgePeekRef.current = false;
    if (isNarrowViewport) {
      setOpenState(false);
    } else if (isCompactViewport) {
      setOpenState(false);
    } else {
      setOpenState(true);
    }
  }, [isNarrowViewport, isCompactViewport, responsive, setOpenState]);

  const setVariant = React.useCallback(
    (nextVariant: SidebarVariant) => {
      setVariantState(nextVariant === "double" ? "double" : "simple");
    },
    [setVariantState],
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!next) {
        openedByEdgePeekRef.current = false;
      }
      setOpenState(next);
    },
    [setOpenState],
  );

  const toggleOpen = React.useCallback(() => {
    setOpenState((prev) => {
      const next = !prev;
      openedByEdgePeekRef.current = false;
      return next;
    });
  }, [setOpenState]);

  const handleEdgePeekEnter = React.useCallback(() => {
    if (open) return;
    openedByEdgePeekRef.current = true;
    setOpenState(true);
  }, [open, setOpenState]);

  const notifyNavPanelPeekLeave = React.useCallback(
    (event: React.PointerEvent<Element> | React.MouseEvent<Element>) => {
      if (!openedByEdgePeekRef.current) return;
      const next = event.relatedTarget as Node | null;
      if (next instanceof Element && next.closest("[data-sidebar-part='context-rail']")) {
        return;
      }
      openedByEdgePeekRef.current = false;
      setOpenState(false);
    },
    [setOpenState],
  );

  const shouldShowInlineOverlay = responsive === true && isNarrowViewport && open;
  const shouldShowFloatingToggle = responsive === true && isNarrowViewport && open === false;

  const navPanelId = React.useId();

  const closeOverlay = React.useCallback(() => setOpen(false), [setOpen]);

  const navAreaRef = useOverlayModal<HTMLDivElement>(shouldShowInlineOverlay, closeOverlay);

  const contextValue = React.useMemo(
    () => ({
      size,
      variant,
      setVariant,
      activeSection,
      setActiveSection: (id: string) => setActiveSection(id),
      open,
      setOpen,
      toggleOpen,
      navPanelId,
      notifyNavPanelPeekLeave,
    }),
    [
      activeSection,
      navPanelId,
      notifyNavPanelPeekLeave,
      open,
      setActiveSection,
      setOpen,
      setVariant,
      size,
      toggleOpen,
      variant,
    ],
  );

  return (
    <SidebarProvider value={contextValue}>
      <aside
        {...rest}
        className={cx(styles.root, className)}
        aria-label={ariaLabel}
        {...toDataAttributes({
          size,
          variant,
          open,
          responsive: responsive ? true : undefined,
          "sidebar-slot": sidebarSlot,
        })}
        data-collapsed={variant === "simple" ? "true" : undefined}
      >
        {canEdgePeekHover && !open && isNarrowViewport ? (
          <div
            className={styles.edgePeek}
            data-sidebar-part="edge-peek"
            aria-hidden
            onPointerEnter={handleEdgePeekEnter}
          />
        ) : null}
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
