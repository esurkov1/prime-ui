/** Required and optional markers, a hint and an error that replaces it — `required`, `optional`, `hint`, `error`. */
import { DigitInput } from "prime-ui-kit";

export default function DigitInputValidationExample() {
  return (
    <>
      <DigitInput label="Код из письма" required hint="Проверьте папку «Спам»" length={6} />
      <DigitInput
        label="Код подтверждения"
        required
        defaultValue="1111"
        error="Неверный код, осталось 2 попытки"
      />
      <DigitInput label="Код приглашения" optional />
    </>
  );
}
