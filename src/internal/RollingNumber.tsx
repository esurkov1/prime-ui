import * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./RollingNumber.module.css";

export type RollingNumberProps = {
  /** The formatted value («4 812 350 ₽», «12», «−3,4%»); digits roll, other characters stay put. */
  children: string | number;
  className?: string;
};

/**
 * A number whose digits roll to their new values column by column, like an odometer (foundation §7
 * rule 8: counters ease, they do not flip). The DOM holds the real digits (text, copy, assistive
 * tech and a page without CSS read the value); each digit column draws the 0–9 strip in a
 * pseudo-element. Columns are keyed from the right, so an unchanged digit stays still and a new
 * leading digit appears without rolling. A value that changes by itself every frame (a running
 * percentage) stays plain tabular text: rolling there is noise.
 */
export function RollingNumber({ children, className }: RollingNumberProps) {
  const value = String(children);
  const chars = [...value];
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const previous = React.useRef<string | null>(null);

  // A column the list moved in the DOM (a reorder re-inserts nodes) starts with no style to transition
  // from, and its digit would just change. Every changed digit is put back to its old value, its
  // style taken, then set to the new one: the roll runs whether or not the node was moved.
  React.useLayoutEffect(() => {
    const before = previous.current;
    previous.current = value;
    const root = rootRef.current;
    if (before === null || before === value || !root) return;
    const old = [...before];
    const columns = root.querySelectorAll<HTMLElement>("[data-rolling-digit]");
    let column = 0;
    const replays: Array<[HTMLElement, string, string]> = [];
    chars.forEach((char, i) => {
      if (!/\d/.test(char)) return;
      const element = columns[column++];
      const was = old[old.length - (chars.length - i)];
      if (element && was !== undefined && /\d/.test(was) && was !== char) {
        replays.push([element, was, char]);
      }
    });
    if (replays.length === 0) return;
    for (const [element, was] of replays) element.style.setProperty("--rolling-n", was);
    void root.offsetWidth;
    for (const [element, , next] of replays) element.style.setProperty("--rolling-n", next);
  });

  return (
    <span ref={rootRef} className={cx(styles.root, className)}>
      {chars.map((char, i) => {
        const key = chars.length - i;
        return /\d/.test(char) ? (
          <span
            key={`d${key}`}
            className={styles.digit}
            // A carried copy of a host finds its digits by this and rolls them too (`carryRolling`).
            data-rolling-digit=""
            style={{ "--rolling-n": char } as React.CSSProperties}
          >
            {char}
          </span>
        ) : (
          <span key={`c${key}`} className={styles.char}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

const DIGIT = "[data-rolling-digit]";

/**
 * A copy of a host carried elsewhere (Dnd's overlay, flying while the real item is hidden) shows
 * what the host shows now: the copy's rolling digit columns take the destination's values and roll
 * in flight. Matched from the right, as the number keys its columns; a new leading digit appears
 * on settle. Returns whether the copy now shows the same number (as many columns on both sides) —
 * else the caller copies the content as it stands.
 */
export function carryRolling(copy: Element, destination: Element): boolean {
  const to = [...destination.querySelectorAll<HTMLElement>(DIGIT)].reverse();
  const from = [...copy.querySelectorAll<HTMLElement>(DIGIT)].reverse();
  to.forEach((digit, index) => {
    const own = from[index];
    if (!own) return;
    own.style.setProperty("--rolling-n", digit.style.getPropertyValue("--rolling-n"));
    own.textContent = digit.textContent;
  });
  return to.length > 0 && to.length === from.length;
}
