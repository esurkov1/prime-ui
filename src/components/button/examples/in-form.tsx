/** A full-width submit button that shows the request in progress after the email passes validation — `type`, `loading`, `fullWidth`. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** The email error, or nothing when the address is valid. */
function emailError(value: string) {
  if (!value.trim()) return "Введите рабочую почту";
  if (!/^\S+@\S+\.\S+$/.test(value.trim())) return "Проверьте адрес: нужен вид name@company.ru";
  return undefined;
}

export default function ButtonInFormExample() {
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = emailError(String(new FormData(event.currentTarget).get("email") ?? ""));
    setError(next);
    if (next) return;
    setSending(true);
    window.setTimeout(() => setSending(false), 1500);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Input.Root label="Рабочая почта" required error={error} reserveSupportRow>
        <Input.Wrapper>
          <Input.Field
            type="email"
            name="email"
            placeholder="name@company.ru"
            autoComplete="email"
            onValueChange={() => setError(undefined)}
          />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root type="submit" loading={sending} fullWidth>
        Получить ссылку для входа
      </Button.Root>
    </form>
  );
}
