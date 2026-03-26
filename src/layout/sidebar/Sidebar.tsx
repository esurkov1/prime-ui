import { ChevronsUpDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router-dom";

import { Tooltip } from "@/components/tooltip/Tooltip";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Slot } from "@/internal/slot";
import type { SidebarSize } from "@/internal/states";
import styles from "./Sidebar.module.css";
import { SIDEBAR_MEDIA_QUERY_NARROW } from "./sidebarLayout";

export type { SidebarSize };

export type SidebarVariant = "simple" | "double";
export type SidebarResponsive = boolean;

export type SidebarContextItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  tooltip?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

type SidebarContextValue = {
  size: SidebarSize;
  variant: SidebarVariant;
  setVariant: (next: SidebarVariant) => void;
  activeSection: string | null;
  setActiveSection: (id: string) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleOpen: () => void;
  /** Закрыть оверлей, если он был открыт наведением к левому краю (responsive). */
  onNavPanelMouseLeave: () => void;
  /** Стабильный id для `NavPanel` — `aria-controls` у кнопок открытия. */
  navPanelId: string;
};

const [SidebarProvider, useSidebarContext] = createComponentContext<SidebarContextValue>("Sidebar");

export { useSidebarContext };

/**
 * Собирает `to` для пунктов **панели** при `Sidebar.Root variant="double"`: префикс =
 * `activeSection` из контекста (выбранный пункт `ContextBar`). Внутри `PanelSwitch` для
 * каждого раздела рендерите свой `Menu` с `MenuRouterLink`, передавая либо полный `to`,
 * либо короткий путь сюда — например `useSidebarNavTo("deals")` → `/crm/deals` при активном CRM.
 *
 * При `variant="simple"` или пока раздел не выбран — путь от корня: `/${pathWithinSection}`.
 */
