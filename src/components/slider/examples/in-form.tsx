/** Campaign limits submitted with the form by `name`, a calm note confirms the save — `name`, `label`. */
import { Button, Slider, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SliderInFormExample() {
  const [saved, setSaved] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved(
      `Сохранено: показов в день — ${data.get("dailyCap")}, ставка — ${data.get("bidShare")}%.`,
    );
  };

  return (
    <form className={styles.column} noValidate onSubmit={submit}>
      <Slider
        label="Показов одному клиенту в день"
        name="dailyCap"
        min={1}
        max={10}
        defaultValue={3}
        showValue
        onValueChange={() => setSaved(undefined)}
      />
      <Slider
        label="Доля бюджета на ставки, %"
        name="bidShare"
        step={5}
        defaultValue={40}
        showValue
        onValueChange={() => setSaved(undefined)}
      />
      <div className={styles.actions}>
        <Button.Root type="submit">Сохранить лимиты</Button.Root>
        {saved ? (
          <Typography as="p" variant="body-s" tone="secondary" role="status">
            {saved}
          </Typography>
        ) : null}
      </div>
    </form>
  );
}
