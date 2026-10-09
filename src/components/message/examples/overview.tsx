/** A complete messenger over two thousand messages: a header with the status that turns into typing, search with highlight and stepping through matches, pinned messages, history that loads above, every kind of message, the transcript of a voice message and a video circle, reactions, the menu with reply, edit, pin and select, jump to the quoted message, the new-messages button, typing, and the Composer whose sent messages rise into the list while the reply arrives — `Message.Group`, `Message.Root`, `groupMessages`, `onReactionToggle`, `selected`, `highlight`, `current`, `transcript`, `onTranscribe`, `Message.Typing`, `Message.Pinned`, `Message.Reply`. */
import {
  Avatar,
  Button,
  Card,
  Composer,
  type ComposerMediaItem,
  type ComposerMessage,
  type ComposerRecording,
  Crossfade,
  Dropdown,
  groupMessages,
  Icon,
  Input,
  Message,
  type MessageMediaItem,
  type MessageReaction,
  type MessageStatus,
  type MessageUser,
  ScrollContainer,
  Skeleton,
  Typography,
  type UploadContext,
  useUploadQueue,
  VideoNote,
  VoicePlayer,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Content =
  | { kind: "text"; text: string }
  | { kind: "media"; items: MessageMediaItem[]; caption?: string }
  | { kind: "voice"; src: string; waveform: number[]; duration: number; transcript?: string }
  | { kind: "videoNote"; src: string; duration: number; transcribable?: boolean }
  | { kind: "file"; name: string; size: number; uploading?: boolean }
  | { kind: "contact"; name: string; phone: string }
  | { kind: "location"; title: string; address: string }
  | { kind: "link"; text: string; href: string; site: string; title: string; description: string }
  | { kind: "service"; text: string };

type ChatMessage = Content & {
  id: string;
  from: "anna" | "me";
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
const ANNA_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";
const ANNA: MessageUser = { id: "anna", name: "Анна Котова", src: ANNA_PHOTO };

const photo = (seed: string, width: number, height: number, alt: string): MessageMediaItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

/** The long history of the thread: two months of work talk, generated the same way every time. */
const ARCHIVE_SIZE = 2000;
const ARCHIVE_ANNA = [
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
    from: mine ? "me" : "anna",
    sentAt: new Date(
      2026,
      7,
      10 + Math.floor(index / perDay),
      9 + Math.floor(slot / 4),
      (slot % 4) * 14,
    ),
    ...(mine ? { status: "read" as const } : {}),
    kind: "text",
    text: archiveText(mine ? ARCHIVE_ME : ARCHIVE_ANNA, index),
  };
});

/** Older history, loaded when the conversation is scrolled to its start. */
const OLDER: ChatMessage[] = [
  {
    id: "o1",
    from: "anna",
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
    from: "anna",
    sentAt: at(8, 9, 0),
    kind: "service",
    text: "Анна Котова закрепила реквизиты для оплаты",
  },
  {
    id: "m4",
    from: "anna",
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
    reactions: [{ emoji: "❤️", count: 1, users: [ANNA] }],
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
    from: "anna",
    sentAt: at(8, 10, 5),
    kind: "file",
    name: "Договор поставки №418.pdf",
    size: 1_258_291,
  },
  {
    id: "m11",
    from: "anna",
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

/** What the other side answers, one after another. */
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
      return message.name;
    case "contact":
      return message.name;
    case "location":
      return message.title;
    default:
      return "Сообщение";
  }
};

const searchable = (message: ChatMessage) =>
  message.kind === "text" || message.kind === "link"
    ? message.text
    : message.kind === "voice"
      ? (message.transcript ?? "")
      : "";

/** The speech service: a video message's text arrives a moment after it is asked for. */
const transcribeVideoNote = () =>
  wait(TRANSCRIBE_MS).then(
    () => "Снимаю склад: стеллаж B, третий ряд. Коробки по заказу 4821 тут.",
  );

/** An album holds up to ten photos and videos: more go as the next album. */
const ALBUM_MAX = 10;
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

