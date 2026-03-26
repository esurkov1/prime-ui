import { ChevronsUpDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router-dom";

import { cx } from "@/internal/cx";
import { Slot } from "@/internal/slot";
import type { SidebarSize } from "@/internal/states";
import styles from "./Sidebar.module.css";
import { SidebarRoot } from "./SidebarRoot";
import { useSidebarContext } from "./sidebar-context";

export type { SidebarRootProps } from "./SidebarRoot";
export type { SidebarSize };
export { useSidebarContext };

/** @deprecated Используйте `responsive` из `Sidebar.Root`. */
export type SidebarResponsive = boolean;

export type SidebarNavPanelProps = React.ComponentPropsWithoutRef<"nav">;

function SidebarNavPanel({
  className,
  onMouseLeave,
  onPointerLeave,
  id,
  ...rest
}: SidebarNavPanelProps) {
  const { navPanelId } = useSidebarContext();
  return (
    <nav
      {...rest}
      id={id ?? navPanelId}
      className={cx(styles.navPanel, className)}
      onMouseLeave={onMouseLeave}
      onPointerLeave={onPointerLeave}
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
    const { mode, toggleOpen, navPanelId } = useSidebarContext();
    const visible = mode !== "hidden";
    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(styles.toggleButton, className)}
        aria-expanded={visible}
        aria-controls={navPanelId}
        aria-label={visible ? openLabel : closedLabel}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleOpen();
          }
        }}
      >
        {visible ? (
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

/** Пункт меню на базе React Router `NavLink` со стилями `menuButton` (активное состояние по URL). */
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
  NavPanel: SidebarNavPanel,
  NavPanelBody: SidebarNavPanelBody,
  NavDocTree: SidebarNavDocTree,
  NavPanelHeading: SidebarNavPanelHeading,
  NavCategory: SidebarNavCategory,
  NavCategoryTrigger: SidebarNavCategoryTrigger,
  NavCategoryLabel: SidebarNavCategoryLabel,
  NavCategoryCount: SidebarNavCategoryCount,
  NavCategoryPanel: SidebarNavCategoryPanel,
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
