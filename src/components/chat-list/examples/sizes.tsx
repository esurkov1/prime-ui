/** Every size tier: row height, text, avatar, glyphs and the search field follow the tier — `size`. */
import { Avatar, Card, ChatList, hueOf, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

const NOW = new Date(2026, 9, 14, 15, 0);

const DIALOGS = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Не можем выгрузить счёт в 1С",
    at: new Date(2026, 9, 14, 14, 32),
    unread: 2,
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Акт сверки подписан",
    at: new Date(2026, 9, 13, 12, 5),
    unread: 0,
  },
];

export default function ChatListSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.tier}>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
          <Card.Root>
            <ChatList.Root
              size={size}
              items={DIALOGS}
              getKey={(item) => item.id}
              defaultValue="vector"
              now={NOW}
              renderItem={(item) => (
                <ChatList.Item time={item.at} unread={item.unread}>
                  <ChatList.ItemIcon>
                    <Avatar.Root color={hueOf(item.id)}>
                      <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                    </Avatar.Root>
                  </ChatList.ItemIcon>
                  <ChatList.ItemText>{item.name}</ChatList.ItemText>
                  <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
                </ChatList.Item>
              )}
            />
          </Card.Root>
        </div>
      ))}
    </>
  );
}
