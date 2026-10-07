/** Consent in a sign-up form: a hint under the text, an error after a submit without the tick — `required`, `hint`, `error`. */
import { Button, Checkbox } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function CheckboxInFormExample() {
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accepted = new FormData(event.currentTarget).get("terms") === "on";
    setError(accepted ? undefined : "Без согласия мы не сможем создать аккаунт");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Checkbox.Root
        name="terms"
        required
        error={error}
        onCheckedChange={(checked) => checked && setError(undefined)}
      >
        <Checkbox.Label>Принимаю условия оферты</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root name="news" hint="Не чаще раза в месяц, отписаться можно в профиле">
        <Checkbox.Label>Получать новости продукта</Checkbox.Label>
      </Checkbox.Root>
      <div className={styles.formActions}>
        <Button.Root type="submit">Создать аккаунт</Button.Root>
      </div>
    </form>
  );
}
