/** Second step with a one-time code: DigitInput inside the form, a rejected code turns the cells and the hint to danger, resend and back are quiet actions. Use it after e-mail or SMS confirmation. */
import { MailCheck } from "lucide-react";
import { Button, DigitInput, Hint, LinkButton, LoginForm } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LoginFormVerificationCodeExample() {
  const [code, setCode] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const hintId = React.useId();

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
            <div className={styles.code}>
              <DigitInput.Root
                length={6}
                size="l"
                fullWidth
                groupSize={3}
                value={code}
                invalid={invalid}
                aria-describedby={invalid ? hintId : undefined}
                onValueChange={(value) => {
                  setCode(value);
                  setInvalid(false);
                }}
                labels={{ group: "Код из письма" }}
              />
              {invalid ? (
                <Hint.Root id={hintId} invalid>
                  Неверный код. Проверьте письмо и попробуйте ещё раз
                </Hint.Root>
              ) : null}
            </div>
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
            Не тот адрес? <LinkButton href="#">Изменить email</LinkButton>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </div>
  );
}
