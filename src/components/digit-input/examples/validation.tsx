/** A confirmation code checked once it is complete: a wrong code shakes in with one message and leaves as soon as you type again; a hint and an optional code — `required`, `optional`, `hint`, `error`. */
import { DigitInput } from "prime-ui-kit";
import * as React from "react";

const CODE = "482916";

export default function DigitInputValidationExample() {
  const [error, setError] = React.useState<string>();

  return (
    <>
      <DigitInput
        label="Код из письма"
        required
        hint={`Проверьте папку «Спам». Для примера — ${CODE}`}
        length={6}
        error={error}
        onValueChange={() => setError(undefined)}
        onComplete={(value) => setError(value === CODE ? undefined : "Неверный код")}
      />
      <DigitInput label="Код приглашения" optional />
    </>
  );
}
