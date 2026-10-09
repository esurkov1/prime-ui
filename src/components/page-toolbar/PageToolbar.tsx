import * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./PageToolbar.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageToolbarRootProps = DivProps;

/**
 * The panel at the top of a page: search and filter, sections, view options and the primary
 * action, with the active filters right under the search. It lays itself out from its own width —
 * one row when wide, stacked rows when narrow — so the slots keep fixed places at any width. Parts
 * may be left out; the JSX order is the Tab order.
 */
function PageToolbarRoot({ className, children, ref, ...rest }: PageToolbarRootProps) {
  // The chips row lives under the bar, so the bar can keep one line when wide. The root is the
  // size container; the layout inside it is what the container query restyles.
  const items = React.Children.toArray(children);
  const isChips = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === PageToolbarChips;

  return (
    <div {...rest} ref={ref} className={cx(styles.root, className)}>
      <div className={styles.layout}>
        <div className={styles.bar}>{items.filter((child) => !isChips(child))}</div>
        {items.filter(isChips)}
      </div>
    </div>
  );
}
PageToolbarRoot.displayName = "PageToolbar.Root";

export type PageToolbarSectionsProps = DivProps;

/** Sections of the page — a `fullWidth` SegmentedControl; after the Tools when wide, a full row under the chips when narrow. */
function PageToolbarSections({ className, ...rest }: PageToolbarSectionsProps) {
  return <div {...rest} className={cx(styles.sections, className)} />;
}
PageToolbarSections.displayName = "PageToolbar.Sections";

export type PageToolbarToolsProps = DivProps;

/** Search and filter button (`SmartFilter.Toolbar`): the first slot and the stretchy one, the Chips sit right under it. */
function PageToolbarTools({ className, ...rest }: PageToolbarToolsProps) {
  return <div {...rest} className={cx(styles.tools, className)} />;
}
PageToolbarTools.displayName = "PageToolbar.Tools";

export type PageToolbarViewProps = DivProps;

/** How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it. */
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

/** Active filters (`SmartFilter.Chips`) in their own row right under the search; the row disappears when empty. */
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
