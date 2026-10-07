/** A six-digit code from SMS with its label and a hint — `label`, `hint`, `length`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputOverviewExample() {
  return <DigitInput label="Код из SMS" hint="Код действует 5 минут" length={6} />;
}
