import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
};

/** Аккорд из нескольких клавиш: каждая клавиша — отдельный `Kbd.Root`, плюс вне ключей. */
export default function CombinationKeysExample() {
  return (
    <div style={row}>
      <Kbd.Root>Ctrl</Kbd.Root>
      <span aria-hidden="true">+</span>
      <Kbd.Root>Shift</Kbd.Root>
      <span aria-hidden="true">+</span>
      <Kbd.Root>P</Kbd.Root>
    </div>
  );
}
