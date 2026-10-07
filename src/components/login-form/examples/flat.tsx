/** `flat` removes the shadow so the form sits inside a Modal or on a plain page without a double surface. Use it when the host already provides the surface. */
import { Button, Input, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LoginFormFlatExample() {
  return (
    <div className={styles.stage}>
      <LoginForm.Root flat>
        <LoginForm.Header>
          <LoginForm.Title>Войти в аккаунт</LoginForm.Title>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
            <Input.Root label="Email">
              <Input.Wrapper>
                <Input.Field type="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth>
              Получить ссылку для входа
            </Button.Root>
          </LoginForm.Form>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
