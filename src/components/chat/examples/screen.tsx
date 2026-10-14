/** A support messenger as a work screen: the title and the unread count in the app header, the dialogs with a search over them beside the conversation (one pane at a time on a phone), history that loads above as you scroll up, the unread band, reply and edit from the menu, the typing signal both ways, unread counts from what was seen, and the Composer whose messages rise into the list while the client answers — `items`, `renderMessage`, `hasOlder`, `onLoadOlder`, `typing`. */
import {
  AppHeader,
  Avatar,
  Card,
  Chat,
  ChatList,
  Composer,
  type ComposerActivity,
  type ComposerMediaItem,
  type ComposerMessage,
  type ComposerRecording,
  Dropdown,
  type GalleryItem,
  hueOf,
  Icon,
  Message,
  type MessageStatus,
  PageContent,
  type UploadContext,
  useUploadQueue,
  VoicePlayer,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Content =
  | { kind: "text"; text: string }
  | { kind: "media"; items: GalleryItem[]; caption?: string }
  | { kind: "voice"; src: string; waveform: number[]; duration: number }
  | { kind: "file"; name: string; size: number; href: string };

type ChatMessage = Content & {
  id: string;
  from: "client" | "me";
  sentAt: Date;
  status?: MessageStatus;
  edited?: boolean;
  replyTo?: string;
};

type Dialog = {
  id: string;
  name: string;
  contact: string;
  /** The contact in the dative, for «Ответ Ирине Беловой». */
  contactTo: string;
  initials: string;
  unread: number;
  preview: string;
  at: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS: Dialog[] = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    contact: "Ирина Белова",
    contactTo: "Ирине Беловой",
    initials: "ВК",
    unread: 2,
    preview: "Ок, жду акт",
    at: at(8, 14, 31),
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    contact: "Олег Савин",
    contactTo: "Олегу Савину",
    initials: "ГР",
    unread: 0,
    preview: "Акт сверки подписан",
    at: at(7, 16, 5),
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    contact: "Андрей Козлов",
    contactTo: "Андрею Козлову",
    initials: "ИК",
    unread: 1,
    preview: "Подключите ЭДО",
    at: at(6, 11, 40),
  },
];

/** Older history, loaded when the conversation is scrolled to its start. */
const OLDER: ChatMessage[] = [
  {
    id: "o1",
    from: "client",
    sentAt: at(6, 11, 2),
    kind: "text",
    text: "Добрый день! Подключаем второй склад, нужен доступ для кладовщика.",
  },
  {
    id: "o2",
    from: "me",
    sentAt: at(6, 11, 10),
    status: "read",
    kind: "text",
    text: "Здравствуйте! Пригласил его, ссылка придёт на почту.",
  },
];

const HISTORY: ChatMessage[] = [
  {
    id: "m1",
    from: "client",
    sentAt: at(7, 10, 12),
    kind: "text",
    text: "Не можем выгрузить счёт **INV-2048** в 1С, ошибка после «Экспорт».",
  },
  {
    id: "m2",
    from: "client",
    sentAt: at(7, 10, 13),
    kind: "media",
    items: [
      {
        src: "https://picsum.photos/seed/export-error/800/520",
        width: 800,
        height: 520,
        alt: "Окно с ошибкой экспорта",
      },
    ],
    caption: "Вот так выглядит",
  },
  {
    id: "m3",
    from: "me",
    sentAt: at(7, 10, 20),
    status: "read",
    kind: "text",
    text: "Похоже, в карточке контрагента не заполнен ИНН. Инструкция: https://prime.app/wiki/requisites",
  },
  {
    id: "m4",
    from: "client",
    sentAt: at(8, 9, 40),
    kind: "text",
    text: "Заполнили, счёт выгрузился. Пришлите, пожалуйста, договор на второй склад.",
  },
  {
    id: "m5",
    from: "me",
    sentAt: at(8, 10, 5),
    status: "read",
    replyTo: "m4",
    kind: "text",
    text: "Высылаю договор, акт подготовлю до пятницы.",
  },
  {
    id: "m6",
    from: "me",
    sentAt: at(8, 10, 6),
    status: "read",
    kind: "file",
    name: "Договор поставки №418.pdf",
    size: 1_258_291,
    href: "https://prime.app/files/contract-418.pdf",
  },
  {
    id: "m7",
    from: "client",
    sentAt: at(8, 14, 30),
    kind: "text",
    text: "Подписали, скан у бухгалтерии.",
  },
  { id: "m8", from: "client", sentAt: at(8, 14, 31), kind: "text", text: "Ок, жду акт" },
];

