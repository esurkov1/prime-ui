/** Switches submitted with a form: the value goes to FormData by `name`, a required one shows an error — `name`, `required`, `error`. */
import { Button, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SwitchInFormExample() {
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accepted = new FormData(event.currentTarget).get("processing") === "on";
    setError(accepted ? undefined : "Без согласия аккаунт не создать");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Switch.Root name="news" defaultChecked>
        <Switch.Label>Новости продукта</Switch.Label>
      </Switch.Root>
      <Switch.Root
        name="processing"
        required
        error={error}
        onCheckedChange={(checked) => checked && setError(undefined)}
      >
        <Switch.Label>Согласие на обработку данных</Switch.Label>
      </Switch.Root>
      <div className={styles.formActions}>
        <Button.Root type="submit">Создать аккаунт</Button.Root>
      </div>
    </form>
  );
}
