import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { contentLabelRows, contentParts } from "./content.api";

const COLORS =
  '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"';

export const api: ComponentApi = {
  parts: [
    {
      name: "Message.Root",
      en: "`ref` → `HTMLElement` (`<article>`). One message: a `role=\"article\"` row (an `option` in selection mode) with its parts in the shell its content parts declare — `bubble` (fill, padding: text, voice, file, contact, location, link preview, a picture with a caption), `media` (a picture or an album alone: the shape itself, clipped to the radius, no backing, the meta on a dark pill over it, reactions under it), `round` (`VideoNote`: no backing, the meta on its pill, reactions under it); fragments are opened and empty children ignored. The last bubble of a run of one author (`position` `single` or `last`) curls a tail out of its square bottom corner on the author's side when it is a bubble of fill (never a picture, with a caption or not, or a circle); every other corner keeps one radius. The bubble fits its content (up to the cap; a picture or a card sets its width and a caption wraps under it; a bubble of text hugs its widest laid-out line, measured once per text and row width and cached), the meta stands in the bottom-end corner over a spacer that ends the last line and drops to a line of its own only when that line is full. Every message holds a closed reactions row: the first reaction opens it and grows the message upward — its bottom corner, the meta and the tail stay, the meta moving onto the row's last line while the text gives its room back (a card keeps it, so nothing inside the card moves), the rows above gliding up as one block; the last one taken back closes it the same way. Every size change of a message (reactions, a transcript, an edit, an upload state) is laid out at once and played as one stroke: the bubble's box glides from the old size to the new one, width and height together, and its parts glide, fade in or fade out on the same clock (`--prime-message-morph-duration`); reduced motion makes it instant. Parts go in the order you write them; `Message.Author` heads the bubble (on a pill over a picture or a circle), `Message.Avatar` goes to the gutter, `Message.Menu` to the menu. In a group chat (`Chat.Messages type=\"group\"`) the message shows the author's header only on the first of a run and the avatar only on the last; in a direct chat neither; on its own a message with an author or an avatar does the same by its `position`.",
      ru: 'Одно сообщение: строка `role="article"` (в режиме выбора — `option`) с частями в оболочке, которую объявляют части содержимого: `bubble` (заливка и отступы: текст, голосовое, файл, контакт, место, превью ссылки, фото с подписью), `media` (одно фото или альбом: сам блок, обрезанный по скруглению, без подложки, мета на тёмной плашке поверх, реакции под ним), `round` (`VideoNote`: без подложки, мета на плашке, реакции под кружком); фрагменты раскрываются, пустые дети не считаются. Последний пузырь серии одного автора (`position` `single` или `last`) с заливкой выпускает хвостик из прямого нижнего угла на стороне автора (никогда у фото, с подписью или без, и у кружка); остальные углы — одно скругление. Пузырь облегает содержимое (до предела; фото или карточка задают ширину, подпись переносится под ними; пузырь текста ровно по самой широкой строке — она измеряется один раз на текст и ширину строки и запоминается), мета стоит в нижнем углу над распоркой в конце последней строки и уходит на свою строку, только когда строка заполнена. В каждом сообщении закрыта строка реакций: первая реакция раскрывает её и растит сообщение вверх — нижний угол, мета и хвостик стоят на месте, мета уходит на последнюю строку ряда, а текст отдаёт её место (карточка его сохраняет, и внутри карточки ничего не сдвигается), строки выше плавно сдвигаются одним блоком; снятие последней закрывает её так же. Любое изменение размера сообщения (реакции, расшифровка, правка, состояние загрузки) раскладывается сразу и проигрывается одним движением: рамка пузыря плавно переходит от старого размера к новому, ширина и высота вместе, а части скользят, проявляются или гаснут на тех же часах (`--prime-message-morph-duration`); при сниженном движении — сразу. Части идут в порядке записи; `Message.Author` возглавляет пузырь (на плашке поверх фото или кружка), `Message.Avatar` — в поле аватара, `Message.Menu` — в меню. В групповом чате (`Chat.Messages type="group"`) сообщение показывает шапку автора только у первого в серии, аватар — только у последнего; в личном чате — ни то ни другое; само по себе сообщение с автором или аватаром делает то же по своему `position`.',
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
          en: "The place in a run of one author's messages (`Chat.Messages items` sets it, `groupMessages` gives it): sets the small gap inside a run; `single` and `last` end a run — a bubble of fill there gets the tail, and in a group chat the avatar; `single` and `first` start one and show the author's header.",
          ru: "Место в серии сообщений одного автора (его ставит `Chat.Messages items`, даёт `groupMessages`): задаёт малый зазор внутри серии; `single` и `last` замыкают серию — пузырь с заливкой получает хвостик, а в групповом чате аватар; `single` и `first` открывают её и показывают шапку автора.",
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
          default: "«09:05»",
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
          ru: "Повторная отправка неотправленного: кнопка рядом с пузырём. Возвращённый промис показывает `sending`, пока не завершится; отказ оставляет сообщение неотправленным.",
        },
        {
          name: "onReactionToggle",
          type: "(emoji: string) => void | Promise<unknown>",
          en: "The reader puts or takes back a reaction: a chip of `Message.Reactions`, a double tap (the chat's `quickReaction`), `L`, or the reaction bar (long press, long hover, `R`). The chip shows the new state at once; a returned promise keeps it (`aria-busy`) until it settles — update the reactions before it resolves; a rejection drops it back. Without it reactions are read-only and there is no bar.",
          ru: "Читатель ставит или снимает реакцию: чип `Message.Reactions`, двойное касание (`quickReaction` чата), `L` или панель реакций (долгое нажатие, долгое наведение, `R`). Чип сразу показывает новое состояние; возвращённый промис держит его (`aria-busy`), пока не завершится — обновите реакции до его выполнения; отказ возвращает прежнее. Без обработчика реакции только для чтения и панели нет.",
        },
        {
          name: "value",
          type: "string",
          en: "The id of the message: selection (`Chat.Root selected`), `onNewMessage`, `onRead`, `current`, search, `Chat.Pinned`, `Message.Reply target` (`Chat.Messages items` sets it to the item's key). Keep it when the server confirms a sent message.",
          ru: "Идентификатор сообщения: выбор (`Chat.Root selected`), `onNewMessage`, `onRead`, `current`, поиск, `Chat.Pinned`, `Message.Reply target` (`Chat.Messages items` ставит ключ элемента). Сохраняйте его, когда сервер подтвердит отправленное.",
        },
        {
          name: "labels",
          type: "Partial<MessageLabels>",
          en: "System strings, see Labels.",
          ru: "Системные строки, см. Labels.",
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
      en: "`ref` → `HTMLDivElement`. The author's picture in the gutter beside an incoming bubble of a group chat, aligned to its bottom; holds an `Avatar` (`m`). Put it on every message: the message shows it on the last of a run and keeps the gutter empty on the others. Decorative: the message is named by its author.",
      ru: "Фото автора в поле рядом с входящим пузырём группового чата, по его нижнему краю; внутри `Avatar` (`m`). Ставьте на каждое сообщение: сообщение показывает его у последнего в серии, у остальных поле пустое. Декоративно: сообщение названо автором.",
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
      en: "`ref` → `HTMLDivElement`. The author's header at the top of the first bubble of a run in a group chat: the name semibold in the author's hue, an optional `Message.AuthorIcon` after it and the `tag` muted after them — one line, the name ellipsizing first, then the tag. The bubble hugs the whole line, so a long name or tag widens it up to its cap. Over a picture or a circle without a caption the header stands on a pill at its top-start corner. Plain text here also names the message; the hue never carries meaning on its own.",
      ru: "Шапка автора вверху первого пузыря серии в групповом чате: имя полужирным в цвете автора, необязательный `Message.AuthorIcon` после него и `tag` приглушённо после них — одна строка, сначала сокращается имя, потом тег. Пузырь облегает всю строку, поэтому длинное имя или тег расширяют его до предела. Над фото или кружком без подписи шапка стоит на плашке в верхнем углу. Простой текст здесь заодно называет сообщение; цвет сам по себе ничего не значит.",
      props: [
        {
          name: "color",
          type: COLORS,
          default: "hueOf(name)",
          en: "The author's hue: one per person in a chat. By default a hue stable per name; pass `hueOf(user.id)` to keep it per person.",
          ru: "Цвет автора: один на человека в чате. По умолчанию — цвет, постоянный для имени; передайте `hueOf(user.id)`, чтобы он был постоянным для человека.",
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
          en: "The `value` of the quoted message: a press brings the chat to it (rendering it first in a window), the other messages blink back around it, and the focus moves to it. Makes the quote a button.",
          ru: "`value` цитируемого сообщения: нажатие приводит чат к нему (в окне сначала отрисовывает), остальные сообщения мигают вокруг него, фокус переходит на него. Делает цитату кнопкой.",
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
      en: "`ref` → `HTMLDivElement`. The text: a string renders the Markdown subset the Composer writes (**bold**, _italic_, ~~strike~~, `code`, fenced code, Markdown links, bare URLs, `> ` quotes) as elements, never as HTML; links take only http(s), mailto and tel and open in a new tab. Wraps anywhere; the meta stands at the end of its last line. Marks the matches of the chat's search (`Chat.Search`).",
      ru: "Текст: строка с разметкой, которую пишет Composer (**жирный**, _курсив_, ~~зачёркнутый~~, `код`, блок кода, ссылки Markdown, голые адреса, цитаты `> `), рисуется элементами, никогда не HTML; ссылки — только http(s), mailto и tel, открываются в новой вкладке. Переносится где угодно; мета встаёт в конец последней строки. Выделяет совпадения поиска чата (`Chat.Search`).",
      props: [
        {
          name: "plain",
          type: "boolean",
          default: "false",
          en: "Render a string as is, without its Markdown.",
          ru: "Показать строку как есть, без разметки.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the text), `className`.",
          ru: "`children` (текст), `className`.",
        },
      ],
    },
    ...contentParts,
    {
      name: "Message.Reactions",
      en: "`ref` → `HTMLDivElement`. Reactions at the bottom of a bubble, under a picture or a circle: a `role=\"group\"` of chips (`aria-pressed`) — the emoji, then the avatars of who reacted (`users`: up to 3; from 4 on, 2 and a «+N» circle) or the rolling count. Not the reader's: a neutral wash; the reader's own: the accent. A press goes to `Message.Root onReactionToggle` and shows at once, the reader (`Chat.Messages reader`) joining the stack. Every message holds the row closed; the first reaction opens it in place and the last one closes it, as the message's one stroke, while the rows below stay still and the rows above glide as one block. A reaction new on the message takes its room at once and fades and scales in from 0.9 where it stands as the bubble glides; a chip taken away fades out where it stood while the chips after it glide into its place; a count change rolls its digits only; nothing animates on mount. In a bubble the meta stands at the end of the row's last line.",
      ru: 'Реакции внизу пузыря, под фото или кружком: `role="group"` из чипов (`aria-pressed`) — эмодзи, затем аватары отреагировавших (`users`: до 3; с 4 — два и кружок «+N») или счётчик с прокруткой цифр. Чужая реакция — нейтральная подложка, своя — акцент. Нажатие идёт в `Message.Root onReactionToggle` и видно сразу, читатель (`reader` у `Chat.Messages`) встаёт в стопку. В каждом сообщении строка закрыта и держит место; первая реакция раскрывает её на месте, последняя закрывает — одним движением сообщения, строки ниже стоят, а строки выше скользят одним блоком. Новая для сообщения реакция сразу занимает место и проявляется с масштабом от 0.9 там, где стоит, пока пузырь плавно меняет размер; снятая гаснет на своём месте, а следующие чипы скользят на её место; смена счётчика прокручивает только цифры; при монтировании ничего не анимируется. В пузыре мета стоит в конце последней строки ряда.',
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
          en: "System strings, see Labels.",
          ru: "Системные строки, см. Labels.",
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
      name: "Message.Menu",
      en: '`ref` → `HTMLDivElement`. The context menu (a `Dropdown.Content`): `Dropdown.Item`s you write — Ответить, Скопировать, Закрепить, Переслать, Пожаловаться, Удалить (`tone="danger"`); the kit adds a separator and «Выбрать» when the chat has a selection (`Chat.Root selected`). It opens where the pointer is on right click, with the reaction bar on a long press, under the bubble from the keyboard (Enter, Shift+F10, the menu key); a bottom sheet on phones.',
      ru: 'Контекстное меню (`Dropdown.Content`): ваши `Dropdown.Item` — Ответить, Скопировать, Закрепить, Переслать, Пожаловаться, Удалить (`tone="danger"`); кит добавляет разделитель и «Выбрать», если у чата есть выбор (`Chat.Root selected`). Открывается у указателя по правому клику, вместе с панелью реакций по долгому нажатию, под пузырём — с клавиатуры (Enter, Shift+F10, клавиша меню); на телефоне — нижний лист.',
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
      en: '`ref` → `HTMLDivElement` (`role="status"`). «Печатает…»: an incoming bubble of three dots that rise and fade in turn (the loading loop: reduced motion slows it), at the end of the list while the other side types (`Chat.Root typing` puts it there for you). Enters like an incoming message; leaves fading and closing its height. Its hidden text is read politely.',
      ru: "«Печатает…»: входящий пузырь из трёх точек, которые по очереди поднимаются и проявляются (цикл загрузки: при уменьшенном движении медленнее), в конце ленты, пока собеседник пишет (`Chat.Root typing` ставит его сам). Появляется как входящее сообщение, уходит, гаснув и закрывая высоту. Скрытый текст читается вежливо.",
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
    {
      key: "message",
      default: "{author}, {time}",
      en: "The name of a message for assistive tech.",
      ru: "Имя сообщения для скринридера.",
    },
    {
      key: "you",
      default: "Вы",
      en: "The author of an outgoing message.",
      ru: "Автор исходящего сообщения.",
    },
    {
      key: "edited",
      default: "изменено",
      en: "The mark of an edited message in its meta.",
      ru: "Отметка изменённого сообщения в мете.",
    },
    {
      key: "sending",
      default: "Отправляется",
      en: "Name of the clock status.",
      ru: "Имя статуса «часы».",
    },
    {
      key: "sent",
      default: "Отправлено",
      en: "Name of the one-check status.",
      ru: "Имя статуса «одна галочка».",
    },
    {
      key: "read",
      default: "Прочитано",
      en: "Name of the two-check status.",
      ru: "Имя статуса «две галочки».",
    },
    {
      key: "failed",
      default: "Не отправлено",
      en: "Name of the failed status.",
      ru: "Имя статуса ошибки.",
    },
    {
      key: "retry",
      default: "Повторить отправку",
      en: "The retry button beside a failed message.",
      ru: "Кнопка повтора рядом с неотправленным.",
    },
    {
      key: "menu",
      default: "Действия с сообщением",
      en: "The name of the context menu.",
      ru: "Имя контекстного меню.",
    },
    {
      key: "select",
      default: "Выбрать",
      en: "The menu item that starts selection mode with the message.",
      ru: "Пункт меню, который начинает выбор с этого сообщения.",
    },
    {
      key: "reaction",
      default: "{emoji}: {count}",
      en: "`Message.Reactions`: the name of a chip without `users`.",
      ru: "`Message.Reactions`: имя чипа без `users`.",
    },
    {
      key: "reactionUsers",
      default: "{emoji} {count}: {users}",
      en: "`Message.Reactions`: the name of a chip with `users`; `{users}` — their names.",
      ru: "`Message.Reactions`: имя чипа с `users`; `{users}` — их имена.",
    },
    {
      key: "moreUsers",
      default: "ещё {count}",
      en: "`Message.Reactions`: the last item of `{users}` when not everyone is listed.",
      ru: "`Message.Reactions`: последний элемент `{users}`, когда перечислены не все.",
    },
    {
      key: "reactions",
      default: "Реакции",
      en: "`Message.Reactions`: the name of the row.",
      ru: "`Message.Reactions`: имя ряда.",
    },
    {
      key: "reactionAdded",
      default: "Реакция {emoji} поставлена",
      en: "Announced when the quick reaction (a double tap, `L`) is put.",
      ru: "Объявление, когда быстрая реакция (двойное касание, `L`) поставлена.",
    },
    {
      key: "reactionRemoved",
      default: "Реакция {emoji} снята",
      en: "Announced when the quick reaction is taken back.",
      ru: "Объявление, когда быстрая реакция снята.",
    },
    {
      key: "reactionBar",
      default: "Реакции",
      en: "The name of the reaction bar.",
      ru: "Имя панели реакций.",
    },
    {
      key: "moreReactions",
      default: "Все реакции",
      en: "The «⌄» of the reaction bar that shows every reaction.",
      ru: "Кнопка «⌄» панели реакций, которая показывает все реакции.",
    },
    {
      key: "typing",
      default: "Собеседник печатает",
      en: "`Message.Typing`: the text read while the other side types.",
      ru: "`Message.Typing`: текст, который читается, пока собеседник пишет.",
    },
    ...contentLabelRows,
  ],
};
