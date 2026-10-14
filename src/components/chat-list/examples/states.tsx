/** Loading and empty: placeholder rows in the rows' geometry cross-fade into the dialogs; a new workspace without dialogs shows its own empty state with an action — `loading`, `empty`. */
import { Avatar, Button, Card, ChatList, EmptyPage, hueOf, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

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
    at: new Date(2026, 9, 14, 12, 5),
    unread: 0,
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: new Date(2026, 9, 13, 11, 40),
    unread: 1,
  },
];

const LOAD_MS = 1400;

type Dialog = (typeof DIALOGS)[number];

const renderDialog = (item: Dialog) => (
  <ChatList.Item time={item.at} unread={item.unread}>
    <ChatList.ItemIcon>
      <Avatar.Root color={hueOf(item.id)}>
        <Avatar.Fallback>{item.initials}</Avatar.Fallback>
      </Avatar.Root>
    </ChatList.ItemIcon>
    <ChatList.ItemText>{item.name}</ChatList.ItemText>
    <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
  </ChatList.Item>
);

export default function ChatListStatesExample() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div>
      <div>
        <Button.Root
          variant="soft"
          tone="neutral"
          loading={loading}
          onClick={() => setLoading(true)}
        >
          Обновить
        </Button.Root>
        <Card.Root>
          <ChatList.Root
            items={loading ? [] : DIALOGS}
            getKey={(item) => item.id}
            loading={loading}
            now={NOW}
            renderItem={renderDialog}
          />
        </Card.Root>
        <Typography as="span" variant="caption" tone="muted">
          loading
        </Typography>
      </div>
      <div>
        <Card.Root>
          <ChatList.Root
            items={[] as Dialog[]}
            getKey={(item) => item.id}
            renderItem={renderDialog}
            empty={
              <EmptyPage.Root layout="compact">
                <EmptyPage.Icon>
                  <Icon name="object.message" />
                </EmptyPage.Icon>
                <EmptyPage.Title>Диалогов пока нет</EmptyPage.Title>
                <EmptyPage.Description>
                  Клиенты появятся здесь, когда напишут в чат на сайте.
                </EmptyPage.Description>
                <EmptyPage.Actions>
                  <Button.Root variant="soft">Настроить виджет</Button.Root>
                </EmptyPage.Actions>
              </EmptyPage.Root>
            }
          />
        </Card.Root>
        <Typography as="span" variant="caption" tone="muted">
          empty
        </Typography>
      </div>
    </div>
  );
}
