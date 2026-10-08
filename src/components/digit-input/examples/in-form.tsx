/** A masked card PIN submitted with a form; a short PIN shows an error — `name`, `mask`, `required`, `error`. */
import { Button, DigitInput } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PIN_LENGTH = 4;

export default function DigitInputInFormExample() {
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pin = String(new FormData(event.currentTarget).get("pin") ?? "");
    setError(pin.length === PIN_LENGTH ? undefined : "Введите все четыре цифры");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <DigitInput
        label="PIN-код карты"
        name="pin"
        length={PIN_LENGTH}
        mask
        required
        error={error}
        onValueChange={() => setError(undefined)}
      />
      <Button.Root type="submit">Привязать карту</Button.Root>
    </form>
  );
}
