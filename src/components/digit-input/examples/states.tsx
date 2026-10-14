/** A default code next to a disabled one, an invalid one with no message and an accepted one — `disabled`, `invalid`, `success`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputStatesExample() {
  return (
    <div>
      <div>
        <DigitInput label="default" defaultValue="42" />
      </div>
      <div>
        <DigitInput label="disabled" defaultValue="42" disabled />
      </div>
      <div>
        <DigitInput label="invalid" defaultValue="4271" invalid />
      </div>
      <div>
        <DigitInput label="success" defaultValue="4821" success hint="Код подтверждён" />
      </div>
    </div>
  );
}