export function useSidebarNavTo(pathWithinSection: string): string {
  const { variant, activeSection } = useSidebarContext();
  const inner = pathWithinSection.replace(/^\/+|\/+$/g, "");
  if (variant === "double" && activeSection !== null && activeSection !== "") {
    if (inner === "") {
      return `/${activeSection}`;
    }
    return `/${activeSection}/${inner}`;
  }
  if (inner === "") {
    return "/";
  }
  return `/${inner}`;
}

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
  responsive?: SidebarResponsive;
  /** Узкая ширина панели навигации (`--sb-panel-width`). */
  panelWidth?: "compact";
  /** Размещение в колонке навигации рядом с контентом (flex-слот). */
  sidebarSlot?: "page-nav";
  /**
   * При `responsive` и узком viewport: открывать оверлей, когда указатель оказывается
   * у левого края окна (только если устройство поддерживает hover + fine pointer).
   * Такой оверлей закрывается при уходе указателя с `Sidebar.NavPanel`.
   * При контролируемом `open` задайте `onOpenChange`, иначе родитель не узнает о запросе открытия/закрытия.
   */
  edgeHoverOpen?: boolean;
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
  edgeHoverOpen = true,
  panelWidth,
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

  const [edgeHoverRevealEnabled, setEdgeHoverRevealEnabled] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function" ||
      edgeHoverOpen !== true
    ) {
      setEdgeHoverRevealEnabled(false);
      return;
    }
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEdgeHoverRevealEnabled(query.matches);
    sync();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, [edgeHoverOpen]);

  const edgeOpenPx = 12;
  const openViaEdgeHoverRef = React.useRef(false);

  React.useEffect(() => {
    if (open) return;
    openViaEdgeHoverRef.current = false;
  }, [open]);

  React.useEffect(() => {
    if (
      edgeHoverOpen !== true ||
      responsive !== true ||
      !isResponsiveViewport ||
      open ||
      !edgeHoverRevealEnabled ||
      typeof window === "undefined"
    ) {
      return;
    }
    const onMove = (event: MouseEvent) => {
      if (event.clientX <= edgeOpenPx) {
        openViaEdgeHoverRef.current = true;
        setOpenState(true);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [edgeHoverOpen, edgeHoverRevealEnabled, isResponsiveViewport, open, responsive, setOpenState]);

  const onNavPanelMouseLeave = React.useCallback(() => {
    if (!openViaEdgeHoverRef.current) return;
    if (responsive !== true || !isResponsiveViewport || !open) return;
    openViaEdgeHoverRef.current = false;
    setOpen(false);
  }, [isResponsiveViewport, open, responsive, setOpen]);

  const shouldShowInlineOverlay = responsive === true && isResponsiveViewport && open;
  const shouldShowFloatingToggle = open === false;

  const navPanelId = React.useId();

  const navAreaRef = useFocusTrap<HTMLDivElement>({
    enabled: shouldShowInlineOverlay,
  });

  useScrollLock(shouldShowInlineOverlay);

  useEscapeKey({
    enabled: shouldShowInlineOverlay,
    onEscape: () => setOpen(false),
  });

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
      onNavPanelMouseLeave,
      navPanelId,
    }),
    [
      activeSection,
      navPanelId,
      onNavPanelMouseLeave,
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
          "panel-width": panelWidth === "compact" ? "compact" : undefined,
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

export type SidebarContextBarProps = React.ComponentPropsWithoutRef<"nav"> & {
  items?: SidebarContextItem[];
  activeSection?: string | null;
  onSelectSection?: (sectionId: string) => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
};

function SidebarContextBar({
  className,
  items,
  activeSection: activeSectionProp,
  onSelectSection,
  logo,
  footer,
  children,
  ...rest
}: SidebarContextBarProps) {
  const { activeSection, setActiveSection } = useSidebarContext();
  const resolvedActiveSection = activeSectionProp ?? activeSection;
  const selectSection = onSelectSection ?? setActiveSection;

  React.useEffect(() => {
    if (items === undefined || items.length === 0) return;
    if (resolvedActiveSection !== null) return;
    selectSection(items[0].id);
  }, [items, resolvedActiveSection, selectSection]);

  return (
    <div className={styles.contextRail}>
      <nav {...rest} className={cx(styles.contextBar, className)} aria-label="Context navigation">
        {logo === undefined ? null : <div className={styles.contextBarHeader}>{logo}</div>}

        {items === undefined ? (
          children
        ) : (
          <div className={styles.contextBarBody}>
            <ul className={styles.contextList}>
              {items.map((item) => {
                const button = (
                  <SidebarContextItemButton
                    aria-label={item.ariaLabel ?? item.label}
                    disabled={item.disabled}
                    active={resolvedActiveSection === item.id}
                    onClick={() => selectSection(item.id)}
                  >
                    <span className={styles.contextItemIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                  </SidebarContextItemButton>
                );

                return (
                  <li key={item.id} className={styles.contextListItem}>
                    <Tooltip.Root>
                      <Tooltip.Trigger>{button}</Tooltip.Trigger>
                      <Tooltip.Content side="right">{item.tooltip ?? item.label}</Tooltip.Content>
                    </Tooltip.Root>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {footer === undefined ? null : <div className={styles.contextBarFooter}>{footer}</div>}
      </nav>
    </div>
  );
}

SidebarContextBar.displayName = "SidebarContextBar";

export type SidebarContextBarHeaderProps = React.ComponentPropsWithoutRef<"div">;

function SidebarContextBarHeader({ className, ...rest }: SidebarContextBarHeaderProps) {
  return <div {...rest} className={cx(styles.contextBarHeader, className)} />;
}

SidebarContextBarHeader.displayName = "SidebarContextBarHeader";

export type SidebarContextBarBodyProps = React.ComponentPropsWithoutRef<"div">;

function SidebarContextBarBody({ className, ...rest }: SidebarContextBarBodyProps) {
  return <div {...rest} className={cx(styles.contextBarBody, className)} />;
}

SidebarContextBarBody.displayName = "SidebarContextBarBody";

export type SidebarContextBarFooterProps = React.ComponentPropsWithoutRef<"div">;

function SidebarContextBarFooter({ className, ...rest }: SidebarContextBarFooterProps) {
  return <div {...rest} className={cx(styles.contextBarFooter, className)} />;
}

SidebarContextBarFooter.displayName = "SidebarContextBarFooter";

export type SidebarContextItemButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
  asChild?: boolean;
};

const SidebarContextItemButton = React.forwardRef<HTMLButtonElement, SidebarContextItemButtonProps>(
  ({ className, type = "button", active, asChild = false, disabled, onClick, ...rest }, ref) => {
    const cls = cx(styles.contextItemButton, className);
    const dataActive = active ? "true" : undefined;

    if (asChild) {
      return (
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={cls}
          data-active={dataActive}
          aria-disabled={disabled || undefined}
          onClick={
            disabled
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                }
              : onClick
          }
        />
      );
    }

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        className={cls}
        data-active={dataActive}
        onClick={onClick}
      />
    );
  },
);

SidebarContextItemButton.displayName = "SidebarContextItemButton";

export type SidebarNavPanelProps = React.ComponentPropsWithoutRef<"nav">;

function SidebarNavPanel({ className, onMouseLeave, id, ...rest }: SidebarNavPanelProps) {
  const { onNavPanelMouseLeave, navPanelId } = useSidebarContext();
  return (
    <nav
      {...rest}
      id={id ?? navPanelId}
      className={cx(styles.navPanel, className)}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        onNavPanelMouseLeave();
      }}
    />
  );
}

SidebarNavPanel.displayName = "SidebarNavPanel";

export type SidebarNavPanelBodyProps = React.ComponentPropsWithoutRef<"div">;

function SidebarNavPanelBody({ className, ...rest }: SidebarNavPanelBodyProps) {
  return <div {...rest} className={cx(styles.navPanelBody, className)} />;
}

SidebarNavPanelBody.displayName = "SidebarNavPanelBody";

export type SidebarNavDocTreeProps = React.ComponentPropsWithoutRef<"div">;

function SidebarNavDocTree({ className, ...rest }: SidebarNavDocTreeProps) {
  return <div {...rest} className={cx(styles.navDocTree, className)} />;
}

SidebarNavDocTree.displayName = "SidebarNavDocTree";

export type SidebarNavPanelHeadingProps = React.ComponentPropsWithoutRef<"h2">;

function SidebarNavPanelHeading({ className, ...rest }: SidebarNavPanelHeadingProps) {
  return <h2 {...rest} className={cx(styles.navPanelHeading, className)} />;
}

SidebarNavPanelHeading.displayName = "SidebarNavPanelHeading";

export type SidebarNavCategoryProps = React.ComponentPropsWithoutRef<"div">;

function SidebarNavCategory({ className, ...rest }: SidebarNavCategoryProps) {
  return <div {...rest} className={cx(styles.navCategory, className)} />;
}

SidebarNavCategory.displayName = "SidebarNavCategory";

export type SidebarNavCategoryTriggerProps = React.ComponentPropsWithoutRef<"button">;

const SidebarNavCategoryTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarNavCategoryTriggerProps
>(({ className, type = "button", ...rest }, ref) => (
  <button ref={ref} type={type} className={cx(styles.navCategoryTrigger, className)} {...rest} />
));
SidebarNavCategoryTrigger.displayName = "SidebarNavCategoryTrigger";

export type SidebarNavCategoryLabelProps = React.ComponentPropsWithoutRef<"span">;

function SidebarNavCategoryLabel({ className, ...rest }: SidebarNavCategoryLabelProps) {
  return <span {...rest} className={cx(styles.navCategoryLabel, className)} />;
}

SidebarNavCategoryLabel.displayName = "SidebarNavCategoryLabel";

export type SidebarNavCategoryCountProps = React.ComponentPropsWithoutRef<"span">;

function SidebarNavCategoryCount({ className, ...rest }: SidebarNavCategoryCountProps) {
  return <span {...rest} className={cx(styles.navCategoryCount, className)} />;
}

SidebarNavCategoryCount.displayName = "SidebarNavCategoryCount";

export type SidebarNavCategoryPanelProps = React.ComponentPropsWithoutRef<"div">;

function SidebarNavCategoryPanel({ className, ...rest }: SidebarNavCategoryPanelProps) {
  return <div {...rest} className={cx(styles.navCategoryPanel, className)} />;
}

SidebarNavCategoryPanel.displayName = "SidebarNavCategoryPanel";

export type SidebarPanelSwitchProps = React.ComponentPropsWithoutRef<"div"> & {
  sections?: Record<string, React.ReactNode>;
  renderSection?: (activeSection: string | null) => React.ReactNode;
  fallback?: React.ReactNode;
};

function SidebarPanelSwitch({
  className,
  sections,
  renderSection,
  fallback = null,
  ...rest
}: SidebarPanelSwitchProps) {
  const { activeSection } = useSidebarContext();

  let content: React.ReactNode = fallback;
  if (renderSection !== undefined) {
    content = renderSection(activeSection);
  } else if (sections !== undefined) {
    const keys = Object.keys(sections);
    const sectionKey =
      activeSection !== null && sections[activeSection] !== undefined ? activeSection : keys[0];
    content = sectionKey === undefined ? fallback : sections[sectionKey];
  }

  return (
    <div {...rest} className={cx(styles.panelSwitch, className)}>
      {content}
    </div>
  );
}

SidebarPanelSwitch.displayName = "SidebarPanelSwitch";

export type SidebarHeaderProps = React.ComponentPropsWithoutRef<"div">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <div {...rest} className={cx(styles.header, className)} />;
}

SidebarHeader.displayName = "SidebarHeader";

export type SidebarHeaderRowProps = React.ComponentPropsWithoutRef<"div">;

function SidebarHeaderRow({ className, ...rest }: SidebarHeaderRowProps) {
  return <div {...rest} className={cx(styles.headerRow, className)} />;
}

SidebarHeaderRow.displayName = "SidebarHeaderRow";

export type SidebarHeaderMainProps = React.ComponentPropsWithoutRef<"div">;

function SidebarHeaderMain({ className, ...rest }: SidebarHeaderMainProps) {
  return <div {...rest} className={cx(styles.headerMain, className)} />;
}

SidebarHeaderMain.displayName = "SidebarHeaderMain";

export type SidebarContentProps = React.ComponentPropsWithoutRef<"div">;

function SidebarContent({ className, ...rest }: SidebarContentProps) {
  return <div {...rest} className={cx(styles.content, className)} />;
}

SidebarContent.displayName = "SidebarContent";

export type SidebarFooterProps = React.ComponentPropsWithoutRef<"div"> & {
  variant?: "plain" | "inset";
};

function SidebarFooter({ className, variant = "plain", ...rest }: SidebarFooterProps) {
  return (
    <div
      {...rest}
      className={cx(styles.footer, className)}
      data-variant={variant === "inset" ? "inset" : undefined}
    />
  );
}

SidebarFooter.displayName = "SidebarFooter";

export type SidebarIdentityButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> & {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
};

const SidebarIdentityButton = React.forwardRef<HTMLButtonElement, SidebarIdentityButtonProps>(
  (
    { className, type = "button", leading, title, subtitle, trailing, disabled, onClick, ...rest },
    ref,
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        className={cx(styles.identityButton, className)}
        onClick={onClick}
      >
        {leading === undefined ? null : (
          <span className={styles.identityButtonLeading} aria-hidden="true">
            {leading}
          </span>
        )}
        <span className={styles.identityButtonMain}>
          <span className={styles.identityButtonTitle}>{title}</span>
          {subtitle === undefined ? null : (
            <span className={styles.identityButtonSubtitle}>{subtitle}</span>
          )}
        </span>
        <span className={styles.identityButtonTrailing} aria-hidden="true">
          {trailing ?? <ChevronsUpDown size="1em" strokeWidth={2} />}
        </span>
      </button>
    );
  },
);

SidebarIdentityButton.displayName = "SidebarIdentityButton";

export type SidebarToggleButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  openLabel?: string;
  closedLabel?: string;
};

const SidebarToggleButton = React.forwardRef<HTMLButtonElement, SidebarToggleButtonProps>(
  (
    {
      className,
      type = "button",
      openLabel = "Скрыть сайдбар",
      closedLabel = "Открыть сайдбар",
      onClick,
      ...rest
    },
    ref,
  ) => {
    const { open, toggleOpen, navPanelId } = useSidebarContext();
    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(styles.toggleButton, className)}
        aria-expanded={open}
        aria-controls={navPanelId}
        aria-label={open ? openLabel : closedLabel}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleOpen();
          }
        }}
      >
        {open ? (
          <PanelLeftClose size="1em" strokeWidth={2} />
        ) : (
          <PanelLeftOpen size="1em" strokeWidth={2} />
        )}
      </button>
    );
  },
);

