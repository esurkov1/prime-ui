/** The list alone, written as parts: `Chat.Root` with only `Chat.Messages`, a date that stays on top while its day scrolls, an event of the chat and the unread band — `Chat.Messages`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`. */
import { Card, Chat, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ChatStructureExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Messages aria-label="Чат проекта «Интеграция с 1С»">
          <Chat.Separator>12 марта</Chat.Separator>
          <Chat.Service>Анна Котова добавила Олега Смирнова в чат</Chat.Service>
          <Message.Root value="row-1" time="10:00">
            <Message.Text>Олег, добро пожаловать! Вводная — в закреплённом.</Message.Text>
          </Message.Root>
          <Message.Root value="row-2" direction="outgoing" time="10:04" status="read">
            <Message.Text>Спасибо, изучу до обеда.</Message.Text>
          </Message.Root>
          <Chat.Separator>Сегодня</Chat.Separator>
          <Chat.Unread />
          <Message.Root value="row-3" time="09:41">
            <Message.Text>Обмен справочниками заработал на тестовой базе.</Message.Text>
          </Message.Root>
        </Chat.Messages>
      </Chat.Root>
    </Card.Root>
  );
}
