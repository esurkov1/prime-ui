import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  columnGap: "var(--prime-sys-spacing-l)",
  rowGap: "var(--prime-sys-spacing-s)",
  maxWidth: "calc(var(--prime-sys-unit-1rem) * 24)",
};

const chord: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
};

/** Легенда в документации: пары «действие → комбинация». */
export default function DocsLegendExample() {
  return (
    <dl style={grid}>
      <dt>Copy</dt>
      <dd style={chord}>
        <Kbd.Root>⌘</Kbd.Root>
        <span aria-hidden="true">+</span>
        <Kbd.Root>C</Kbd.Root>
      </dd>
      <dt>Command palette</dt>
      <dd style={chord}>
        <Kbd.Root>⌘</Kbd.Root>
        <span aria-hidden="true">+</span>
        <Kbd.Root>K</Kbd.Root>
      </dd>
      <dt>Undo</dt>
      <dd style={chord}>
        <Kbd.Root>⌘</Kbd.Root>
        <span aria-hidden="true">+</span>
        <Kbd.Root>Z</Kbd.Root>
      </dd>
    </dl>
  );
}
