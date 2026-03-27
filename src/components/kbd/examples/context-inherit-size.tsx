import { ControlSizeProvider, Kbd } from "prime-ui-kit";
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

/**
 * Без `size` — масштаб из ближайшего `ControlSizeProvider`; явный `size` перекрывает контекст.
 * Контекст `xs` на поверхности контрола маппится в эффективный `s` на kbd (parity with `playground/snippets/kbd/inherit-size.tsx`).
 */
export default function KbdContextInheritSizeExample() {
  return (
    <div style={stack}>
      <ControlSizeProvider value="xl">
        <div style={row}>
          <Kbd.Root>Ctrl</Kbd.Root>
          <span aria-hidden="true">+</span>
          <Kbd.Root>B</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="s">
        <div style={row}>
          <Kbd.Root>Tab</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="xs">
        <div style={row}>
          <Kbd.Root>xs→s</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="xl">
        <Kbd.Root size="s">Явный s</Kbd.Root>
      </ControlSizeProvider>
    </div>
  );
}
