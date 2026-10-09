/** The code is checked on the server as soon as the last cell is filled: the cells wait, a right one turns them success, a wrong one clears them and shakes in the reason — `onComplete`, `hint`. */
import { DigitInput } from "prime-ui-kit";
import * as React from "react";

const VALID_CODE = "123456";

/** The server checking the code a beat later. */
function verifyCode(code: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (code === VALID_CODE) resolve();
      else reject(new Error("Неверный код — попробуйте ещё раз"));
    }, 900);
  });
}

export default function DigitInputOnCompleteExample() {
  const [verified, setVerified] = React.useState(false);

  return (
    <DigitInput
      label="Код подтверждения входа"
      length={6}
      // The success look is color: the hint says it in words.
      hint={verified ? "Код подтверждён" : `Для проверки подходит ${VALID_CODE}`}
      onValueChange={() => setVerified(false)}
      onComplete={async (code) => {
        await verifyCode(code);
        setVerified(true);
      }}
    />
  );
}
