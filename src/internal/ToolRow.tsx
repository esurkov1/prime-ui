import * as React from "react";

import { Datepicker, type DatepickerRootProps } from "@/components/datepicker/Datepicker";
import { Input } from "@/components/input/Input";
import {
  SegmentedControl,
  type SegmentedControlRootProps,
} from "@/components/segmented-control/SegmentedControl";
import { Select } from "@/components/select/Select";
import { SmartFilter } from "@/components/smart-filter/SmartFilter";
import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";
import { flattenChildren, isPart } from "@/internal/parts";

import styles from "./ToolRow.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

/** How a tool takes room in the row (see `ToolRow.module.css`). */
type ToolKind = "grow" | "share" | "fixed";

type ToolGroupProps = DivProps;

/**
 * A host's own items kept together in one cell that takes the free room (the Gantt's legend or
 * title before its zoom): they wrap inside it.
 */
export function ToolGroup({ className, ...rest }: ToolGroupProps) {
  return <div {...rest} className={cx(styles.group, className)} />;
}

type ToolCellProps = DivProps;

/**
 * A cell the host draws itself, standing in the row as given: a part that comes and goes takes its
 * presence (`usePartPresence`) on the cell, so the row closes up when it leaves. A fixed cell.
 */
export function ToolCell({ className, ...rest }: ToolCellProps) {
  return <div {...rest} className={cx(styles.cell, className)} data-kind="fixed" />;
}

function kindOf(node: React.ReactNode): ToolKind {
  if (
    isPart(node, SmartFilter.Toolbar) ||
    isPart(node, Input.Root) ||
    isPart(node, Typography) ||
    isPart(node, ToolGroup)
  ) {
    return "grow";
  }
  if (
    isPart(node, SegmentedControl.Root) ||
    isPart(node, Datepicker.Root) ||
    isPart(node, Select.Root)
  ) {
    return "share";
  }
  return "fixed";
}

/** A SegmentedControl or a Datepicker fills its cell unless `fullWidth` is set. */
function filled(node: React.ReactNode): React.ReactNode {
  const fills =
    (isPart<SegmentedControlRootProps>(node, SegmentedControl.Root) ||
      isPart<DatepickerRootProps>(node, Datepicker.Root)) &&
    node.props.fullWidth === undefined;
  return fills
    ? React.cloneElement(node as React.ReactElement<{ fullWidth?: boolean }>, { fullWidth: true })
    : node;
}

const keyOf = (node: React.ReactNode, index: number) =>
  React.isValidElement(node) && node.key != null ? String(node.key) : `#${index}`;

type ToolRowProps = DivProps & {
  /** The row has a line of its own: it wraps and its cells fill it by kind. Off — one line, every cell at its natural width. */
  fill?: boolean;
  /** The edge a filled row gathers its cells at: `end` — tools of the content; `start` — a section's sub-pages under its title. */
  align?: "start" | "end";
};

/**
 * A row of tools as written, each in a cell of its kind: a search grows, switchers and pickers
 * keep their content width beside it and fill a short line, buttons keep their width at the end.
 */
export function ToolRow({
  fill = true,
  align = "end",
  className,
  children,
  ...rest
}: ToolRowProps) {
  return (
    <div
      {...rest}
      className={cx(styles.row, className)}
      data-fill={fill ? "true" : undefined}
      data-align={align === "start" ? "start" : undefined}
    >
      {flattenChildren(children).map((item, index) =>
        isPart(item, ToolCell) ? (
          React.cloneElement(item, { key: keyOf(item, index) })
        ) : (
          <div key={keyOf(item, index)} className={styles.cell} data-kind={kindOf(item)}>
            {filled(item)}
          </div>
        ),
      )}
    </div>
  );
}

type ToolChipsProps = DivProps;

/** The applied filters (`SmartFilter.Chips`) on a line of their own under a tool row; gone while empty. */
export function ToolChips({ className, ...rest }: ToolChipsProps) {
  return <div {...rest} className={cx(styles.chips, className)} />;
}
