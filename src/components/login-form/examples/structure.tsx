/** The minimal form: no logo, description or footer, no shadow for a host that already is a surface and a second-level title under the host page's own heading — `flat`, `as`. */
import { Button, Input, LoginForm } from "prime-ui-kit";

export default function LoginFormStructureExample() {
  return (
    <LoginForm.Root flat>
      <LoginForm.Header>
        <LoginForm.Title as="h2">Войти, чтобы оплатить счёт</LoginForm.Title>
      </LoginForm.Header>
      <LoginForm.Body>
        <LoginForm.Form onSubmit={(e) => e.preventDefault()}>
          <Input.Root label="Email">
            <Input.Wrapper>
              <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root type="submit" fullWidth>
            Получить ссылку для входа
          </Button.Root>
        </LoginForm.Form>
      </LoginForm.Body>
    </LoginForm.Root>
  );
}
