import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const shortcutRow: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--prime-sys-spacing-m)",
  maxWidth: "calc(var(--prime-sys-unit-1rem) * 22)",
};

/** Строка меню или списка команд: действие слева, шорткат справа (`size="s"` — плотный хром). */
export default function ShortcutRowExample() {
  return (
    <div style={shortcutRow}>
      <span>Save</span>
      <Kbd.Root size="s">⌘S</Kbd.Root>
    </div>
  );
}
