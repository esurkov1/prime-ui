/** The one code on a pickup point screen, where the caret and the lighter fill of the entry cell show focus — `focusRing`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputWithoutFocusRingExample() {
  return (
    <DigitInput
      label="Код выдачи заказа"
      hint="Покупатель называет его на кассе"
      length={6}
      focusRing={false}
    />
  );
}
