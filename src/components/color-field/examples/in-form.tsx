/** A pipeline stage form: the color goes with the form by `name`, a calm note confirms the save — `name`, `required`. */
import { Button, Card, Input, Typography } from "prime-ui-kit";
import { ColorField } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

export default function ColorFieldInFormExample() {
  const [saved, setSaved] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved(`Этап «${data.get("stage")}» сохранён, цвет ${data.get("stageColor")}.`);
  };

  return (
    <Card.Root className={styles.formCard}>
      <Card.Body>
        <form className={styles.form} noValidate onSubmit={submit}>
          <Input.Root label="Название этапа" required>
            <Input.Wrapper>
              <Input.Field name="stage" defaultValue="Переговоры" />
            </Input.Wrapper>
          </Input.Root>
          <ColorField
            label="Цвет этапа"
            required
            name="stageColor"
            defaultValue="#F76B15"
            onValueChange={() => setSaved(undefined)}
          />
          <div className={styles.actions}>
            {saved ? (
              <Typography as="p" variant="body-s" tone="secondary" role="status">
                {saved}
              </Typography>
            ) : null}
            <Button.Root type="submit">Сохранить этап</Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
