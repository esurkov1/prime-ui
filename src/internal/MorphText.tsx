import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { afterMotionMs, readCssDurationMs } from "@/internal/motionTiming";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./MorphText.module.css";

export type MorphTextProps = {
  children: string;
  className?: string;
};

type Morph = { id: number; from: string; to: string; width: number };

/** The unchanged start and end of two labels: only the part between them morphs. */
function splitChange(from: string, to: string) {
  const a = [...from];
  const b = [...to];
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head += 1;
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  ) {
    tail += 1;
  }
  return {
    prefix: b.slice(0, head).join(""),
    suffix: b.slice(b.length - tail).join(""),
    out: a.slice(head, a.length - tail).join(""),
    in: b.slice(head, b.length - tail).join(""),
  };
}

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

/** When the morph of `text` has settled: the letters' clock plus the longest stagger. */
function settleMs(text: string): number {
  const base = readCssDurationMs("--prime-motion-duration-base");
  // The per-letter step is a sixth of `--prime-motion-stagger` (MorphText.module.css).
  const step = readCssDurationMs("--prime-motion-stagger") / 6;
  return afterMotionMs(base + step * text.length);
}

/**
 * A label that changes in place (foundation §7 rule 8): the start and end both labels share stay
 * still; between them the old letters leave upward, the new ones come from below one short step
 * apart, and the changed part glides between the two widths. At rest it is
 * one plain text span; the letter layers exist only while a change plays. Still on the first
 * render, under reduced motion, and when only digits change (a counter or a percentage in a label
 * updates in place).
 */
export function MorphText({ children: text, className }: MorphTextProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const segmentRef = React.useRef<HTMLSpanElement>(null);
  const sizerRef = React.useRef<HTMLSpanElement>(null);
  const prevText = React.useRef<string | null>(null);
  /** The width the settled text takes: where the next change starts. */
  const restWidth = React.useRef<{ text: string; className?: string; width: number } | null>(null);
  const nextId = React.useRef(0);
  const [morph, setMorph] = React.useState<Morph | null>(null);
  const morphRef = React.useRef(morph);
  morphRef.current = morph;

  // A new text: start a morph from the width the old one had on screen.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const prev = prevText.current;
    prevText.current = text;
    if (!root || prev === null || prev === text) return;
    if (prefersReducedMotion() || digitsOnly(prev, text)) {
      setMorph(null);
      return;
    }
    const running = morphRef.current;
    const width = running ? root.getBoundingClientRect().width : (restWidth.current?.width ?? 0);
    nextId.current += 1;
    setMorph({ id: nextId.current, from: running ? running.to : prev, to: text, width });
  }, [text]);

  const change = morph ? splitChange(morph.from, morph.to) : null;

  // The morph layers are in the DOM: the changed part glides from its old width to the new one
  // (the old label's width less the still start and end) and settles later.
  React.useLayoutEffect(() => {
    if (!morph) return;
    const root = rootRef.current;
    const segment = segmentRef.current;
    const sizer = sizerRef.current;
    if (!root || !segment || !sizer) return;
    const target = sizer.getBoundingClientRect().width;
    const still = root.getBoundingClientRect().width - target;
    const from = Math.max(0, morph.width - still);
    if (target !== from) {
      segment.style.width = `${from}px`;
      segment.getBoundingClientRect();
      segment.style.width = `${target}px`;
    }
    const changed = splitChange(morph.from, morph.to);
    const longest = changed.in.length > changed.out.length ? changed.in : changed.out;
    const timer = window.setTimeout(() => setMorph(null), settleMs(longest));
    return () => window.clearTimeout(timer);
  }, [morph]);

  // At rest: remember the width the text takes, the starting point of the next change. Measured
  // once per settled text and class, not on every render (a read here forces a synchronous layout).
  React.useLayoutEffect(() => {
    if (morph || !rootRef.current) return;
    restWidth.current = { text, className, width: rootRef.current.getBoundingClientRect().width };
  }, [morph, text, className]);

  if (!morph || !change) {
    return (
      <span ref={rootRef} className={cx(styles.root, className)}>
        {text}
      </span>
    );
  }

  return (
    <span ref={rootRef} className={cx(styles.root, className)}>
      <span aria-hidden="true">{change.prefix}</span>
      <span ref={segmentRef} className={styles.segment} aria-hidden="true">
        <span ref={sizerRef} className={styles.sizer}>
          {change.in}
        </span>
        <span key={`out-${morph.id}`} className={cx(styles.layer, styles.layerOut)}>
          {letters(change.out, "out")}
        </span>
        <span key={`in-${morph.id}`} className={cx(styles.layer, styles.layerIn)}>
          {letters(change.in, "in")}
        </span>
      </span>
      <span aria-hidden="true">{change.suffix}</span>
      <VisuallyHidden>{morph.to}</VisuallyHidden>
    </span>
  );
}
