import { Kbd } from "prime-ui-kit";
import type * as React from "react";

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
};

/** Номинальные размеры `s`–`xl` (parity with `playground/snippets/kbd/sizes.tsx`). */
export default function KbdSizesLadderExample() {
  return (
    <div style={row}>
      <Kbd.Root size="s">Kbd s</Kbd.Root>
      <Kbd.Root size="m">Kbd m</Kbd.Root>
      <Kbd.Root size="l">Kbd l</Kbd.Root>
      <Kbd.Root size="xl">Kbd xl</Kbd.Root>
    </div>
  );
}
