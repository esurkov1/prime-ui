import * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./PageToolbar.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageToolbarRootProps = DivProps;

/**
 * The panel at the top of a page: sections, tools, view options and the primary action. It lays
 * itself out from its own width — one row when wide, exactly two rows when narrow — so the slots
 * keep fixed places at any width. Parts may be left out; the JSX order is the Tab order.
 */
function PageToolbarRoot({ className, children, ref, ...rest }: PageToolbarRootProps) {
  // The chips row lives under the bar, so the bar can keep one line when wide.
  const items = React.Children.toArray(children);
  const isChips = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === PageToolbarChips;

  return (
    <div {...rest} ref={ref} className={cx(styles.root, className)}>
      <div className={styles.bar}>
        {items.filter((child) => !isChips(child))}
        {/* The forced line break of the two-row layout; hidden when one row is empty or wide. */}
        <span className={styles.break} aria-hidden="true" />
      </div>
      {items.filter(isChips)}
    </div>
  );
}
PageToolbarRoot.displayName = "PageToolbar.Root";

export type PageToolbarSectionsProps = DivProps;

/** Sections of the page — a `fullWidth` SegmentedControl; top row, stretches when narrow. */
function PageToolbarSections({ className, ...rest }: PageToolbarSectionsProps) {
  return <div {...rest} className={cx(styles.sections, className)} />;
}
PageToolbarSections.displayName = "PageToolbar.Sections";

export type PageToolbarToolsProps = DivProps;

/** Filter button and search (`SmartFilter.Toolbar`): takes the free space of its row. */
function PageToolbarTools({ className, ...rest }: PageToolbarToolsProps) {
  return <div {...rest} className={cx(styles.tools, className)} />;
}
PageToolbarTools.displayName = "PageToolbar.Tools";

export type PageToolbarViewProps = DivProps;

/** How the data is shown: period, table / cards, columns. Sized by content; alone in a row, its controls share the row. */
function PageToolbarView({ className, ...rest }: PageToolbarViewProps) {
  return <div {...rest} className={cx(styles.view, className)} />;
}
PageToolbarView.displayName = "PageToolbar.View";

export type PageToolbarActionsProps = DivProps;

/** The primary action of the page: the top row's end at every width, never wraps down. */
function PageToolbarActions({ className, ...rest }: PageToolbarActionsProps) {
  return <div {...rest} className={cx(styles.actions, className)} />;
}
PageToolbarActions.displayName = "PageToolbar.Actions";

export type PageToolbarChipsProps = DivProps;

/** Active filters (`SmartFilter.Chips`) in their own row under the panel; the row disappears when empty. */
function PageToolbarChips({ className, ...rest }: PageToolbarChipsProps) {
  return <div {...rest} className={cx(styles.chips, className)} />;
}
PageToolbarChips.displayName = "PageToolbar.Chips";

export const PageToolbar = {
  Root: PageToolbarRoot,
  Sections: PageToolbarSections,
  Tools: PageToolbarTools,
  View: PageToolbarView,
  Actions: PageToolbarActions,
  Chips: PageToolbarChips,
};
