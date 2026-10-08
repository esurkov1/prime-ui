/** A calendar event form: the color is submitted by `name` and required on save: submitting an empty title or no color shakes the field, picking or typing clears the error — `name`, `required`, `error`. */
import { Button, ColorSwatches, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ColorSwatchesInFormExample() {
  const [titleError, setTitleError] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setTitleError(String(data.get("title") ?? "").trim() ? undefined : "Введите название события");
    setError(data.get("color") ? undefined : "Выберите цвет события");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Input.Root label="Название события" required error={titleError} reserveSupportRow>
        <Input.Wrapper>
          <Input.Field
            name="title"
            defaultValue="Встреча с поставщиком"
            onValueChange={() => setTitleError(undefined)}
          />
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
