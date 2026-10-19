/** The threads pane of an assistant: the search, the new chat button under it, then the threads — creating stands at the top, never under the list — `ChatList.Actions`, `onSearchChange`. */
import { Button, Card, ChatList, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const THREADS = [
  {
    id: "refunds",
    name: "Возвраты по заказам за сентябрь",
    preview: "Собрал 14 возвратов, 3 без акта",
    at: at(14, 14, 32),
  },
  {
    id: "pricing",
    name: "Тарифы для корпоративных клиентов",
    preview: "Черновик сетки скидок готов",
    at: at(14, 11, 5),
  },
  {
    id: "script",
    name: "Скрипт первого звонка",
    preview: "Добавил ответы на возражения",
    at: at(12, 16, 40),
  },
  {
    id: "report",
    name: "Отчёт по выручке за квартал",
    preview: "Выручка 3,4 млн ₽, рост 12%",
    at: at(9, 10, 0),
  },
];

export default function ChatListActionsExample() {
  const [query, setQuery] = React.useState("");
  const [value, setValue] = React.useState<string | null>("refunds");
  const needle = query.trim().toLowerCase();
  const found = THREADS.filter(
    (item) =>
      item.name.toLowerCase().includes(needle) || item.preview.toLowerCase().includes(needle),
  );

  return (
    <Card.Root className={styles.short}>
      <ChatList.Root
        items={found}
        getKey={(item) => item.id}
        value={value}
        onValueChange={setValue}
        search={query}
        onSearchChange={setQuery}
        now={NOW}
        labels={{ list: "Треды", search: "Поиск по тредам" }}
        renderItem={(item) => (
          <ChatList.Item time={item.at}>
            <ChatList.ItemText>{item.name}</ChatList.ItemText>
            <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
          </ChatList.Item>
        )}
      >
        <ChatList.Actions>
          <Button.Root
            aria-label="Новый чат"
            fullWidth
            variant="soft"
            tone="neutral"
            onClick={() => setValue(null)}
          >
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Чат
          </Button.Root>
        </ChatList.Actions>
      </ChatList.Root>
    </Card.Root>
  );
}
