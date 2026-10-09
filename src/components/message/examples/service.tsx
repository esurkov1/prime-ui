/** Lines between messages: a date that stays on top while its day scrolls, an event of the chat and the unread band — `Message.Separator`, `Message.Service`, `Message.Unread`. */
import { Message } from "prime-ui-kit";

export default function MessageServiceExample() {
  return (
    <Message.Group aria-label="Чат проекта «Интеграция с 1С»">
      <Message.Separator>12 марта</Message.Separator>
      <Message.Service>Анна Котова добавила Олега Смирнова в чат</Message.Service>
      <Message.Root direction="incoming" time="10:00">
        <Message.Author color="green">Анна Котова</Message.Author>
        <Message.Text>Олег, добро пожаловать! Вводная — в закреплённом.</Message.Text>
      </Message.Root>
      <Message.Separator>Сегодня</Message.Separator>
      <Message.Unread />
      <Message.Root direction="incoming" time="09:41">
        <Message.Author color="purple">Олег Смирнов</Message.Author>
        <Message.Text>Обмен справочниками заработал на тестовой базе.</Message.Text>
      </Message.Root>
    </Message.Group>
  );
}
