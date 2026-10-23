/**
 * The header row of a surface that holds one entity, as Card set it (headerRow.module.css): the
 * mark, the title with its badges on one line, the description under them, the controls at the
 * end. A host renders its own parts with these classes and lays them out with `HeaderRowContent`.
 */
import * as React from "react";

import { StatusDot } from "@/components/status-dot/StatusDot";
import styles from "./headerRow.module.css";
import { flattenChildren, isPart } from "./parts";

export const headerRowStyles = styles;

type HeaderRowContentProps = {
  mark?: React.ReactNode;
  title?: React.ReactNode;
  badges?: React.ReactNode;
  description?: React.ReactNode;
  end?: React.ReactNode;
  children?: React.ReactNode;
};

const present = (node: React.ReactNode) => flattenChildren(node).length > 0;

/** The parts in their places, whatever order the host's children came in. */
export function HeaderRowContent({
  mark,
  title,
  badges,
  description,
  end,
  children,
}: HeaderRowContentProps) {
  return (
    <>
      {mark}
      {present(title) || present(badges) || present(description) ? (
        <div className={styles.titles}>
          <div className={styles.titleRow}>
            {title}
            {badges}
          </div>
          {description}
        </div>
      ) : null}
      {end}
      {children}
    </>
  );
}

/** The longest a title gives way to its badges: its own text, at most this many `em`. */
const TITLE_MIN_EM = 8;

/**
 * The floor a title keeps beside its badges (`--header-title-min`): its text, or 8em when the text
 * is longer. Measured after every render, so a new title gets its own floor.
 */
export function useTitleFloor(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.removeProperty("--header-title-min");
    const em = Number.parseFloat(getComputedStyle(node).fontSize) || 0;
    const floor = Math.min(node.scrollWidth, em * TITLE_MIN_EM);
    node.style.setProperty("--header-title-min", `${Math.ceil(floor)}px`);
  });
}

/**
 * The content of a description line: a `StatusDot` first states the state, the text after it
 * follows a «·» and is cut with an ellipsis.
 */
export function HeaderLineContent({ children }: { children?: React.ReactNode }) {
  const items = flattenChildren(children);
  const dots: React.ReactNode[] = items.filter((part) => isPart(part, StatusDot));
  const text = items.filter((part) => !dots.includes(part));
  return (
    <>
      {dots}
      {dots.length > 0 && text.length > 0 ? (
        <span aria-hidden="true" className={styles.separator}>
          ·
        </span>
      ) : null}
      {text.length > 0 ? <span className={styles.descriptionText}>{text}</span> : null}
    </>
  );
}
