import {
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router-dom";

import { Divider } from "@/components/divider/Divider";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";
import { Slot } from "@/internal/slot";
import type { SidebarSize } from "@/internal/states";

import styles from "./Sidebar.module.css";
import { SidebarRoot, type SidebarRootProps } from "./SidebarRoot";
import { useSidebarContext } from "./sidebar-context";
import type { SidebarLayoutMode } from "./sidebarLayout";

export type { SidebarLayoutMode, SidebarRootProps, SidebarSize };
export { useSidebarContext };

/** @deprecated Используйте `responsive` из `Sidebar.Root`. */
export type SidebarResponsive = boolean;

const SidebarComposedRoot = SidebarRoot;

export type SidebarNavPanelProps = React.ComponentPropsWithoutRef<"nav">;

function SidebarNavPanel({ className, id, ...rest }: SidebarNavPanelProps) {
  const { navPanelId } = useSidebarContext();

  return (
    <nav
      {...rest}
      id={id ?? navPanelId}
      className={cx(styles.navPanel, className)}
      aria-label={rest["aria-label"] ?? "Sidebar navigation"}
    />
  );
}

SidebarNavPanel.displayName = "SidebarNavPanel";

export type SidebarHeaderProps = React.ComponentPropsWithoutRef<"header">;

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return <header {...rest} className={cx(styles.header, className)} />;
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

export type SidebarContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof ScrollContainer>,
  "as"
>;

function SidebarContent({ className, axis = "vertical", ...rest }: SidebarContentProps) {
  return (
    <ScrollContainer
      {...rest}
      axis={axis}
      className={cx(styles.content, className)}
      overscrollBehavior="contain"
    />
  );
}

SidebarContent.displayName = "SidebarContent";

export type SidebarFooterProps = React.ComponentPropsWithoutRef<"footer"> & {
  variant?: "plain" | "inset";
};

function SidebarFooter({ className, variant = "plain", ...rest }: SidebarFooterProps) {
  return (
    <footer
      {...rest}
      className={cx(styles.footer, className, variant === "inset" && styles.footerInset)}
    />
  );
}

SidebarFooter.displayName = "SidebarFooter";

export type SidebarTextProps = React.ComponentPropsWithoutRef<"span">;

function SidebarText({ className, ...rest }: SidebarTextProps) {
  return <span {...rest} className={cx(styles.text, className)} />;
}

SidebarText.displayName = "SidebarText";

export type SidebarToggleButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children" | "aria-label"
> & {
  openLabel?: string;
  closedLabel?: string;
  placement?: "inline" | "edge";
};

function iconForToggle(state: SidebarLayoutMode, side: "left" | "right") {
  if (side === "left") {
    return state === "hidden" ? <PanelLeftOpen size="1em" /> : <PanelLeftClose size="1em" />;
  }
  return state === "hidden" ? <PanelRightOpen size="1em" /> : <PanelRightClose size="1em" />;
}

const SidebarToggleButton = React.forwardRef<HTMLButtonElement, SidebarToggleButtonProps>(
  (
    {
      className,
      openLabel = "Скрыть сайдбар",
      closedLabel = "Открыть сайдбар",
      placement = "inline",
      ...rest
    },
    ref,
  ) => {
    const { state, toggleOpen, navPanelId, side } = useSidebarContext();
    const expanded = state !== "hidden";

    return (
      <button
        {...rest}
        ref={ref}
        type={rest.type ?? "button"}
        className={cx(styles.toggleButton, className)}
        aria-expanded={expanded}
        aria-controls={navPanelId}
        aria-label={expanded ? openLabel : closedLabel}
        data-placement={placement}
        onClick={(event) => {
          rest.onClick?.(event);
          if (!event.defaultPrevented) {
            toggleOpen();
          }
        }}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          {iconForToggle(state, side)}
        </span>
      </button>
    );
  },
);

SidebarToggleButton.displayName = "SidebarToggleButton";

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
    const { size: _size } = useSidebarContext();
    void _size;

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cx(styles.identityButton, className)}
        aria-label={typeof title === "string" ? title : rest["aria-label"]}
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

export type SidebarGroupProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: React.ReactNode;
  action?: React.ReactNode;
};

function SidebarGroup({ className, title, action, children, ...rest }: SidebarGroupProps) {
  return (
    <section {...rest} className={cx(styles.group, className)}>
      {title !== undefined ? (
        <div className={styles.groupHeader}>
          <Typography.Root as="h3" variant="body-small" tone="muted" className={styles.groupLabel}>
            {title}
          </Typography.Root>
          {action === undefined ? null : <div className={styles.groupHeaderAction}>{action}</div>}
        </div>
      ) : null}
      {children}
    </section>
  );
}

SidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = React.ComponentPropsWithoutRef<"div">;

function SidebarGroupLabel({ className, children, ...rest }: SidebarGroupLabelProps) {
  return (
    <Typography.Root
      as="div"
      variant="body-small"
      tone="muted"
      className={cx(styles.groupLabel, className)}
      {...rest}
    >
      {children}
    </Typography.Root>
  );
}

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export type SidebarSeparatorProps = React.ComponentPropsWithoutRef<typeof Divider.Root>;