const FIRST_UNREAD = "m7";

/** What the client answers, one after another. */
const CLIENT_REPLIES = [
  "Спасибо! Передам бухгалтерии.",
  "Отлично, тогда ждём акт до пятницы.",
  "Поняла, если что — напишу сюда.",
];

const MESSAGE_SEND_MS = 700;
const MESSAGE_READ_MS = 1500;
const CLIENT_TYPING_MS = 1800;
const HISTORY_MS = 900;
const DIALOG_MS = 800;

/** A stand-in for the file server: sends an attachment in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.25);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(file.name);
    }, 200);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** «1 непрочитанный», «3 непрочитанных». */
const unreadLabel = (count: number) => {
  const tens = count % 100;
  const ones = count % 10;
  const word = ones === 1 && tens !== 11 ? "непрочитанный" : "непрочитанных";
  return count === 0 ? "Всё прочитано" : `${count} ${word}`;
};

const excerpt = (message: ChatMessage) => {
  switch (message.kind) {
    case "text":
      return message.text;
    case "voice":
      return "Голосовое сообщение";
    case "media":
      return (
        message.caption ?? (message.items.every((item) => item.type === "video") ? "Видео" : "Фото")
      );
    case "file":
      return message.name;
  }
};

/** An album holds up to ten photos and videos: more go as the next album. */
const ALBUM_MAX = 10;
const albumsOf = (media: readonly ComposerMediaItem[]) =>
  Array.from({ length: Math.ceil(media.length / ALBUM_MAX) }, (_, index) =>
    media.slice(index * ALBUM_MAX, (index + 1) * ALBUM_MAX),
  );

/** The local object URLs a message plays from (photos, videos and recordings sent here). */
const localSourcesOf = (message: Content): string[] =>
  (message.kind === "media"
    ? message.items.map((item) => item.src)
    : message.kind === "voice"
      ? [message.src]
      : []
  ).filter((src) => src.startsWith("blob:"));

const renderContent = (message: ChatMessage) => {
  switch (message.kind) {
    case "text":
      return <Message.Text>{message.text}</Message.Text>;
    case "media":
      return (
        <>
          <Message.Media items={message.items} />
          {message.caption ? <Message.Text>{message.caption}</Message.Text> : null}
        </>
      );
    case "voice":
      return (
        <VoicePlayer src={message.src} waveform={message.waveform} duration={message.duration} />
      );
    case "file":
      return <Message.File name={message.name} fileSize={message.size} href={message.href} />;
  }
};

type ChatComposerProps = {
  replyTo: ChatMessage | null;
  replyAuthor: string;
  editing: ChatMessage | null;
  onReplyDismiss: () => void;
  onEditDismiss: () => void;
  onEditLast: () => void;
  onPost: (content: Content, replyTo?: string) => void;
  onSave: (id: string, text: string) => void;
  /** «печатает…» for the client: what the composer reports goes to the other side. */
  onActivityChange: (activity: ComposerActivity | null) => void;
};

