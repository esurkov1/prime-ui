/** A long code read in chunks with a wider gap between groups — `groupSize`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputGroupedExample() {
  return (
    <>
      <DigitInput label="Код из приложения" length={6} groupSize={3} defaultValue="482915" />
      <DigitInput label="Резервный код" length={8} groupSize={4} />
    </>
  );
}
