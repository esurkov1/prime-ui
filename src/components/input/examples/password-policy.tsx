/** A password change under a policy: a new password below the required level turns the meter danger and stops the submit, the repeat gets a check once it matches — `strength`, `minStrength`, `valid`. */
import { Button, Fieldset, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function InputPasswordPolicyExample() {
  const [password, setPassword] = React.useState("Graphite7");
  const [repeat, setRepeat] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const matches = repeat !== "" && repeat === password;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setSaved(matches);
      }}
    >
      <Fieldset>
        <Input.Root label="Новый пароль" hint="Не ниже среднего уровня" strength minStrength={3}>
          <Input.Wrapper>
            <Input.Field
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onValueChange={(value) => {
                setPassword(value);
                setSaved(false);
              }}
            />
            <Input.RevealButton />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root
          label="Повторите пароль"
          valid={matches}
          error={submitted && !matches ? "Пароли не совпадают" : undefined}
        >
          <Input.Wrapper>
            <Input.Field
              type="password"
              autoComplete="new-password"
              value={repeat}
              onValueChange={(value) => {
                setRepeat(value);
                setSaved(false);
              }}
            />
          </Input.Wrapper>
        </Input.Root>
      </Fieldset>
      <div>
        <Button.Root type="submit" tone={saved ? "success" : "accent"}>
          {saved ? "Пароль изменён" : "Сменить пароль"}
        </Button.Root>
      </div>
    </form>
  );
}
