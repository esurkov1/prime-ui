/**
 * The header row of a surface that holds one entity, as Card set it (headerRow.module.css): the
 * mark, the title with its badges on one line, the description under them, the controls at the
 * end. A host renders its own parts with these classes and lays them out with `HeaderRowContent`.
 */
import * as React from "react";

import { StatusDot } from "@/components/status-dot/StatusDot";
import { cx } from "./cx";
import { hasContent } from "./hasContent";
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

/** The longest a title gives way: its own text, at most this many `em`. */
const TITLE_MIN_EM = 8;

/**
 * Writes a title's floor (`--header-title-min`) on the title and on the header row's titles column,
 * which wraps the row by it (headerRow.module.css).
 */
function setTitleFloor(title: HTMLElement, width: number) {
  const em = Number.parseFloat(getComputedStyle(title).fontSize) || 0;
  const value = `${Math.ceil(Math.min(width, em * TITLE_MIN_EM))}px`;
  title.style.setProperty("--header-title-min", value);
  title.closest<HTMLElement>(`.${styles.titles}`)?.style.setProperty("--header-title-min", value);
}

/** Forgets the floor, so the title is measured at its natural width. */
function clearTitleFloor(title: HTMLElement) {
  title.style.removeProperty("--header-title-min");
  title.closest<HTMLElement>(`.${styles.titles}`)?.style.removeProperty("--header-title-min");
}

/**
 * The floor a title keeps in its header (`--header-title-min`): its text, or 8em when the text is
 * longer. The title never gives way below it: beside badges they fold, and the controls at the end
 * drop to their own line when the row cannot hold both. Measured after every render, so a new
 * title gets its own floor.
 */
export function useTitleFloor(
  ref: React.RefObject<HTMLElement | null>,
  name?: React.RefObject<HTMLElement | null>,
  number?: React.RefObject<HTMLElement | null>,
) {
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    clearTitleFloor(node);
    if (!name) {
      setTitleFloor(node, node.scrollWidth);
      return;
    }
    // A record title (a name and its `number`): the number never gives way and the name shrinks
    // inside the title, so the floor is measured from the parts and the gap between them.
    const text = name.current;
    if (!text) return;
    const tail = number?.current;
    const gap = tail ? Number.parseFloat(getComputedStyle(node).columnGap) || 0 : 0;
    setTitleFloor(node, text.scrollWidth + (tail ? tail.offsetWidth + gap : 0));
  });
}

type SectionTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "title"> & {
  as: "h2" | "h3";
  number?: React.ReactNode;
  badges?: React.ReactNode;
};

/**
 * The heading of a section (`Page.Section`, a dialog's `Section`). A plain heading wraps; one that
 * names a record — a `number` after the name, badges after it — is a header row's title line: one
 * line, the name cut with an ellipsis down to its floor, the number never, then the badges fold
 * into «+N».
 */
export function SectionTitle({
  as: Tag,
  number,
  badges,
  className,
  children,
  ...rest
}: SectionTitleProps) {
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nameRef = React.useRef<HTMLSpanElement>(null);
  const numberRef = React.useRef<HTMLSpanElement>(null);
  const numbered = hasContent(number);
  const record = numbered || present(badges);
  useTitleFloor(titleRef, numbered ? nameRef : undefined, numberRef);
  if (!record) {
    return (
      <Tag {...rest} ref={titleRef} className={className}>
        {children}
      </Tag>
    );
  }
  return (
    <div className={styles.titleRow}>
      <Tag
        {...rest}
        ref={titleRef}
        className={cx(className, styles.title, numbered && styles.numbered)}
      >
        {numbered ? (
          <>
            <span ref={nameRef} className={styles.name}>
              {children}
            </span>{" "}
            <span ref={numberRef} className={styles.number}>
              {number}
            </span>
          </>
        ) : (
          children
        )}
      </Tag>
      {badges}
    </div>
  );
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
