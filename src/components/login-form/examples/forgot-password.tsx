/** Password reset request: one field, the primary action and a quiet way back — `LoginForm.Actions`. */
import { Button, Icon, Input, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LoginFormForgotPasswordExample() {
  return (
    <div className={styles.stage}>
      <LoginForm.Root>
        <LoginForm.Header>
          <LoginForm.Logo>
            <Icon name="object.key" />
          </LoginForm.Logo>
          <LoginForm.Title>Сброс пароля</LoginForm.Title>
          <LoginForm.Description>
            Введите email от аккаунта — отправим ссылку для смены пароля
          </LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
            <Input.Root label="Email" required>
              <Input.Wrapper>
                <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <LoginForm.Actions>
              <Button.Root type="submit" fullWidth>
                Отправить ссылку
              </Button.Root>
              <Button.Root variant="ghost" tone="neutral" fullWidth>
                Вернуться ко входу
              </Button.Root>
            </LoginForm.Actions>
          </LoginForm.Form>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
