import * as React from "react";

import { motionDurationMs, prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";

import styles from "./glyphSwap.module.css";

type Layer = { id: number; key: string; node: React.ReactNode };

const typeIds = new WeakMap<object, number>();
let nextTypeId = 0;

/** A stable name for an element type (never `displayName`: behaviour compares types). */
function typeName(type: unknown): string {
  if (typeof type === "string") return type;
  if (type && (typeof type === "object" || typeof type === "function")) {
    let id = typeIds.get(type);
    if (id === undefined) {
      nextTypeId += 1;
      id = nextTypeId;
      typeIds.set(type, id);
    }
    return `#${id}`;
  }
  return "?";
}

/**
 * What a glyph is: the element type with its `name` prop (an `<Icon name>`) and its key. Text and
 * numbers are one glyph whose words change in place (a percent ticking up never cross-fades).
 */
export function glyphKey(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return "text";
  if (React.isValidElement<{ name?: unknown }>(node)) {
    const name = typeof node.props.name === "string" ? node.props.name : "";
    return `${typeName(node.type)}:${name}:${node.key ?? ""}`;
  }
  return "many";
}

/**
 * A glyph that changes cross-fades in place (foundation §7 rule 7): the outgoing one shrinks to 0.6
 * and fades, the incoming one grows from 0.6 (`fast` · standard) and plays its own gesture once
 * (`data-play`, `icons/glyphMotion`). Both share one grid cell, so the box keeps the glyph's size.
 * A change of the same glyph (new words, new props) updates in place. Reduced motion swaps at once
 * and plays no gesture. Used by `Button.Icon` and the centre of ProgressCircle.
 */
export function GlyphSwap({
  children,
  className,
  layerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  /** A class on every glyph layer, for the host to style the glyph inside (`.glyph > svg`). */
  layerClassName?: string;
}) {
  const key = glyphKey(children);
  const [state, setState] = React.useState<{ current: Layer; leaving: Layer[]; swaps: number }>(
    () => ({ current: { id: 0, key, node: null }, leaving: [], swaps: 0 }),
  );
  // What the last render showed: the content a glyph keeps while it leaves.
  const rendered = React.useRef<React.ReactNode>(children);
  if (state.current.key !== key) {
    const previous = { ...state.current, node: rendered.current };
    setState({
      current: { id: state.current.id + 1, key, node: null },
      leaving: prefersReducedMotion() || previous.key === "" ? [] : [...state.leaving, previous],
      swaps: state.swaps + 1,
    });
  }
  React.useEffect(() => {
    rendered.current = children;
  });

  const leavingIds = state.leaving.map((layer) => layer.id).join(",");
  React.useEffect(() => {
    if (!leavingIds) return;
    const timer = window.setTimeout(
      () => setState((s) => ({ ...s, leaving: [] })),
      motionDurationMs("fast"),
    );
    return () => window.clearTimeout(timer);
  }, [leavingIds]);

  const incoming = React.useRef<HTMLSpanElement | null>(null);
  React.useLayoutEffect(() => {
    if (state.swaps === 0 || prefersReducedMotion()) return;
    for (const icon of incoming.current?.querySelectorAll("svg[data-icon-motion]") ?? []) {
      icon.setAttribute("data-play", "");
    }
  }, [state.swaps]);

  return (
    <span className={cx(styles.swap, className)}>
      {state.leaving.map((layer) => (
        <span
          key={layer.id}
          className={cx(styles.layer, layerClassName)}
          data-leaving=""
          aria-hidden="true"
        >
          {layer.node}
        </span>
      ))}
      {key === "" ? null : (
        <span
          key={state.current.id}
          ref={incoming}
          className={cx(styles.layer, layerClassName)}
          data-entering={state.swaps > 0 ? "" : undefined}
        >
          {children}
        </span>
      )}
    </span>
  );
}
