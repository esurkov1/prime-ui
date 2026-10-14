/** A bot's message with an inline keyboard: rows of buttons under the bubble at its width, sharing each row equally, one of them a link — `Message.Actions`, `asChild`. */
import { Button, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INVOICE_URL = "https://vector.example/invoices/4821";

export default function MessageBotActionsExample() {
  const [answer, setAnswer] = React.useState<string | null>(null);

  return (
    <div className={styles.thread}>
      <Message.Root value="bot-order" time="15:02">
        <Message.Author>Бот склада</Message.Author>
        <Message.Text>
          Заказ № 4821 собран: 12 позиций на 184 300 ₽. Подтвердите отгрузку до 16:00.
        </Message.Text>
        <Message.Actions>
          <Button.Root variant="soft" tone="neutral" onClick={() => setAnswer("Подтвердить заказ")}>
            Подтвердить заказ
          </Button.Root>
          <Button.Root variant="soft" tone="neutral" onClick={() => setAnswer("Изменить")}>
            Изменить
          </Button.Root>
        </Message.Actions>
        <Message.Actions>
          <Button.Root
            variant="soft"
            tone="neutral"
            onClick={() => setAnswer("Связаться с менеджером")}
          >
            Связаться с менеджером
          </Button.Root>
        </Message.Actions>
        <Message.Actions>
          <Button.Root variant="soft" tone="neutral" asChild>
            <a href={INVOICE_URL} target="_blank" rel="noreferrer">
              Открыть счёт
            </a>
          </Button.Root>
        </Message.Actions>
      </Message.Root>
      {answer ? (
        <Message.Root value="reply" direction="outgoing" time="15:03" status="sent">
          <Message.Text>{answer}</Message.Text>
        </Message.Root>
      ) : null}
    </div>
  );
}
