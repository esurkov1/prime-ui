import { Icon, Kbd } from "prime-ui-kit";
import type * as React from "react";

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
};

const stack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--prime-sys-spacing-m)",
};

/** Сочетание из нескольких `Kbd.Root` и один бейдж с иконкой внутри (parity with `playground/snippets/kbd/composition.tsx`). */
export default function KbdCompositionChordIconExample() {
  return (
    <div style={stack}>
      <div style={row}>
        <Kbd.Root>⌘</Kbd.Root>
        <span aria-hidden="true">+</span>
        <Kbd.Root>K</Kbd.Root>
      </div>
      <div style={row}>
        <Kbd.Root>
          <Icon name="action.close" aria-hidden />
          <span>Esc</span>
        </Kbd.Root>
      </div>
    </div>
  );
}
