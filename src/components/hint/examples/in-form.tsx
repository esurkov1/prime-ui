/** A password change form with hints via the Input `hint` prop; after submit the error takes the hint's slot. Use field props instead of a standalone Hint whenever the field has them. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintInFormExample() {
  const [password, setPassword] = React.useState("qwerty");
  const [submitted, setSubmitted] = React.useState(false);
  const tooShort = password.length < 8;

  return (
    <form
      className={styles.form}
      aria-label="Смена пароля"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Input.Root label="Текущий пароль" required hint="Тот, которым вы входите сейчас.">
        <Input.Wrapper>
          <Input.Field type="password" defaultValue="secret-pass" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="Новый пароль"
        required
        hint="Не менее 8 символов, буквы и цифры."
        error={submitted && tooShort ? "Пароль короче 8 символов." : undefined}
      >
        <Input.Wrapper>
          <Input.Field
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Input.Wrapper>
      </Input.Root>
      <div className={styles.actions}>
        <Button.Root type="submit">Сохранить пароль</Button.Root>
      </div>
    </form>
  );
}