SidebarToggleButton.displayName = "SidebarToggleButton";

export type SidebarGroupProps = React.ComponentPropsWithoutRef<"div">;

function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return <div {...rest} className={cx(styles.group, className)} />;
}

SidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = React.ComponentPropsWithoutRef<"div">;

function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps) {
  return <div {...rest} className={cx(styles.groupLabel, className)} />;
}

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export type SidebarMenuProps = React.ComponentPropsWithoutRef<"ul">;

function SidebarMenu({ className, ...rest }: SidebarMenuProps) {
  return <ul {...rest} className={cx(styles.menu, className)} />;
}

SidebarMenu.displayName = "SidebarMenu";

export type SidebarMenuItemProps = React.ComponentPropsWithoutRef<"li">;

function SidebarMenuItem({ className, ...rest }: SidebarMenuItemProps) {
  return <li {...rest} className={cx(styles.menuItem, className)} />;
}

SidebarMenuItem.displayName = "SidebarMenuItem";

export type SidebarMenuButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
  asChild?: boolean;
};

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, type = "button", active, asChild = false, disabled, onClick, ...rest }, ref) => {
    const cls = cx(styles.menuButton, className);
    const dataActive = active ? "true" : undefined;

    if (asChild) {
      return (
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={cls}
          data-active={dataActive}
          aria-disabled={disabled || undefined}
          onClick={
            disabled
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                }
              : onClick
          }
        />
      );
    }

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        className={cls}
        data-active={dataActive}
        onClick={onClick}
      />
    );
  },
);

