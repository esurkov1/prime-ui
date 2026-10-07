/** The second step with a one-time code: a rejected code shows its error under the cells, resend is a quiet action — `DigitInput`, `LoginForm.Actions`. */
import { MailCheck } from "lucide-react";
import { Button, DigitInput, LinkButton, LoginForm } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LoginFormVerificationCodeExample() {
  const [code, setCode] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);

  return (
    <div className={styles.stage}>
      <LoginForm.Root>
        <LoginForm.Header>
          <LoginForm.Logo>
            <MailCheck aria-hidden />
          </LoginForm.Logo>
          <LoginForm.Title>Введите код</LoginForm.Title>
          <LoginForm.Description>Мы отправили 6 цифр на name@company.ru</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form
            onSubmit={(e) => {
              e.preventDefault();
              setInvalid(code !== "123456");
            }}
          >
            <DigitInput
              length={6}
              size="l"
              fullWidth
              groupSize={3}
              value={code}
              error={invalid ? "Неверный код. Проверьте письмо и попробуйте ещё раз" : undefined}
              onValueChange={(value) => {
                setCode(value);
                setInvalid(false);
              }}
              labels={{ group: "Код из письма" }}
            />
            <LoginForm.Actions>
              <Button.Root type="submit" fullWidth disabled={code.length < 6}>
                Подтвердить
              </Button.Root>
              <Button.Root variant="ghost" tone="neutral" fullWidth>
                Отправить код ещё раз
              </Button.Root>
            </LoginForm.Actions>
          </LoginForm.Form>
          <LoginForm.Footer>
            Не тот адрес? <LinkButton.Root href="#">Изменить email</LinkButton.Root>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
