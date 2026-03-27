import { Button, DigitInput, Hint, Label } from "prime-ui-kit";
import * as React from "react";

/** Шаг подтверждения: кнопка «Продолжить» активна только после ввода полного кода. */
export default function VerificationStepExample() {
  const [code, setCode] = React.useState("");
  const isComplete = code.length === 6;

  return (
    <>
      <Label.Root>Код из письма</Label.Root>
      <DigitInput.Root length={6} value={code} onChange={setCode} />
      <Button.Root disabled={!isComplete} type="button" variant="primary">
        Продолжить
      </Button.Root>
      <Hint.Root variant="default">
        Введите шестизначный код со страницы подтверждения email.
      </Hint.Root>
    </>
  );
}
