/** A support messenger on `Chat`: dialogs with a search over them beside the conversation (one pane at a time on a phone), history that loads above as you scroll up, dates and runs from data, every kind of message, search, pinned messages, replies and edits from the menu with a jump to the quoted message, read receipts and unread counts from what was seen, the typing signal both ways, and the Composer whose messages rise into the list while the client answers. */
import {
  Avatar,
  Button,
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
  type MessageReaction,
  type MessageStatus,
  type MessageUser,
  PageContent,
  type UploadContext,
  useUploadQueue,
  VideoNote,
  VoicePlayer,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./chat.module.css";

type Content =
  | { kind: "text"; text: string }
  | { kind: "media"; items: GalleryItem[]; caption?: string }
  | { kind: "voice"; src: string; waveform: number[]; duration: number; transcribable?: boolean }
  | { kind: "videoNote"; src: string; duration: number; transcript?: string }
  | { kind: "file"; name: string; size: number; href: string }
  | { kind: "location"; title: string; address: string }
  | { kind: "contact"; name: string; phone: string }
  | { kind: "link"; text: string; href: string; site: string; title: string; description: string }
  | { kind: "service"; text: string };

type ChatMessage = Content & {
  id: string;
  from: "client" | "me";
  sentAt: Date;
  status?: MessageStatus;
  edited?: boolean;
  forwardedFrom?: string;
  replyTo?: string;
  reactions?: MessageReaction[];
};

type Dialog = {
  id: string;
  name: string;
  initials: string;
  unread: number;
  preview: string;
  at: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
const VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const MAP = "https://tile.openstreetmap.org/15/19808/10244.png";
const WAVE = [
  0.2, 0.4, 0.7, 0.5, 0.9, 0.6, 0.3, 0.5, 0.8, 0.6, 0.35, 0.55, 0.75, 0.4, 0.25, 0.6, 0.85, 0.5,
  0.3, 0.45, 0.65, 0.4, 0.2,
];

/** The reader (the support agent) and the client's contact, as reactors of a chip. */
const ME: MessageUser = {
  id: "me",
  name: "Вы",
  src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop",
};
const CLIENT: MessageUser = {
  id: "irina",
  name: "Ирина Белова",
  src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
};

/** The client's reaction to the reply. */
const LIKE: MessageReaction = { emoji: "👍", count: 1, users: [CLIENT] };

const photo = (seed: string, width: number, height: number, alt: string): GalleryItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

const DIALOGS: Dialog[] = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    unread: 2,
    preview: "Ок, жду акт",
    at: at(8, 14, 31),
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    unread: 0,
    preview: "Акт сверки подписан",
    at: at(7, 16, 5),
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
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
    reactions: [{ emoji: "👀", count: 1, selected: true, users: [ME] }],
  },
  {
    id: "m2",
    from: "client",
    sentAt: at(7, 10, 13),
    kind: "media",
    items: [photo("export-error", 800, 520, "Окно с ошибкой экспорта")],
    caption: "Вот так выглядит",
  },
  {
    id: "m3",
    from: "me",
    sentAt: at(7, 10, 20),
    status: "read",
    kind: "text",
    text: "Похоже, в карточке не заполнен ИНН. Инструкция: https://prime.app/wiki/requisites",
  },
  {
    id: "m4",
    from: "me",
    sentAt: at(7, 10, 21),
    status: "read",
    kind: "link",
    text: "И статья о выгрузке:",
    href: "https://prime.app/blog/export-1c",
    site: "Блог Prime",
    title: "Выгрузка счетов в 1С за пять минут",
    description: "Настройка обмена, реквизиты контрагента и типичные ошибки экспорта.",
  },
  {
    id: "s1",
    from: "me",
    sentAt: at(8, 9, 0),
    kind: "service",
    text: "Ирина Белова добавила Дмитрия Орлова",
  },
  {
    id: "m5",
    from: "client",
    sentAt: at(8, 9, 40),
    kind: "media",
    items: [
      photo("dock-1", 600, 800, "Рампа 1"),
      photo("dock-2", 800, 600, "Рампа 2"),
      photo("dock-3", 800, 600, "Рампа 3"),
    ],
  },
  {
    id: "m6",
    from: "client",
    sentAt: at(8, 9, 41),
    kind: "videoNote",
    src: VIDEO,
    duration: 6,
    transcript: "Вот рампа номер два, машина встанет сюда задним ходом.",
  },
  {
    id: "m7",
    from: "client",
    sentAt: at(8, 9, 43),
    kind: "voice",
    src: AUDIO,
    waveform: WAVE,
    duration: 18,
    transcribable: true,
  },
  {
    id: "m8",
    from: "me",
    sentAt: at(8, 10, 5),
    status: "read",
    replyTo: "m7",
    kind: "text",
    text: "Понял про вторую рампу. Высылаю договор и адрес склада.",
    reactions: [LIKE],
  },
  {
    id: "m9",
    from: "me",
    sentAt: at(8, 10, 6),
    status: "read",
    kind: "file",
    name: "Договор поставки №418.pdf",
    size: 1_258_291,
    href: "https://prime.app/files/contract-418.pdf",
  },
  {
    id: "m10",
    from: "me",
    sentAt: at(8, 10, 6),
    status: "read",
    kind: "location",
    title: "Склад «Центральный»",
    address: "Москва, ул. Складочная, 1, стр. 6",
  },
  {
    id: "m11",
    from: "client",
    sentAt: at(8, 14, 30),
    forwardedFrom: "Дмитрий Орлов",
    kind: "contact",
    name: "Дмитрий Орлов",
    phone: "+7 916 204-18-77",
  },
  { id: "m12", from: "client", sentAt: at(8, 14, 31), kind: "text", text: "Ок, жду акт" },
];

