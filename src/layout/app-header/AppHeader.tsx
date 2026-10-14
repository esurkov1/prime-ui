import * as React from "react";

import { Button } from "@/components/button/Button";
import { Divider, type DividerProps } from "@/components/divider/Divider";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import {
  type OutletStore,
  useMovedToOutlet,
  useOutletEntries,
  useOutletStore,
} from "@/internal/slot";
import { stickySurfaceClass } from "@/internal/sticky";
import textRole from "@/internal/textRole.module.css";
import { useAppShellHeaderOutlet, useAppShellNav } from "@/layout/app-shell/AppShell";

import styles from "./AppHeader.module.css";

export type AppHeaderLabels = {
  /** Name of the menu button that opens the off-canvas Sidebar. */
  menu: string;
};

export const APP_HEADER_LABELS: AppHeaderLabels = {
  menu: "Открыть меню",
};

const LabelsContext = React.createContext<AppHeaderLabels>(APP_HEADER_LABELS);

/**
 * The menu button of a header: a part placed by the consumer claims the place, else the bar draws
 * one itself at the start of its row.
 */
const MenuClaimContext = React.createContext<(() => () => void) | null>(null);

/** The outlet of the header's second row: `AppHeader.Tools` written inside a wrapper moves there. */
const ToolsOutletContext = React.createContext<OutletStore | null>(null);

type HeaderProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type AppHeaderRootProps = HeaderProps & {
  labels?: Partial<AppHeaderLabels>;
};

/**
 * The page's bar at the very top of the content panel: a title row as high as the Sidebar brand
 * row (so the two read as one line) with only what the current page needs — the page title, the
 * page's own buttons — and the page tools (`AppHeader.Tools`) as a second row under it. Sticky;
 * lays itself out from its own width (narrow: the title icon goes, the title and its line of data
 * truncate). Inside an `AppShell` a header the page renders moves into the shell's header row, and
 * while the Sidebar is off-canvas the row starts with the menu button that opens it.
 */
function AppHeaderRoot(props: AppHeaderRootProps) {
  const outlet = useAppShellHeaderOutlet();
  if (outlet) return <MovingHeader outlet={outlet} {...props} />;
  return <HeaderBar {...props} />;
}
AppHeaderRoot.displayName = "AppHeader.Root";

/** A header written inside a shell: it renders in the shell's header row. */
function MovingHeader({ outlet, ...props }: AppHeaderRootProps & { outlet: OutletStore }) {
  const bar = <HeaderBar {...props} />;
  const moved = useMovedToOutlet(outlet, bar);
  return moved ? null : bar;
}

function HeaderBar({ labels: labelsProp, className, children, ...rest }: AppHeaderRootProps) {
  const labels = useLabels(APP_HEADER_LABELS, labelsProp);
  const nav = useAppShellNav();
  const [claims, setClaims] = React.useState(0);
  const claim = React.useCallback(() => {
    setClaims((count) => count + 1);
    return () => setClaims((count) => count - 1);
  }, []);

  // The page tools are the header's second row, after the title row in the DOM and the Tab order:
  // written directly (or in a fragment) they are placed at once; inside a wrapper they move.
  const tools = useOutletStore();
  const { parts: placedTools, rest: row } = splitParts(flattenChildren(children), AppHeaderTools);
  // The menu button the bar draws itself leads the start zone (or the row without one).
  const menu = nav?.offCanvas && claims === 0 ? <MenuButtonBody /> : null;
  const startsRow = row.some((node) => isPart(node, AppHeaderStart));

  return (
    <LabelsContext.Provider value={labels}>
      <MenuClaimContext.Provider value={claim}>
        <AutoMenuContext.Provider value={startsRow ? menu : null}>
          <ControlSizeProvider value="m">
            <header {...rest} className={cx(styles.root, stickySurfaceClass, className)}>
              <ToolsOutletContext.Provider value={tools}>
                <div className={styles.row}>
                  {startsRow ? null : menu}
                  {row}
                </div>
              </ToolsOutletContext.Provider>
              {placedTools}
              <MovedTools store={tools} />
            </header>
          </ControlSizeProvider>
        </AutoMenuContext.Provider>
      </MenuClaimContext.Provider>
    </LabelsContext.Provider>
  );
}

/**
 * The tools that moved out of the title row. A leaf of its own: an update of a moved part
 * re-renders it alone, never the bar around the part.
 */
function MovedTools({ store }: { store: OutletStore }) {
  return useOutletEntries(store).map(({ id, node }) => (
    <React.Fragment key={id}>{node}</React.Fragment>
  ));
}

