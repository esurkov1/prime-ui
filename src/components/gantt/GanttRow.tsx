// biome-ignore-all lint/a11y/useSemanticElements: an ARIA grid of divs (see Gantt.tsx)
// biome-ignore-all lint/a11y/useFocusableInteractive: rows and cells are not focus stops; the row header and bars are
import type { Locale } from "date-fns";
import * as React from "react";

import { isPlainClick, opensRow } from "@/components/data-table/rowEvents";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";

import styles from "./Gantt.module.css";
import { GanttBarView } from "./GanttBar";
import {
  daysBetween,
  formatSpan,
  type GanttBar,
  type GanttDates,
  type GanttScale,
} from "./ganttModel";

/** A bar being created: drawn by the pointer, waiting for `onBarCreate`, or fading after a refusal. */
export type GanttGhost = {
  id: string;
  dates: GanttDates;
  status: "drawing" | "pending" | "leaving";
};

export type GanttTrackEvent =
  | "pointerDown"
  | "pointerMove"
  | "pointerUp"
  | "pointerCancel"
  | "pointerLeave"
  | "contextMenu"
  | "doubleClick";

/**
 * Stable callbacks from the chart to its rows. They read the chart's latest state themselves, so a
 * row re-renders only when its own props change — scrolling mounts new rows and leaves the rest.
 */
