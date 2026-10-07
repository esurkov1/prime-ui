/** On a phone-width screen the card keeps its padding, the header wraps and the buttons stay full width. */
import { Button, Input, LinkButton, LoginForm } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LoginFormNarrowExample() {
  return (
    <div className={styles.narrow}>
      <LoginForm.Root size="s">
        <LoginForm.Header>
          <LoginForm.Title>Вход в кабинет поставщика</LoginForm.Title>
          <LoginForm.Description>Пришлём ссылку для входа на рабочую почту</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form onSubmit={(event) => event.preventDefault()}>
            <Input.Root label="Рабочая почта" required>
              <Input.Wrapper>
                <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth>
              Получить ссылку
            </Button.Root>
          </LoginForm.Form>
          <LoginForm.Footer>
            Нет доступа? <LinkButton href="#">Написать в поддержку</LinkButton>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
