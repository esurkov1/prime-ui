import type * as React from "react";

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
  const chars = [...String(children)];
  return (
    <span className={cx(styles.root, className)}>
      {chars.map((char, i) => {
        const key = chars.length - i;
        return /\d/.test(char) ? (
          <span
            key={`d${key}`}
            className={styles.digit}
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
