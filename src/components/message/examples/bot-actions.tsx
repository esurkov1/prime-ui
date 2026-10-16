/** A bot's message with an inline keyboard: one-line rows whose keys share the row equally, a coloured key with an icon that loads while its promise runs, a link with its mark — `Message.Actions`, `tone`, `Button.Icon`, `asChild`. */
import { Button, Icon, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INVOICE_URL = "https://vector.example/invoices/4821";
const CONFIRM_DELAY_MS = 1200;

export default function MessageBotActionsExample() {
  const [decision, setDecision] = React.useState<string | null>(null);

  // A callback key: the bot answers after a round trip, the key loads until then.
  const confirm = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setDecision("Отгрузка подтверждена, машина выезжает в 16:30.");
        resolve();
      }, CONFIRM_DELAY_MS);
    });

  return (
    <div className={styles.thread}>
      <Message.Root value="bot-order" time="15:02" edited={decision !== null}>
        <Message.Author>Бот склада</Message.Author>
        <Message.Text>
          {decision ??
            "Заказ № 4821 собран: 12 позиций на 184 300 ₽. Подтвердите отгрузку до 16:00."}
        </Message.Text>
        {decision === null ? (
          <Message.Actions>
            <Button.Root tone="success" onClick={confirm}>
              <Button.Icon>
                <Icon name="action.check" />
              </Button.Icon>
              Подтвердить
            </Button.Root>
            <Button.Root tone="danger" onClick={() => setDecision("Отгрузка отменена.")}>
              Отменить
            </Button.Root>
          </Message.Actions>
        ) : null}
        {decision === null ? (
          <Message.Actions>
            <Button.Root onClick={() => setDecision("Состав заказа открыт для правки.")}>
              Изменить состав
            </Button.Root>
            <Button.Root onClick={() => setDecision("Отгрузка перенесена на завтра.")}>
              Перенести
            </Button.Root>
          </Message.Actions>
        ) : null}
        {decision === null ? (
          <Message.Actions>
            <Button.Root onClick={() => setDecision("Менеджер свяжется с вами.")}>
              Связаться с менеджером
            </Button.Root>
          </Message.Actions>
        ) : null}
        <Message.Actions>
          <Button.Root asChild>
            <a href={INVOICE_URL} target="_blank" rel="noreferrer">
              Открыть счёт
            </a>
          </Button.Root>
        </Message.Actions>
      </Message.Root>
    </div>
  );
}