SidebarMenuButton.displayName = "SidebarMenuButton";

export type SidebarMenuLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  active?: boolean;
};

const SidebarMenuLink = React.forwardRef<HTMLAnchorElement, SidebarMenuLinkProps>(
  ({ active, className, ...rest }, ref) => (
    <SidebarMenuButton asChild active={active} className={className}>
      <a {...rest} ref={ref} />
    </SidebarMenuButton>
  ),
);

SidebarMenuLink.displayName = "SidebarMenuLink";

export type SidebarMenuRouterLinkProps = React.ComponentPropsWithoutRef<typeof NavLink>;

/**
 * Пункт меню на базе React Router `NavLink` со стилями `menuButton` (активное состояние по URL).
 *
 * **Двухъярусная навигация (`ContextBar` + панель):** верхний ярус переключает `activeSection`
 * и контент `PanelSwitch`; в каждой ветке перечисляйте ссылки через `MenuRouterLink`. Удобно
 * комбинировать с {@link useSidebarNavTo}, чтобы не дублировать префикс раздела в каждом `to`.
 */
const SidebarMenuRouterLink = React.forwardRef<HTMLAnchorElement, SidebarMenuRouterLinkProps>(
  ({ className, ...rest }, ref) => (
    <NavLink
      ref={ref}
      {...rest}
      className={(navState) =>
        cx(styles.menuButton, typeof className === "function" ? className(navState) : className)
      }
    />
  ),
);
SidebarMenuRouterLink.displayName = "SidebarMenuRouterLink";