const FIRST_UNREAD = "m11";
const PINNED = ["m9"];

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
const TRANSCRIBE_MS = 1400;

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

/** A stand-in for the speech service: the voice message's text, asked for on its first open. */
const transcribeVoice = () =>
  wait(TRANSCRIBE_MS).then(
    () => "Машина будет в девять, водитель позвонит за полчаса. Пропуск заказан на рампу два.",
  );

const excerpt = (message: ChatMessage) => {
  switch (message.kind) {
    case "text":
    case "link":
      return message.text;
    case "voice":
      return "Голосовое сообщение";
    case "videoNote":
      return "Видеосообщение";
    case "media":
      return (
        message.caption ?? (message.items.every((item) => item.type === "video") ? "Видео" : "Фото")
      );
    case "file":
      return message.name;
    default:
      return "Сообщение";
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
    : message.kind === "voice" || message.kind === "videoNote"
      ? [message.src]
      : []
  ).filter((src) => src.startsWith("blob:"));

/** Puts the reader's reaction or takes it back, with the reader among its `users`. */
const toggleReactions = (reactions: MessageReaction[], emoji: string): MessageReaction[] =>
  reactions.some((reaction) => reaction.emoji === emoji)
    ? reactions
        .map((reaction) => {
          if (reaction.emoji !== emoji) return reaction;
          const others = (reaction.users ?? []).filter((user) => user.id !== ME.id);
          return {
            ...reaction,
            selected: !reaction.selected,
            count: reaction.count + (reaction.selected ? -1 : 1),
            users: reaction.selected ? others : [...others, ME],
          };
        })
        .filter((reaction) => reaction.count > 0)
    : [...reactions, { emoji, count: 1, selected: true, users: [ME] }];

const renderContent = (message: ChatMessage) => {
  switch (message.kind) {
    case "text":
      return <Message.Text>{message.text}</Message.Text>;
    case "link":
      return (
        <>
          <Message.Text>{message.text}</Message.Text>
          <Message.LinkPreview
            href={message.href}
            site={message.site}
            title={message.title}
            description={message.description}
          />
        </>
      );
    case "media":
      return (
        <>
          <Message.Media items={message.items} />
          {message.caption ? <Message.Text>{message.caption}</Message.Text> : null}
        </>
      );
    case "voice":
      return (
        <VoicePlayer
          src={message.src}
          waveform={message.waveform}
          duration={message.duration}
          onTranscribe={message.transcribable ? transcribeVoice : undefined}
        />
      );
    case "videoNote":
      return (
        <VideoNote src={message.src} duration={message.duration} transcript={message.transcript} />
      );
    case "file":
      return <Message.File name={message.name} fileSize={message.size} href={message.href} />;
    case "location":
      return (
        <Message.Location
          src={MAP}
          href="https://www.openstreetmap.org/#map=16/55.7512/37.6184"
          title={message.title}
          address={message.address}
        />
      );
    case "contact":
      return (
        <Message.Contact name={message.name} phone={message.phone} color="teal">
          <Button.Root variant="soft" tone="neutral" size="s">
            Написать
          </Button.Root>
        </Message.Contact>
      );
    default:
      return null;
  }
};

type ChatComposerProps = {
  replyTo: ChatMessage | null;
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
  // Photos and videos go as albums in the tray's order with the text as their caption, other
  // files as file messages. The tray's previews are revoked after the send, so an album plays from
  // its own URLs of the files (the thread lets them go with the message).
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
          <Composer.Title>Ответ {replyTo.from === "me" ? "себе" : "Ирине Беловой"}</Composer.Title>
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

export default function ChatPattern() {
  const [dialogId, setDialogId] = React.useState<string | null>("vector");
  const [messages, setMessages] = React.useState<ChatMessage[]>(HISTORY);
  const [hasOlder, setHasOlder] = React.useState(true);
  const [replyTo, setReplyTo] = React.useState<ChatMessage | null>(null);
  const [editing, setEditing] = React.useState<ChatMessage | null>(null);
  const [selected, setSelected] = React.useState<readonly string[] | null>(null);
  const [pinned, setPinned] = React.useState<readonly string[]>(PINNED);
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

  const togglePin = React.useCallback(
    (id: string) =>
      setPinned((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      ),
    [],
  );

  const reportActivity = React.useCallback((activity: ComposerActivity | null) => {
    // A real chat sends it over its socket; here the simulated client reads it.
    myActivity.current = activity;
  }, []);

  const toggleReaction = React.useCallback(
    (id: string, emoji: string) =>
      patch(id, (message) => ({ reactions: toggleReactions(message.reactions ?? [], emoji) })),
    [patch],
  );

  const remove = React.useCallback(
    (id: string) => setMessages((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const dismissReply = React.useCallback(() => setReplyTo(null), []);
  const dismissEdit = React.useCallback(() => setEditing(null), []);

  const pinnedItems = pinned.flatMap((id) => {
    const message = messages.find((item) => item.id === id);
    return message ? [{ value: id, text: excerpt(message) }] : [];
  });

  // The newest messages for what a row looks up (a reply's original), without making every row
  // render again when one message changes.
  const messagesRef = React.useRef(messages);
  messagesRef.current = messages;

  // A message renders again only when its data, its place or this function change: a reaction, a
  // status or an upload tick re-renders the one message it touches.
  const renderMessage = React.useCallback(
    (message: ChatMessage) => {
      if (message.kind === "service") return <Chat.Service>{message.text}</Chat.Service>;
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
          onReactionToggle={(emoji) => toggleReaction(message.id, emoji)}
        >
          {message.forwardedFrom ? <Message.Forwarded from={message.forwardedFrom} /> : null}
          {original ? (
            <Message.Reply
              author={original.from === "me" ? "Вы" : "Ирина Белова"}
              target={original.id}
            >
              {excerpt(original)}
            </Message.Reply>
          ) : null}
          {renderContent(message)}
          {message.reactions?.length ? <Message.Reactions items={message.reactions} /> : null}
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
            <Dropdown.Item onSelect={() => togglePin(message.id)}>
              <Dropdown.ItemIcon>
                <Icon name="action.pin" />
              </Dropdown.ItemIcon>
              {pinned.includes(message.id) ? "Открепить" : "Закрепить"}
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
    [pinned, toggleReaction, startReply, startEdit, togglePin, remove],
  );

  return (
    <PageContent.Root fill>
      <PageContent.Header>
        <PageContent.Title>Поддержка</PageContent.Title>
      </PageContent.Header>
      <PageContent.Body>
        <PageContent.Split
          open={dialogId !== null}
          onOpenChange={(next) => {
            if (!next) setDialogId(null);
          }}
        >
          <PageContent.List aria-label="Диалоги">
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
          </PageContent.List>

          <PageContent.Detail aria-label="Переписка">
            <Card.Root className={styles.paneCard}>
              <Chat.Root typing={clientTyping} selected={selected} onSelectedChange={setSelected}>
                <Chat.Header>
                  <PageContent.BackButton />
                  <Avatar.Root color={hueOf(dialog.id)}>
                    <Avatar.Fallback>{dialog.initials}</Avatar.Fallback>
                    <Avatar.Status status="online" />
                  </Avatar.Root>
                  <Chat.Title>{dialog.name}</Chat.Title>
                  <Chat.Description>Ирина Белова · в сети</Chat.Description>
                  <Chat.Actions>
                    <Chat.SearchButton />
                  </Chat.Actions>
                </Chat.Header>
                <Chat.Search />
                <Chat.Pinned items={pinnedItems} onRemove={togglePin} />
                <Chat.Messages
                  loading={loadedId !== dialogId}
                  reader={ME}
                  items={messages}
                  getKey={(message) => message.id}
                  getAuthor={(message) => message.from}
                  getDate={(message) => message.sentAt}
                  isService={(message) => message.kind === "service"}
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
                >
                  <Chat.SelectionBar>
                    <Button.Root
                      variant="soft"
                      tone="danger"
                      size="s"
                      disabled={!selected?.length}
                      onClick={() => {
                        setMessages((current) =>
                          current.filter((item) => !selected?.includes(item.id)),
                        );
                        setSelected(null);
                      }}
                    >
                      Удалить
                    </Button.Root>
                  </Chat.SelectionBar>
                </Chat.Messages>
                <Chat.Footer>
                  <ChatComposer
                    replyTo={replyTo}
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
          </PageContent.Detail>
        </PageContent.Split>
      </PageContent.Body>
    </PageContent.Root>
  );
}
