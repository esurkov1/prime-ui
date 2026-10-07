/** A support request form in a card: Input and Textarea of size `m`, required and optional fields, counter and an error after submit. Use it as a form reference. */
import { Button, Card, Input, Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX = 1000;

export default function TextareaInFormExample() {
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const tooShort = sent && message.trim().length < 20;

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Обращение в поддержку</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Input.Root label="Тема" required>
            <Input.Wrapper>
              <Input.Field placeholder="Не проходит оплата" />
            </Input.Wrapper>
          </Input.Root>
          <Textarea.Root
            label="Опишите проблему"
            required
            reserveSupportRow
            value={message}
            maxLength={MAX}
            onValueChange={setMessage}
            placeholder="Что вы делали и что пошло не так"
            hint="Не указывайте пароли и данные карты."
            error={tooShort ? "Нужно хотя бы 20 символов." : undefined}
            counter={<Textarea.Counter current={message.length} max={MAX} />}
          />
          <Textarea.Root label="Шаги воспроизведения" optional placeholder="1. Открыть корзину…" />
          <div className={styles.actions}>
            <Button.Root
              variant="outline"
              tone="neutral"
              type="button"
              onClick={() => setSent(false)}
            >
              Отмена
            </Button.Root>
            <Button.Root type="submit">Отправить</Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