/** The Composer with its upload queue: an upload tick re-renders the composer, not the thread. */
const ChatComposer = React.memo(function ChatComposer({
  replyTo,
  replyAuthor,
  editing,
  onReplyDismiss,
  onEditDismiss,
  onEditLast,
  onPost,
  onSave,
  onActivityChange,
}: ChatComposerProps) {
  const queue = useUploadQueue({ upload: sendFile });
  const [draft, setDraft] = React.useState("");
  const [editedId, setEditedId] = React.useState<string | null>(null);
  // An edit opened from the menu or ↑ puts the message's text into the field (once per message).
  if (editing && editing.kind === "text" && editedId !== editing.id) {
    setEditedId(editing.id);
    setDraft(editing.text);
  }
  if (!editing && editedId !== null) setEditedId(null);

  // Optimistic: every message is in the list at once with `sending`, so the send returns at once
  // and the field is free for the next one. The bar's `value` says what it answers or edits.
  // Photos and videos go as albums with the text as their caption, other files as file messages.
  // The tray's previews are revoked after the send, so an album plays from its own URLs.
  const send = ({ text, media, files, replyTo: reply, editOf }: ComposerMessage) => {
    if (editOf) {
      onSave(editOf, text);
      return;
    }
    albumsOf(media).forEach((album, index) => {
      onPost(
        {
          kind: "media",
          items: album.map((item) => ({
            type: item.type,
            src: URL.createObjectURL(item.file),
            alt: item.file.name,
          })),
          caption: index === 0 && text ? text : undefined,
        },
        reply,
      );
    });
    for (const item of files) {
      onPost({ kind: "file", name: item.file.name, size: item.file.size, href: "#" }, reply);
    }
    if (text && media.length === 0) onPost({ kind: "text", text }, reply);
  };

  const sendVoice = ({ blob, durationMs, waveform }: ComposerRecording) =>
    onPost(
      {
        kind: "voice",
        src: URL.createObjectURL(blob),
        waveform: [...waveform],
        duration: durationMs / 1000,
      },
      replyTo?.id,
    );

  return (
    <Composer.Root
      value={draft}
      onValueChange={setDraft}
      queue={queue}
      onSend={send}
      onSendVoice={sendVoice}
      onEditLast={onEditLast}
      onActivityChange={onActivityChange}
    >
      <Composer.Attach />
      {replyTo ? (
        <Composer.Context value={replyTo.id} onDismiss={onReplyDismiss}>
          <Composer.Title>Ответ {replyTo.from === "me" ? "себе" : replyAuthor}</Composer.Title>
          <Composer.Description>{excerpt(replyTo)}</Composer.Description>
        </Composer.Context>
      ) : null}
      {editing ? (
        <Composer.Context
          mode="edit"
          value={editing.id}
          onDismiss={() => {
            onEditDismiss();
            setDraft("");
          }}
        >
          <Composer.Title>Редактирование</Composer.Title>
          <Composer.Description>{excerpt(editing)}</Composer.Description>
        </Composer.Context>
      ) : null}
    </Composer.Root>
  );
});

