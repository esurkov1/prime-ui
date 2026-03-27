import { Button, DigitInput, Label } from "prime-ui-kit";
import * as React from "react";

/** Повторная отправка кода: сброс поля через родительское состояние. */
export default function ResendAndClearExample() {
  const [code, setCode] = React.useState("");

  return (
    <>
      <Label.Root>Код</Label.Root>
      <DigitInput.Root length={4} value={code} onChange={setCode} />
      <Button.Root mode="stroke" type="button" variant="neutral" onClick={() => setCode("")}>
        Отправить снова
      </Button.Root>
    </>
  );
}
