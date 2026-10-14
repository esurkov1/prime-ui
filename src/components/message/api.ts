import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { contentLabelRows, contentParts } from "./content.api";
import {
  MESSAGE_FORWARDED_LABELS,
  MESSAGE_LABELS,
  MESSAGE_REACTIONS_LABELS,
  MESSAGE_REPLY_LABELS,
} from "./MessageParts";
import { MESSAGE_TYPING_LABELS } from "./MessageTyping";

const COLORS =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Message.Root",
      en: '`ref` → `HTMLElement` (`<article>`). One chat message: a `role="article"` row whose content parts pick its shell — `bubble`, `media` or `round`; `direction` sets its side and fill, `position` its tail, header and avatar in a run.',
      ru: 'Одно сообщение чата: строка `role="article"`, оболочку которой выбирают части содержимого — `bubble`, `media` или `round`; `direction` задаёт сторону и заливку, `position` — хвостик, шапку и аватар в серии.',
      props: [
        {
          name: "direction",
          type: '"incoming" | "outgoing"',
          default: '"incoming"',
          en: "`incoming` — on the start side, a surface one step off the chat; `outgoing` — on the end side, in the accent hue (`--prime-color-message-outgoing-*`), everything inside recolors with it.",
          ru: "`incoming` — у начала, поверхность на ступень от фона чата; `outgoing` — у конца, в акцентном оттенке (`--prime-color-message-outgoing-*`), всё внутри перекрашивается вместе с ним.",
        },
        {
          name: "position",
          type: '"single" | "first" | "middle" | "last"',
          default: '"single"',
          en: "The place in a run of one author (`Chat.Messages items` sets it): `single` and `last` end a run with the tail (and a group chat's avatar); `single` and `first` show the author's header.",
          ru: "Место в серии одного автора (его ставит `Chat.Messages items`): `single` и `last` замыкают серию хвостиком (и аватаром в групповом чате); `single` и `first` показывают шапку автора.",
        },
        {
          name: "time",
          type: "Date | string",
          en: "When it was sent: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show.",
          ru: "Когда отправлено: `Date` выводится через `formatTime` (и попадает в `<time dateTime>`) или готовый текст.",
        },
        {
          name: "formatTime",
          type: "(date: Date) => string",
          defaultNote: { en: "«09:05»", ru: "«09:05»" },
          en: "Display of a `Date` time.",
          ru: "Показ времени из `Date`.",
        },
        {
          name: "edited",
          type: "boolean",
          default: "false",
          en: "The text was edited: `labels.edited` before the time.",
          ru: "Текст изменён: `labels.edited` перед временем.",
        },
        {
          name: "status",
          type: '"sending" | "sent" | "read" | "failed"',
          en: "Delivery of an outgoing message: a clock, one check, two checks (accent), or a danger mark; the glyphs cross-fade from one state to the next. Named for assistive tech by `labels`.",
          ru: "Доставка исходящего: часы, одна галочка, две (акцентом) или знак ошибки; значки плавно сменяют друг друга. Для скринридера названы через `labels`.",
        },
        {
          name: "onRetry",
          type: "() => void | Promise<void>",
          en: "Sends a failed message again: a ghost danger button beside the bubble. A returned promise shows `sending` until it settles; a rejection leaves it failed.",
          ru: "Повторная отправка неотправленного: прозрачная кнопка в тоне danger рядом с пузырём. Возвращённый промис показывает `sending`, пока не завершится; отказ оставляет сообщение неотправленным.",
        },
        {
          name: "onReactionToggle",
          type: "(emoji: string) => void | Promise<unknown>",
          en: "Puts or takes back the reader's reaction (a chip, a double tap, `L`, the reaction bar). Shown at once; a returned promise keeps it pending, a rejection drops it back. Without it reactions are read-only.",
          ru: "Ставит или снимает реакцию читателя (чип, двойное касание, `L`, панель реакций). Видно сразу; возвращённый промис держит ожидание, отказ возвращает прежнее. Без обработчика реакции только для чтения.",
        },
        {
          name: "value",
          type: "string",
          en: "The message id for selection, jumps, read receipts, search, pins and `Message.Reply target` (`Chat.Messages items` sets the item's key). Keep it when the server confirms a sent message.",
          ru: "Идентификатор сообщения для выбора, переходов, прочтений, поиска, закрепа и `Message.Reply target` (`Chat.Messages items` ставит ключ элемента). Сохраняйте его, когда сервер подтвердит отправленное.",
        },
        {
          name: "labels",
          type: "Partial<MessageLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "role">',
          en: "`id`, `aria-label` to replace «{author}, {time}», `className` and the other attributes of the row.",
          ru: "`id`, `aria-label` вместо «{автор}, {время}», `className` и прочие атрибуты строки.",
        },
      ],
    },
    {
      name: "Message.Avatar",
      en: "`ref` → `HTMLDivElement` (`aria-hidden`). The author's `Avatar` (`m`) in the gutter of an incoming bubble in a group chat. Put it on every message: only the last of a run shows it.",
      ru: "Аватар автора (`Avatar`, `m`) в поле рядом с входящим пузырём группового чата. Ставьте на каждое сообщение: показывает его только последнее в серии.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (an `Avatar.Root`), `className`.",
          ru: "`children` (`Avatar.Root`), `className`.",
        },
      ],
    },
    {
      name: "Message.Author",
      en: "`ref` → `HTMLDivElement`. A group chat's author header: the name in the author's hue, an optional `Message.AuthorIcon`, then the muted `tag`. Put it on every message: only the first of a run shows it.",
      ru: "Шапка автора в групповом чате: имя в цвете автора, необязательный `Message.AuthorIcon`, затем приглушённый `tag`. Ставьте на каждое сообщение: показывает её только первое в серии.",
      props: [
        {
          name: "color",
          type: COLORS,
          default: "hueOf(name)",
          en: 'The author\'s hue: one per person in a chat. By default a hue stable per name (`"blue"` when the name is not plain text); pass `hueOf(user.id)` to keep it per person.',
          ru: 'Цвет автора: один на человека в чате. По умолчанию — цвет, постоянный для имени (`"blue"`, если имя не простой текст); передайте `hueOf(user.id)`, чтобы он был постоянным для человека.',
        },
        {
          name: "tag",
          type: "ReactNode",
          en: "The member's own title in this chat, muted after the name («Админ», «Бухгалтерия»).",
          ru: "Собственная подпись участника в этом чате, приглушённо после имени («Админ», «Бухгалтерия»).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "color">',
          en: "`children` (the name, then an optional `Message.AuthorIcon`), `className`.",
          ru: "`children` (имя, затем необязательный `Message.AuthorIcon`), `className`.",
        },
      ],
    },
    {
      name: "Message.AuthorIcon",
      en: "`ref` → `HTMLSpanElement` (`aria-hidden`). A small mark after the author's name — an `<Icon name=\"…\" />`: a crown of the chat's owner, a check of a verified member. Decorative: say what it means in the `tag` when it matters.",
      ru: 'Небольшой значок после имени автора — `<Icon name="…" />`: корона владельца чата, галочка проверенного участника. Декоративно: если смысл важен, скажите его в `tag`.',
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (an `Icon`), `className`.",
          ru: "`children` (`Icon`), `className`.",
        },
      ],
    },
    {
      name: "Message.Forwarded",
      en: "`ref` → `HTMLDivElement`. «Переслано от {author}» over a forwarded message, the original author in bold, in the accent color.",
      ru: "«Переслано от {author}» над пересланным сообщением, автор оригинала полужирным, акцентным цветом.",
      props: [
        {
          name: "from",
          type: "string",
          required: true,
          en: "Who wrote the original.",
          ru: "Автор оригинала.",
        },
        {
          name: "labels",
          type: "Partial<MessageForwardedLabels>",
          en: "`forwarded` — the header template with `{author}`.",
          ru: "`forwarded` — шаблон заголовка с `{author}`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
    {
      name: "Message.Reply",
      en: "`ref` → `HTMLElement` (`HTMLButtonElement` with `target` or `onClick`). The quoted message this one answers: a wash with a bar in the author's hue, the name over one line of the text. In an outgoing bubble it takes the bubble's accent.",
      ru: "Цитата сообщения, на которое это отвечает: подложка с полосой в цвете автора, имя над одной строкой текста. В исходящем пузыре — акцент пузыря.",
      props: [
        {
          name: "author",
          type: "ReactNode",
          required: true,
          en: "Who wrote the quoted message.",
          ru: "Автор цитируемого сообщения.",
        },
        {
          name: "color",
          type: COLORS,
          default: '"blue"',
          en: "The author's hue (the same as their `Message.Author`).",
          ru: "Цвет автора (как у его `Message.Author`).",
        },
        {
          name: "target",
          type: "string",
          en: "The `value` of the quoted message: a press brings the chat to it (rendering it first in a window), the message blinks, and the focus moves to it. Makes the quote a button.",
          ru: "`value` цитируемого сообщения: нажатие приводит чат к нему (в окне сначала отрисовывает), сообщение мигает, фокус переходит на него. Делает цитату кнопкой.",
        },
        {
          name: "onClick",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          en: "A press on the quote, after `target` is shown: load the original when it is not in the list yet. Makes the quote a button.",
          ru: "Нажатие на цитату после показа `target`: подгрузите оригинал, если его ещё нет в ленте. Делает цитату кнопкой.",
        },
        {
          name: "labels",
          type: "Partial<MessageReplyLabels>",
          en: "`reply` — the hidden prefix read before the quote.",
          ru: "`reply` — скрытая приставка перед цитатой.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "color" | "onClick">',
          en: "`children` (the quoted text, one line), `className`.",
          ru: "`children` (текст цитаты, одна строка), `className`.",
        },
      ],
    },
    {
      name: "Message.Text",
      en: "`ref` → `HTMLDivElement`. The text: a string renders the Markdown subset the Composer writes as elements, never as HTML (`plain` shows it as is). Marks the matches of the chat's search.",
      ru: "Текст: строка с разметкой, которую пишет Composer, рисуется элементами, никогда не HTML (`plain` показывает её как есть). Выделяет совпадения поиска чата.",
      props: [
        {
          name: "plain",
          type: "boolean",
          default: "false",
          en: "Render a string as is, without its Markdown.",
          ru: "Показать строку как есть, без разметки.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The text: a string renders its Markdown subset.",
          ru: "Текст: строка рисует свою разметку.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
    ...contentParts,
    {
      name: "Message.Reactions",
      en: '`ref` → `HTMLDivElement`. Reaction chips at the bottom of a bubble, or under a picture or a circle: a `role="group"` of toggle chips — the emoji, then who reacted (`users`) or the count. A press goes to `Message.Root onReactionToggle`.',
      ru: 'Чипы реакций внизу пузыря или под фото и кружком: `role="group"` из чипов-переключателей — эмодзи, затем кто отреагировал (`users`) или счётчик. Нажатие идёт в `Message.Root onReactionToggle`.',
      props: [
        {
          name: "items",
          type: "MessageReaction[]",
          required: true,
          en: "`{ emoji, count, selected?, users? }` — `count` is the total, `selected` the reader's own reaction, `users` (`{ id, name, src?, color? }[]`, in the order they put it) who put it; without `users` the chip shows the count.",
          ru: "`{ emoji, count, selected?, users? }` — `count` — всего, `selected` — своя реакция читателя, `users` (`{ id, name, src?, color? }[]`, в порядке реакций) — кто поставил; без `users` чип показывает счётчик.",
        },
        {
          name: "labels",
          type: "Partial<MessageReactionsLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
    {
      name: "Message.Actions",
      en: "`ref` → `HTMLDivElement`. A row of a bot's inline keyboard under the bubble: `Button.Root` children share it equally at the message's width (the bubble widens to it). Several make several rows; such a message has no tail.",
      ru: "Ряд встроенной клавиатуры бота под пузырём: дети `Button.Root` делят его поровну по ширине сообщения (пузырь расширяется до неё). Несколько частей — несколько рядов; у такого сообщения нет хвостика.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: '`children` — the `Button.Root`s of the row (`variant="soft" tone="neutral"`, `asChild` for a link); `className`.',
          ru: '`children` — `Button.Root` ряда (`variant="soft" tone="neutral"`, `asChild` для ссылки); `className`.',
        },
      ],
    },
    {
      name: "Message.Menu",
      en: "`ref` → `HTMLDivElement`. The context menu: a `Dropdown.Content` of the `Dropdown.Item`s you write; the kit adds «Выбрать» when the chat has a selection. Opens on right click, long press and from the keyboard.",
      ru: "Контекстное меню: `Dropdown.Content` из ваших `Dropdown.Item`; кит добавляет «Выбрать», если у чата есть выбор. Открывается по правому клику, долгому нажатию и с клавиатуры.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Row tier of the menu.",
          ru: "Ярус строк меню.",
        },
        {
          name: "…rest",
          type: 'Omit<DropdownContentProps, "side" | "align" | "matchTriggerWidth">',
          en: "`children` (the items), `className`.",
          ru: "`children` (пункты), `className`.",
        },
      ],
    },
    {
      name: "Message.Typing",
      en: '`ref` → `HTMLDivElement` (`role="status"`). «Печатает…»: an incoming bubble of three dots at the end of the list while the other side types (`Chat.Root typing` puts it there). Keep it mounted and switch `active`.',
      ru: "«Печатает…»: входящий пузырь из трёх точек в конце ленты, пока собеседник пишет (`Chat.Root typing` ставит его сам). Держите смонтированным и переключайте `active`.",
      props: [
        {
          name: "active",
          type: "boolean",
          default: "true",
          en: "The other side is typing. Keep the part mounted and switch this, so it can leave smoothly.",
          ru: "Собеседник пишет. Держите часть смонтированной и переключайте это, чтобы она уходила плавно.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: '`Message.Avatar` of who types, in a group chat (`Chat.Messages type="group"`).',
          ru: '`Message.Avatar` того, кто пишет, в групповом чате (`Chat.Messages type="group"`).',
        },
        {
          name: "labels",
          type: "Partial<MessageTypingLabels>",
          en: "`typing` — the text read for assistive tech.",
          ru: "`typing` — текст для скринридера.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
  ],
  labels: [
    ...labelRows(MESSAGE_LABELS, {
      message: {
        en: "The name of a message for assistive tech.",
        ru: "Имя сообщения для скринридера.",
      },
      you: { en: "The author of an outgoing message.", ru: "Автор исходящего сообщения." },
      edited: {
        en: "The mark of an edited message in its meta.",
        ru: "Отметка изменённого сообщения в мете.",
      },
      spoiler: {
        en: "`Message.Text`: the name of a `||spoiler||` while it is hidden.",
        ru: "`Message.Text`: имя `||spoiler||`, пока он скрыт.",
      },
      sending: { en: "Name of the clock status.", ru: "Имя статуса «часы»." },
      sent: { en: "Name of the one-check status.", ru: "Имя статуса «одна галочка»." },
      read: { en: "Name of the two-check status.", ru: "Имя статуса «две галочки»." },
      failed: { en: "Name of the failed status.", ru: "Имя статуса ошибки." },
      retry: {
        en: "The retry button beside a failed message.",
        ru: "Кнопка повтора рядом с неотправленным.",
      },
      menu: { en: "The name of the context menu.", ru: "Имя контекстного меню." },
      select: {
        en: "The menu item that starts selection mode with the message.",
        ru: "Пункт меню, который начинает выбор с этого сообщения.",
      },
      reactionAdded: {
        en: "Announced when the quick reaction (a double tap, `L`) is put.",
        ru: "Объявление, когда быстрая реакция (двойное касание, `L`) поставлена.",
      },
      reactionRemoved: {
        en: "Announced when the quick reaction is taken back.",
        ru: "Объявление, когда быстрая реакция снята.",
      },
      reactionBar: { en: "The name of the reaction bar.", ru: "Имя панели реакций." },
      moreReactions: {
        en: "The «⌄» of the reaction bar that shows every reaction.",
        ru: "Кнопка «⌄» панели реакций, которая показывает все реакции.",
      },
    }),
    ...labelRows(MESSAGE_REACTIONS_LABELS, {
      reaction: {
        en: "`Message.Reactions`: the name of a chip without `users`.",
        ru: "`Message.Reactions`: имя чипа без `users`.",
        part: "Message.Reactions",
      },
      reactionUsers: {
        en: "`Message.Reactions`: the name of a chip with `users`; `{users}` — their names.",
        ru: "`Message.Reactions`: имя чипа с `users`; `{users}` — их имена.",
        part: "Message.Reactions",
      },
      moreUsers: {
        en: "`Message.Reactions`: the last item of `{users}` when not everyone is listed.",
        ru: "`Message.Reactions`: последний элемент `{users}`, когда перечислены не все.",
        part: "Message.Reactions",
      },
      reactions: {
        en: "`Message.Reactions`: the name of the row.",
        ru: "`Message.Reactions`: имя ряда.",
        part: "Message.Reactions",
      },
    }),
    ...labelRows(MESSAGE_TYPING_LABELS, {
      typing: {
        en: "`Message.Typing`: the text read while the other side types.",
        ru: "`Message.Typing`: текст, который читается, пока собеседник пишет.",
        part: "Message.Typing",
      },
    }),
    ...labelRows(MESSAGE_REPLY_LABELS, {
      reply: {
        en: "`Message.Reply`: the hidden prefix read before the quote.",
        ru: "`Message.Reply`: скрытая приставка перед цитатой.",
        part: "Message.Reply",
      },
    }),
    ...labelRows(MESSAGE_FORWARDED_LABELS, {
      forwarded: {
        en: "`Message.Forwarded`: the header; `{author}` — the original author.",
        ru: "`Message.Forwarded`: заголовок; `{author}` — автор оригинала.",
        part: "Message.Forwarded",
      },
    }),
    ...contentLabelRows,
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Shift+F10 · ContextMenu",
        en: "Opens the menu of the focused message (`ContextMenu` is the menu key); in a chat's selection mode `Enter` / `Space` toggle it and Shift extends the range from the anchor",
        ru: "Открывает меню сообщения в фокусе (`ContextMenu` — клавиша меню); в режиме выбора чата `Enter` / `Space` переключают выбор, Shift расширяет диапазон от якоря",
      },
      {
        keys: "R",
        en: "Opens the reaction bar (with `onReactionToggle`); arrows move between reactions, `Home` / `End` to the ends, `Enter` / `Space` pick, `Tab` closes it",
        ru: "Открывает панель реакций (при `onReactionToggle`); стрелки ходят по реакциям, `Home` / `End` — к краям, `Enter` / `Space` ставят, `Tab` закрывает",
      },
      {
        keys: "L",
        en: "Puts or takes back the quick reaction (as a double tap)",
        ru: "Ставит или снимает быструю реакцию (как двойное касание)",
      },
      {
        keys: "Tab",
        en: "Moves to the buttons and links of a message: the reply quote, a file, the `Message.Actions` buttons in row order",
        ru: "Переходит к кнопкам и ссылкам сообщения: цитате ответа, файлу, кнопкам `Message.Actions` по порядку рядов",
      },
      {
        keys: "Escape",
        en: "Closes the menu or the reaction bar",
        ru: "Закрывает меню или панель реакций",
      },
    ],
    aria: [
      {
        en: 'Every message is a `role="article"` named «{author}, {time}» (`labels.message`); an outgoing one is «Вы»; the author names every message of a run, its header shown or not. In a list it carries `aria-posinset` / `aria-setsize`; in a chat\'s selection mode it is an `option` with `aria-selected`.',
        ru: 'Каждое сообщение — `role="article"` с именем «{автор}, {время}» (`labels.message`); для исходящих автор — «Вы»; автор называет каждое сообщение серии, показана его шапка или нет. В ленте оно несёт `aria-posinset` / `aria-setsize`; в режиме выбора чата — `option` с `aria-selected`.',
      },
      {
        en: "The delivery status is an image named «Отправляется», «Отправлено», «Прочитано» or «Не отправлено».",
        ru: "Статус доставки — картинка с именем: «Отправляется», «Отправлено», «Прочитано», «Не отправлено».",
      },
      {
        en: "A reply with `target` or `onClick` is a button; the hidden «Ответ на сообщение» explains it. Pressing it moves the focus to the original.",
        ru: "Цитата ответа с `target` или `onClick` — кнопка, скрытый текст «Ответ на сообщение» объясняет её; нажатие переводит фокус на оригинал.",
      },
      {
        en: "`Message.Avatar` is `aria-hidden`: the message is named by its author.",
        ru: "`Message.Avatar` скрыт (`aria-hidden`): сообщение называет его автор.",
      },
      {
        en: "The author's header is text; the hue of the name means nothing on its own, `Message.AuthorIcon` is `aria-hidden` — say what it means in the `tag`.",
        ru: "Шапка автора — текст; цвет имени ничего не значит сам по себе, значок `Message.AuthorIcon` — `aria-hidden`, смысл скажите в `tag`.",
      },
      {
        en: "`Message.Typing` is a polite `status` with «Собеседник печатает» (`labels.typing`); its dots are decorative.",
        ru: "`Message.Typing` — вежливый `status` «Собеседник печатает» (`labels.typing`); точки декоративны.",
      },
      {
        en: "Reactions are a group of buttons with `aria-pressed`; a chip is named «{emoji}: {count}», with `users` «{emoji} {count}: {users}» («❤️ 3: Анна, Пётр, Мария», «ещё N» when not everyone is listed); its avatars are `aria-hidden`; without `onReactionToggle` the chips are `disabled`. The reaction bar is a `toolbar` of toggle buttons named by the reaction («Нравится», «Огонь»…); its «⌄» is `aria-expanded`. The quick reaction is announced in the list's polite live region.",
        ru: "Реакции — группа кнопок с `aria-pressed`; имя чипа — «{emoji}: {count}», а с `users` — «{emoji} {count}: {users}» («❤️ 3: Анна, Пётр, Мария», «ещё N», когда перечислены не все); аватары в чипе — `aria-hidden`; без `onReactionToggle` чипы `disabled`. Панель реакций — `toolbar` из кнопок-переключателей, названных по реакции («Нравится», «Огонь»…); её «⌄» — `aria-expanded`. Быстрая реакция объявляется в вежливой области ленты.",
      },
      {
        en: "`VideoNote` and `VoicePlayer` carry their own ARIA (see their pages); inside a message their transcript is a plain paragraph, selectable and marked by the chat's search.",
        ru: "`VideoNote` и `VoicePlayer` несут свою ARIA (см. их страницы); внутри сообщения их расшифровка — обычный абзац, выделяется и подсвечивается поиском чата.",
      },
      {
        en: "Media tiles are buttons «Открыть: {alt}» that open the album in MediaViewer, the focus returning to the tile on close; a transfer is the round cancel, retry or download button, the share its accessible description; a refused retry or cancel is announced politely; a done transfer's disk is `inert`.",
        ru: "Плитки медиа — кнопки «Открыть: {alt}», открывающие альбом в MediaViewer, фокус после закрытия возвращается на плитку; передача — круглая кнопка отмены, повтора или скачивания с долей в описании; отказ объявляется вежливо; диск завершённой передачи — `inert`.",
      },
      {
        en: "`Message.Actions` are plain buttons and links (`Button.Root`, `asChild`) with visible labels, in row order; in a chat's selection mode they take no presses.",
        ru: "`Message.Actions` — обычные кнопки и ссылки (`Button.Root`, `asChild`) с видимыми подписями, в порядке рядов; в режиме выбора чата они не нажимаются.",
      },
      {
        en: "Color is never the only signal: the status is named, the own reaction is `aria-pressed`, a selected message is `aria-selected` with a check, the author is text.",
        ru: "Цвет никогда не единственный признак: статус назван, своя реакция — `aria-pressed`, выбранное сообщение — `aria-selected` с галочкой, автор — текстом.",
      },
    ],
  },
};
