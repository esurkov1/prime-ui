/** The code is checked as soon as the last cell is filled: a right one turns the cells success, a wrong one turns the hint into an error — `onComplete`, `success`, `error`. */
import { DigitInput } from "prime-ui-kit";
import * as React from "react";

const VALID_CODE = "123456";

export default function DigitInputOnCompleteExample() {
  const [result, setResult] = React.useState<"accepted" | "rejected">();

  return (
    <DigitInput
      label="Код подтверждения входа"
      length={6}
      hint={result === "accepted" ? "Код подтверждён" : `Для проверки подходит ${VALID_CODE}`}
      error={result === "rejected" ? "Неверный код" : undefined}
      success={result === "accepted"}
      onValueChange={() => setResult(undefined)}
      onComplete={(code) => setResult(code === VALID_CODE ? "accepted" : "rejected")}
    />
  );
}
