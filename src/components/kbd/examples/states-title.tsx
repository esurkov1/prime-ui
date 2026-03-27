import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
};

/** Обычный `Kbd` и вариант с нативной подсказкой через `title` (parity with `playground/snippets/kbd/states.tsx`). */
export default function KbdStatesTitleExample() {
  return (
    <div style={row}>
      <Kbd.Root>Enter</Kbd.Root>
      <Kbd.Root title="Сохранить и закрыть">Ctrl+Enter</Kbd.Root>
    </div>
  );
}
