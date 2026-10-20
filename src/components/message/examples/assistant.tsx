/** An AI assistant's answer in a CRM as one message: a heading line, a bulleted and a numbered list, links to the product's screens that the app routes itself, and a question with two keys under it that never get cut — `Message.Text`, `onLinkClick`, `Message.Actions`. */
import { Button, Message, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ANSWER = `## Сделки на этой неделе
- **Вектор** — поставка стоек, 1 240 000 ₽, [открыть](/sales/deals/12)
- **Альфа-Логистик** — продление, ждёт счёт
- **ТехноСнаб** — _на паузе_ до 24 октября

Что сделать сегодня:
1. Выставить счёт «Альфа-Логистик»
2. Позвонить в «Вектор» до 15:00

Все сделки — в [воронке](/sales/pipeline).

Создать задачу «Выставить счёт» на завтра, 10:00?`;

const CONFIRM_DELAY_MS = 1000;

export default function MessageAssistantExample() {
  const [route, setRoute] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<string | null>(null);

  // A product link: the app navigates in place (its router), not the browser.
  const openRoute = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setRoute(href);
  };

  const confirm = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setDecision("Задача создана на завтра, 10:00.");
        resolve();
      }, CONFIRM_DELAY_MS);
    });

  return (
    <div className={styles.thread}>
      <Message.Root value="answer" time="11:20">
        <Message.Author>Ассистент</Message.Author>
        <Message.Text onLinkClick={openRoute}>{ANSWER}</Message.Text>
        {decision === null ? (
          <Message.Actions>
            <Button.Root onClick={() => setDecision("Задача не создана.")}>Отмена</Button.Root>
            <Button.Root tone="success" onClick={confirm}>
              Подтвердить
            </Button.Root>
          </Message.Actions>
        ) : null}
      </Message.Root>
      <Typography as="p" variant="caption" tone="muted" aria-live="polite">
        {decision ??
          (route ? `Открыт экран ${route}` : "Ссылки ответа открывают экраны CRM на месте")}
      </Typography>
    </div>
  );
}
