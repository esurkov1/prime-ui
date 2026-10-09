/** Optional parts of a bubble in their order: the author, a forwarded header, a reply quote, the text and reactions — `Message.Author`, `Message.Forwarded`, `Message.Reply`, `Message.Reactions`. */
import { Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const REACTIONS = [
  { emoji: "👍", count: 3, selected: true },
  { emoji: "🔥", count: 1 },
];

export default function MessageStructureExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="11:02">
        <Message.Author color="purple">Олег Смирнов</Message.Author>
        <Message.Text>Макет страницы заказа готов, ссылка в задаче PRJ-412.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="11:05">
        <Message.Author color="green">Анна Котова</Message.Author>
        <Message.Forwarded from="Ирина Белова" />
        <Message.Text>Клиент просит добавить в заказ поле «Номер договора».</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="11:07" status="read">
        <Message.Reply author="Олег Смирнов" color="purple">
          Макет страницы заказа готов, ссылка в задаче PRJ-412.
        </Message.Reply>
        <Message.Text>Посмотрел — согласовано, передаю в разработку.</Message.Text>
        <Message.Reactions items={REACTIONS} />
      </Message.Root>
    </div>
  );
}
