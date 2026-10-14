/** A support chat pinned to its last message: a sent message keeps it at the end, scrolling up loads older ones without moving what is on screen — `anchor`, `onReachStart`. */
import { Button, Card, Icon, Input, ScrollContainer, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Message = { id: number; author: string; text: string };

const HISTORY: Message[] = [
  "Добрый день! Счёт № 4821 пришёл без НДС.",
  "Здравствуйте, проверю реквизиты и вернусь.",
  "Спасибо, ждём — нужно провести до пятницы.",
  "Нашла: в карточке клиента стояла ставка 0 %.",
  "Исправили ставку, выставляю счёт заново.",
  "Новый счёт № 4830 отправлен на почту бухгалтерии.",
  "Получили, всё верно. Оплатим сегодня.",
  "Отлично! Закрывающие документы пришлём после оплаты.",
  "Оплата прошла, платёжка во вложении.",
  "Вижу поступление, спасибо. Акт отправим завтра.",
  "Подскажите, можно ли подключить ЭДО?",
  "Да, пришлите идентификатор в Диадоке.",
].map((text, index) => ({ id: index + 1, author: index % 2 === 0 ? "Клиент" : "Поддержка", text }));

const PAGE = 4;

export default function ScrollContainerChatExample() {
  // The newest messages first; older pages arrive when the reader scrolls up.
  const [shown, setShown] = React.useState(PAGE);
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState("");
  const messages = [...HISTORY.slice(-shown), ...sent];

  const loadOlder = () => {
    if (shown >= HISTORY.length) return;
    setLoading(true);
    // The promise keeps the region `aria-busy` and stops repeat calls until it settles.
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setShown((count) => Math.min(count + PAGE, HISTORY.length));
        setLoading(false);
        resolve();
      }, 800);
    });
  };

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setSent((list) => [
      ...list,
      { id: HISTORY.length + list.length + 1, author: "Поддержка", text },
    ]);
    setDraft("");
  };

  return (
    <Card.Root className={styles.chat}>
      <Card.Header>
        <Card.Title>ООО «Гранит» · счёт № 4821</Card.Title>
      </Card.Header>
      <ScrollContainer
        anchor="end"
        onReachStart={loadOlder}
        tabIndex={0}
        aria-label="Сообщения"
        className={styles.messages}
      >
        {loading ? <Skeleton lines={2} className={styles.older} /> : null}
        <ul className={styles.list}>
          {messages.map((message) => (
            <li key={message.id}>
              <Typography as="span" variant="caption" tone="muted">
                {message.author}
              </Typography>
              <Typography variant="body-m">{message.text}</Typography>
            </li>
          ))}
        </ul>
      </ScrollContainer>
      <form className={styles.composer} onSubmit={send}>
        <Input.Root className={styles.composerField}>
          <Input.Wrapper>
            <Input.Field
              aria-label="Сообщение"
              placeholder="Ответить клиенту"
              value={draft}
              onValueChange={setDraft}
            />
          </Input.Wrapper>
        </Input.Root>
        <Button.Root type="submit" aria-label="Отправить">
          <Button.Icon>
            <Icon name="action.send" />
          </Button.Icon>
        </Button.Root>
      </form>
    </Card.Root>
  );
}
