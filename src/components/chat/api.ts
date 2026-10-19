import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { CHAT_LABELS } from "./Chat";
import { CHAT_PINNED_LABELS } from "./ChatPinned";
import { CHAT_SERVICE_CHANGE_LABELS } from "./ChatRows";

export const api: ComponentApi = {
  parts: [
    {
      name: "Chat.Root",
      en: "`ref` → `HTMLDivElement`. The chat frame: owns the selection, the search, the typing signal and jumps, and hands them to its parts. A column that fills its host's height; every part but `Chat.Messages` is optional.",
      ru: "Рамка чата: владеет выбором, поиском, сигналом набора и переходами и раздаёт их частям. Колонка во всю высоту родителя; все части, кроме `Chat.Messages`, необязательны.",
      props: [
        {
          name: "variant",
          type: '"pane" | "inline"',
          default: '"pane"',
          en: "How the chat stands in its host: `pane` — inset from its own edges (a `Card`, a page pane); `inline` — flush with the content edges of a padded host (a `Drawer.Body`, a `Tabs.Panel`, a `Card.Body`).",
          ru: "Как чат стоит в родителе: `pane` — с отступами от своих краёв (`Card`, панель страницы); `inline` — вровень с краями содержимого родителя с отступами (`Drawer.Body`, `Tabs.Panel`, `Card.Body`).",
        },
        {
          name: "selected",
          type: "readonly string[] | null",
          en: "Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting. Any of the triad adds «Выбрать» to every `Message.Menu`; without it the chat has no selection.",
          ru: "Режим выбора (управляемое): `value` выбранных сообщений, `null` — не выбираем. Любой из тройки добавляет «Выбрать» в каждое `Message.Menu`; без неё выбора нет.",
        },
        {
          name: "defaultSelected",
          type: "readonly string[] | null",
          default: "null",
          en: "Initial selection (uncontrolled).",
          ru: "Начальный выбор (неуправляемое).",
        },
        {
          name: "onSelectedChange",
          type: "(selected: readonly string[] | null) => void",
          en: "The selection changed: a message toggled, selection started from the menu (`[value]`) or ended (`null`).",
          ru: "Выбор изменён: сообщение переключено, выбор начат из меню (`[value]`) или закончен (`null`).",
        },
        {
          name: "search",
          type: "string | null",
          en: "The search query (controlled); `null` — the search bar is closed. Matches in the messages' text and transcripts are marked; the newest is current.",
          ru: "Поисковый запрос (управляемое); `null` — строка поиска закрыта. Совпадения в тексте и расшифровках сообщений выделены; самое новое — текущее.",
        },
        {
          name: "minSearchLength",
          type: "number",
          default: "2",
          en: "How many characters a query needs (trimmed) before it is searched: a shorter one marks, counts and steps nothing.",
          ru: "Сколько символов нужно запросу (без пробелов по краям), чтобы искать: более короткий ничего не выделяет, не считает и не листает.",
        },
        {
          name: "defaultSearch",
          type: "string | null",
          default: "null",
          en: "The initial search (uncontrolled).",
          ru: "Начальный поиск (неуправляемое).",
        },
        {
          name: "onSearchChange",
          type: "(search: string | null) => void",
          en: 'The search opened (`""`), changed its query or closed (`null`).',
          ru: 'Поиск открыт (`""`), запрос изменён или поиск закрыт (`null`).',
        },
        {
          name: "jumpTo",
          type: "string | null",
          default: "null",
          en: "A message to jump to (a link, a notification): on change the chat brings it to the middle and the message itself blinks. The focus stays where it is; while the search is open its current match takes this place.",
          ru: "Сообщение, к которому перейти (ссылка, уведомление): при смене чат приводит его в середину, и само сообщение мигает. Фокус остаётся на месте; пока открыт поиск, его место занимает текущее совпадение.",
        },
        {
          name: "typing",
          type: "boolean",
          default: "false",
          en: "The other side is typing: `Chat.Description` cross-fades into «печатает…» and the list ends with the typing bubble (`Message.Typing`), which gives way at once to the reply that ends it.",
          ru: "Собеседник пишет: `Chat.Description` плавно сменяется на «печатает…», а лента заканчивается индикатором набора (`Message.Typing`), который сразу уступает место ответу.",
        },
        {
          name: "labels",
          type: "Partial<ChatLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">',
          en: "`className` and the other attributes of the frame.",
          ru: "`className` и прочие атрибуты рамки.",
        },
      ],
    },
    {
      name: "Chat.Header",
      en: "`ref` → `HTMLDivElement`. The top of the chat: who it is with. The title over the badges and the description, the actions at the end; every other child (a back button, an `Avatar`) leads the row. It draws nothing of its own.",
      ru: "Верх чата: с кем переписка. Заголовок над бейджами и описанием, действия в конце; все остальные дети (кнопка «Назад», `Avatar`) встают в начало ряда. Своего ничего не рисует.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (a `Page.BackButton`, an `Avatar`, `Chat.Title`, `Chat.Badges`, `Chat.Description`, `Chat.Actions`), `className`.",
          ru: "`children` (`Page.BackButton`, `Avatar`, `Chat.Title`, `Chat.Badges`, `Chat.Description`, `Chat.Actions`), `className`.",
        },
      ],
    },
    {
      name: "Chat.Title",
      en: "`ref` → `HTMLHeadingElement`. Who the chat is with, one line that ellipsizes; it also names the message list (`aria-labelledby`).",
      ru: "С кем переписка, одна строка с многоточием; она же называет ленту сообщений (`aria-labelledby`).",
      props: [
        {
          name: "number",
          type: "ReactNode",
          en: "The record's number («#4120»), muted after the name and part of it: the name ellipsizes, the number never.",
          ru: "Номер записи («#4120»), приглушённо после имени и часть его: имя сокращается, номер — никогда.",
        },
        {
          name: "as",
          type: '"h2" | "h3" | "h4"',
          default: '"h2"',
          en: "Heading level that fits the page outline (the look does not change).",
          ru: "Уровень заголовка по структуре страницы (вид не меняется).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`children` (the name), `className`.",
          ru: "`children` (имя), `className`.",
        },
      ],
    },
    {
      name: "Chat.Badges",
      en: "`ref` → `HTMLDivElement`. The record's badges under the title: the pickers first (a `Badge.Root` in a `Dropdown.Trigger`), then the statuses. One row of `s` chips (`Badge.Group`); what does not fit waits behind «+N».",
      ru: "Бейджи записи под заголовком: сначала выбор (`Badge.Root` в `Dropdown.Trigger`), затем статусы. Один ряд чипов `s` (`Badge.Group`); что не влезло, ждёт за «+N».",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (`Badge.Root`, a `Dropdown.Root` around one), `className`.",
          ru: "`children` (`Badge.Root`, `Dropdown.Root` вокруг него), `className`.",
        },
      ],
    },
    {
      name: "Chat.Description",
      en: "`ref` → `HTMLDivElement`. The status line under the title («в сети», «3 участника»); while the other side types (`Chat.Root typing`) it cross-fades into «печатает…» in the accent, and back.",
      ru: "Строка статуса под заголовком («в сети», «3 участника»); пока собеседник пишет (`Chat.Root typing`), плавно сменяется на «печатает…» акцентом и обратно.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the status), `className`.",
          ru: "`children` (статус), `className`.",
        },
      ],
    },
    {
      name: "Chat.Actions",
      en: "`ref` → `HTMLDivElement`. The controls at the end of the header, tier `s`: ghost icon buttons (`Chat.SearchButton`, a call, a toggle with `pressed`), a `Select` or a `SegmentedControl`, a ⋯ `Dropdown` last. Centred on the header's text.",
      ru: "Элементы управления в конце шапки, ярус `s`: призрачные кнопки-иконки (`Chat.SearchButton`, звонок, переключатель с `pressed`), `Select` или `SegmentedControl`, ⋯ `Dropdown` последним. По центру текста шапки.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the controls), `className`.",
          ru: "`children` (элементы управления), `className`.",
        },
      ],
    },
    {
      name: "Chat.SearchButton",
      en: "`ref` → `HTMLButtonElement`. Opens and closes the search bar: a ghost icon `Button`, pressed while the search is open, named `labels.search`.",
      ru: "Открывает и закрывает строку поиска: призрачная кнопка-иконка `Button`, нажата, пока поиск открыт, с именем `labels.search`.",
      props: [
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-pressed">',
          en: "`onClick` (runs first; `preventDefault` keeps the search as it is), `className`.",
          ru: "`onClick` (срабатывает первым; `preventDefault` оставляет поиск как есть), `className`.",
        },
      ],
    },
    {
      name: "Chat.Search",
      en: "`ref` → `HTMLDivElement`. The search bar: your control and the field; once a query of `minSearchLength` is typed the field's end holds the steps to the older and newer match and the count («2/5»). Shown while open, or always with `persistent`.",
      ru: "Строка поиска: ваш элемент и поле; когда введён запрос длиной `minSearchLength`, в конце поля — шаги и счётчик («2/5»). Видна, пока поиск открыт, или всегда с `persistent`.",
      props: [
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "The bar is always there, with no `Chat.SearchButton`: the field shows from the start and never takes the focus by itself; an empty field is no search (`search` is `null`), Escape clears the query.",
          ru: "Строка видна всегда, без `Chat.SearchButton`: поле показано сразу и само фокус не берёт; пустое поле — не поиск (`search` равен `null`), Escape очищает запрос.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` — one control before the field at its tier (a channel `Select.Root`, its own width, at most half the row); `className` and the other attributes.",
          ru: "`children` — один элемент перед полем в его ярусе (`Select.Root` канала, своей ширины, не больше половины ряда); `className` и прочие атрибуты.",
        },
      ],
    },
    {
      name: "Chat.Pinned",
      en: "`ref` → `HTMLDivElement`. The pinned messages above the conversation: a rail of segments, the title over one line of the message and an optional unpin button. A press jumps to the message, then steps to the next older one.",
      ru: "Закреплённые сообщения над перепиской: полоска сегментов, заголовок над строкой сообщения и необязательная кнопка открепления. Нажатие переходит к сообщению, затем к следующему более старому.",
      props: [
        {
          name: "items",
          type: "readonly { value: string; text: string }[]",
          required: true,
          en: "The pinned messages, oldest first: the `value` of each `Message.Root` and one line of it («Фото», «Голосовое сообщение» for media).",
          ru: "Закреплённые сообщения, от старых к новым: `value` каждого `Message.Root` и одна его строка («Фото», «Голосовое сообщение» для медиа).",
        },
        {
          name: "value",
          type: "string",
          en: "The pinned message shown (controlled).",
          ru: "Показанное закреплённое сообщение (управляемое).",
        },
        {
          name: "defaultValue",
          type: "string",
          defaultNote: { en: "the last item", ru: "последний" },
          en: "The one shown first (uncontrolled): the newest.",
          ru: "Показанное сначала (неуправляемое): самое новое.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "The shown message changed: a press stepped to the next older one (the oldest wraps to the newest).",
          ru: "Показанное сообщение сменилось: нажатие перешло к следующему более старому (самое старое — снова к новому).",
        },
        {
          name: "onSelect",
          type: "(value: string) => void",
          en: "A press on the bar, after the chat has jumped to the message: load it when it is not in the list yet.",
          ru: "Нажатие на плашку, после того как чат перешёл к сообщению: подгрузите его, если его ещё нет в ленте.",
        },
        {
          name: "onRemove",
          type: "(value: string) => void",
          en: "Unpin the shown message: a ghost close button at the end. Without it no button.",
          ru: "Открепить показанное сообщение: кнопка-крестик в конце. Без него кнопки нет.",
        },
        {
          name: "labels",
          type: "Partial<ChatPinnedLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onSelect">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
    {
      name: "Chat.Messages",
      en: "`ref` → `HTMLDivElement` (the log). The message list in its own scroller, rendering only the rows near the view. Rows come from `items` (dates, runs and the unread band added for you) or from children; it keeps the end and the reader's place itself.",
      ru: "Лента сообщений в своей прокрутке, рендерит только строки рядом с видимой областью. Строки — из `items` (даты, серии и полоса непрочитанного — сами) или из детей; конец ленты и место чтения она держит сама.",
      props: [
        {
          name: "group",
          type: "boolean",
          default: "false",
          en: "A group chat of many authors: the first message of a run shows the author's header, the last one the avatar, and incoming messages keep the avatar's gutter. Without it a conversation of two.",
          ru: "Групповой чат многих авторов: первое сообщение серии показывает шапку автора, последнее — аватар, входящие держат место под аватар. Без него — переписка двоих.",
        },
        {
          name: "authors",
          type: '"none" | "incoming" | "outgoing" | "all"',
          default: '"none"',
          en: "Several writers, no avatars: the first message of a run on the named side (`incoming`, `outgoing`, `all`) shows the author's header; no avatar, no gutter. Ignored with `group`.",
          ru: "Несколько авторов без аватаров: первое сообщение серии на названной стороне (`incoming`, `outgoing`, `all`) показывает шапку автора; ни аватара, ни места под него. С `group` не действует.",
        },
        {
          name: "items",
          type: "readonly T[]",
          en: "Messages as application data, in time order: the list adds the dates, the runs and the unread band and sets each message's `value` and `position`. Without it, children are the rows.",
          ru: "Сообщения как данные приложения, по времени: лента сама ставит даты, серии и полосу непрочитанного и задаёт `value` и `position`. Без них строки — это дети.",
        },
        {
          name: "getKey",
          type: "(item: T) => string",
          en: "A stable key of an item (with `items`): also its message's `value`. Keep it when the server confirms a sent message.",
          ru: "Постоянный ключ элемента (с `items`): он же `value` сообщения. Сохраняйте его, когда сервер подтвердит отправленное.",
        },
        {
          name: "getAuthor",
          type: "(item: T) => string",
          en: "Who wrote an item (an id, with `items`): a change of author starts a new run.",
          ru: "Кто написал элемент (id, с `items`): смена автора начинает новую серию.",
        },
        {
          name: "getDate",
          type: "(item: T) => Date",
          en: "When an item was sent (with `items`): a new day gets a date.",
          ru: "Когда отправлен элемент (с `items`): новый день получает дату.",
        },
        {
          name: "renderMessage",
          type: "(item: T, entry: ChatMessageEntry<T>) => ReactElement",
          en: "Renders an item: a `Message.Root` or a `Chat.Service`; `entry` — `{ position, showAuthor, showAvatar, find }`, `find(key)` gives another item (a reply's original). Runs again only for an item whose data or place changed.",
          ru: "Рисует элемент: `Message.Root` или `Chat.Service`; `entry` — `{ position, showAuthor, showAvatar, find }`, `find(key)` даёт другой элемент (оригинал ответа). Повторно — только для элемента с новыми данными или местом.",
        },
        {
          name: "isService",
          type: "(item: T) => boolean",
          en: "An event of the chat, not a message: it stands alone and breaks the runs around it.",
          ru: "Событие чата, а не сообщение: стоит отдельно и разрывает серии вокруг.",
        },
        {
          name: "unread",
          type: "string",
          en: "The key of the first unread item: the «Непрочитанные сообщения» band stands above it.",
          ru: "Ключ первого непрочитанного элемента: над ним встаёт полоса «Непрочитанные сообщения».",
        },
        {
          name: "groupWindow",
          type: "number",
          default: "5",
          en: "Messages of one author further apart than this many minutes start a new run.",
          ru: "Сообщения одного автора дальше друг от друга, чем столько минут, начинают новую серию.",
        },
        {
          name: "now",
          type: "Date",
          defaultNote: { en: "today", ru: "сегодня" },
          en: "«Today» for the dates.",
          ru: "«Сегодня» для дат.",
        },
        {
          name: "timeZone",
          type: "string",
          defaultNote: { en: "the browser's zone", ru: "пояс браузера" },
          en: "The IANA zone of the date separators, the runs and every message time (`\"Asia/Vladivostok\"`): a profile's zone, not the browser's.",
          ru: 'Пояс IANA для разделителей дат, серий и времени каждого сообщения (`"Asia/Vladivostok"`): пояс профиля, а не браузера.',
        },
        {
          name: "formatDate",
          type: "(date: Date, now: Date, timeZone?: string) => string",
          default: "formatMessageDate",
          en: "The label of a date; gets the `timeZone`.",
          ru: "Подпись даты; получает `timeZone`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The first load: bubble-shaped `Skeleton`s on both sides stand in the list's place (`aria-busy`, `labels.loading` announced), then cross-fade into the messages; none of them counts as new.",
          ru: "Первая загрузка: на месте ленты — `Skeleton` в форме пузырей с обеих сторон (`aria-busy`, объявляется `labels.loading`), затем они плавно сменяются сообщениями; ни одно не считается новым.",
        },
        {
          name: "hasOlder",
          type: "boolean",
          default: "false",
          en: "Older history exists: a bubble-shaped placeholder stands above the first message and `onLoadOlder` runs when the reader reaches the top.",
          ru: "Есть более старая история: над первым сообщением стоит заглушка в форме пузыря, а `onLoadOlder` вызывается, когда читатель дошёл до верха.",
        },
        {
          name: "onLoadOlder",
          type: "() => void | Promise<void>",
          en: "Load older messages and prepend them (while `hasOlder`); the reader's place is kept.",
          ru: "Подгрузите более старые сообщения в начало (пока `hasOlder`); место чтения сохраняется.",
        },
        {
          name: "quickReaction",
          type: "string | false",
          default: '"👍"',
          en: "The reaction of a double tap (and `L`) on a message: puts it or takes it back through `onReactionToggle`. `false` — off.",
          ru: "Реакция двойного касания (и `L`) по сообщению: ставит или снимает её через `onReactionToggle`. `false` — выключено.",
        },
        {
          name: "reactionOptions",
          type: "readonly { emoji: string; label: string }[]",
          defaultNote: {
            en: "👍 🔥 🤣 👌 🤔 😢 😱, then 7 more",
            ru: "👍 🔥 🤣 👌 🤔 😢 😱, затем ещё 7",
          },
          en: "The reactions of the bar above a message (long press, long hover or `R`): the first seven in a row, «⌄» opens the rest. `label` names each toggle button.",
          ru: "Реакции панели над сообщением (долгое нажатие, долгое наведение или `R`): первые семь в ряд, «⌄» раскрывает остальные. `label` называет каждую кнопку.",
        },
        {
          name: "reader",
          type: "MessageUser",
          en: "The reader (`{ id, name: «Вы», src?, color? }`): a reaction they put shows them among the chip's avatars at once, before the data comes back; matched by `id`.",
          ru: "Читатель (`{ id, name: «Вы», src?, color? }`): поставленная им реакция сразу показывает его среди аватаров чипа, до ответа данных; сопоставляется по `id`.",
        },
        {
          name: "onNewMessage",
          type: '(value: string, details: { direction: "incoming" | "outgoing" }) => void',
          en: "A message was added at the end after mount, sent or received: for a sound, a counter, a title badge. Not called for the first render, history or a message put back in the middle.",
          ru: "В конец после монтирования добавлено сообщение, отправленное или полученное: для звука, счётчика, значка в заголовке. Не вызывается для первого показа, истории и сообщения, вернувшегося в середину.",
        },
        {
          name: "onRead",
          type: "(values: string[]) => void",
          en: "Incoming messages the reader has seen (at least half on screen while the page is visible); batched per frame, each `value` once per mount. Send read receipts from here.",
          ru: "Входящие, которые читатель увидел (не меньше половины на экране, пока страница видна); пачкой за кадр, каждый `value` один раз за монтирование. Отсюда отправляйте отметки о прочтении.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`aria-label` (the list's name when the header has no `Chat.Title`, default `labels.messages`), `className` and the other attributes of the log; `children` — rows, `Chat.SelectionBar`, `Message.Typing`.",
          ru: "`aria-label` (имя ленты, если в шапке нет `Chat.Title`; по умолчанию `labels.messages`), `className` и прочие атрибуты ленты; `children` — строки, `Chat.SelectionBar`, `Message.Typing`.",
        },
      ],
    },
    {
      name: "Chat.SelectionBar",
      en: '`ref` → `HTMLDivElement`. The bar of selection mode (`role="toolbar"`), a child of `Chat.Messages` sticky at its bottom: «Выбрано: N», your actions and «Отмена». Renders nothing outside selection.',
      ru: 'Панель режима выбора (`role="toolbar"`), ребёнок `Chat.Messages`, прилипает к её низу: «Выбрано: N», ваши действия и «Отмена». Вне режима выбора ничего не рисует.',
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: '`children` — the actions (`Button.Root size="s"`: Переслать, Удалить), `className`.',
          ru: '`children` — действия (`Button.Root size="s"`: Переслать, Удалить), `className`.',
        },
      ],
    },
    {
      name: "Chat.Separator",
      en: "`ref` → `HTMLDivElement`. A date between messages (`items` add them for you) («Сегодня», «12 марта» — `formatMessageDate`): a pill a step above the bubbles that stays at the top while its day scrolls, until the next date pushes it out.",
      ru: "Дата между сообщениями (`items` ставят их сами) («Сегодня», «12 марта» — `formatMessageDate`): плашка на ступень выше пузырей, которая держится сверху, пока листается её день, пока её не вытолкнет следующая дата.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the date), `className`.",
          ru: "`children` (дата), `className`.",
        },
      ],
    },
    {
      name: "Chat.Service",
      en: "`ref` → `HTMLDivElement`. An event of the chat, not a message: a centered pill that wraps — `Chat.ServiceIcon`, the words, `Chat.ServiceChange`, the time. A row (for an `isService` item): the arrows, the selection and the search pass it by; events in a row stand as one group.",
      ru: "Событие чата, а не сообщение: плашка посередине с переносом — `Chat.ServiceIcon`, слова, `Chat.ServiceChange`, время. Строка (для элемента `isService`): стрелки, выбор и поиск её минуют; события подряд стоят одной группой.",
      props: [
        {
          name: "time",
          type: "Date | string",
          en: "When it happened: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show; muted, at the end of the pill.",
          ru: "Когда произошло: `Date` выводится через `formatTime` (и попадает в `<time dateTime>`) или готовый текст; приглушённо, в конце плашки.",
        },
        {
          name: "timeZone",
          type: "string",
          defaultNote: {
            en: "the list's `timeZone`, else the browser's zone",
            ru: "`timeZone` списка, иначе пояс браузера",
          },
          en: "The zone `time` is read in.",
          ru: "Пояс, в котором читается `time`.",
        },
        {
          name: "formatTime",
          type: "(date: Date, timeZone?: string) => string",
          defaultNote: { en: "«09:05»", ru: "«09:05»" },
          en: "Display of a `Date` time; gets the `timeZone` in force.",
          ru: "Показ времени из `Date`; получает действующий `timeZone`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the event: words, `Chat.ServiceIcon`, `Chat.ServiceChange`, a link), `className`.",
          ru: "`children` (событие: слова, `Chat.ServiceIcon`, `Chat.ServiceChange`, ссылка), `className`.",
        },
      ],
    },
    {
      name: "Chat.ServiceIcon",
      en: "`ref` → `HTMLSpanElement`. The glyph before an event's text (who or what acted): an `Icon` at the caption's size, muted, `aria-hidden` — the words name it.",
      ru: "Глиф перед текстом события (кто или что действовало): `Icon` размера подписи, приглушённый, `aria-hidden` — его называют слова.",
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
      name: "Chat.ServiceChange",
      en: "`ref` → `HTMLSpanElement`. A value that changed inside an event: `from` › `to`, two `Badge.Root` with your colours as a rule. It wraps as one unit; assistive tech hears one phrase, «с «Лид» на «Арендатор»» (`labels.change`), the drawing is hidden.",
      ru: "Значение, которое изменилось в событии: `from` › `to`, как правило два `Badge.Root` ваших цветов. Переносится целиком; вспомогательные технологии слышат одну фразу «с «Лид» на «Арендатор»» (`labels.change`), рисунок скрыт.",
      props: [
        {
          name: "from",
          type: "ReactNode",
          required: true,
          en: "The value before (a `Badge.Root`); its text fills `{from}`.",
          ru: "Значение до (`Badge.Root`); его текст подставляется в `{from}`.",
        },
        {
          name: "to",
          type: "ReactNode",
          required: true,
          en: "The value after; its text fills `{to}`.",
          ru: "Значение после; его текст подставляется в `{to}`.",
        },
        {
          name: "labels",
          type: "Partial<ChatServiceChangeLabels>",
          en: "`change` — the phrase assistive tech hears.",
          ru: "`change` — фраза для вспомогательных технологий.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes.",
          ru: "`className` и прочие атрибуты.",
        },
      ],
    },
    {
      name: "Chat.Unread",
      en: "`ref` → `HTMLDivElement`. «Непрочитанные сообщения»: a band across the list above the first unread message (`unread` of `Chat.Messages items` puts it there).",
      ru: "«Непрочитанные сообщения»: полоса через ленту над первым непрочитанным (её ставит `unread` у `Chat.Messages items`).",
      props: [
        {
          name: "labels",
          type: "Partial<ChatUnreadLabels>",
          en: "`unread` — the text of the band.",
          ru: "`unread` — текст полосы.",
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
      name: "Chat.Footer",
      en: "`ref` → `HTMLDivElement`. The bottom of the chat, under the messages: the `Composer`, padded to the chat's edges.",
      ru: "Низ чата под сообщениями: `Composer` с отступами по краям чата.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (a `Composer.Root`), `className`.",
          ru: "`children` (`Composer.Root`), `className`.",
        },
      ],
    },
  ],
  labels: [
    ...labelRows(CHAT_LABELS, {
      selectedCount: { en: "The count of the selection bar.", ru: "Счётчик панели выбора." },
      cancel: {
        en: "The selection bar's button that leaves selection.",
        ru: "Кнопка панели выбора, которая выходит из выбора.",
      },
      scrollToEnd: {
        en: "The name of the round button that goes to the newest message.",
        ru: "Имя круглой кнопки перехода к последнему сообщению.",
      },
      newMessages: {
        en: "The name of that button while new messages wait below.",
        ru: "Имя этой кнопки, пока внизу ждут новые сообщения.",
      },
      typing: {
        en: "The status line of the header while the other side types.",
        ru: "Строка статуса в шапке, пока собеседник пишет.",
      },
      search: {
        en: "The search button and the name of the search field.",
        ru: "Кнопка поиска и имя поля поиска.",
      },
      searchPlaceholder: {
        en: "The placeholder of the search field.",
        ru: "Подсказка в поле поиска.",
      },
      matches: {
        en: "The place of the current match, counted from the newest.",
        ru: "Место текущего совпадения, считая от самого нового.",
      },
      matchCount: {
        en: "The count badge at the field's end, each number rolling; no match shows «0/0».",
        ru: "Бейдж-счётчик в конце поля, каждое число прокручивается; без совпадений — «0/0».",
      },
      noMatches: { en: "The search found nothing.", ru: "Поиск ничего не нашёл." },
      previousMatch: {
        en: "The button that goes to the older match.",
        ru: "Кнопка перехода к более старому совпадению.",
      },
      nextMatch: {
        en: "The button that goes to the newer match.",
        ru: "Кнопка перехода к более новому совпадению.",
      },
      messages: {
        en: "The name of the list when the header has no `Chat.Title`.",
        ru: "Имя ленты, если в шапке нет `Chat.Title`.",
      },
      unread: {
        en: "The text of the «unread» band: `Chat.Root labels` for rows from `items`, `Chat.Unread labels` for a hand-placed band.",
        ru: "Текст полосы непрочитанных: `Chat.Root labels` для строк из `items`, `Chat.Unread labels` для полосы, поставленной вручную.",
      },
      loading: {
        en: "Announced politely while the conversation loads for the first time (`Chat.Messages loading`).",
        ru: "Вежливо объявляется, пока переписка загружается впервые (`Chat.Messages loading`).",
      },
    }),
    ...labelRows(CHAT_SERVICE_CHANGE_LABELS, {
      change: {
        en: "`Chat.ServiceChange labels`: the change as assistive tech hears it; `{from}`, `{to}` — the text of each value.",
        ru: "`Chat.ServiceChange labels`: изменение для вспомогательных технологий; `{from}`, `{to}` — текст каждого значения.",
        part: "Chat.ServiceChange",
      },
    }),
    ...labelRows(CHAT_PINNED_LABELS, {
      pinned: {
        en: "`Chat.Pinned labels`: the title with one pinned message.",
        ru: "`Chat.Pinned labels`: заголовок при одном закреплённом.",
        part: "Chat.Pinned",
      },
      pinnedOf: {
        en: "`Chat.Pinned labels`: the title with several, the newest last.",
        ru: "`Chat.Pinned labels`: заголовок при нескольких, самое новое — последнее.",
        part: "Chat.Pinned",
      },
      unpin: {
        en: "`Chat.Pinned labels`: the name of the unpin button.",
        ru: "`Chat.Pinned labels`: имя кнопки открепления.",
        part: "Chat.Pinned",
      },
    }),
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Enters the list on the last (or last focused) message, then its buttons and links",
        ru: "Входит в ленту на последнем (или последнем выбранном) сообщении, дальше — в его кнопки и ссылки",
      },
      {
        keys: "↑ · ↓",
        en: "Moves to the previous / next message; in the search field, with matches, goes to the older / newer match",
        ru: "Переходит к предыдущему / следующему сообщению; в поле поиска, когда есть совпадения, — к более старому / более новому совпадению",
      },
      {
        keys: "Home · End",
        en: "Moves to the first / last message",
        ru: "Переходит к первому / последнему сообщению",
      },
      {
        keys: "Space · Shift+Space",
        en: "In selection mode toggles the focused message; with Shift the range from the last toggled",
        ru: "В режиме выбора переключает сообщение; с Shift — диапазон от последнего отмеченного",
      },
      {
        keys: "Enter",
        en: "In the search field goes to the older match (`Shift+Enter` — the newer); on a message opens its menu; in selection mode toggles the message (`Shift+Enter` — the range)",
        ru: "В поле поиска — к более старому совпадению (`Shift+Enter` — к более новому); на сообщении открывает его меню; в режиме выбора переключает сообщение (`Shift+Enter` — диапазон)",
      },
      {
        keys: "L · R",
        en: "On a focused message: the quick reaction / the reaction bar (see Message)",
        ru: "На сообщении в фокусе: быстрая реакция / панель реакций (см. Message)",
      },
      {
        keys: "ContextMenu · Shift+F10",
        en: "Opens the focused message's menu",
        ru: "Открывает меню сообщения в фокусе",
      },
      {
        keys: "Escape",
        en: "In the search field closes the search and returns the focus to `Chat.SearchButton` (`persistent`: clears the query); in the list leaves selection mode",
        ru: "В поле поиска закрывает поиск и возвращает фокус на `Chat.SearchButton` (`persistent`: очищает запрос); в ленте выходит из режима выбора",
      },
    ],
    aria: [
      {
        en: 'The list is `role="log"`: new messages are announced politely; its name is `Chat.Title` (`aria-labelledby`), else `labels.messages`, or your `aria-label`. It is one tab stop; the messages carry `aria-posinset` / `aria-setsize`, so the keyboard reaches rows the window does not render. In selection mode it is a `listbox` with `aria-multiselectable`, the messages `option`s with `aria-selected`.',
        ru: 'Лента — `role="log"`: новые сообщения вежливо объявляются; её имя — `Chat.Title` (`aria-labelledby`), без заголовка — `labels.messages` или ваш `aria-label`. Это одна остановка Tab; сообщения несут `aria-posinset` / `aria-setsize`, поэтому клавиатура доходит до строк вне окна отрисовки. В режиме выбора — `listbox` с `aria-multiselectable`, сообщения — `option` с `aria-selected`.',
      },
      {
        en: "`Chat.SearchButton` is a toggle (`aria-pressed`); the search field takes the focus as it opens and keeps it while the chat steps through matches; the place of the match («2 из 5», «Нет совпадений») is announced politely from a live region mounted with the bar, the visible count is `aria-hidden`.",
        ru: "`Chat.SearchButton` — кнопка-переключатель (`aria-pressed`); поле поиска получает фокус при открытии и держит его, пока чат переходит по совпадениям; место совпадения («2 из 5», «Нет совпадений») вежливо объявляет живая область, которая стоит вместе со строкой, видимый счётчик — `aria-hidden`.",
      },
      {
        en: "`Chat.Pinned` is a button named by its content, the title and the line («Закреплённое 2 из 3» + the text); the rail is decorative; «Открепить» is a separate button.",
        ru: "`Chat.Pinned` — кнопка с именем из её содержимого: заголовок и строка («Закреплённое 2 из 3» + текст); «Открепить» — отдельная кнопка.",
      },
      {
        en: "The «к последним» button is named «К последним сообщениям», with the count «Новых сообщений: N. …»; the badge is `aria-hidden`.",
        ru: "Кнопка «к последним» называется «К последним сообщениям», со счётчиком «Новых сообщений: N. …»; значок — `aria-hidden`.",
      },
      {
        en: "`Chat.SelectionBar` is a `toolbar` named by the count «Выбрано: N», which is announced politely as it changes.",
        ru: "`Chat.SelectionBar` — `toolbar` с именем «Выбрано: N», которое объявляется по мере изменения.",
      },
      {
        en: "`Chat.Service` is a row of the log, not a message: no `article`, no place in the arrows' order or the selection; its text (with the change's phrase) is what the log announces when an event arrives.",
        ru: "`Chat.Service` — строка ленты, а не сообщение: без `article`, вне порядка стрелок и выбора; её текст (с фразой изменения) лента объявляет, когда событие приходит.",
      },
      {
        en: "The quick reaction (double tap, `L`) is announced politely.",
        ru: "Быстрая реакция (двойное касание, `L`) объявляется вежливо.",
      },
      {
        en: "One sound at a time on the page: a voice message, a video note and a chat video pause each other.",
        ru: "На странице звучит одно: голосовое, видеосообщение или видео из чата ставят друг друга на паузу.",
      },
      {
        en: "«Печатает…» in the header is visible text; in the list the typing bubble is a polite `status` «Собеседник печатает».",
        ru: "«Печатает…» в шапке — видимый текст; в ленте — вежливый `status` «Собеседник печатает».",
      },
      {
        en: "While `loading` the messages' region is `aria-busy`, the placeholders are `aria-hidden`, and «Загрузка сообщений» (`labels.loading`) is announced politely.",
        ru: "Первая загрузка (`loading`): область ленты — `aria-busy`, заглушки — `aria-hidden`, «Загрузка сообщений» (`labels.loading`) объявляется вежливо.",
      },
      {
        en: "A message reached by a jump or the current search match is not announced as such: a reply's target takes the focus, a search keeps it in its field; the others stepping back is visual only.",
        ru: "Сообщение, к которому перешли поиском или закреплённым, не объявляется: фокус остаётся, где был; остальные отступают только визуально.",
      },
    ],
  },
};
