/** Support request form: the description is checked on submit, its error leaves as soon as the text is long enough and does not shift the form, a sent request turns the button green — `required`, `error`, `reserveSupportRow`. */
import { Button, Input, Textarea, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LIMIT = 1000;
const MIN_LENGTH = 20;

export default function TextareaInFormExample() {
  const [message, setMessage] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const tooShort = message.trim().length < MIN_LENGTH;
  // After the first submit the check is live: the error leaves as soon as the text is long enough.
  const error = checked && tooShort ? "Опишите проблему хотя бы в 20 символах" : undefined;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChecked(true);
    setSent(!tooShort);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography as="h3" variant="title-m">
          Обращение в поддержку
        </Typography>
        <Typography as="p" variant="body-s" tone="secondary">
          Ответим в течение рабочего дня.
        </Typography>
      </div>
      <div className={styles.formFields}>
        <Input.Root label="Тема" required>
          <Input.Wrapper>
            <Input.Field name="subject" defaultValue="Не проходит оплата счёта" />
          </Input.Wrapper>
        </Input.Root>
        <Textarea.Root
          label="Опишите проблему"
          name="message"
          required
          reserveSupportRow
          placeholder="Что вы делали и что пошло не так"
          hint="Не указывайте пароли и данные карты"
          error={error}
          value={message}
          maxLength={LIMIT}
          onValueChange={(value) => {
            setMessage(value);
            setSent(false);
          }}
          counter={<Textarea.Counter current={message.length} max={LIMIT} />}
        />
      </div>
      <div className={styles.formActions}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setMessage("");
            setChecked(false);
            setSent(false);
          }}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit" tone={sent ? "success" : "accent"}>
          {sent ? "Отправлено" : "Отправить"}
        </Button.Root>
      </div>
    </form>
  );
}
