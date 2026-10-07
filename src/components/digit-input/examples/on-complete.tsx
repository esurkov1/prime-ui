/** The code is checked as soon as the last cell is filled; a wrong code turns the hint into an error — `onComplete`, `error`. */
import { DigitInput } from "prime-ui-kit";
import * as React from "react";

const VALID_CODE = "123456";

export default function DigitInputOnCompleteExample() {
  const [error, setError] = React.useState<string>();

  return (
    <DigitInput
      label="Код подтверждения входа"
      length={6}
      hint={`Для проверки подходит ${VALID_CODE}`}
      error={error}
      onValueChange={() => setError(undefined)}
      onComplete={(code) => setError(code === VALID_CODE ? undefined : "Неверный код")}
    />
  );
}
