// biome-ignore-all lint/a11y/useSemanticElements: an ARIA grid of divs (see Gantt.tsx)
// biome-ignore-all lint/a11y/useFocusableInteractive: rows and cells are not focus stops; the row header and bars are
import type { Locale } from "date-fns";
import * as React from "react";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";
import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import palette from "@/internal/palette.module.css";
import { isPlainClick, opensRow } from "@/internal/rowLink";
import { type PaletteColor, stepDown } from "@/internal/states";

import styles from "./Gantt.module.css";
import { GanttBarView, useDateGlide } from "./GanttBar";
import {
  barEdit,
  daysBetween,
  formatSpan,
  type GanttBar,
  type GanttBarHeight,
  type GanttDates,
  type LaneHeights,
  lanesHeight,
  laneTops,
  type TimeStep,
} from "./ganttModel";
import { type TimeScene, toPx } from "./timeCore";

/**
 * A bar being created: the phantom a press would create (under the mouse, at the `N` slot of a
 * focused row header), drawn by the pointer, waiting for `onBarCreate`, or fading after a refusal.
 * One element from the phantom on: a drawing grows from it.
 */
export type GanttGhost = {
  id: string;
  dates: GanttDates;
  status: "phantom" | "drawing" | "pending" | "leaving";
  /** The lane asked for: under the pointer, pressed (`placeGhost` decides where it stands). */
  lane?: number;
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
  /** The ref of a row's time layer: the chart's slide moves it with the head and the grid. */
  layer: (node: HTMLElement | null) => (() => void) | undefined;
  focus: (id: string) => void;
  open: (barId: string, rowIndex: number) => void;
  /** `onRowClick` of the row at `rowIndex`. */
  openRow: (
    rowIndex: number,
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  commit: (barId: string, rowIndex: number, dates: GanttDates) => void;
  nameFor: (bar: GanttBar, dates: GanttDates) => string;
  /** The hue of a bar's category (`categories`). */
  categoryColor: (bar: GanttBar) => PaletteColor | undefined;
  formatDuration: (days: number) => string;
  track: (event: GanttTrackEvent, rowIndex: number, native: React.SyntheticEvent) => void;
  registerTip: (id: string, close: (() => void) | null) => void;
  /** Whether enough of the cell is visible on the timeline for a tooltip to point at it. */
  canShowTip: (id: string) => boolean;
  onDragChange: (id: string, dragging: boolean) => void;
  direction: () => 1 | -1;
  /** The day at the start of the view now (`timeCore`). */
  viewStart: () => number;
  /** A touch pointer a bar or a drawing holds: the chart does not slide under it. */
  claimPointer: (pointerId: number, held: boolean) => void;
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
  /** Each lane's look (`assignLanes`): a lane is as tall as its look's height. */
  looks: readonly GanttBarHeight[];
  heights: LaneHeights;
  padY: number;
  laneGap: number;
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
  /** The chart's tab stop when it is in this row, else `null`. */
  tabStop: string | null;
  pending: ReadonlyMap<string, GanttDates>;
  dragging: ReadonlySet<string>;
  /** What is laid out (`timeCore`): bars outside it are not rendered. */
  scene: TimeScene;
  /** The grid's coarse step: what a drag with Alt lands on (see `GanttBarView`). */
  snap: TimeStep;
  rangeStart: number;
  locale: Locale;
  newBarLabel: string;
  editableAtAll: boolean;
  creatable: boolean;
  hintId: string;
  endHintId: string;
  createHintId: string;
};

function GanttRowView({
  ctx,
  index,
  navId,
  label,
  bars,
  lanes,
  looks,
  heights,
  padY,
  laneGap,
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
  tabStop,
  pending,
  dragging,
  scene,
  snap,
  rangeStart,
  locale,
  newBarLabel,
  editableAtAll,
  creatable,
  hintId,
  endHintId,
  createHintId,
}: GanttRowProps) {
  const barTier = stepDown(useControlSize(undefined));
  const start = new Date(rangeStart);
  const tops = React.useMemo(
    () => laneTops(looks, heights, padY, laneGap),
    [looks, heights, padY, laneGap],
  );
  /** A bar's top in its lane, px: centred in a lane taller than it (a default bar by a large). */
  const topOf = (lane: number, height: GanttBarHeight) =>
    (tops[lane] ?? padY) + ((heights[looks[lane] ?? "m"] ?? 0) - heights[height]) / 2;
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
    // With an avatar a narrow chart shows only the picture: the row label names the stop.
    "aria-label": renderRowAvatar ? label : undefined,
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
      style={
        {
          "--row-h": `${lanesHeight(looks, heights, padY, laneGap)}px`,
          "--row-top": `${top}px`,
        } as React.CSSProperties
      }
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
        // Bar text is one tier under the chart: the track carries that tier (`--field-*`).
        className={cx(fieldTierClass, styles.track)}
        data-size={barTier}
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
        {/* The row's time layer: laid out from the scene's origin, slid with the head and grid. */}
        <div
          ref={ctx.layer}
          className={styles.layer}
          data-gantt-layer=""
          style={{ width: `${scene.widthPx}px` }}
        >
          {bars.map((bar) => {
            const dates = pending.get(bar.id) ?? bar;
            const x = daysBetween(start, dates.start);
            const span = Math.max(daysBetween(dates.start, dates.end), 1);
            const pinned = pending.has(bar.id) || dragging.has(bar.id) || tabStop === bar.id;
            const edit = editableAtAll && !pending.has(bar.id) ? barEdit(bar, dates) : "none";
            if (!pinned && (x + span < scene.from || x > scene.to)) return null;
            return (
              <GanttBarView
                key={bar.id}
                bar={bar}
                categoryColor={ctx.categoryColor(bar)}
                dates={dates}
                x={x}
                lane={lanes.get(bar.id) ?? 0}
                top={topOf(lanes.get(bar.id) ?? 0, bar.height ?? "m")}
                scene={scene}
                barH={heights[bar.height ?? "m"]}
                snap={snap}
                locale={locale}
                nameFor={(shown) => ctx.nameFor(bar, shown)}
                formatDuration={ctx.formatDuration}
                renderTip={renderBarTooltip ? () => renderBarTooltip(bar, row) : undefined}
                edit={edit}
                pending={pending.has(bar.id)}
                active={tabStop === bar.id}
                hintId={edit === "end" ? endHintId : hintId}
                direction={ctx.direction}
                viewStart={ctx.viewStart}
                claimPointer={ctx.claimPointer}
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
            <GanttGhostView
              ghost={ghost}
              top={topOf(ghostLane, "m")}
              start={start}
              scene={scene}
              locale={locale}
              label={newBarLabel}
              direction={ctx.direction}
              formatDuration={ctx.formatDuration}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * The bar being created, one element throughout. Hovered (or picked up by a long press, or at the
 * `N` slot) it is the phantom: a faint accent wash with «+» and «Новая задача», one unit of the
 * finest drawn line, stepping with a short glide (`useDateGlide`). Pressed and dragged it is a
 * real bar in the default hue — its length in days inside, its dates in the tooltip — growing and
 * shrinking by whole days either way; pending it pulses; refused or dropped it fades out.
 */
function GanttGhostView({
  ghost,
  top,
  start,
  scene,
  locale,
  label,
  direction,
  formatDuration,
}: {
  ghost: GanttGhost;
  /** Its top in the row, px: the lane it stands in. */
  top: number;
  start: Date;
  scene: TimeScene;
  locale: Locale;
  label: string;
  direction: () => 1 | -1;
  formatDuration: (days: number) => string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = daysBetween(start, ghost.dates.start);
  const span = daysBetween(ghost.dates.start, ghost.dates.end);
  const left = toPx(x, scene);
  const width = toPx(x + span, scene) - left;
  useDateGlide(ref, { left, width }, scene, false, direction, "fast");
  const phantom = ghost.status === "phantom";
  return (
    <Tooltip.Root open={ghost.status === "drawing"}>
      <Tooltip.Trigger>
        <span
          ref={ref}
          tabIndex={-1}
          className={cx(styles.ghost, !phantom && palette.hue, enterMotion.enterFade)}
          data-state={ghost.status}
          data-look={phantom ? "phantom" : "bar"}
          data-color={phantom ? undefined : "blue"}
          data-x={x}
          data-span={span}
          aria-hidden="true"
          style={
            {
              insetInlineStart: `${left}px`,
              width: `${width}px`,
              insetBlockStart: `${top}px`,
            } as React.CSSProperties
          }
        >
          {ghost.status === "pending" ? (
            <Skeleton shape="block" className={styles.ghostBusy} />
          ) : null}
          {phantom ? (
            <>
              <span className={styles.ghostIcon}>
                <Icon name="action.add" animated={false} />
              </span>
              <span className={styles.ghostLabel}>{label}</span>
            </>
          ) : (
            <span className={styles.ghostLabel}>{formatDuration(span)}</span>
          )}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <span className={styles.tipTitle}>{label}</span>
        <span className={styles.tipMeta}>
          {formatSpan(ghost.dates, locale)} · {formatDuration(span)}
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

/** One row of the chart: memoized, so scrolling renders only the rows that come into view. */
export const GanttRow = React.memo(GanttRowView);
