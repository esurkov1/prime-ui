import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./MorphText.module.css";

export type MorphTextProps = {
  children: string;
  /** Change in place, without the letter motion (a label that updates every frame). */
  still?: boolean;
  className?: string;
};

type Morph = { id: number; from: string; to: string; width: number };

/** Two labels that differ only in their digits: a counter inside a label changes in place. */
function digitsOnly(a: string, b: string): boolean {
  return a.replace(/\d/g, "") === b.replace(/\d/g, "");
}

function letters(text: string, kind: "in" | "out") {
  return [...text].map((char, i) => (
    <span
      // biome-ignore lint/suspicious/noArrayIndexKey: letters of one fixed string, never reordered
      key={i}
      className={cx(styles.letter, kind === "in" ? styles.letterIn : styles.letterOut)}
      style={{ "--morph-i": i } as React.CSSProperties}
    >
      {char}
    </span>
  ));
}

/** Longest letter stagger of a word: the per-letter step is a sixth of `--prime-motion-stagger`. */
function settleMs(text: string, root: Element): number {
  const css = getComputedStyle(root);
  const read = (name: string) => Number.parseFloat(css.getPropertyValue(name)) || 0;
  const base = read("--prime-motion-duration-base");
  const step = read("--prime-motion-stagger") / 6;
  return base + step * text.length + 50;
}

/**
 * A label that changes in place (foundation §7 rule 8): the old letters leave upward, the new ones
 * come from below one short step apart, and the box glides between the two widths. At rest it is
 * one plain text span; the letter layers exist only while a change plays. Still on the first
 * render, under reduced motion, with `still`, and when only digits change.
 */
export function MorphText({ children: text, still = false, className }: MorphTextProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const sizerRef = React.useRef<HTMLSpanElement>(null);
  const prevText = React.useRef<string | null>(null);
  const restWidth = React.useRef(0);
  const nextId = React.useRef(0);
  const [morph, setMorph] = React.useState<Morph | null>(null);
  const morphRef = React.useRef(morph);
  morphRef.current = morph;
  const stillRef = React.useRef(still);
  stillRef.current = still;

  // A new text: start a morph from the width the old one had on screen.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const prev = prevText.current;
    prevText.current = text;
    if (!root || prev === null || prev === text) return;
    if (stillRef.current || prefersReducedMotion() || digitsOnly(prev, text)) {
      setMorph(null);
      return;
    }
    const running = morphRef.current;
    const width = running ? root.getBoundingClientRect().width : restWidth.current;
    nextId.current += 1;
    setMorph({ id: nextId.current, from: running ? running.to : prev, to: text, width });
  }, [text]);

  // The morph layers are in the DOM at the old width: glide to the new one and settle later.
  React.useLayoutEffect(() => {
    if (!morph) return;
    const root = rootRef.current;
    const sizer = sizerRef.current;
    if (!root || !sizer) return;
    const target = sizer.getBoundingClientRect().width;
    if (target !== morph.width) {
      root.style.width = `${morph.width}px`;
      root.getBoundingClientRect();
      root.style.width = `${target}px`;
    }
    const timer = window.setTimeout(() => setMorph(null), settleMs(morph.to, root));
    return () => window.clearTimeout(timer);
  }, [morph]);

  // At rest: remember the width the text takes, the starting point of the next change.
  React.useLayoutEffect(() => {
    if (morph || !rootRef.current) return;
    rootRef.current.style.width = "";
    restWidth.current = rootRef.current.getBoundingClientRect().width;
  });

  if (!morph) {
    return (
      <span ref={rootRef} className={cx(styles.root, className)}>
        {text}
      </span>
    );
  }

  return (
    <span ref={rootRef} className={cx(styles.root, styles.morphing, className)}>
      <span ref={sizerRef} className={styles.sizer} aria-hidden="true">
        {morph.to}
      </span>
      <span key={`out-${morph.id}`} className={styles.layer} aria-hidden="true">
        {letters(morph.from, "out")}
      </span>
      <span key={`in-${morph.id}`} className={styles.layer} aria-hidden="true">
        {letters(morph.to, "in")}
      </span>
      <VisuallyHidden>{morph.to}</VisuallyHidden>
    </span>
  );
}
