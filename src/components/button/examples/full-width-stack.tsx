import { Button } from "prime-ui-kit";

/**
 * `fullWidth` primary filled and neutral stroke at `size="m"` (parity with `playground/snippets/button/full-width.tsx`).
 */
export default function FullWidthStackExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
      }}
    >
      <Button.Root variant="primary" mode="filled" size="m" fullWidth>
        Button full width primary
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" size="m" fullWidth>
        Button full width neutral stroke
      </Button.Root>
    </div>
  );
}
