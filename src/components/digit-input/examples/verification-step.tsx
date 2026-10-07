/** A sign-in confirmation step in a card: Label, a six-digit code, a Hint that turns into an error, resend and submit actions. Use it as the full OTP screen pattern. */
import { Button, Card, DigitInput, Hint, Label, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const VALID_CODE = "123456";

export default function DigitInputVerificationStepExample() {
  const id = React.useId();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(false);

  const verify = (value: string) => setError(value !== VALID_CODE);

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Подтвердите вход</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            verify(code);
          }}
        >
          <Typography.Root variant="body-s" tone="muted">
            Мы отправили код на +7 900 ••• 12 34. Для демо подходит {VALID_CODE}.
          </Typography.Root>
          <div className={styles.field}>
            <Label.Root>Код из SMS</Label.Root>
            <DigitInput.Root
              invalid={error}
              length={6}
              value={code}
              onValueChange={(value) => {
                setCode(value);
                setError(false);
              }}
              onComplete={verify}
              labels={{ group: "Код из SMS" }}
              aria-describedby={`${id}-hint`}
            />
            <Hint.Root invalid={error} id={`${id}-hint`}>
              {error ? "Неверный код. Проверьте SMS и введите снова." : "Код действует 5 минут."}
            </Hint.Root>
          </div>
          <div className={styles.actions}>
            <Button.Root variant="ghost" tone="neutral" type="button" onClick={() => setCode("")}>
              Отправить код ещё раз
            </Button.Root>
            <Button.Root type="submit" disabled={code.length < 6}>
              Подтвердить
            </Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
