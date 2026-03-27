import { Button } from "prime-ui-kit";

/**
 * Size ladder: `s`–`xl` at `variant="primary"` `mode="filled"` (parity with `playground/snippets/button/sizes.tsx`).
 */
export default function SizesLadderExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "center",
      }}
    >
      <Button.Root variant="primary" mode="filled" size="s">
        Button s
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="m">
        Button m
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="l">
        Button l
      </Button.Root>
      <Button.Root variant="primary" mode="filled" size="xl">
        Button xl
      </Button.Root>
    </div>
  );
}
