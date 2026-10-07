/** Sign in by e-mail and password with a Telegram option on top, a divider, a «forgot password» link and a link to sign-up. A standalone brand-first screen: `align="center"` gives a round logo above centered text (the default `start` header, icon left and text right, is used in the other examples). */
import { Send } from "lucide-react";
import { Button, Divider, Input, LinkButton, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LoginFormSignInExample() {
  return (
    <div className={styles.stage}>
      <LoginForm.Root align="center">
        <LoginForm.Header>
          <LoginForm.Logo>
            <Send aria-hidden />
          </LoginForm.Logo>
          <LoginForm.Title>Войти в аккаунт</LoginForm.Title>
          <LoginForm.Description>Введите данные для входа в кабинет</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Social>
            <Button.Root variant="outline" tone="neutral" fullWidth>
              <Button.Icon>
                <Send />
              </Button.Icon>
              Продолжить через Telegram
            </Button.Root>
          </LoginForm.Social>
          <Divider.Root>или</Divider.Root>
          <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
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
              <LinkButton.Root href="#" size="s" tone="neutral">
                Забыли пароль?
              </LinkButton.Root>
            </div>
            <Button.Root type="submit" fullWidth>
              Войти
            </Button.Root>
          </LoginForm.Form>
          <LoginForm.Footer>
            Нет аккаунта? <LinkButton.Root href="#">Зарегистрироваться</LinkButton.Root>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
