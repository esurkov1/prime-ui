/** A complete team messenger over two thousand messages: the header whose status turns into typing, search with highlight, pinned messages, history that loads above, author headers with tags in a group chat, every kind of message, transcripts, reactions, the menu with reply, edit, pin and select, jumps, the new-messages button and the Composer whose messages rise into the list — `Chat.Root`, `Chat.Header`, `Chat.Search`, `Chat.Pinned`, `Chat.Messages`, `type`, `items`, `renderMessage`, `typing`, `selected`, `Chat.Footer`. */
import {
  Avatar,
  Button,
  Card,
  Chat,
  Composer,
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
  type UploadContext,
  useUploadQueue,
  VideoNote,
  VoicePlayer,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Content =
  | { kind: "text"; text: string }
  | { kind: "media"; items: GalleryItem[]; caption?: string }
  | { kind: "voice"; src: string; waveform: number[]; duration: number; transcript?: string }
  | { kind: "videoNote"; src: string; duration: number; transcribable?: boolean }
  | { kind: "file"; name: string; size: number; uploading?: boolean }
  | { kind: "contact"; name: string; phone: string }
  | { kind: "location"; title: string; address: string }
  | { kind: "link"; text: string; href: string; site: string; title: string; description: string }
  | { kind: "service"; text: string };

type Member = MessageUser & { tag?: string; owner?: boolean };

type ChatMessage = Content & {
  id: string;
  from: "anna" | "oleg" | "irina" | "me";
  sentAt: Date;
  status?: MessageStatus;
  edited?: boolean;
  forwardedFrom?: string;
  replyTo?: string;
  reactions?: MessageReaction[];
};

const NOW = new Date(2026, 9, 8, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
const VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const MAP = "https://tile.openstreetmap.org/15/19808/10244.png";
const WAVE = [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.6, 0.35, 0.7, 0.5, 0.3, 0.6, 0.8, 0.45, 0.25, 0.5];

const ME: MessageUser = {
  id: "me",
  name: "Вы",
  src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop",
};
const MEMBERS: Record<ChatMessage["from"], Member> = {
  me: ME,
  anna: {
    id: "anna",
    name: "Анна Котова",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    tag: "Логистика",
  },
  irina: { id: "irina", name: "Ирина Белова", tag: "Бухгалтерия" },
  oleg: {
    id: "oleg",
    name: "Олег Смирнов",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
    tag: "Админ",
    owner: true,
  },
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("");

const photo = (seed: string, width: number, height: number, alt: string): GalleryItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

/** The long history of the thread: two months of work talk, generated the same way every time. */
const ARCHIVE_SIZE = 2000;
const ARCHIVE_TEAM = [
  "Счёт INV-{n} выставлен, проверьте реквизиты.",
  "Склад подтвердил отгрузку по заказу №{n}.",
  "Клиент просит перенести поставку №{n} на пятницу.",
  "Бухгалтерия закрыла акт сверки за неделю.",
  "Выгрузка в 1С по заказу №{n} прошла без ошибок.",
  "Нужна подпись на допсоглашении к договору №{n}.",
  "Поставщик прислал новые цены, сравню с прошлым месяцем.",
  "Заказ №{n} собран, ждём курьера.",
];
const ARCHIVE_ME = [
  "Принято, посмотрю до обеда.",
  "Реквизиты верные, можно отправлять.",
  "Согласовал с отделом продаж, переносим.",
  "Подписал, скан в папке проекта.",
  "Спасибо! Обновлю статус в карточке заказа №{n}.",
  "Проверю остатки и вернусь с ответом.",
];
const archiveText = (lines: readonly string[], index: number) =>
  (lines[(index * 7) % lines.length] ?? "").replace("{n}", String(3000 + index));
const ARCHIVE: ChatMessage[] = Array.from({ length: ARCHIVE_SIZE }, (_, index) => {
  const mine = (index * 5) % 7 < 3;
  const perDay = 36;
  const slot = index % perDay;
  return {
    id: `a${index}`,
    from: mine ? "me" : index % 11 < 3 ? "oleg" : index % 13 < 3 ? "irina" : "anna",
    sentAt: new Date(
      2026,
      7,
      10 + Math.floor(index / perDay),
      9 + Math.floor(slot / 4),
      (slot % 4) * 14,
    ),
    ...(mine ? { status: "read" as const } : {}),
    kind: "text",
    text: archiveText(mine ? ARCHIVE_ME : ARCHIVE_TEAM, index),
  };
});

/** Older history, loaded when the conversation is scrolled to its start. */
const OLDER: ChatMessage[] = [
  {
    id: "o1",
    from: "oleg",
    sentAt: new Date(2026, 7, 3, 11, 2),
    kind: "text",
    text: "Добрый день! Подключаем второй склад к порталу поставщиков.",
  },
  {
    id: "o2",
    from: "me",
    sentAt: new Date(2026, 7, 3, 11, 10),
    status: "read",
    kind: "text",
    text: "Здравствуйте! Заведу склад сегодня и пришлю доступы.",
  },
];

const HISTORY: ChatMessage[] = [
  {
    id: "m1",
    from: "anna",
    sentAt: at(7, 18, 30),
    kind: "text",
    text: "Релиз **2.4** переносим на четверг: _миграция счетов_ ещё идёт.",
    reactions: [{ emoji: "👍", count: 1, users: [ME], selected: true }],
  },
  {
    id: "m2",
    from: "anna",
    sentAt: at(7, 18, 31),
    kind: "media",
    items: [
      photo("board-1", 600, 800, "Доска задач"),
      photo("board-2", 800, 600, "План миграции"),
      photo("board-3", 800, 600, "Схема сервисов"),
    ],
    reactions: [{ emoji: "🔥", count: 1, users: [ME], selected: true }],
  },
  {
    id: "m3",
    from: "me",
    sentAt: at(7, 18, 40),
    status: "read",
    kind: "text",
    text: "Принято, сдвину выгрузку счетов в 1С.",
  },
  {
    id: "s1",
    from: "oleg",
    sentAt: at(8, 9, 0),
    kind: "service",
    text: "Олег Смирнов закрепил реквизиты для оплаты",
  },
  {
    id: "m4",
    from: "oleg",
    sentAt: at(8, 9, 12),
    forwardedFrom: "Ирина Белова",
    kind: "text",
    text: "Клиент просит добавить поле «Номер договора» в форму заказа.",
  },
  {
    id: "m5",
    from: "anna",
    sentAt: at(8, 9, 13),
    kind: "media",
    items: [photo("order-form", 800, 560, "Форма заказа")],
    caption: "Вот текущая форма заказа",
  },
  {
    id: "m6",
    from: "anna",
    sentAt: at(8, 9, 14),
    kind: "voice",
    src: AUDIO,
    waveform: WAVE,
    duration: 18,
    transcript:
      "Посмотрела форму: поле «Склад отгрузки» пустое, хотя склад один. Можно подставлять его сразу?",
  },
  {
    id: "m7",
    from: "anna",
    sentAt: at(8, 9, 15),
    kind: "videoNote",
    src: VIDEO,
    duration: 6,
    transcribable: true,
  },
  {
    id: "m8",
    from: "me",
    sentAt: at(8, 9, 30),
    status: "read",
    edited: true,
    replyTo: "m4",
    kind: "text",
    text: "Сделаю сегодня, макет: https://prime.app/design/order-form",
    reactions: [{ emoji: "❤️", count: 1, users: [MEMBERS.anna] }],
  },
  {
    id: "m9",
    from: "me",
    sentAt: at(8, 9, 31),
    status: "read",
    kind: "link",
    text: "И чеклист релиза:",
    href: "https://prime.app/wiki/release-2-4",
    site: "База знаний",
    title: "Чеклист релиза 2.4",
    description: "Бэкап, миграция, проверка выгрузки счетов в 1С и уведомление клиентов.",
  },
  {
    id: "m10",
    from: "oleg",
    sentAt: at(8, 10, 5),
    kind: "file",
    name: "Договор поставки №418.pdf",
    size: 1_258_291,
  },
  {
    id: "m11",
    from: "oleg",
    sentAt: at(8, 10, 6),
    kind: "contact",
    name: "Ирина Белова",
    phone: "+7 916 204-18-77",
  },
  {
    id: "m12",
    from: "anna",
    sentAt: at(8, 10, 7),
    kind: "location",
    title: "Склад «Центральный»",
    address: "Москва, ул. Складочная, 1, стр. 6",
  },
  {
    id: "m13",
    from: "anna",
    sentAt: at(8, 14, 20),
    kind: "text",
    text: "Пришлите, пожалуйста, спецификацию к договору и реквизиты склада.",
  },
  {
    id: "m14",
    from: "me",
    sentAt: at(8, 14, 25),
    status: "sending",
    kind: "file",
    name: "Спецификация.xlsx",
    size: 3_670_016,
    uploading: true,
  },
  {
    id: "m15",
    from: "me",
    sentAt: at(8, 14, 26),
    status: "failed",
    kind: "text",
    text: "Реквизиты склада пришлю после сверки с бухгалтерией.",
  },
];

const FIRST_UNREAD = "m13";
const PINNED_FIRST = ["m1", "m10"];

/** What the team answers, one after another. */
const REPLIES = [
  "Спасибо, получила! Передам бухгалтерии.",
  "Отлично, тогда ждём выгрузку в четверг.",
  "Поняла. Если будут вопросы по складу — пишите сюда.",
];

const SEND_MS = 600;
const READ_MS = 1200;
const TYPING_MS = 1800;
const HISTORY_MS = 900;
const TRANSCRIBE_MS = 1400;
/** An album holds up to ten photos and videos: more go as the next album. */
const ALBUM_MAX = 10;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** A stand-in for the file server: an attachment goes up in four steps. */
function uploadFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
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

const excerpt = (message: ChatMessage) => {
  switch (message.kind) {
    case "text":
    case "link":
      return message.text;
    case "media":
      return (
        message.caption ?? (message.items.every((item) => item.type === "video") ? "Видео" : "Фото")
      );
    case "voice":
      return "Голосовое сообщение";
    case "videoNote":
      return "Видеосообщение";
    case "file":
    case "contact":
      return message.name;
    case "location":
      return message.title;
    default:
      return message.text;
  }
};

/** The speech service: a video message's text arrives a moment after it is asked for. */
const transcribeVideoNote = () =>
  wait(TRANSCRIBE_MS).then(
    () => "Снимаю склад: стеллаж B, третий ряд. Коробки по заказу 4821 тут.",
  );

const albumsOf = (media: readonly ComposerMediaItem[]) =>
  Array.from({ length: Math.ceil(media.length / ALBUM_MAX) }, (_, index) =>
    media.slice(index * ALBUM_MAX, (index + 1) * ALBUM_MAX),
  );

/** The media URLs a message plays from. */
const sourcesOf = (message: ChatMessage): string[] =>
  message.kind === "media"
    ? message.items.map((item) => item.src)
    : message.kind === "voice" || message.kind === "videoNote"
      ? [message.src]
      : [];

/** The reader's reaction put or taken back. */
const toggleOwn = (reactions: readonly MessageReaction[], emoji: string): MessageReaction[] => {
  const own = reactions.find((reaction) => reaction.emoji === emoji);
  if (!own) return [...reactions, { emoji, count: 1, selected: true, users: [ME] }];
  return reactions
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
    .filter((reaction) => reaction.count > 0);
};

const content = (message: ChatMessage, onCancel: () => void) => {
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
          unplayed={message.from !== "me"}
          transcript={message.transcript}
        />
      );
    case "videoNote":
      return (
        <VideoNote
          src={message.src}
          duration={message.duration}
          onTranscribe={message.transcribable ? transcribeVideoNote : undefined}
        />
      );
    case "file":
      return message.uploading ? (
        <Message.File
          name={message.name}
          fileSize={message.size}
          transfer="loading"
          transferProgress={0.4}
          onCancel={onCancel}
        />
      ) : (
        <Message.File
          name={message.name}
          fileSize={message.size}
          href="https://prime.app/files/contract-418.pdf"
        />
      );
    case "contact":
      return (
        <Message.Contact name={message.name} phone={message.phone} color="pink">
          <Button.Root variant="soft" tone="neutral" size="s">
            Написать
          </Button.Root>
        </Message.Contact>
      );
    case "location":
      return (
        <Message.Location
          src={MAP}
          href="https://www.openstreetmap.org/#map=16/55.7512/37.6184"
          title={message.title}
          address={message.address}
        />
      );
    default:
      return null;
  }
};

export default function ChatOverviewExample() {
  const [messages, setMessages] = React.useState(() => [...ARCHIVE, ...HISTORY]);
  const [hasOlder, setHasOlder] = React.useState(true);
  const [selected, setSelected] = React.useState<readonly string[] | null>(null);
  const [pinned, setPinned] = React.useState<readonly string[]>(PINNED_FIRST);
  const [typing, setTyping] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState<ChatMessage | null>(null);
  const [editing, setEditing] = React.useState<ChatMessage | null>(null);
  const [draft, setDraft] = React.useState("");
  const replies = React.useRef(0);
  const queue = useUploadQueue({ upload: uploadFile });
  // The newest messages for what a row looks up (a reply's original, the files to let go), without
  // making every row render again when one message changes.
  const messagesRef = React.useRef(messages);
  messagesRef.current = messages;

  const patch = (id: string, next: Partial<ChatMessage>) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? ({ ...message, ...next } as ChatMessage) : message,
      ),
    );

  /** The team reads my message, Анна types for a moment and answers. */
  const answer = async () => {
    await wait(READ_MS);
    setTyping(true);
    await wait(TYPING_MS);
    setTyping(false);
    const text = REPLIES[replies.current % REPLIES.length] ?? "";
    replies.current += 1;
    setMessages((current) => [
      ...current,
      { id: `in-${Date.now()}`, from: "anna", sentAt: new Date(), kind: "text", text },
    ]);
  };

  /** Adds my message at once (it rises from the composer), then walks its status. */
  const post = (next: Content, reply?: string) => {
    const id = `own-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMessages((current) => [
      ...current,
      {
        ...next,
        id,
        from: "me",
        sentAt: new Date(),
        status: "sending",
        replyTo: reply,
      } as ChatMessage,
    ]);
    window.setTimeout(() => patch(id, { status: "sent" }), SEND_MS);
    window.setTimeout(() => patch(id, { status: "read" }), SEND_MS + READ_MS);
    void answer();
  };

  // Photos, videos and recordings of this session play from local object URLs: each is let go
  // when its message is deleted or the chat closes.
  const localUrls = React.useRef(new Set<string>());
  const localUrl = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    localUrls.current.add(url);
    return url;
  };
  React.useEffect(() => {
    const urls = localUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  // Photos and videos go as albums in the order of the tray, the text as their caption; other
  // files as file messages.
  const send = ({ text, media, files, replyTo: reply, editOf }: ComposerMessage) => {
    if (editOf) {
      patch(editOf, { kind: "text", text, edited: true } as Partial<ChatMessage>);
      setDraft("");
      return;
    }
    albumsOf(media).forEach((album, index) => {
      post(
        {
          kind: "media",
          items: album.map((item) => ({
            type: item.type,
            src: localUrl(item.file),
            alt: item.file.name,
          })),
          caption: index === 0 && text ? text : undefined,
        },
        reply,
      );
    });
    for (const item of files)
      post({ kind: "file", name: item.file.name, size: item.file.size }, reply);
    if (text && media.length === 0) post({ kind: "text", text }, reply);
  };

  const sendRecording =
    (kind: "voice" | "videoNote") =>
    ({ blob, durationMs, waveform }: ComposerRecording) =>
      post(
        kind === "voice"
          ? { kind, src: localUrl(blob), waveform: [...waveform], duration: durationMs / 1000 }
          : { kind, src: localUrl(blob), duration: durationMs / 1000 },
        replyTo?.id,
      );

  const startEdit = (message: ChatMessage) => {
    if (message.kind !== "text") return;
    setReplyTo(null);
    setEditing(message);
    setDraft(message.text);
  };

  const editLast = () => {
    const last = [...messages].reverse().find((item) => item.from === "me" && item.kind === "text");
    if (last) startEdit(last);
  };

  const loadOlder = async () => {
    await wait(HISTORY_MS);
    // Once: the region may ask again before this render lands.
    setMessages((current) =>
      current.some((message) => message.id === OLDER[0]?.id) ? current : [...OLDER, ...current],
    );
    setHasOlder(false);
  };

  const remove = (ids: readonly string[]) => {
    for (const message of messagesRef.current) {
      if (!ids.includes(message.id)) continue;
      for (const url of sourcesOf(message)) {
        if (localUrls.current.delete(url)) URL.revokeObjectURL(url);
      }
    }
    setMessages((current) => current.filter((message) => !ids.includes(message.id)));
    setPinned((current) => current.filter((id) => !ids.includes(id)));
  };

  const togglePin = (id: string) =>
    setPinned((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const pinnedItems = pinned.flatMap((id) => {
    const message = messages.find((item) => item.id === id);
    return message ? [{ value: id, text: excerpt(message) }] : [];
  });

  // Stable while the pins are: a reaction, a status or a keystroke in the composer renders again
  // only the row whose data changed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the handlers only call state setters
  const renderMessage = React.useCallback(
    (message: ChatMessage) => {
      if (message.kind === "service") return <Chat.Service>{message.text}</Chat.Service>;
      const own = message.from === "me";
      const author = MEMBERS[message.from];
      const original = message.replyTo
        ? messagesRef.current.find((item) => item.id === message.replyTo)
        : undefined;
      return (
        <Message.Root
          direction={own ? "outgoing" : "incoming"}
          time={message.sentAt}
          status={message.status}
          edited={message.edited}
          onRetry={
            message.status === "failed"
              ? () => wait(900).then(() => patch(message.id, { status: "read" }))
              : undefined
          }
          onReactionToggle={(emoji) =>
            patch(message.id, { reactions: toggleOwn(message.reactions ?? [], emoji) })
          }
        >
          {own ? null : (
            <Message.Avatar>
              <Avatar.Root color={hueOf(author.id)}>
                {author.src ? <Avatar.Image src={author.src} alt="" /> : null}
                <Avatar.Fallback>{initialsOf(author.name)}</Avatar.Fallback>
              </Avatar.Root>
            </Message.Avatar>
          )}
          {own ? null : (
            <Message.Author color={hueOf(author.id)} tag={author.tag}>
              {author.name}
              {author.owner ? (
                <Message.AuthorIcon>
                  <Icon name="object.crown" />
                </Message.AuthorIcon>
              ) : null}
            </Message.Author>
          )}
          {message.forwardedFrom ? <Message.Forwarded from={message.forwardedFrom} /> : null}
          {original ? (
            <Message.Reply
              author={MEMBERS[original.from].name}
              color={hueOf(original.from)}
              target={original.id}
            >
              {excerpt(original)}
            </Message.Reply>
          ) : null}
          {content(message, () => remove([message.id]))}
          {message.reactions?.length ? <Message.Reactions items={message.reactions} /> : null}
          <Message.Menu>
            <Dropdown.Item
              onSelect={() => {
                setEditing(null);
                setReplyTo(message);
              }}
            >
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
              <Dropdown.Item tone="danger" onSelect={() => remove([message.id])}>
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
    [pinned],
  );

  return (
    <Card.Root className={styles.messenger}>
      <Chat.Root typing={typing} selected={selected} onSelectedChange={setSelected}>
        <Chat.Header>
          <Avatar.Root color="teal">
            <Avatar.Fallback>П4</Avatar.Fallback>
          </Avatar.Root>
          <Chat.Title>Поставка №418</Chat.Title>
          <Chat.Description>3 участника</Chat.Description>
          <Chat.Actions>
            <Chat.SearchButton />
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Ещё">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item onSelect={() => setSelected([])}>
                  <Dropdown.ItemIcon>
                    <Icon name="action.check" />
                  </Dropdown.ItemIcon>
                  Выбрать сообщения
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.ItemIcon>
                    <Icon name="status.muted" />
                  </Dropdown.ItemIcon>
                  Без звука
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Chat.Actions>
        </Chat.Header>
        <Chat.Search />
        <Chat.Pinned items={pinnedItems} onRemove={togglePin} />
        <Chat.Messages
          type="group"
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
        >
          <Chat.SelectionBar>
            <Button.Root variant="soft" tone="neutral" size="s" disabled={!selected?.length}>
              Переслать
            </Button.Root>
            <Button.Root
              variant="soft"
              tone="danger"
              size="s"
              disabled={!selected?.length}
              onClick={() => {
                remove(selected ?? []);
                setSelected(null);
              }}
            >
              Удалить
            </Button.Root>
          </Chat.SelectionBar>
        </Chat.Messages>
        <Chat.Footer>
          <Composer.Root
            value={draft}
            onValueChange={setDraft}
            queue={queue}
            onSend={send}
            onSendVoice={sendRecording("voice")}
            onSendVideoNote={sendRecording("videoNote")}
            onEditLast={editLast}
          >
            <Composer.Attach />
            {replyTo ? (
              <Composer.Context value={replyTo.id} onDismiss={() => setReplyTo(null)}>
                <Composer.Title>Ответ {MEMBERS[replyTo.from].name}</Composer.Title>
                <Composer.Description>{excerpt(replyTo)}</Composer.Description>
              </Composer.Context>
            ) : null}
            {editing ? (
              <Composer.Context
                mode="edit"
                value={editing.id}
                onDismiss={() => {
                  setEditing(null);
                  setDraft("");
                }}
              >
                <Composer.Title>Редактирование</Composer.Title>
                <Composer.Description>{excerpt(editing)}</Composer.Description>
              </Composer.Context>
            ) : null}
          </Composer.Root>
        </Chat.Footer>
      </Chat.Root>
    </Card.Root>
  );
}
