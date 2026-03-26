import { DigitInput, Hint, Label } from "prime-ui-kit";
import * as React from "react";

/** SMS / OTP: шесть ячеек, контролируемое значение, подсказка про вставку из буфера. */
export default function OtpLoginExample() {
  const [code, setCode] = React.useState("");

  return (
    <>
      <Label.Root size="m">Код из SMS</Label.Root>
      <DigitInput.Root length={6} size="m" value={code} onChange={setCode} />
      <Hint.Root size="m" variant="default">
        Вставьте код из сообщения — цифры заполнят ячейки с текущей позиции.
      </Hint.Root>
    </>
  );
}
