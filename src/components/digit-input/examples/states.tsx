/** A default code next to a disabled one, an invalid one with no message and an accepted one — `disabled`, `invalid`, `success`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputStatesExample() {
  return (
    <>
      <DigitInput label="default" defaultValue="42" />
      <DigitInput label="disabled" defaultValue="42" disabled />
      <DigitInput label="invalid" defaultValue="4271" invalid />
      <DigitInput label="success" defaultValue="4821" success hint="Код подтверждён" />
    </>
  );
}
