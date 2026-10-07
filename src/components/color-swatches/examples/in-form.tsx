/** A calendar event form: the color is submitted by `name` and required on save — `name`, `required`, `error`. */
import { Button, ColorSwatches, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ColorSwatchesInFormExample() {
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const color = new FormData(event.currentTarget).get("color");
    setError(color ? undefined : "Выберите цвет события");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Input.Root label="Название события" required>
        <Input.Wrapper>
          <Input.Field name="title" defaultValue="Встреча с поставщиком" />
        </Input.Wrapper>
      </Input.Root>
      <ColorSwatches
        label="Цвет в календаре"
        name="color"
        required
        error={error}
        onValueChange={() => setError(undefined)}
      />
      <div className={styles.actions}>
        <Button.Root type="submit">Сохранить</Button.Root>
      </div>
    </form>
  );
}
