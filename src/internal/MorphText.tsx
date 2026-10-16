import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { afterMotionMs, readCssDurationMs } from "@/internal/motionTiming";

import styles from "./MorphText.module.css";

type MorphTextProps = {
  children: string;
  className?: string;
};

/** Where a letter stands on screen: its opacity and its vertical shift in px. */
type LetterPose = { opacity: number; y: number };

type Morph = {
  id: number;
  from: string;
  to: string;
  width: number;
  /** A change during a change: the leaving and arriving letters start where they are on screen. */
  outPoses?: (LetterPose | undefined)[];
  inPoses?: (LetterPose | undefined)[];
};

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

function letters(text: string, kind: "in" | "out", poses?: (LetterPose | undefined)[]) {
  return [...text].map((char, i) => {
    const pose = poses?.[i];
    const style: Record<string, string | number> = { "--morph-i": i };
    if (pose) {
      style["--morph-opacity"] = pose.opacity;
      style["--morph-y"] = `${pose.y}px`;
    }
    return (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: letters of one fixed string, never reordered
        key={i}
        className={cx(styles.letter, kind === "in" ? styles.letterIn : styles.letterOut)}
        style={style as React.CSSProperties}
      >
        {char}
      </span>
    );
  });
}

/** The on-screen pose of each letter of a layer (its animated opacity and shift). */
function readPoses(layer: HTMLElement | null): (LetterPose | undefined)[] {
  if (!layer) return [];
  return Array.from(layer.children, (letter) => {
    const computed = getComputedStyle(letter);
    const opacity = Number.parseFloat(computed.opacity);
    if (Number.isNaN(opacity)) return undefined;
    const transform = computed.transform;
    const y =
      transform && transform !== "none" && typeof DOMMatrixReadOnly === "function"
        ? new DOMMatrixReadOnly(transform).m42
        : 0;
    return { opacity, y };
  });
}

/**
 * The poses of a running morph by character of one of its labels: the shared start and end stand
 * still (no pose — a leaving letter starts from rest), the changed part takes its layer's poses.
 */
function posesOf(
  label: string,
  running: Morph,
  layerPoses: (LetterPose | undefined)[],
): (LetterPose | undefined)[] {
  const head = [...splitChange(running.from, running.to).prefix].length;
  return [...label].map((_, i) => layerPoses[i - head]);
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
  const outLayerRef = React.useRef<HTMLSpanElement>(null);
  const inLayerRef = React.useRef<HTMLSpanElement>(null);
  const prevText = React.useRef<string | null>(null);
  /** The width the settled text takes: where the next change starts. */
  const restWidth = React.useRef<{ text: string; className?: string; width: number } | null>(null);
  const nextId = React.useRef(0);
  const [morph, setMorph] = React.useState<Morph | null>(null);
  const morphRef = React.useRef(morph);
  morphRef.current = morph;

  // A new text: start a morph from what is on screen — the width the label has now (mid-glide
  // when a change interrupts a change) and, for a change during a change, each letter's pose.
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
    nextId.current += 1;
    if (!running) {
      setMorph({ id: nextId.current, from: prev, to: text, width: restWidth.current?.width ?? 0 });
      return;
    }
    // The arriving label of the running change leaves from where its letters are; going back to
    // the label that was leaving, its letters return from where they are too.
    const from = running.to;
    const change = splitChange(from, text);
    const head = [...change.prefix].length;
    const arriving = posesOf(from, running, readPoses(inLayerRef.current));
    const leaving = posesOf(running.from, running, readPoses(outLayerRef.current));
    setMorph({
      id: nextId.current,
      from,
      to: text,
      width: root.getBoundingClientRect().width,
      outPoses: arriving.slice(head, head + [...change.out].length),
      inPoses:
        text === running.from ? leaving.slice(head, head + [...change.in].length) : undefined,
    });
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
    // The still start and end: the label less the changed part as it stands now — a segment
    // interrupted mid-glide still holds its in-flight width, not the new text's.
    const target = sizer.getBoundingClientRect().width;
    const still = root.getBoundingClientRect().width - segment.getBoundingClientRect().width;
    const from = Math.max(0, morph.width - still);
    // Start the glide at `from` exactly: an interrupted glide is dropped, not retargeted from its
    // own clock, and the new one runs from the width on screen to the new text's.
    segment.style.transition = "none";
    segment.style.width = `${from}px`;
    segment.getBoundingClientRect();
    segment.style.transition = "";
    segment.style.width = `${target}px`;
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
        <span
          key={`out-${morph.id}`}
          ref={outLayerRef}
          className={cx(styles.layer, styles.layerOut)}
        >
          {letters(change.out, "out", morph.outPoses)}
        </span>
        <span key={`in-${morph.id}`} ref={inLayerRef} className={cx(styles.layer, styles.layerIn)}>
          {letters(change.in, "in", morph.inPoses)}
        </span>
      </span>
      <span aria-hidden="true">{change.suffix}</span>
      <VisuallyHidden>{morph.to}</VisuallyHidden>
    </span>
  );
}
