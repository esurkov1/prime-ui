import { Button, DigitInput, Label } from "prime-ui-kit";
import * as React from "react";

/** Повторная отправка кода: сброс поля через родительское состояние. */
export default function ResendAndClearExample() {
  const [code, setCode] = React.useState("");

  return (
    <>
      <Label.Root size="m">Код</Label.Root>
      <DigitInput.Root length={4} size="m" value={code} onChange={setCode} />
      <Button.Root
        mode="stroke"
        size="m"
        type="button"
        variant="neutral"
        onClick={() => setCode("")}
      >
        Отправить снова
      </Button.Root>
    </>
  );
}
