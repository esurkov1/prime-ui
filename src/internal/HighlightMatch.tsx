import * as React from "react";

import styles from "./HighlightMatch.module.css";

/** Index of the first case-insensitive occurrence of `query` in `text`; -1 for an empty query. */
export function matchIndex(text: string, query: string): number {
  if (!query) return -1;
  return text.toLowerCase().indexOf(query.toLowerCase());
}

/**
 * `text` with its first match of `query` marked (underlined); plain text when nothing matches.
 * The pieces share one span, so a flex row with a `gap` (a menu item) keeps the word whole.
 */
export function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const at = matchIndex(text, q);
  if (at < 0) return <>{text}</>;
  return (
    <span>
      {text.slice(0, at)}
      <mark className={styles.match}>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </span>
  );
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
