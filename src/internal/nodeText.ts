import * as React from "react";

/**
 * The plain text of a node tree: a label made of nodes (an icon and a word, a highlighted match)
 * still has a name to search, announce or show in a trigger. Booleans and empty nodes add nothing.
 */
export function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeText(node.props.children);
  }
  return "";
}