export default function MessageOverviewExample() {
  const [messages, setMessages] = React.useState(() => [...ARCHIVE, ...HISTORY]);
  const [hasOlder, setHasOlder] = React.useState(true);
  const [selected, setSelected] = React.useState<readonly string[] | null>(null);
  const [pinned, setPinned] = React.useState<readonly string[]>(PINNED_FIRST);
  const [typing, setTyping] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState<ChatMessage | null>(null);
  const [editing, setEditing] = React.useState<ChatMessage | null>(null);
  const [draft, setDraft] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [query, setQuery] = React.useState("");
  /** The current match, counted from the newest; a new query starts at the newest. */
  const [matchIndex, setMatchIndex] = React.useState(0);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [jumpTo, setJumpTo] = React.useState<string | null>(null);
  const replies = React.useRef(0);
  const queue = useUploadQueue({ upload: uploadFile });

  const patch = (id: string, next: Partial<ChatMessage>) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? ({ ...message, ...next } as ChatMessage) : message,
      ),
    );

  // Search: the matching texts, newest last; the current one is brought into view.
  const matches = query.trim()
    ? messages.filter((message) =>
        searchable(message).toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];
  const match = matches[matches.length - 1 - Math.min(matchIndex, matches.length - 1)];
  const current = searching ? (match?.id ?? null) : jumpTo;
  const older = () => setMatchIndex((index) => (index + 1) % Math.max(1, matches.length));
  const newer = () =>
    setMatchIndex((index) => (index - 1 + matches.length) % Math.max(1, matches.length));

  React.useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  /** The other side reads my message, types for a moment and answers. */
  const answer = async () => {
    await wait(READ_MS);
    setTyping(true);
    await wait(TYPING_MS);
    setTyping(false);
    const text = REPLIES[replies.current % REPLIES.length] ?? REPLIES[0];
    replies.current += 1;
    setMessages((current) => [
      ...current,
      {
        id: `in-${Date.now()}`,
        from: "anna",
        sentAt: new Date(),
        kind: "text",
        text,
      } as ChatMessage,
    ]);
  };

  /** Adds my message at once (it rises from the composer), then walks its status. */
  const post = (content: Content, reply?: string) => {
    const id = `own-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMessages((current) => [
      ...current,
      {
        ...content,
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
  // files as file messages. The tray's previews are revoked after the send: the album takes its
  // own URLs of the files.
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
    for (const item of files) {
      post({ kind: "file", name: item.file.name, size: item.file.size }, reply);
    }
    if (text && media.length === 0) post({ kind: "text", text }, reply);
  };

  const sendRecording =
    (kind: "voice" | "videoNote") =>
    ({ blob, durationMs, waveform }: ComposerRecording) =>
      post(
        kind === "voice"
          ? {
              kind,
              src: localUrl(blob),
              waveform: [...waveform],
              duration: durationMs / 1000,
            }
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

  const toggleReaction = (id: string, emoji: string) =>
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== id) return message;
        const reactions = message.reactions ?? [];
        const own = reactions.find((reaction) => reaction.emoji === emoji);
        const next = own
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
        return { ...message, reactions: next };
      }),
    );

  const retry = (id: string) =>
    wait(900).then(() => {
      patch(id, { status: "read" });
    });

  const loadOlder = async () => {
    if (!hasOlder) return;
    await wait(HISTORY_MS);
    // Once: the region may ask again before this render lands.
    setMessages((current) =>
      current.some((message) => message.id === OLDER[0]?.id) ? current : [...OLDER, ...current],
    );
    setHasOlder(false);
  };

  const remove = (ids: readonly string[]) => {
    for (const message of messages) {
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

  const closeSearch = () => {
    setSearching(false);
    setQuery("");
    setMatchIndex(0);
  };

  const pinnedItems = pinned.flatMap((id) => {
    const message = messages.find((item) => item.id === id);
    return message ? [{ value: id, text: excerpt(message) }] : [];
  });

  const content = (message: ChatMessage) => {
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
            <Message.Media items={message.items} onItemOpen={() => {}} />
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
            onCancel={() => remove([message.id])}
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

  // The rows of a long history are built when the messages change, not on every keystroke in the
  // composer, and a message that did not change keeps its row element: React passes unchanged
  // rows by, and the browser skips the rows off screen.
  const built = React.useRef(new Map<string, { key: unknown[]; row: React.ReactElement }>());
  // biome-ignore lint/correctness/useExhaustiveDependencies: the handlers only call state setters
  const rows = React.useMemo(() => {
    const byId = new Map(messages.map((message) => [message.id, message]));
    const entries = groupMessages(messages, {
      getAuthor: (message) => message.from,
      getDate: (message) => message.sentAt,
      getKey: (message) => message.id,
      isService: (message) => message.kind === "service",
      now: NOW,
    });
    return entries.map((entry) => {
      if (entry.type === "date") {
        return <Message.Separator key={entry.key}>{entry.label}</Message.Separator>;
      }
      const message = entry.item;
      if (message.kind === "service") {
        return <Message.Service key={entry.key}>{message.text}</Message.Service>;
      }
      const own = message.from === "me";
      const original = message.replyTo ? byId.get(message.replyTo) : undefined;
      const key = [message, entry.position, original, pinned.includes(message.id)];
      const cached = built.current.get(message.id);
      if (cached?.key.every((part, index) => part === key[index])) return cached.row;
      const row = (
        <React.Fragment key={entry.key}>
          {message.id === FIRST_UNREAD ? <Message.Unread /> : null}
          <Message.Root
            value={message.id}
            direction={own ? "outgoing" : "incoming"}
            position={entry.position}
            time={message.sentAt}
            status={message.status}
            edited={message.edited}
            onRetry={message.status === "failed" ? () => retry(message.id) : undefined}
            onReactionToggle={(emoji) => toggleReaction(message.id, emoji)}
          >
            {message.forwardedFrom ? <Message.Forwarded from={message.forwardedFrom} /> : null}
            {original ? (
              <Message.Reply
                author={original.from === "me" ? "Вы" : "Анна Котова"}
                color={original.from === "me" ? "blue" : "green"}
                target={original.id}
              >
                {excerpt(original)}
              </Message.Reply>
            ) : null}
            {content(message)}
            {message.reactions?.length ? <Message.Reactions reactions={message.reactions} /> : null}
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
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="action.forward" />
                </Dropdown.ItemIcon>
                Переслать
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
        </React.Fragment>
      );
      built.current.set(message.id, { key, row });
      return row;
    });
  }, [messages, pinned]);

  return (
    <Card.Root className={styles.messenger}>
      <div className={styles.header}>
        <Avatar.Root color="green">
          <Avatar.Image src={ANNA_PHOTO} alt="" />
          <Avatar.Fallback>АК</Avatar.Fallback>
          <Avatar.Status status="online" />
        </Avatar.Root>
        <div className={styles.headerText}>
          <Typography as="h2" variant="title-s">
            Анна Котова
          </Typography>
          <Crossfade state={typing ? "typing" : "online"}>
            <Typography as="span" variant="caption" tone={typing ? "accent" : "muted"}>
              {typing ? "печатает…" : "в сети"}
            </Typography>
          </Crossfade>
        </div>
        <Button.Root
          variant="ghost"
          tone="neutral"
          aria-label="Поиск по переписке"
          aria-pressed={searching}
          onClick={() => {
            if (searching) closeSearch();
            else {
              setJumpTo(null);
              setSearching(true);
            }
          }}
        >
          <Button.Icon>
            <Icon name="action.search" />
          </Button.Icon>
        </Button.Root>
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
            <Dropdown.Item tone="danger" onSelect={() => remove(messages.map((item) => item.id))}>
              <Dropdown.ItemIcon>
                <Icon name="action.delete" />
              </Dropdown.ItemIcon>
              Очистить историю
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      {searching ? (
        <div className={styles.search}>
          <Input.Root className={styles.searchField}>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" tone="secondary" />
              </Input.Icon>
              <Input.Field
                ref={searchRef}
                type="search"
                aria-label="Поиск по переписке"
                placeholder="Поиск по сообщениям"
                value={query}
                onValueChange={(next) => {
                  setQuery(next);
                  setMatchIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                  if (event.key === "Enter") older();
                }}
              />
            </Input.Wrapper>
          </Input.Root>
          <Typography
            as="span"
            variant="caption"
            tone="muted"
            aria-live="polite"
            className={styles.searchCount}
          >
            {query.trim()
              ? matches.length > 0
                ? `${matches.length - Math.min(matchIndex, matches.length - 1)} из ${matches.length}`
                : "Нет совпадений"
              : ""}
          </Typography>
          <Button.Root
            variant="ghost"
            tone="neutral"
            aria-label="Предыдущее совпадение"
            disabled={matches.length < 2}
            onClick={older}
          >
            <Button.Icon>
              <Icon name="nav.chevronUp" />
            </Button.Icon>
          </Button.Root>
          <Button.Root
            variant="ghost"
            tone="neutral"
            aria-label="Следующее совпадение"
            disabled={matches.length < 2}
            onClick={newer}
          >
            <Button.Icon>
              <Icon name="nav.chevronDown" />
            </Button.Icon>
          </Button.Root>
        </div>
      ) : null}

      {pinnedItems.length > 0 ? (
        <Message.Pinned
          className={styles.pinned}
          items={pinnedItems}
          onSelect={(id) => {
            setJumpTo(null);
            window.requestAnimationFrame(() => setJumpTo(id));
          }}
          onRemove={togglePin}
        />
      ) : null}

      <ScrollContainer anchor="end" onReachStart={loadOlder} className={styles.thread}>
        {hasOlder ? (
          <div className={styles.older} aria-hidden="true">
            <Skeleton shape="block" className={styles.olderBubble} />
          </div>
        ) : null}
        <Message.Group
          aria-label="Переписка с Анной Котовой"
          reader={ME}
          selected={selected}
          onSelectedChange={setSelected}
          highlight={searching ? query : ""}
          current={current}
        >
          {rows}
          <Message.Typing active={typing} />
          <Message.SelectionBar>
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
          </Message.SelectionBar>
        </Message.Group>
      </ScrollContainer>

      <div className={styles.composer}>
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
              <Composer.Title>
                Ответ {replyTo.from === "me" ? "себе" : "Анне Котовой"}
              </Composer.Title>
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
      </div>
    </Card.Root>
  );
}
