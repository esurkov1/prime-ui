/** A long code read in chunks with a wider gap between groups — `groupSize`. */
import { DigitInput, Fieldset } from "prime-ui-kit";

export default function DigitInputGroupedExample() {
  return (
    <Fieldset aria-label="Подтверждение входа">
      <DigitInput label="Код из приложения" length={6} groupSize={3} defaultValue="482915" />
      <DigitInput label="Резервный код" length={6} groupSize={2} />
    </Fieldset>
  );
}
