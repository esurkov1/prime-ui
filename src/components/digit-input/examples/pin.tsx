import { DigitInput, Label } from "prime-ui-kit";

/** PIN: четыре цифры, увеличенный размер ячеек для удобного ввода на тач-экране. */
export default function PinExample() {
  return (
    <>
      <Label.Root size="l">PIN-код</Label.Root>
      <DigitInput.Root length={4} size="l" />
    </>
  );
}
