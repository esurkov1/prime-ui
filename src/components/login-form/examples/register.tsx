/** Sign-up: five fields in one column, a strength meter on the new password and a mismatch shown as the field error — `strength`, `error`, `LoginForm.Form`. */
import { Button, Divider, Icon, Input, LinkButton, LoginForm } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LoginFormRegisterExample() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className={styles.stage}>
      <LoginForm.Root>
        <LoginForm.Header>
          <LoginForm.Logo>
            <Icon name="action.send" />
          </LoginForm.Logo>
          <LoginForm.Title>Регистрация</LoginForm.Title>
          <LoginForm.Description>Создайте аккаунт за минуту</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Actions>
            <Button.Root variant="outline" tone="neutral" fullWidth>
              <Button.Icon>
                <Icon name="action.send" />
              </Button.Icon>
              Продолжить через Telegram
            </Button.Root>
          </LoginForm.Actions>
          <Divider>или</Divider>
          <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
            <Input.Root label="Ваше имя" required>
              <Input.Wrapper>
                <Input.Field autoComplete="name" placeholder="Анна Смирнова" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Email" required>
              <Input.Wrapper>
                <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Логин в Telegram" required>
              <Input.Wrapper>
                <Input.Field placeholder="@login" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Пароль" required hint="Минимум 8 символов" strength>
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
              label="Повторите пароль"
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
            <Button.Root type="submit" fullWidth disabled={mismatch}>
              Создать аккаунт
            </Button.Root>
          </LoginForm.Form>
          <LoginForm.Footer>
            Уже есть аккаунт? <LinkButton href="#">Войти</LinkButton>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
