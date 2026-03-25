import { DigitInput } from "@/components/digit-input/DigitInput";

/** Четыре размера ячеек: `size` s, m, l, xl — те же токены контролов, что у поля ввода. */
export default function DigitInputSizesSnippet() {
  return (
    <>
      <DigitInput.Root size="s" length={4} defaultValue="1234" />
      <DigitInput.Root size="m" length={4} defaultValue="1234" />
      <DigitInput.Root size="l" length={4} defaultValue="1234" />
      <DigitInput.Root size="xl" length={4} defaultValue="1234" />
    </>
  );
}
