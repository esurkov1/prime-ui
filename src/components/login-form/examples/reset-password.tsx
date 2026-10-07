/** A new password after the e-mail link: two fields and a mismatch error under the second one — `error`. */
import { LockKeyhole } from "lucide-react";
import { Button, Input, LoginForm } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LoginFormResetPasswordExample() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className={styles.stage}>
      <LoginForm.Root>
        <LoginForm.Header>
          <LoginForm.Logo>
            <LockKeyhole aria-hidden />
          </LoginForm.Logo>
          <LoginForm.Title>Создайте новый пароль</LoginForm.Title>
          <LoginForm.Description>
            Придумайте пароль и храните его в надёжном месте
          </LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
            <Input.Root label="Новый пароль" required hint="Минимум 6 символов">
              <Input.Wrapper>
                <Input.Field
                  type="password"
                  autoComplete="new-password"
                  placeholder="********"
                  value={password}
                  onValueChange={setPassword}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root
              label="Повторите новый пароль"
              required
              error={mismatch ? "Пароли не совпадают" : undefined}
            >
              <Input.Wrapper>
                <Input.Field
                  type="password"
                  autoComplete="new-password"
                  placeholder="********"
                  value={confirm}
                  onValueChange={setConfirm}
                />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth disabled={mismatch || password.length < 6}>
              Сохранить
            </Button.Root>
          </LoginForm.Form>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
