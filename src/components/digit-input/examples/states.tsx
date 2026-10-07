/** A default code next to a disabled one — `disabled`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputStatesExample() {
  return (
    <>
      <DigitInput label="default" defaultValue="42" />
      <DigitInput label="disabled" defaultValue="42" disabled />
    </>
  );
}