function SidebarSeparator({ className, variant = "line-spacing", ...rest }: SidebarSeparatorProps) {
  return <Divider.Root {...rest} variant={variant} className={cx(styles.separator, className)} />;
}

SidebarSeparator.displayName = "SidebarSeparator";

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

export type SidebarMenuActionProps = React.ComponentPropsWithoutRef<"button"> & {
  children?: React.ReactNode;
};

const SidebarMenuAction = React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  ({ className, children, type = "button", ...rest }, ref) => {
    return (
      <button {...rest} ref={ref} type={type} className={cx(styles.menuAction, className)}>
        {children}
      </button>
    );
  },
);

SidebarMenuAction.displayName = "SidebarMenuAction";

export type SidebarMenuButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
  asChild?: boolean;
};

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, active, asChild = false, disabled, onClick, type = "button", ...rest }, ref) => {
    if (asChild) {
      return (
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={cx(styles.menuButton, className)}
          data-active={active ? "true" : undefined}
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
        className={cx(styles.menuButton, className)}
        data-active={active ? "true" : undefined}
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

const SidebarMenuRouterLink = React.forwardRef<HTMLAnchorElement, SidebarMenuRouterLinkProps>(
  ({ className, ...rest }, ref) => {
    if (typeof className === "function") {
      return (
        <NavLink
          ref={ref}
          {...rest}
          className={(navState) =>
            cx(styles.menuButton, navState.isActive && styles.menuButtonActive, className(navState))
          }
        />
      );
    }

    return <NavLink ref={ref} {...rest} className={cx(styles.menuButton, className)} />;
  },
);

SidebarMenuRouterLink.displayName = "SidebarMenuRouterLink";

export type SidebarItemProps = Omit<SidebarMenuButtonProps, "children"> & {
  icon?: React.ReactNode;
  label: React.ReactNode;
  trailing?: React.ReactNode;
  tooltip?: React.ReactNode | boolean;
};

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, label, trailing, tooltip = true, active, ...rest }, ref) => {
    const { state, isMobile, side } = useSidebarContext();
    const compact = state === "compact" && !isMobile;
    const showTooltip = compact && tooltip !== false;

    const node = (
      <SidebarMenuButton
        {...rest}
        ref={ref}
        active={active}
        className={cx(styles.itemButton, className)}
      >
        {icon === undefined ? null : <SidebarMenuIcon>{icon}</SidebarMenuIcon>}
        <SidebarMenuLabel>{label}</SidebarMenuLabel>
        {trailing === undefined ? null : <SidebarMenuTrailing>{trailing}</SidebarMenuTrailing>}
      </SidebarMenuButton>
    );

    if (!showTooltip) return node;

    return (
      <Tooltip.Root>
        <Tooltip.Trigger>{node}</Tooltip.Trigger>
        <Tooltip.Content side={side === "left" ? "right" : "left"}>
          {tooltip === true ? label : tooltip}
        </Tooltip.Content>
      </Tooltip.Root>
    );
  },
);

SidebarItem.displayName = "SidebarItem";

export type SidebarNavPanelBodyProps = React.ComponentPropsWithoutRef<typeof ScrollContainer>;

function SidebarNavPanelBody({ className, axis = "vertical", ...rest }: SidebarNavPanelBodyProps) {
  return (
    <ScrollContainer
      {...rest}
      axis={axis}
      className={cx(styles.navPanelBody, className)}
      overscrollBehavior="contain"
    />
  );
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
>(({ className, type = "button", children, ...rest }, ref) => (
  <button ref={ref} type={type} className={cx(styles.navCategoryTrigger, className)} {...rest}>
    {children}
  </button>
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

export type SidebarMenuSlotButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
  asChild?: boolean;
};

const SidebarMenuSlotButton = React.forwardRef<HTMLButtonElement, SidebarMenuSlotButtonProps>(
  ({ className, active, asChild = false, disabled, onClick, type = "button", ...rest }, ref) => {
    const cls = cx(styles.menuButton, className, active && styles.menuButtonActive);

    if (asChild) {
      return (
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={cls}
          data-active={active ? "true" : undefined}
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
        data-active={active ? "true" : undefined}
        onClick={onClick}
      />
    );
  },
);

SidebarMenuSlotButton.displayName = "SidebarMenuSlotButton";

export const Sidebar = Object.assign(SidebarComposedRoot, {
  Root: SidebarComposedRoot,
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
  ToggleButton: SidebarToggleButton,
  IdentityButton: SidebarIdentityButton,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Separator: SidebarSeparator,
  Item: SidebarItem,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuLink: SidebarMenuLink,
  MenuRouterLink: SidebarMenuRouterLink,
  MenuAction: SidebarMenuAction,
  MenuIcon: SidebarMenuIcon,
  MenuLabel: SidebarMenuLabel,
  MenuTrailing: SidebarMenuTrailing,
  MenuSlotButton: SidebarMenuSlotButton,
  Text: SidebarText,
});