export type GanttRowContext = {
  register: (id: string) => React.RefCallback<HTMLElement>;
  focus: (id: string) => void;
  open: (barId: string, rowIndex: number) => void;
  /** `onRowClick` of the row at `rowIndex`. */
  openRow: (
    rowIndex: number,
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  commit: (barId: string, rowIndex: number, dates: GanttDates) => void;
  nameFor: (bar: GanttBar, dates: GanttDates) => string;
  formatDuration: (days: number) => string;
  track: (event: GanttTrackEvent, rowIndex: number, native: React.SyntheticEvent) => void;
  registerTip: (id: string, close: (() => void) | null) => void;
  /** Whether enough of the cell is visible on the timeline for a tooltip to point at it. */
  canShowTip: (id: string) => boolean;
  onDragChange: (id: string, dragging: boolean) => void;
  dayPx: () => number;
  direction: () => 1 | -1;
  scrollLeft: () => number;
  autoScroll: { follow: (clientX: number, onScrolled: () => void) => void; stop: () => void };
};

export type GanttRowProps = {
  ctx: GanttRowContext;
  index: number;
  rowKey: React.Key;
  navId: string;
  label: string;
  bars: readonly GanttBar[];
  lanes: ReadonlyMap<string, number>;
  laneCount: number;
  top: number;
  measureRef: (node: HTMLElement | null) => void;
  /** The row's data and the first-column renderers (stable while the chart's props are). */
  row: unknown;
  renderRow?: (row: unknown) => React.ReactNode;
  renderRowAvatar?: (row: unknown) => React.ReactNode;
  renderBarTooltip?: (bar: GanttBar, row: unknown) => React.ReactNode;
  /** `getRowHref(row)`: the header is a link. */
  href: string | undefined;
  /** `onRowClick` is set: the header opens the row. */
  clickable: boolean;
  ghost: GanttGhost | undefined;
  ghostLane: number;
  hover: { x: number; span: number } | null;
  /** The chart's tab stop when it is in this row, else `null`. */
  tabStop: string | null;
  pending: ReadonlyMap<string, GanttDates>;
  dragging: ReadonlySet<string>;
  /** Visible time window in days (`from` > `to` — no window yet: render every bar). */
  windowFrom: number;
  windowTo: number;
  scale: GanttScale;
  rangeStart: number;
  locale: Locale;
  newBarLabel: string;
  editableAtAll: boolean;
  creatable: boolean;
  hintId: string;
  createHintId: string;
};

function GanttRowView({
  ctx,
  index,
  navId,
  label,
  bars,
  lanes,
  laneCount,
  top,
  measureRef,
  row,
  renderRow,
  renderRowAvatar,
  renderBarTooltip,
  href,
  clickable,
  ghost,
  ghostLane,
  hover,
  tabStop,
  pending,
  dragging,
  windowFrom,
  windowTo,
  scale,
  rangeStart,
  locale,
  newBarLabel,
  editableAtAll,
  creatable,
  hintId,
  createHintId,
}: GanttRowProps) {
  const start = new Date(rangeStart);
  const windowed = windowFrom <= windowTo;
  const on = (event: GanttTrackEvent) => (native: React.SyntheticEvent) =>
    ctx.track(event, index, native);

  const content = (
    <>
      {renderRowAvatar ? <span className={styles.rowAvatar}>{renderRowAvatar(row)}</span> : null}
      <span className={styles.rowLabel}>{renderRow ? renderRow(row) : label}</span>
    </>
  );
  // The header's grid stop: roving focus, and the create key when bars can be drawn.
  const stopProps = {
    "aria-describedby": creatable ? createHintId : undefined,
    "aria-keyshortcuts": creatable ? "N" : undefined,
    onFocus: () => ctx.focus(navId),
  };

  return (
    <div
      ref={measureRef}
      role="row"
      aria-rowindex={index + 2}
      className={styles.row}
      style={{ "--lanes": laneCount, "--row-top": `${top}px` } as React.CSSProperties}
    >
      {href === undefined ? (
        <div
          ref={ctx.register(navId)}
          role="rowheader"
          tabIndex={tabStop === navId ? 0 : -1}
          className={styles.rowHeader}
          data-nav-id={navId}
          data-clickable={clickable || undefined}
          {...stopProps}
          onClick={
            clickable
              ? (event) => {
                  if (opensRow(event)) ctx.openRow(index, event);
                }
              : undefined
          }
          onKeyDown={
            clickable
              ? (event) => {
                  if (event.target !== event.currentTarget || event.repeat) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  ctx.openRow(index, event);
                }
              : undefined
          }
        >
          {content}
        </div>
      ) : (
        <div role="rowheader" className={styles.rowHeader} data-clickable="">
          {/* The row's link is the header's stop in the grid; its hit area fills the header. */}
          <a
            ref={ctx.register(navId)}
            href={href}
            tabIndex={tabStop === navId ? 0 : -1}
            className={styles.rowLink}
            data-nav-id={navId}
            {...stopProps}
            onClick={(event) => {
              // The browser keeps the modified clicks (new tab, new window).
              if (clickable && isPlainClick(event)) ctx.openRow(index, event);
            }}
            onKeyDown={(event) => {
              // Space activates the link like Enter does: the header is one cell of a grid.
              if (event.key !== " " || event.repeat) return;
              event.preventDefault();
              event.currentTarget.click();
            }}
          >
            {content}
          </a>
        </div>
      )}
      <div
        role="gridcell"
        className={styles.track}
        data-row={index}
        data-creatable={creatable || undefined}
        onPointerDown={creatable ? on("pointerDown") : undefined}
        onPointerMove={creatable ? on("pointerMove") : undefined}
        onPointerUp={creatable ? on("pointerUp") : undefined}
        onPointerCancel={creatable ? on("pointerCancel") : undefined}
        onPointerLeave={creatable ? on("pointerLeave") : undefined}
        onContextMenu={creatable ? on("contextMenu") : undefined}
        onDoubleClick={creatable ? on("doubleClick") : undefined}
      >
        {hover && !ghost ? (
          <span
            className={styles.createCell}
            style={{ "--x": hover.x, "--span": hover.span } as React.CSSProperties}
            aria-hidden="true"
          >
            <Icon name="action.add" animated={false} />
          </span>
        ) : null}
        {bars.map((bar) => {
          const dates = pending.get(bar.id) ?? bar;
          const x = daysBetween(start, dates.start);
          const span = Math.max(daysBetween(dates.start, dates.end), 1);
          const pinned = pending.has(bar.id) || dragging.has(bar.id) || tabStop === bar.id;
          if (windowed && !pinned && (x + span < windowFrom || x > windowTo)) return null;
          return (
            <GanttBarView
              key={bar.id}
              bar={bar}
              dates={dates}
              x={x}
              lane={lanes.get(bar.id) ?? 0}
              scale={scale}
              locale={locale}
              nameFor={(shown) => ctx.nameFor(bar, shown)}
              formatDuration={ctx.formatDuration}
              renderTip={renderBarTooltip ? () => renderBarTooltip(bar, row) : undefined}
              editable={editableAtAll && !bar.readOnly && !pending.has(bar.id)}
              pending={pending.has(bar.id)}
              active={tabStop === bar.id}
              hintId={hintId}
              dayPx={ctx.dayPx}
              direction={ctx.direction}
              scrollLeft={ctx.scrollLeft}
              autoScroll={ctx.autoScroll}
              onActivate={() => ctx.open(bar.id, index)}
              onFocusBar={() => ctx.focus(bar.id)}
              onTipChange={ctx.registerTip}
              canShowTip={ctx.canShowTip}
              onCommit={(next) => ctx.commit(bar.id, index, next)}
              onDragChange={ctx.onDragChange}
              barRef={ctx.register(bar.id)}
            />
          );
        })}
        {ghost ? (
          <Tooltip.Root open={ghost.status === "drawing"}>
            <Tooltip.Trigger>
              <span
                tabIndex={-1}
                className={styles.ghost}
                data-state={ghost.status}
                aria-hidden="true"
                style={
                  {
                    "--x": daysBetween(start, ghost.dates.start),
                    "--span": daysBetween(ghost.dates.start, ghost.dates.end),
                    "--lane": ghostLane,
                  } as React.CSSProperties
                }
              >
                {ghost.status === "pending" ? (
                  <Skeleton shape="block" className={styles.ghostBusy} />
                ) : null}
                <span className={styles.ghostLabel}>{newBarLabel}</span>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span className={styles.tipTitle}>{newBarLabel}</span>
              <span className={styles.tipMeta}>
                {formatSpan(ghost.dates, locale)} ·{" "}
                {ctx.formatDuration(daysBetween(ghost.dates.start, ghost.dates.end))}
              </span>
            </Tooltip.Content>
          </Tooltip.Root>
        ) : null}
      </div>
    </div>
  );
}

/** One row of the chart: memoized, so scrolling renders only the rows that come into view. */
export const GanttRow = React.memo(GanttRowView);
