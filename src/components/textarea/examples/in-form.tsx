/** Support request form: the description is checked on submit and its error does not shift the form — `required`, `error`, `reserveSupportRow`. */
import { Button, Input, Textarea, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LIMIT = 1000;
const MIN_LENGTH = 20;

export default function TextareaInFormExample() {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(
      message.trim().length < MIN_LENGTH ? "Опишите проблему хотя бы в 20 символах" : undefined,
    );
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography.Root as="h3" variant="title-m">
          Обращение в поддержку
        </Typography.Root>
        <Typography.Root as="p" variant="body-s" tone="secondary">
          Ответим в течение рабочего дня.
        </Typography.Root>
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
          onValueChange={setMessage}
          counter={<Textarea.Counter current={message.length} max={LIMIT} />}
        />
      </div>
      <div className={styles.formActions}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => setError(undefined)}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit">Отправить</Button.Root>
      </div>
    </form>
  );
}