/** The menu button the bar draws itself, for the start zone to lead with. */
const AutoMenuContext = React.createContext<React.ReactNode>(null);

export type AppHeaderStartProps = DivProps;

/** The leading zone: the menu button, a back button, the title or breadcrumbs. Takes the free width. */
function AppHeaderStart({ className, children, ...rest }: AppHeaderStartProps) {
  const menu = React.useContext(AutoMenuContext);
  return (
    <div {...rest} className={cx(styles.start, className)}>
      {menu}
      {children}
    </div>
  );
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
  const { parts: icon, rest: text } = splitParts(children, AppHeaderIcon);
  const { parts: description, rest: name } = splitParts(text, AppHeaderDescription);

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
  return (
    <span aria-hidden="true" {...rest} className={cx(styles.icon, iconSlotClass, className)} />
  );
}
AppHeaderIcon.displayName = "AppHeader.Icon";

export type AppHeaderDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Muted line of data under the title (a period, a count); on a narrow header it truncates. */
function AppHeaderDescription({ className, ...rest }: AppHeaderDescriptionProps) {
  return <span {...rest} className={cx(textRole.caption, styles.description, className)} />;
}
AppHeaderDescription.displayName = "AppHeader.Description";

export type AppHeaderSeparatorProps = Omit<
  DividerProps,
  "orientation" | "children" | "align" | "size" | "inset"
>;

/**
 * A short vertical line between groups in a zone (a back button | the path), with air on both
 * sides: the inset vertical Divider, one text line tall.
 */
function AppHeaderSeparator({ className, ...rest }: AppHeaderSeparatorProps) {
  return <Divider {...rest} orientation="vertical" inset className={className} />;
}
AppHeaderSeparator.displayName = "AppHeader.Separator";

export type AppHeaderToolsProps = DivProps;

/**
 * The page's tools in the header — a `PageToolbar.Root` (sections, period, filters, the primary
 * action): the header's second row, the full width under the title row, so the toolbar lays
 * itself out from that width (one row when wide, two when narrow). Root places it there wherever
 * it is written — directly, in a fragment or inside a component of the page.
 */
function AppHeaderTools(props: AppHeaderToolsProps) {
  const outlet = React.useContext(ToolsOutletContext);
  if (outlet) return <MovingTools outlet={outlet} {...props} />;
  return <ToolsRow {...props} />;
}
AppHeaderTools.displayName = "AppHeader.Tools";

function ToolsRow({ className, ...rest }: AppHeaderToolsProps) {
  return <div {...rest} className={cx(styles.tools, className)} />;
}

/** Tools written inside the title row (in a wrapper): they render in the second row. */
function MovingTools({ outlet, ...props }: AppHeaderToolsProps & { outlet: OutletStore }) {
  const row = <ToolsRow {...props} />;
  const moved = useMovedToOutlet(outlet, row);
  return moved ? null : row;
}

export type AppHeaderActionsProps = DivProps;

/** Buttons at the end: one primary action, notifications, the account. Never wraps. */
function AppHeaderActions({ className, ...rest }: AppHeaderActionsProps) {
  return <div {...rest} className={cx(styles.actions, className)} />;
}
AppHeaderActions.displayName = "AppHeader.Actions";

export type AppHeaderMenuButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children" | "aria-expanded" | "aria-controls"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Opens the off-canvas Sidebar of the shell: an icon button named by `labels.menu`, with
 * `aria-expanded` and `aria-controls` from the shell. The bar draws one itself; this part moves it
 * to another place in the header. Renders nothing while the Sidebar is a rail on screen, or
 * outside a shell with a Sidebar.
 */
function AppHeaderMenuButton(props: AppHeaderMenuButtonProps) {
  const claim = React.useContext(MenuClaimContext);
  React.useLayoutEffect(() => claim?.(), [claim]);
  return <MenuButtonBody {...props} />;
}
AppHeaderMenuButton.displayName = "AppHeader.MenuButton";

function MenuButtonBody({ className, onClick, ...rest }: AppHeaderMenuButtonProps) {
  const labels = React.useContext(LabelsContext);
  const nav = useAppShellNav();
  if (!nav?.offCanvas) return null;
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      aria-label={labels.menu}
      {...rest}
      aria-expanded={nav.open}
      aria-controls={nav.navId}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) nav.setOpen(!nav.open);
      }}
    >
      <Button.Icon>
        <Icon name="nav.menu" />
      </Button.Icon>
    </Button.Root>
  );
}

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
