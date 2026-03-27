import { DigitInput } from "prime-ui-kit";

/**
 * Четыре размера ячеек: `size` s, m, l, xl — те же токены контролов, что у поля ввода.
 * Паритет с `playground/snippets/digit-input/sizes.tsx`.
 */
export default function DigitInputSizesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "center",
      }}
    >
      <DigitInput.Root size="s" length={4} defaultValue="1234" />
      <DigitInput.Root size="m" length={4} defaultValue="1234" />
      <DigitInput.Root size="l" length={4} defaultValue="1234" />
      <DigitInput.Root size="xl" length={4} defaultValue="1234" />
    </div>
  );
}
