/** Tiers `s`, `m` and `l`: card padding, gaps and text roles follow `size`; pass the same `size` to the fields and buttons. Use `s` in a modal, `m` on a regular page, `l` on a standalone sign-in screen. */
import { Button, Input, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["s", "m", "l"] as const;

export default function LoginFormSizesExample() {
  return (
    <div className={styles.row}>
      {sizes.map((size) => (
        <LoginForm.Root key={size} size={size}>
          <LoginForm.Header>
            <LoginForm.Title>Войти в аккаунт</LoginForm.Title>
            <LoginForm.Description>Размер {size}</LoginForm.Description>
          </LoginForm.Header>
          <LoginForm.Body>
            <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
              <Input.Root size={size} label="Email">
                <Input.Wrapper>
                  <Input.Field type="email" placeholder="name@company.ru" />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root size={size} label="Пароль">
                <Input.Wrapper>
                  <Input.Field type="password" placeholder="********" />
                </Input.Wrapper>
              </Input.Root>
              <Button.Root type="submit" size={size} fullWidth>
                Войти
              </Button.Root>
            </LoginForm.Form>
          </LoginForm.Body>
        </LoginForm.Root>
      ))}
    </div>
  );
}