export default function ChatScreenExample() {
  const [dialogId, setDialogId] = React.useState<string | null>("vector");
  const [messages, setMessages] = React.useState<ChatMessage[]>(HISTORY);
  const [hasOlder, setHasOlder] = React.useState(true);
  const [replyTo, setReplyTo] = React.useState<ChatMessage | null>(null);
  const [editing, setEditing] = React.useState<ChatMessage | null>(null);
  const [clientTyping, setClientTyping] = React.useState(false);
  const [unread, setUnread] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(DIALOGS.map((item) => [item.id, item.unread])),
  );
  /** What the reader is doing now, as the client would see it: the client waits while you type. */
  const myActivity = React.useRef<ComposerActivity | null>(null);
  const replies = React.useRef(0);
  /** Object URLs of what was sent here: each is let go when no message plays from it any more. */
  const localUrls = React.useRef(new Set<string>());
  React.useEffect(() => {
    const live = new Set(messages.flatMap(localSourcesOf));
    for (const url of localUrls.current) {
      if (live.has(url)) continue;
      URL.revokeObjectURL(url);
      localUrls.current.delete(url);
    }
  }, [messages]);
  React.useEffect(() => {
    const urls = localUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);
  const dialog = DIALOGS.find((item) => item.id === dialogId) ?? DIALOGS[0];
  const unreadTotal = Object.values(unread).reduce((sum, count) => sum + count, 0);
  /** The search over the dialogs: by name and by the last message a row shows. */
  const [dialogQuery, setDialogQuery] = React.useState("");
  // The open dialog shows its live last message; the others their stored one.
  const lastOf = (item: Dialog) =>
    item.id === dialogId ? messages[messages.length - 1] : undefined;
  const previewOf = (item: Dialog) => {
    const last = lastOf(item);
    return last ? excerpt(last) : item.preview;
  };
  const needle = dialogQuery.trim().toLowerCase();
  const foundDialogs = needle
    ? DIALOGS.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          previewOf(item).toLowerCase().includes(needle),
      )
    : DIALOGS;
  /** The dialog whose history has arrived: opening another one loads it first. */
  const [loadedId, setLoadedId] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!dialogId) return;
    const timer = window.setTimeout(() => setLoadedId(dialogId), DIALOG_MS);
    return () => window.clearTimeout(timer);
  }, [dialogId]);

  const loadOlder = async () => {
    if (!hasOlder) return;
    await wait(HISTORY_MS);
    // Once: the region may ask again before this render lands.
    setMessages((current) =>
      current.some((message) => message.id === OLDER[0]?.id) ? current : [...OLDER, ...current],
    );
    setHasOlder(false);
  };

  // Every update touches one message: the rest keep their objects, so their rows stay memoized.
  const patch = React.useCallback(
    (id: string, next: (message: ChatMessage) => Partial<ChatMessage>) =>
      setMessages((current) =>
        current.map((message) =>
          message.id === id ? ({ ...message, ...next(message) } as ChatMessage) : message,
        ),
      ),
    [],
  );

  /** The client reads, waits while you are still typing, types for a moment and answers. */
  const clientAnswers = React.useCallback(async () => {
    await wait(MESSAGE_SEND_MS + MESSAGE_READ_MS);
    while (myActivity.current !== null) await wait(500);
    setClientTyping(true);
    await wait(CLIENT_TYPING_MS);
    setClientTyping(false);
    const text = CLIENT_REPLIES[replies.current % CLIENT_REPLIES.length] ?? "";
    replies.current += 1;
    setMessages((current) => [
      ...current,
      { id: `client-${Date.now()}`, from: "client", sentAt: new Date(), kind: "text", text },
    ]);
  }, []);

  /**
   * Adds an outgoing message at once (it rises from the composer into the list), sends it, then
   * marks it read when the client opens it. The id stays: the row is never re-keyed.
   */
  const post = React.useCallback(
    (content: Content, replyToId?: string) => {
      for (const url of localSourcesOf(content)) localUrls.current.add(url);
      const id = `own-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const message = {
        ...content,
        id,
        from: "me",
        sentAt: new Date(),
        status: "sending",
        replyTo: replyToId,
      } as ChatMessage;
      setMessages((current) => [...current, message]);
      window.setTimeout(() => patch(id, () => ({ status: "sent" })), MESSAGE_SEND_MS);
      window.setTimeout(
        () => patch(id, () => ({ status: "read" })),
        MESSAGE_SEND_MS + MESSAGE_READ_MS,
      );
      void clientAnswers();
    },
    [patch, clientAnswers],
  );

  const save = React.useCallback(
    (id: string, text: string) => patch(id, () => ({ text, edited: true })),
    [patch],
  );

  const editLast = React.useCallback(() => {
    const last = [...messages].reverse().find((item) => item.from === "me" && item.kind === "text");
    if (!last) return;
    setReplyTo(null);
    setEditing(last);
  }, [messages]);

  const startEdit = React.useCallback((message: ChatMessage) => {
    setReplyTo(null);
    setEditing(message);
  }, []);

  const startReply = React.useCallback((message: ChatMessage) => {
    setEditing(null);
    setReplyTo(message);
  }, []);

  const reportActivity = React.useCallback((activity: ComposerActivity | null) => {
    // A real chat sends it over its socket; here the simulated client reads it.
    myActivity.current = activity;
  }, []);

  const remove = React.useCallback(
    (id: string) => setMessages((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const dismissReply = React.useCallback(() => setReplyTo(null), []);
  const dismissEdit = React.useCallback(() => setEditing(null), []);

  // The newest messages for what a row looks up (a reply's original), without making every row
  // render again when one message changes.
  const messagesRef = React.useRef(messages);
  messagesRef.current = messages;
  const contact = dialog.contact;

  // A message renders again only when its data, its place or this function change: a status or an
  // upload tick re-renders the one message it touches.
  const renderMessage = React.useCallback(
    (message: ChatMessage) => {
      const own = message.from === "me";
      const original = message.replyTo
        ? messagesRef.current.find((item) => item.id === message.replyTo)
        : undefined;
      return (
        <Message.Root
          direction={own ? "outgoing" : "incoming"}
          time={message.sentAt}
          status={message.status}
          edited={message.edited}
        >
          {original ? (
            <Message.Reply author={original.from === "me" ? "Вы" : contact} target={original.id}>
              {excerpt(original)}
            </Message.Reply>
          ) : null}
          {renderContent(message)}
          <Message.Menu>
            <Dropdown.Item onSelect={() => startReply(message)}>
              <Dropdown.ItemIcon>
                <Icon name="action.reply" />
              </Dropdown.ItemIcon>
              Ответить
            </Dropdown.Item>
            {own && message.kind === "text" ? (
              <Dropdown.Item onSelect={() => startEdit(message)}>
                <Dropdown.ItemIcon>
                  <Icon name="action.edit" />
                </Dropdown.ItemIcon>
                Изменить
              </Dropdown.Item>
            ) : null}
            <Dropdown.Item onSelect={() => navigator.clipboard?.writeText(excerpt(message))}>
              <Dropdown.ItemIcon>
                <Icon name="action.copy" />
              </Dropdown.ItemIcon>
              Скопировать
            </Dropdown.Item>
            {own ? (
              <Dropdown.Item tone="danger" onSelect={() => remove(message.id)}>
                <Dropdown.ItemIcon>
                  <Icon name="action.delete" />
                </Dropdown.ItemIcon>
                Удалить
              </Dropdown.Item>
            ) : null}
          </Message.Menu>
        </Message.Root>
      );
    },
    [contact, startReply, startEdit, remove],
  );

  return (
    <>
      {/* A work screen: in an app this header fills the shell's `header` slot and carries the page —
          the only h1 and one line of data; main has no PageContent.Header. */}
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            Поддержка
            <AppHeader.Description>{unreadLabel(unreadTotal)}</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
      </AppHeader.Root>

      <PageContent.Root fill>
        <PageContent.Body>
          <PageContent.Split
            open={dialogId !== null}
            onOpenChange={(next) => {
              if (!next) setDialogId(null);
            }}
          >
            <PageContent.Panel kind="list" aria-label="Диалоги">
              <Card.Root className={styles.paneCard}>
                <ChatList.Root
                  items={foundDialogs}
                  getKey={(item) => item.id}
                  value={dialogId}
                  onValueChange={setDialogId}
                  search={dialogQuery}
                  onSearchChange={setDialogQuery}
                  now={NOW}
                  renderItem={(item) => {
                    const last = lastOf(item);
                    return (
                      <ChatList.Item
                        time={last?.sentAt ?? item.at}
                        status={last?.from === "me" ? last.status : undefined}
                        unread={unread[item.id] ?? 0}
                        typing={item.id === dialogId && clientTyping}
                      >
                        <ChatList.ItemIcon>
                          <Avatar.Root color={hueOf(item.id)}>
                            <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                            {item.id === "vector" ? <Avatar.Status status="online" /> : null}
                          </Avatar.Root>
                        </ChatList.ItemIcon>
                        <ChatList.ItemText>{item.name}</ChatList.ItemText>
                        <ChatList.ItemDescription author={last?.from === "me" ? "Вы" : undefined}>
                          {previewOf(item)}
                        </ChatList.ItemDescription>
                      </ChatList.Item>
                    );
                  }}
                />
              </Card.Root>
            </PageContent.Panel>

            <PageContent.Panel kind="detail" aria-label="Переписка">
              <Card.Root className={styles.paneCard}>
                <Chat.Root typing={clientTyping}>
                  <Chat.Header>
                    <PageContent.BackButton />
                    <Avatar.Root color={hueOf(dialog.id)}>
                      <Avatar.Fallback>{dialog.initials}</Avatar.Fallback>
                      {dialog.id === "vector" ? <Avatar.Status status="online" /> : null}
                    </Avatar.Root>
                    <Chat.Title>{dialog.name}</Chat.Title>
                    <Chat.Description>{dialog.contact}</Chat.Description>
                    <Chat.Actions>
                      <Chat.SearchButton />
                    </Chat.Actions>
                  </Chat.Header>
                  <Chat.Search />
                  <Chat.Messages
                    loading={loadedId !== dialogId}
                    items={messages}
                    getKey={(message) => message.id}
                    getAuthor={(message) => message.from}
                    getDate={(message) => message.sentAt}
                    renderMessage={renderMessage}
                    unread={FIRST_UNREAD}
                    now={NOW}
                    hasOlder={hasOlder}
                    onLoadOlder={loadOlder}
                    onNewMessage={(_, { direction }) => {
                      if (direction !== "incoming" || !dialogId) return;
                      setUnread((current) => ({
                        ...current,
                        [dialogId]: (current[dialogId] ?? 0) + 1,
                      }));
                    }}
                    onRead={(values) => {
                      if (!dialogId) return;
                      setUnread((current) => ({
                        ...current,
                        [dialogId]: Math.max(0, (current[dialogId] ?? 0) - values.length),
                      }));
                    }}
                  />
                  <Chat.Footer>
                    <ChatComposer
                      replyTo={replyTo}
                      replyAuthor={dialog.contactTo}
                      editing={editing}
                      onReplyDismiss={dismissReply}
                      onEditDismiss={dismissEdit}
                      onEditLast={editLast}
                      onPost={post}
                      onSave={save}
                      onActivityChange={reportActivity}
                    />
                  </Chat.Footer>
                </Chat.Root>
              </Card.Root>
            </PageContent.Panel>
          </PageContent.Split>
        </PageContent.Body>
      </PageContent.Root>
    </>
  );
}
