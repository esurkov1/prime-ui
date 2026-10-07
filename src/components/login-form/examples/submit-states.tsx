/** Real submit cycle: the button shows `loading` while the request runs, a failed request returns a danger Banner above the fields and marks the password. Use it as the reference for server errors. */
import { CircleAlert, LogIn } from "lucide-react";
import { Banner, Button, Input, LoginForm } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LoginFormSubmitStatesExample() {
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className={styles.stage}>
      <LoginForm.Root>
        <LoginForm.Header>
          <LoginForm.Logo>
            <LogIn aria-hidden />
          </LoginForm.Logo>
          <LoginForm.Title>Войти в аккаунт</LoginForm.Title>
          <LoginForm.Description>Любая пара email и пароля вернёт ошибку</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form
            onSubmit={(e) => {
              e.preventDefault();
              setFailed(false);
              setPending(true);
              timer.current = setTimeout(() => {
                setPending(false);
                setFailed(true);
              }, 1200);
            }}
          >
            {failed ? (
              <Banner.Root tone="danger" role="alert">
                <Banner.Content>
                  <Banner.Icon as={CircleAlert} aria-hidden />
                  <Banner.Title>Неверный email или пароль</Banner.Title>
                </Banner.Content>
              </Banner.Root>
            ) : null}
            <Input.Root label="Email" required>
              <Input.Wrapper>
                <Input.Field
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.ru"
                  disabled={pending}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Пароль" required invalid={failed}>
              <Input.Wrapper>
                <Input.Field
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                  disabled={pending}
                  onValueChange={() => setFailed(false)}
                />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth loading={pending}>
              Войти
            </Button.Root>
          </LoginForm.Form>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