export type SidebarMenuActionProps = React.ComponentPropsWithoutRef<"button">;

const SidebarMenuAction = React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  ({ className, type = "button", ...rest }, ref) => {
    return <button {...rest} ref={ref} type={type} className={cx(styles.menuAction, className)} />;
  },
);

SidebarMenuAction.displayName = "SidebarMenuAction";

export type SidebarMenuIconProps = React.ComponentPropsWithoutRef<"span">;

function SidebarMenuIcon({ className, ...rest }: SidebarMenuIconProps) {
  return <span {...rest} className={cx(styles.menuIcon, className)} aria-hidden="true" />;
}

SidebarMenuIcon.displayName = "SidebarMenuIcon";

export type SidebarMenuLabelProps = React.ComponentPropsWithoutRef<"span">;

function SidebarMenuLabel({ className, ...rest }: SidebarMenuLabelProps) {
  return <span {...rest} className={cx(styles.menuLabel, className)} />;
}

SidebarMenuLabel.displayName = "SidebarMenuLabel";

export type SidebarMenuTrailingProps = React.ComponentPropsWithoutRef<"span">;

function SidebarMenuTrailing({ className, ...rest }: SidebarMenuTrailingProps) {
  return <span {...rest} className={cx(styles.menuTrailing, className)} aria-hidden="true" />;
}

SidebarMenuTrailing.displayName = "SidebarMenuTrailing";

export type SidebarTextProps = React.ComponentPropsWithoutRef<"span">;

function SidebarText({ className, ...rest }: SidebarTextProps) {
  return <span {...rest} className={cx(styles.text, className)} />;
}

SidebarText.displayName = "SidebarText";

export const Sidebar = {
  Root: SidebarRoot,
  ContextBar: SidebarContextBar,
  ContextBarHeader: SidebarContextBarHeader,
  ContextBarBody: SidebarContextBarBody,
  ContextBarFooter: SidebarContextBarFooter,
  ContextItemButton: SidebarContextItemButton,
  NavPanel: SidebarNavPanel,
  NavPanelBody: SidebarNavPanelBody,
  NavDocTree: SidebarNavDocTree,
  NavPanelHeading: SidebarNavPanelHeading,
  NavCategory: SidebarNavCategory,
  NavCategoryTrigger: SidebarNavCategoryTrigger,
  NavCategoryLabel: SidebarNavCategoryLabel,
  NavCategoryCount: SidebarNavCategoryCount,
  NavCategoryPanel: SidebarNavCategoryPanel,
  PanelSwitch: SidebarPanelSwitch,
  Header: SidebarHeader,
  HeaderRow: SidebarHeaderRow,
  HeaderMain: SidebarHeaderMain,
  Content: SidebarContent,
  Footer: SidebarFooter,
  IdentityButton: SidebarIdentityButton,
  ToggleButton: SidebarToggleButton,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuLink: SidebarMenuLink,
  MenuRouterLink: SidebarMenuRouterLink,
  MenuAction: SidebarMenuAction,
  MenuIcon: SidebarMenuIcon,
  MenuLabel: SidebarMenuLabel,
  MenuTrailing: SidebarMenuTrailing,
  Text: SidebarText,
};
