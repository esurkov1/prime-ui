/** The submit cycle: the button is busy while the request runs, a refused sign-in marks both fields, which shake once, and the password field says why in words — `loading`, `invalid`, `error`. */
import { Button, Fieldset, Icon, Input, LoginForm } from "prime-ui-kit";
import * as React from "react";

export default function LoginFormStatesExample() {
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <LoginForm.Root>
      <LoginForm.Header>
        <LoginForm.Logo>
          <Icon name="action.login" />
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
          <Fieldset disabled={pending}>
            <Input.Root label="Email" required invalid={failed}>
              <Input.Wrapper>
                <Input.Field
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.ru"
                  onValueChange={() => setFailed(false)}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root
              label="Пароль"
              required
              error={failed ? "Неверная почта или пароль" : undefined}
            >
              <Input.Wrapper>
                <Input.Field
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                  onValueChange={() => setFailed(false)}
                />
              </Input.Wrapper>
            </Input.Root>
          </Fieldset>
          <Button.Root type="submit" fullWidth loading={pending}>
            Войти
          </Button.Root>
        </LoginForm.Form>
      </LoginForm.Body>
    </LoginForm.Root>
  );
}
