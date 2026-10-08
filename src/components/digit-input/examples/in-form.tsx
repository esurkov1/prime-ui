/** A masked card PIN submitted with a form; a short or wrong PIN shakes in an error that leaves when you type again — `name`, `mask`, `required`, `error`. */
import { Button, DigitInput, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PIN_LENGTH = 4;
const PIN = "4821";

export default function DigitInputInFormExample() {
  const [error, setError] = React.useState<string>();
  const [linked, setLinked] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pin = String(new FormData(event.currentTarget).get("pin") ?? "");
    const next =
      pin.length !== PIN_LENGTH
        ? "Введите все четыре цифры"
        : pin === PIN
          ? undefined
          : "Неверный PIN-код";
    setError(next);
    setLinked(next === undefined);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <DigitInput
        label="PIN-код карты"
        name="pin"
        length={PIN_LENGTH}
        mask
        required
        hint={`Для примера — ${PIN}`}
        error={error}
        onValueChange={() => {
          setError(undefined);
          setLinked(false);
        }}
      />
      {linked ? (
        <Typography as="p" variant="body-s" tone="secondary" role="status">
          Карта привязана.
        </Typography>
      ) : null}
      <Button.Root type="submit">Привязать карту</Button.Root>
    </form>
  );
}
