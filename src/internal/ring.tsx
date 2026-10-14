import type * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./ring.module.css";

/**
 * Lengths along a ring circle: every circle carries `pathLength={RING_PATH}`, so a dash or an
 * offset is a share of the whole in percent, whatever the diameter.
 */
export const RING_PATH = 100;

/**
 * The stroke of a `data` ring in `RING_PATH` units: the stroke is 1/12 of the diameter, the circle
 * runs through the middle of the stroke (diameter × 11/12), so its length is π × d × 11/12.
 */
export const RING_DATA_STROKE = RING_PATH / (11 * Math.PI);

/**
 * How heavy the stroke is.
 * - `data` — a ring that is the data (ProgressCircle): 1/12 of the diameter, never under the line
 *   weight; it scales with the ring.
 * - `line` — a ring inside a control (Spinner, the ring of a circle Button, a transfer disk): the
 *   kit's line weight, two border widths — the weight of an icon's stroke at the control's tier,
 *   at every diameter.
 * - `band` — a band of one spacing step over the edge of a round video (the playback ring of
 *   VideoNote, the recording ring of the Composer).
 */
type RingWeight = "data" | "line" | "band";

type RingProps = Omit<React.SVGAttributes<SVGSVGElement>, "children"> & {
  /**
   * The share drawn, `0…1`; `null` — under way, the share unknown: a quarter arc that always
   * turns. Ignored with `live`.
   */
  value: number | null;
  /** The ring turns at any share (one turn = 3 × `--prime-motion-loop`); the arc never under 8%. */
  spin?: boolean;
  /** A faint full circle under the arc. Default `true`. */
  track?: boolean;
  /** Default `line`. */
  weight?: RingWeight;
  /**
   * The host writes `--ring-value` (0…1) itself, usually every frame, on the ring or an ancestor:
   * no inline value, no glide, no re-render (VideoNote playback, the Composer recording).
   */
  live?: boolean;
  /**
   * Arcs drawn instead of the one value arc (ProgressCircle segments): `RingCircle`s and
   * `RingCap`s, already turned to start at 12 o'clock.
   */
  children?: React.ReactNode;
  ref?: React.Ref<SVGSVGElement>;
};

/** One circle of the ring's geometry: through the middle of the stroke, `RING_PATH` long. */
export function RingCircle({ className, ...rest }: React.SVGProps<SVGCircleElement>) {
  return (
    <circle
      cx="50%"
      cy="50%"
      pathLength={RING_PATH}
      {...rest}
      className={cx(styles.circle, className)}
    />
  );
}

/**
 * The round cap of an arc drawn with flat joints (ProgressCircle segments): a dot on the circle at
 * `position` (`RING_PATH` units clockwise from 12 o'clock).
 */
export function RingCap({
  position,
  className,
  style,
  ...rest
}: React.SVGProps<SVGCircleElement> & { position: number }) {
  return (
    <circle
      {...rest}
      className={cx(styles.cap, className)}
      style={{ ...style, rotate: `${(position / RING_PATH) * 360}deg` }}
    />
  );
}

/**
 * The one ring of the kit — ProgressCircle, Spinner and the ring of a circle Button all draw from
 * it. An SVG without a viewBox: the circle is placed in CSS (`r`, the stroke from `weight`), so
 * the stroke is exact at every diameter; lengths are percent of the circle (`RING_PATH`). The arc
 * starts at 12 o'clock and runs clockwise with round ends; its share is one variable
 * (`--ring-value`) and glides by itself (`base`, on the paint of the arc), while the turn is the
 * `rotate` of its inner group (compositor) — so a share grows while the ring turns, and a host's
 * own animation of the svg (a region swap) runs beside it. The fill is `--ring-fill` (default
 * `currentColor`); the track is `currentColor` at the line tint. Decorative (`aria-hidden`)
 * unless the host gives it a role.
 */
export function Ring({
  value,
  spin = false,
  track = true,
  weight = "line",
  live = false,
  className,
  style,
  children,
  role,
  ...rest
}: RingProps) {
  const unknown = value === null;
  const turning = spin || unknown;
  const share = unknown ? 0.25 : Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative, or named by its host's role and aria-label
    <svg
      aria-hidden={role ? undefined : true}
      focusable="false"
      role={role}
      {...rest}
      className={cx(styles.ring, className)}
      style={live ? style : ({ ...style, "--ring-value": share } as React.CSSProperties)}
      {...toDataAttributes({
        weight,
        spin: turning || undefined,
        // An empty arc still at rest draws nothing (a round cap would leave a dot).
        empty: (!live && !turning && share === 0) || undefined,
        live: live || undefined,
      })}
    >
      <g className={styles.turn}>
        {track ? <RingCircle className={styles.track} /> : null}
        {children ?? <RingCircle className={styles.arc} />}
      </g>
    </svg>
  );
}
