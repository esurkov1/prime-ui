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
import { SIDEBAR_MEDIA_QUERY_NARROW } from "./sidebarLayout";

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
  const initialResponsiveViewport =
    responsive === true &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW).matches;

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
    defaultValue: initialResponsiveViewport ? false : defaultOpen,
    onChange: onOpenChange,
  });

  const [isResponsiveViewport, setIsResponsiveViewport] = React.useState(initialResponsiveViewport);
  const previousResponsiveViewportRef = React.useRef(initialResponsiveViewport);

  React.useEffect(() => {
    if (
      responsive !== true ||
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setIsResponsiveViewport(false);
      previousResponsiveViewportRef.current = false;
      return;
    }

    const query = window.matchMedia(SIDEBAR_MEDIA_QUERY_NARROW);
    const update = () => setIsResponsiveViewport(query.matches);
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
    const prev = previousResponsiveViewportRef.current;
    if (prev === isResponsiveViewport) return;
    previousResponsiveViewportRef.current = isResponsiveViewport;
    setOpenState(!isResponsiveViewport);
  }, [isResponsiveViewport, responsive, setOpenState]);

  const setVariant = React.useCallback(
    (nextVariant: SidebarVariant) => {
      setVariantState(nextVariant === "double" ? "double" : "simple");
    },
    [setVariantState],
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next);
    },
    [setOpenState],
  );

  const toggleOpen = React.useCallback(() => {
    setOpenState((prev) => !prev);
  }, [setOpenState]);

  const shouldShowInlineOverlay = responsive === true && isResponsiveViewport && open;
  const shouldShowFloatingToggle = open === false;

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
    }),
    [
      activeSection,
      navPanelId,
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
