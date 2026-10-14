import type * as React from "react";

import { cx } from "@/internal/cx";
import { namedRole } from "@/internal/namedRole";
import { flattenChildren, isPart } from "@/internal/parts";

import styles from "./PageToolbar.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageToolbarRootProps = DivProps;

/**
 * The panel at the top of a page: search and filter, sections, view options and the primary
 * action, with the active filters under the top row. It lays itself out from its own width — one
 * row when wide, stacked rows when narrow — so the slots keep fixed places at any width. Parts may
 * be left out; whatever the JSX order, the DOM (and Tab) order is Tools, Sections, View, Actions,
 * Chips. Named (`aria-label`), it is a `group`.
 */
function PageToolbarRoot({ className, children, ref, ...rest }: PageToolbarRootProps) {
  // The chips row lives under the bar, so the bar can keep one line when wide. The root is the
  // size container; the layout inside it is what the container query restyles.
  const items = flattenChildren(children);
  const of = (Part: React.ElementType) => items.filter((child) => isPart(child, Part));
  const other = items.filter(
    (child) => !SLOT_ORDER.some((Part) => isPart(child, Part)) && !isPart(child, PageToolbarChips),
  );

  return (
    <div {...rest} ref={ref} role={namedRole(rest, "group")} className={cx(styles.root, className)}>
      <div className={styles.layout}>
        <div className={styles.bar}>
          {SLOT_ORDER.flatMap(of)}
          {other}
        </div>
        {of(PageToolbarChips)}
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

/** Search and filter button (`SmartFilter.Toolbar`): the first slot and the stretchy one; the Chips sit under the top row. */
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

/** Active filters (`SmartFilter.Chips`) in their own row under the top row; the row disappears when empty. */
function PageToolbarChips({ className, ...rest }: PageToolbarChipsProps) {
  return <div {...rest} className={cx(styles.chips, className)} />;
}
PageToolbarChips.displayName = "PageToolbar.Chips";

/** The DOM and Tab order of the bar's slots: the reading order of the wide layout. */
const SLOT_ORDER: React.ElementType[] = [
  PageToolbarTools,
  PageToolbarSections,
  PageToolbarView,
  PageToolbarActions,
];

export const PageToolbar = {
  Root: PageToolbarRoot,
  Sections: PageToolbarSections,
  Tools: PageToolbarTools,
  View: PageToolbarView,
  Actions: PageToolbarActions,
  Chips: PageToolbarChips,
};
