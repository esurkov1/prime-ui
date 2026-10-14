import * as React from "react";

import { Button } from "@/components/button/Button";
import { Divider, type DividerProps } from "@/components/divider/Divider";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { stickySurfaceClass } from "@/internal/sticky";
import textRole from "@/internal/textRole.module.css";

import styles from "./AppHeader.module.css";

export type AppHeaderLabels = {
  /** Name of the menu button that opens the off-canvas Sidebar. */
  menu: string;
};

export const APP_HEADER_LABELS: AppHeaderLabels = {
  menu: "Открыть меню",
};

const LabelsContext = React.createContext<AppHeaderLabels>(APP_HEADER_LABELS);

type HeaderProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type AppHeaderRootProps = HeaderProps & {
  labels?: Partial<AppHeaderLabels>;
};

/**
 * The page's bar at the very top of the content panel: its row holds only what the current page
 * needs — the page title, the page's tools, per-page buttons. One row as high as the Sidebar brand
 * row, so the two read as one line; sticky; lays itself out from its own width (narrow: the
 * description goes, the title truncates).
 */
function AppHeaderRoot({ labels, className, children, ...rest }: AppHeaderRootProps) {
  const value = React.useMemo(() => ({ ...APP_HEADER_LABELS, ...labels }), [labels]);
  // The page tools are the header's second row, under the title row.
  const items = React.Children.toArray(children);
  const isTools = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppHeaderTools;
  return (
    <LabelsContext.Provider value={value}>
      <ControlSizeProvider value="m">
        <header {...rest} className={cx(styles.root, stickySurfaceClass, className)}>
          <div className={styles.row}>{items.filter((child) => !isTools(child))}</div>
          {items.filter(isTools)}
        </header>
      </ControlSizeProvider>
    </LabelsContext.Provider>
  );
}
AppHeaderRoot.displayName = "AppHeader.Root";

export type AppHeaderStartProps = DivProps;

/** The leading zone: the menu button, a back button, the title or breadcrumbs. Takes the free width. */
function AppHeaderStart({ className, ...rest }: AppHeaderStartProps) {
  return <div {...rest} className={cx(styles.start, className)} />;
}
AppHeaderStart.displayName = "AppHeader.Start";

export type AppHeaderTitleProps = DivProps;

/**
 * Where you are: an optional `AppHeader.Icon`, the name and an optional `AppHeader.Description`
 * under it — the same anatomy as the Sidebar brand. The name is the page's `<h1>` (an app page
 * titles itself in the header); the description stays outside the heading's name. The name
 * truncates.
 */
function AppHeaderTitle({ className, children, ...rest }: AppHeaderTitleProps) {
  const items = React.Children.toArray(children);
  const isIcon = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppHeaderIcon;
  const isDescription = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === AppHeaderDescription;
  const icon = items.filter(isIcon);
  const description = items.filter(isDescription);
  const name = items.filter((child) => !isIcon(child) && !isDescription(child));

  return (
    <div {...rest} className={cx(styles.title, className)}>
      {icon}
      <div className={styles.titleText}>
        <h1 className={cx(textRole.titleS, styles.titleName)}>{name}</h1>
        {description}
      </div>
    </div>
  );
}
AppHeaderTitle.displayName = "AppHeader.Title";

export type AppHeaderIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Decorative glyph before the title on a tile shaped like the bar's soft buttons (control m).
 * Not a Thumbnail: its tiers (32 · 40) miss the control height the buttons beside it have.
 */
function AppHeaderIcon({ className, ...rest }: AppHeaderIconProps) {
  return <span aria-hidden="true" {...rest} className={cx(styles.icon, className)} />;
}
AppHeaderIcon.displayName = "AppHeader.Icon";

export type AppHeaderDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Muted second line under the title (a workspace, a period); hidden on a narrow header. */
function AppHeaderDescription({ className, ...rest }: AppHeaderDescriptionProps) {
  return <span {...rest} className={cx(textRole.caption, styles.description, className)} />;
}
AppHeaderDescription.displayName = "AppHeader.Description";

export type AppHeaderSeparatorProps = Omit<DividerProps, "orientation" | "children">;

/** A short vertical line between groups in a zone (a back button | the path), with air on both sides. */
function AppHeaderSeparator({ className, ...rest }: AppHeaderSeparatorProps) {
  return <Divider {...rest} orientation="vertical" className={cx(styles.separator, className)} />;
}
AppHeaderSeparator.displayName = "AppHeader.Separator";

export type AppHeaderToolsProps = DivProps;

/**
 * The page's tools in the header — a `PageToolbar.Root` (sections, period, filters, the primary
 * action): the header's second row, the full width under the title row, so the toolbar lays
 * itself out from that width (one row when wide, two when narrow). Root moves it there wherever
 * it is written.
 */
function AppHeaderTools({ className, ...rest }: AppHeaderToolsProps) {
  return <div {...rest} className={cx(styles.tools, className)} />;
}
AppHeaderTools.displayName = "AppHeader.Tools";

export type AppHeaderActionsProps = DivProps;

/** Buttons at the end: one primary action, notifications, the account. Never wraps. */
function AppHeaderActions({ className, ...rest }: AppHeaderActionsProps) {
  return <div {...rest} className={cx(styles.actions, className)} />;
}
AppHeaderActions.displayName = "AppHeader.Actions";

export type AppHeaderMenuButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  /**
   * `narrow` (default): shown below 768px, where an `offCanvas="auto"` Sidebar leaves the layout;
   * `always`: on every width (`offCanvas="always"`).
   */
  show?: "narrow" | "always";
  ref?: React.Ref<HTMLButtonElement>;
};

/** Opens the off-canvas Sidebar: an icon button named by `labels.menu`; wire `onClick` and `aria-expanded`. */
function AppHeaderMenuButton({ show = "narrow", className, ...rest }: AppHeaderMenuButtonProps) {
  const labels = React.useContext(LabelsContext);
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      aria-label={labels.menu}
      {...rest}
      className={cx(styles.menuButton, className)}
      {...toDataAttributes({ show })}
    >
      <Button.Icon>
        <Icon name="nav.menu" />
      </Button.Icon>
    </Button.Root>
  );
}
AppHeaderMenuButton.displayName = "AppHeader.MenuButton";

export const AppHeader = {
  Root: AppHeaderRoot,
  Start: AppHeaderStart,
  Title: AppHeaderTitle,
  Icon: AppHeaderIcon,
  Description: AppHeaderDescription,
  Separator: AppHeaderSeparator,
  Tools: AppHeaderTools,
  Actions: AppHeaderActions,
  MenuButton: AppHeaderMenuButton,
};
