import * as React from "react";

import styles from "./HighlightMatch.module.css";

/** Index of the first case-insensitive occurrence of `query` in `text`; -1 for an empty query. */
export function matchIndex(text: string, query: string): number {
  if (!query) return -1;
  return text.toLowerCase().indexOf(query.toLowerCase());
}

/**
 * `text` with its first match of `query` marked in accent (every match with `all`, as in a search
 * through messages); plain text when nothing matches. The pieces share one span, so a flex row
 * with a `gap` (a menu item) keeps the word whole.
 */
export function HighlightMatch({
  text,
  query,
  all = false,
}: {
  text: string;
  query: string;
  all?: boolean;
}) {
  const q = query.trim();
  const at = matchIndex(text, q);
  if (at < 0) return <>{text}</>;
  if (!all) {
    return (
      <span>
        {text.slice(0, at)}
        <mark className={styles.match}>{text.slice(at, at + q.length)}</mark>
        {text.slice(at + q.length)}
      </span>
    );
  }
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const pieces: React.ReactNode[] = [];
  let from = 0;
  for (let found = at; found >= 0; found = lower.indexOf(needle, from)) {
    if (found > from) pieces.push(text.slice(from, found));
    pieces.push(
      <mark key={found} className={styles.match}>
        {text.slice(found, found + q.length)}
      </mark>,
    );
    from = found + q.length;
  }
  if (from < text.length) pieces.push(text.slice(from));
  return <span>{pieces}</span>;
}

/** Marks the match in every string / number child; elements pass through untouched. */
export function highlightChildren(children: React.ReactNode, query: string): React.ReactNode {
  if (!query.trim()) return children;
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <HighlightMatch text={String(child)} query={query} />
    ) : (
      child
    ),
  );
}
