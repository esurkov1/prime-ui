/** A full-width submit button that shows the request in progress — `type`, `loading`, `fullWidth`. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ButtonInFormExample() {
  const [sending, setSending] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => setSending(false), 1500);
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <Input.Root label="Рабочая почта" required>
        <Input.Wrapper>
          <Input.Field
            type="email"
            name="email"
            placeholder="name@company.ru"
            autoComplete="email"
          />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root type="submit" loading={sending} fullWidth>
        Получить ссылку для входа
      </Button.Root>
    </form>
  );
}
