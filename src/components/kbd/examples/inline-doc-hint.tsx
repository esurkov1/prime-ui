import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const paragraph: React.CSSProperties = {
  maxWidth: "calc(var(--prime-sys-unit-1rem) * 32)",
  margin: 0,
  font: "inherit",
  color: "var(--prime-sys-color-content-primary)",
};

/** Встроенная подсказка в тексте: `Kbd` в потоке абзаца. */
export default function InlineDocHintExample() {
  return (
    <p style={paragraph}>
      To cancel, press <Kbd.Root>Esc</Kbd.Root>. To confirm, press <Kbd.Root>Enter</Kbd.Root>.
    </p>
  );
}
