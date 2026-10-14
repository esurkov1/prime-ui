/** A support inbox: pinned dialogs first, the search, unread and muted counts, the typing line, a draft, delivery ticks and a row menu that pins, mutes, marks read and deletes after a confirm — `ChatList.Root`, `items`, `renderItem`, `value`, `onSearchChange`, `ChatList.Item`, `ChatList.ItemMenu`. */
import { Avatar, Card, ChatList, ConfirmDialog, Dropdown, hueOf, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Dialog = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  author?: string;
  at: Date;
  unread: number;
  online?: boolean;
  pinned?: boolean;
  muted?: boolean;
  mention?: boolean;
  typing?: boolean;
  draft?: string;
  status?: "sent" | "read";
};

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS: Dialog[] = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Не можем выгрузить счёт INV-2048 в 1С",
    at: at(14, 14, 32),
    unread: 2,
    online: true,
    pinned: true,
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Акт сверки за сентябрь подписан",
    author: "Вы",
    at: at(14, 12, 5),
    unread: 0,
    pinned: true,
    status: "read",
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: at(14, 11, 40),
    unread: 1,
    typing: true,
  },
  {
    id: "sever",
    name: "Отдел продаж «Север»",
    initials: "ОС",
    preview: "@Анна, проверь скидку для «Лето»",
    author: "Дмитрий",
    at: at(13, 18, 20),
    unread: 14,
    muted: true,
    mention: true,
  },
  {
    id: "leto",
    name: "ООО «Лето»",
    initials: "ЛТ",
    preview: "Можно перенести доставку на среду?",
    at: at(12, 9, 15),
    unread: 0,
    draft: "Да, среда подходит, водитель",
  },
  {
    id: "tehnosnab",
    name: "ТехноСнаб",
    initials: "ТС",
    preview: "Отправили договор на подпись",
    author: "Вы",
    at: at(3, 16, 0),
    unread: 0,
    status: "sent",
  },
];

/** Pinned first, then by the last message. */
const ordered = (dialogs: Dialog[]) =>
  [...dialogs].sort(
    (a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false) || +b.at - +a.at,
  );

export default function ChatListOverviewExample() {
  const [dialogs, setDialogs] = React.useState(DIALOGS);
  const [dialogId, setDialogId] = React.useState<string | null>("vector");
  const [query, setQuery] = React.useState("");
  const [deleting, setDeleting] = React.useState<Dialog | null>(null);

  const patch = (id: string, next: Partial<Dialog>) =>
    setDialogs((current) => current.map((item) => (item.id === id ? { ...item, ...next } : item)));

  const needle = query.trim().toLowerCase();
  const shown = ordered(dialogs).filter(
    (item) =>
      !needle ||
      item.name.toLowerCase().includes(needle) ||
      item.preview.toLowerCase().includes(needle),
  );

  return (
    <Card.Root className={styles.pane}>
      <ChatList.Root
        items={shown}
        getKey={(item) => item.id}
        value={dialogId}
        onValueChange={(id) => {
          setDialogId(id);
          patch(id, { unread: 0, mention: false });
        }}
        search={query}
        onSearchChange={setQuery}
        now={NOW}
        renderItem={(item) => (
          <ChatList.Item
            time={item.at}
            status={item.status}
            unread={item.unread}
            mention={item.mention}
            muted={item.muted}
            pinned={item.pinned}
            typing={item.typing}
            draft={item.draft}
          >
            <ChatList.ItemIcon>
              <Avatar.Root color={hueOf(item.id)}>
                <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                {item.online ? <Avatar.Status status="online" /> : null}
              </Avatar.Root>
            </ChatList.ItemIcon>
            <ChatList.ItemText>{item.name}</ChatList.ItemText>
            <ChatList.ItemDescription author={item.author}>{item.preview}</ChatList.ItemDescription>
            <ChatList.ItemMenu>
              <Dropdown.Item onSelect={() => patch(item.id, { pinned: !item.pinned })}>
                <Dropdown.ItemIcon>
                  <Icon name="action.pin" />
                </Dropdown.ItemIcon>
                {item.pinned ? "Открепить" : "Закрепить"}
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => patch(item.id, { muted: !item.muted })}>
                <Dropdown.ItemIcon>
                  <Icon name={item.muted ? "status.sound" : "status.muted"} />
                </Dropdown.ItemIcon>
                {item.muted ? "Включить звук" : "Без звука"}
              </Dropdown.Item>
              <Dropdown.Item
                disabled={item.unread === 0}
                onSelect={() => patch(item.id, { unread: 0, mention: false })}
              >
                <Dropdown.ItemIcon>
                  <Icon name="status.read" />
                </Dropdown.ItemIcon>
                Отметить прочитанным
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item tone="danger" onSelect={() => setDeleting(item)}>
                <Dropdown.ItemIcon>
                  <Icon name="action.delete" />
                </Dropdown.ItemIcon>
                Удалить
              </Dropdown.Item>
            </ChatList.ItemMenu>
          </ChatList.Item>
        )}
      />
      <ConfirmDialog.Root
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Удалить диалог с ${deleting?.name ?? ""}?`}
        description="История переписки удалится у вас; клиент свою копию сохранит."
        confirmLabel="Удалить диалог"
        onConfirm={() => {
          const id = deleting?.id;
          setDialogs((current) => current.filter((item) => item.id !== id));
          if (id === dialogId) setDialogId(null);
        }}
      />
    </Card.Root>
  );
}
