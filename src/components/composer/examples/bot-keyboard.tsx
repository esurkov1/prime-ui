/** A bot's reply keyboard under the field: a key sends its text as a message, the field asks for a key, the keyboard hides after use and the toggle brings it back — `Composer.Keyboard`, `rows`, `placeholder`, `oneTime`. */
import { Composer, Icon, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SEND_MS = 600;

const BOT_KEYS = [
  [{ label: "Оформить заказ", icon: <Icon name="action.add" />, tone: "accent" as const }],
  ["Мои заказы", "Статус доставки"],
  ["Счета и акты", "Связаться с менеджером"],
];

export default function ComposerBotKeyboardExample() {
  const [sent, setSent] = React.useState<string | null>(null);

  // A stand-in for the chat API: the message reaches the server after a moment.
  const deliver = ({ text }: { text: string }) =>
    new Promise<void>((resolve) =>
      window.setTimeout(() => {
        setSent(text);
        resolve();
      }, SEND_MS),
    );

  return (
    <div className={styles.chat}>
      <Message.Root value="bot-menu" time="09:14">
        <Message.Author>Бот отдела продаж</Message.Author>
        <Message.Text>Здравствуйте! Выберите раздел на клавиатуре ниже.</Message.Text>
      </Message.Root>
      {sent ? (
        <Message.Root value="answer" direction="outgoing" time="09:15" status="read">
          <Message.Text>{sent}</Message.Text>
        </Message.Root>
      ) : null}
      <Composer.Root onSend={deliver}>
        <Composer.Keyboard rows={BOT_KEYS} placeholder="Выберите раздел" oneTime />
      </Composer.Root>
    </div>
  );
}
