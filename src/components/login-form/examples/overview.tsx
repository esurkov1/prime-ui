/** Sign in with a provider button, e-mail and password, a «forgot password» link and a sign-up link under a header that names the action: its icon tile on the left, the title and one line beside it — `LoginForm.Logo`, `LoginForm.Actions`, `LoginForm.Form`, `LoginForm.Footer`. */
import { Button, Divider, Icon, Input, LinkButton, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LoginFormOverviewExample() {
  return (
    <LoginForm.Root>
      <LoginForm.Header>
        <LoginForm.Logo>
          <Icon name="action.login" />
        </LoginForm.Logo>
        <LoginForm.Title>Войти в аккаунт</LoginForm.Title>
        <LoginForm.Description>Через SSO компании или по рабочей почте</LoginForm.Description>
      </LoginForm.Header>
      <LoginForm.Body>
        <LoginForm.Actions>
          <Button.Root variant="outline" tone="neutral" fullWidth>
            <Button.Icon>
              <Icon name="object.key" />
            </Button.Icon>
            Войти через SSO компании
          </Button.Root>
        </LoginForm.Actions>
        <Divider>или</Divider>
        <LoginForm.Form aria-label="Вход по почте" onSubmit={(e) => e.preventDefault()}>
          <Input.Root label="Email" required>
            <Input.Wrapper>
              <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <div className={styles.withLink}>
            <Input.Root label="Пароль" required>
              <Input.Wrapper>
                <Input.Field
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                />
              </Input.Wrapper>
            </Input.Root>
            <LinkButton href="#" size="s" tone="neutral">
              Забыли пароль?
            </LinkButton>
          </div>
          <Button.Root type="submit" fullWidth>
            Войти
          </Button.Root>
        </LoginForm.Form>
        <LoginForm.Footer>
          Нет аккаунта? <LinkButton href="#">Зарегистрироваться</LinkButton>
        </LoginForm.Footer>
      </LoginForm.Body>
    </LoginForm.Root>
  );
}
