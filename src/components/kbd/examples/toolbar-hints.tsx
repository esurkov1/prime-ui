import { Button, Kbd } from "prime-ui-kit";
import type * as React from "react";

const toolbar: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-m)",
};

const hintCluster: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x2)",
};

/** Подсказки у тулбара: основное действие и рядом компактные клавиши того же визуального ряда. */
export default function ToolbarHintsExample() {
  return (
    <div role="toolbar" aria-label="Formatting" style={toolbar}>
      <div style={hintCluster}>
        <Button.Root>Bold</Button.Root>
        <Kbd.Root size="s">⌘B</Kbd.Root>
      </div>
      <div style={hintCluster}>
        <Button.Root>Italic</Button.Root>
        <Kbd.Root size="s">⌘I</Kbd.Root>
      </div>
    </div>
  );
}
