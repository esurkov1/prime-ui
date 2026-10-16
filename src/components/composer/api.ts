import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { formattingProp, TEXT_FORMATTING_LABEL_DOCS } from "../../internal/textFormatting.api";
import { COMPOSER_LABELS } from "./Composer";

export const api: ComponentApi = {
  parts: [
    {
      name: "Composer.Root",
      en: "`ref` → `HTMLFormElement`. A `<form>` named by `labels.region`: attachments, the reply / edit bar and one row — paperclip · auto-growing field · send / record button. Owns the text, the send, the recording and the formatting; passes its tier to every part.",
      ru: "`<form>` с именем из `labels.region`: вложения, плашка ответа / правки и одна строка — скрепка · растущее поле · кнопка отправки / записи. Хранит текст, отправку, запись и форматирование; передаёт ярус всем частям.",
      props: [
        {
          name: "value",
          type: "string",
          en: "The text of the message (controlled).",
          ru: "Текст сообщения (управляемый).",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: "Initial text, uncontrolled (a saved draft).",
          ru: "Начальный текст без управления (сохранённый черновик).",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Every change of the text: typing, formatting, the field cleared after a send.",
          ru: "Любое изменение текста: ввод, форматирование, очистка после отправки.",
        },
        {
          name: "onSend",
          type: '(message: { text: string; albums: readonly (readonly (UploadItem & { type: "image" | "video" })[])[]; files: readonly UploadItem[]; replyTo?: string; editOf?: string }) => void | Promise<unknown>',
          en: "Sends the message (Enter, Mod+Enter, the button): trimmed `text`, photos and videos as `albums` of up to 10, `files`, `replyTo` / `editOf`. A Promise keeps the text until it resolves; reject changes nothing.",
          ru: "Отправка (Enter, Mod+Enter, кнопка): `text` без пробелов по краям, фото и видео как `albums` до 10, `files`, `replyTo` / `editOf`. Promise держит текст до resolve; reject ничего не меняет.",
        },
        {
          name: "onActivityChange",
          type: '(activity: "typing" | "voice" | "video" | null) => void',
          en: "What the person is doing changed, for the other side's «печатает…»: `typing`, `voice` / `video` while recording, or `null`. Fires on a change only.",
          ru: "Изменилось, что делает человек, — для «печатает…» у собеседника: `typing`, `voice` / `video` во время записи или `null`. Вызывается только при смене.",
        },
        {
          name: "onSendVoice",
          type: "(recording: { blob: Blob; durationMs: number; waveform: number[] }) => void | Promise<unknown>",
          en: "A voice message was recorded: the `MediaRecorder` blob, its length and 48 loudness values 0…1 for its waveform. With it an empty field shows the record button (where the browser can record).",
          ru: "Записано голосовое: blob от `MediaRecorder`, длительность и 48 значений громкости 0…1 для волны. С ним пустое поле показывает кнопку записи (если браузер умеет записывать).",
        },
        {
          name: "onSendVideoNote",
          type: "(recording: { blob: Blob; durationMs: number; waveform: number[] }) => void | Promise<unknown>",
          en: "A round video message was recorded (front camera and microphone), at most 60 s. With both record handlers a double click or tap on the record button (or ↑ / ↓ on it) switches voice and video.",
          ru: "Записано круглое видеосообщение (фронтальная камера и микрофон), не длиннее 60 с. С обоими обработчиками двойной щелчок или касание кнопки записи (или ↑ / ↓ на ней) переключает голос и видео.",
        },
        {
          name: "onEditLast",
          type: "() => void",
          en: '↑ in an empty field: open your last message for editing (show a `Composer.Context mode="edit"` and put its text into `value`).',
          ru: '↑ в пустом поле: открыть последнее своё сообщение для правки (`Composer.Context mode="edit"` и его текст в `value`).',
        },
        {
          name: "recordMode",
          type: '"voice" | "video"',
          en: "What the record button records (controlled); `video` needs `onSendVideoNote`.",
          ru: "Что записывает кнопка (управляемо); `video` требует `onSendVideoNote`.",
        },
        {
          name: "defaultRecordMode",
          type: '"voice" | "video"',
          default: '"voice"',
          en: "Initial record mode, uncontrolled.",
          ru: "Начальный режим записи без управления.",
        },
        {
          name: "onRecordModeChange",
          type: '(mode: "voice" | "video") => void',
          en: "A double click / double tap on the record button (or ↑ / ↓ on it) switched voice and video.",
          ru: "Двойной щелчок или двойное касание кнопки записи (или ↑ / ↓ на ней) переключили голос и видео.",
        },
        {
          name: "queue",
          type: 'Pick<UploadQueue, "items" | "add" | "retry" | "remove" | "clear" | "move">',
          en: "Attachments, usually `useUploadQueue(…)`: the paperclip, a paste and a drop add to it, and a tray above the row shows them as one reorderable strip of tiles. Without `queue` paste and drop of files do nothing.",
          ru: "Вложения, обычно `useUploadQueue(…)`: сюда добавляют скрепка, вставка и перетаскивание, а лоток над строкой показывает их одной лентой плиток с перестановкой. Без `queue` вставка и перетаскивание файлов ничего не делают.",
        },
        formattingProp("true"),
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the field, the buttons and the bar text. Without it the tier of its host, else `m`.",
          ru: "Ярус поля, кнопок и текста плашки. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "A closed conversation: the field, the paperclip and the button are disabled; nothing is pasted or dropped. A disabled `Fieldset` around it sets it too (`data-disabled` included).",
          ru: "Закрытый разговор: поле, скрепка и кнопка недоступны, файлы не принимаются. Неактивный `Fieldset` вокруг включает его тоже (вместе с `data-disabled`).",
        },
        {
          name: "inputRef",
          type: "Ref<HTMLTextAreaElement>",
          en: "The message `<textarea>`: focus it after «Ответить» in a message menu.",
          ru: "`<textarea>` сообщения: например, чтобы поставить в него фокус после «Ответить».",
        },
        {
          name: "labels",
          type: "Partial<ComposerLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Composer.Attach` (placed at the start of the row) and `Composer.Context` (above the field).",
          ru: "`Composer.Attach` (в начало строки) и `Composer.Context` (над полем).",
        },
        {
          name: "…rest",
          type: 'Omit<FormHTMLAttributes<HTMLFormElement>, "children" | "defaultValue" | "onSubmit">',
          en: "`className`, `aria-*`, `onKeyDown` and the other attributes of the `<form>`.",
          ru: "`className`, `aria-*`, `onKeyDown` и другие атрибуты `<form>`.",
        },
      ],
    },
    {
      name: "Composer.Context",
      en: "`ref` → `HTMLDivElement`. The bar above the field: a reply or edit glyph, `Composer.Title` over `Composer.Description` behind an accent rule, and a close button; it describes the field; when it appears, the caret moves to the field.",
      ru: "Плашка над полем: значок ответа или правки, `Composer.Title` над `Composer.Description` за акцентной чертой, кнопка закрытия. Описывает поле; появившись, ставит курсор в поле.",
      props: [
        {
          name: "mode",
          type: '"reply" | "edit"',
          default: '"reply"',
          en: "`reply` — a reply to a message; `edit` — your message is being edited: the send button turns into «Сохранить» and the record button is not offered.",
          ru: "`reply` — ответ на сообщение; `edit` — правка своего: кнопка становится «Сохранить», запись не предлагается.",
        },
        {
          name: "messageId",
          type: "string",
          en: "The id of the message answered or edited: `onSend` receives it as `replyTo` (`reply`) or `editOf` (`edit`).",
          ru: "Id сообщения, на которое отвечают или которое правят: `onSend` получает его как `replyTo` (`reply`) или `editOf` (`edit`).",
        },
        {
          name: "onDismiss",
          type: "() => void",
          en: "Stop replying or editing: the close button, Escape in the field, and a send that went through. Without it the bar has no close button.",
          ru: "Отменить ответ или правку: кнопка закрытия, Escape в поле и прошедшая отправка. Без него кнопки нет.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Composer.Title` and `Composer.Description`.",
          ru: "`Composer.Title` и `Composer.Description`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Composer.Title · Composer.Description",
      en: "`ref` → `HTMLDivElement`. The first line of the bar in the accent text color, medium weight («Ответ Анне», «Редактирование») / the quoted message in the secondary color; both one line, cut with an ellipsis.",
      ru: "Первая строка плашки акцентным цветом, средней насыщенности («Ответ Анне», «Редактирование») / цитируемое сообщение вторичным цветом; обе в одну строку с многоточием.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Composer.Attach",
      en: '`ref` → `HTMLDivElement`. The paperclip at the start of the row. Alone it opens the file picker (FileUpload `trigger="button"`); with `Composer.Item` children it opens a menu where every item picks its own file types. Files go to the root\'s `queue`.',
      ru: 'Скрепка в начале строки. Без детей открывает выбор файлов (FileUpload `trigger="button"`); с `Composer.Item` открывает меню, где каждый пункт выбирает свои типы файлов. Файлы уходят в `queue` корня.',
      props: [
        {
          name: "accept",
          type: "string",
          en: "File types of the picker without a menu.",
          ru: "Типы файлов выбора без меню.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of the button. Default `labels.attach`.",
          ru: "Имя кнопки. По умолчанию `labels.attach`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Composer.Item` kinds of attachment.",
          ru: "Пункты `Composer.Item` — виды вложений.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Composer.Item",
      en: '`ref` → `HTMLButtonElement`. A kind of attachment in the paperclip menu, a `Dropdown.Item` (`role="menuitem"`): `Composer.ItemIcon` and the label. + native button props.',
      ru: 'Вид вложения в меню скрепки, `Dropdown.Item` (`role="menuitem"`): `Composer.ItemIcon` и подпись.',
      props: [
        {
          name: "accept",
          type: "string",
          en: 'File types this item picks (`"image/*,video/*"`; `""` for any file). Without it the item only runs `onSelect`.',
          ru: 'Типы файлов пункта (`"image/*,video/*"`; `""` — любой файл). Без него пункт только вызывает `onSelect`.',
        },
        {
          name: "onSelect",
          type: "() => void",
          en: "The item's own action (a poll, a location); runs after the picker opens when `accept` is set.",
          ru: "Собственное действие пункта (опрос, геопозиция); при `accept` — после открытия выбора файлов.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted and skipped by the arrow keys.",
          ru: "Приглушён, стрелки его пропускают.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" | "type">',
          en: "`children`, `className` and the other button attributes.",
          ru: "`children`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Composer.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. The leading glyph of a menu item (`Dropdown.ItemIcon`, `aria-hidden`).",
      ru: "Значок пункта меню (`Dropdown.ItemIcon`, `aria-hidden`).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children` (the `Icon`), `className` and the other span attributes.",
          ru: "`children` (`Icon`), `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Composer.Keyboard",
      en: "`ref` → `HTMLDivElement`. A bot's reply keyboard under the row (`role=\"group\"`): a key sends its text through the root's `onSend` and loads while its promise runs; the toggle before the send button shows and hides it.",
      ru: 'Клавиатура ответов бота под строкой (`role="group"`): кнопка отправляет свой текст через `onSend` корня и грузится, пока идёт промис; переключатель перед кнопкой отправки показывает и прячет её.',
      props: [
        {
          name: "rows",
          type: "readonly (readonly ComposerKey[])[]",
          required: true,
          en: 'Rows of keys, each row one line shared equally. A key is its text, or `{ label, icon?, tone? }` with `tone` `"accent" | "success" | "danger"`.',
          ru: 'Ряды кнопок, каждый в одну строку поровну. Кнопка — её текст или `{ label, icon?, tone? }`, `tone` — `"accent" | "success" | "danger"`.',
        },
        {
          name: "placeholder",
          type: "string",
          en: "The field's placeholder while the keyboard is shown («Выберите раздел»).",
          ru: "Плейсхолдер поля, пока клавиатура открыта («Выберите раздел»).",
        },
        {
          name: "oneTime",
          type: "boolean",
          default: "false",
          en: "Hides the keyboard after a key is used (once its promise resolves) and puts the caret in the field; the toggle shows it again.",
          ru: "Прячет клавиатуру после нажатия (когда промис выполнился) и ставит курсор в поле; переключатель показывает её снова.",
        },
        {
          name: "open",
          type: "boolean",
          en: "Whether the keys are shown (controlled).",
          ru: "Открыта ли клавиатура (управляемое).",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "true",
          en: "Shown at first, uncontrolled: a keyboard the bot just sent is open.",
          ru: "Начальное состояние без управления: только что пришедшая клавиатура открыта.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "The toggle pressed, or a `oneTime` keyboard used.",
          ru: "Нажат переключатель или использована клавиатура `oneTime`.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of the keyboard and of its toggle. Default `labels.keyboard`.",
          ru: "Имя клавиатуры и её переключателя. По умолчанию `labels.keyboard`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`id`, `className` and the other div attributes.",
          ru: "`id`, `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: labelRows(COMPOSER_LABELS, {
    region: { en: "Accessible name of the composer form.", ru: "Имя формы." },
    placeholder: {
      en: "Placeholder and accessible name of the field.",
      ru: "Плейсхолдер и имя поля.",
    },
    send: { en: "Name of the send button.", ru: "Имя кнопки отправки." },
    save: {
      en: "Name of the send button while a message is edited.",
      ru: "Имя кнопки при правке сообщения.",
    },
    recordVoice: {
      en: "Name of the record button in voice mode.",
      ru: "Имя кнопки записи голоса.",
    },
    recordVideo: { en: "Name of the record button in video mode.", ru: "Имя кнопки записи видео." },
    recordHint: {
      en: "Description of the record button: how to record.",
      ru: "Описание кнопки записи.",
    },
    recordSwitchHint: {
      en: "Description of the record button when it also switches voice and video.",
      ru: "Описание кнопки записи, когда она переключает голос и видео.",
    },
    recordModeVoice: {
      en: "Announced when the record button switches to voice messages.",
      ru: "Объявляется, когда кнопка записи переключается на голосовые.",
    },
    recordModeVideo: {
      en: "Announced when the record button switches to video messages.",
      ru: "Объявляется, когда кнопка записи переключается на видеосообщения.",
    },
    sendRecording: { en: "Name of the button while recording.", ru: "Имя кнопки во время записи." },
    cancelRecording: {
      en: "Name of the button that throws a recording away.",
      ru: "Имя кнопки удаления записи.",
    },
    pauseRecording: {
      en: "Name of the button that pauses a hands-free recording.",
      ru: "Имя кнопки паузы записи без удержания.",
    },
    resumeRecording: {
      en: "Name of the button that resumes a paused recording.",
      ru: "Имя кнопки, продолжающей приостановленную запись.",
    },
    slideToCancel: {
      en: "Hint while a recording is held.",
      ru: "Подсказка при записи с удержанием.",
    },
    recordingStarted: {
      en: "Announced when a recording starts.",
      ru: "Объявляется в начале записи.",
    },
    recordingLocked: {
      en: "Announced when a held recording is locked and goes on hands-free.",
      ru: "Объявляется, когда запись с удержанием закреплена и идёт без него.",
    },
    recordingCanceled: {
      en: "Announced when a recording is thrown away.",
      ru: "Объявляется при удалении записи.",
    },
    recordingPaused: {
      en: "Announced when a recording is paused.",
      ru: "Объявляется, когда запись приостановлена.",
    },
    recordingResumed: {
      en: "Announced when a paused recording goes on.",
      ru: "Объявляется, когда приостановленная запись продолжается.",
    },
    recordingSent: {
      en: "Announced when a recording is handed over.",
      ru: "Объявляется при отправке записи.",
    },
    recordDenied: {
      en: "Error when the browser refuses the microphone or the camera.",
      ru: "Ошибка: браузер не дал доступ к микрофону или камере.",
    },
    recordMissing: { en: "Error when there is no device.", ru: "Ошибка: нет устройства." },
    recordFailed: {
      en: "Error when a recording fails to start for another reason.",
      ru: "Ошибка: запись не началась по другой причине.",
    },
    attach: { en: "Name of the paperclip.", ru: "Имя скрепки." },
    attachments: { en: "Accessible name of the strip of attachments.", ru: "Имя ленты вложений." },
    sendAsFiles: {
      en: "The option that sends the attached photos and videos as files.",
      ru: "Флажок, который отправляет прикреплённые фото и видео файлами.",
    },
    ...TEXT_FORMATTING_LABEL_DOCS,
    cancelReply: {
      en: "Name of the close button of a reply bar.",
      ru: "Имя кнопки закрытия ответа.",
    },
    cancelEdit: {
      en: "Name of the close button of an edit bar.",
      ru: "Имя кнопки закрытия правки.",
    },
    keyboard: {
      en: "Name of the reply keyboard and of the toggle that shows and hides it.",
      ru: "Имя клавиатуры бота и переключателя, который её показывает и прячет.",
      part: "Composer.Keyboard",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter",
        en: "In the field sends the message; on a touch screen breaks the line.",
        ru: "В поле отправляет сообщение; на сенсорном экране переносит строку.",
      },
      { keys: "Shift + Enter", en: "Breaks the line.", ru: "Переносит строку." },
      {
        keys: "Mod + Enter",
        en: "Always sends, on a touch screen too.",
        ru: "Отправляет всегда, и на сенсорном экране.",
      },
      {
        keys: "↑",
        en: "In an empty field opens your last message for editing (`onEditLast`).",
        ru: "В пустом поле открывает последнее своё сообщение для правки (`onEditLast`).",
      },
      {
        keys: "Escape",
        en: "Clears a selection with the toolbar, then cancels the reply or edit; while recording throws the recording away and stops there, so an enclosing Modal or Drawer stays open.",
        ru: "Снимает выделение с панелью форматирования, затем отменяет ответ или правку; во время записи удаляет её и не доходит до окна вокруг (Modal, Drawer).",
      },
      {
        keys: "Mod + B · Mod + I · Mod + Shift + X · Mod + E · Mod + Shift + H · Mod + K · Mod + Shift + 9",
        en: "Bold, italic, strikethrough, code, spoiler, link and quote for the selection; the physical key counts, so any layout works.",
        ru: "Жирный, курсив, зачёркнутый, код, скрытый текст, ссылка и цитата для выделения.",
      },
      {
        keys: "Enter · Space",
        en: "On the record button: record hands-free at once. During a hands-free recording, wherever the focus is in the composer: Enter sends the recording (a paused one too), Space pauses and resumes it — the timer and the waveform stand, the dot turns into a pause glyph.",
        ru: "На кнопке записи сразу начинают запись без удержания. Во время записи без удержания, где бы ни был фокус в композере: Enter отправляет запись (и приостановленную), Space приостанавливает и продолжает её — таймер и волна стоят, точка становится знаком паузы.",
      },
      {
        keys: "↑ · ↓",
        en: "On the record button, with voice and video both offered: switches voice and video (`aria-keyshortcuts`, named in the button's description).",
        ru: "На кнопке записи, когда предложены и голос, и видео: переключают голос и видео (`aria-keyshortcuts`, названы в описании кнопки).",
      },
      {
        keys: "← · →",
        en: "Move between the formatting buttons.",
        ru: "Переходят по кнопкам панели форматирования.",
      },
      {
        keys: "Home · End",
        en: "Jump to the first / last formatting button.",
        ru: "Переходят к первой / последней кнопке панели форматирования.",
      },
      {
        keys: "Enter · Space",
        native: true,
        en: "On a key of the reply keyboard: sends its text; on the keyboard's toggle: shows or hides the keys.",
        ru: "На кнопке клавиатуры бота отправляют её текст; на переключателе показывают или прячут клавиатуру.",
      },
      {
        keys: "Alt + ← · Alt + →",
        en: "On a tile of the tray: moves the attachment one place.",
        ru: "На плитке вложения сдвигают её на одно место.",
      },
      {
        keys: "Delete · Backspace",
        en: "On a tile of the tray: removes the attachment; focus moves to its neighbour.",
        ru: "На плитке вложения убирают его; фокус переходит на соседнюю плитку.",
      },
    ],
    aria: [
      {
        en: 'The composer is a `<form>` named «Новое сообщение»; the field is a `<textarea>` named «Сообщение» with `enterkeyhint="send"` (`enter` on touch).',
        ru: 'Композер — `<form>` с именем «Новое сообщение»; поле — `<textarea>` с именем «Сообщение» и `enterkeyhint="send"` (`enter` на сенсорных).',
      },
      {
        en: "A reply / edit bar describes the field (`aria-describedby`); when it appears after the first render the caret moves to the field. Its close button is «Отменить ответ» / «Отменить редактирование». A send that went through closes it.",
        ru: "Плашка ответа или правки описывает поле (`aria-describedby`); у её кнопки закрытия имя «Отменить ответ» / «Отменить редактирование». Отправка, которая прошла, закрывает плашку.",
      },
      {
        en: 'The formatting toolbar is `role="toolbar"` with one Tab stop and arrow keys; every button has `aria-keyshortcuts` and a tooltip with its keys (`⌘B` on Apple systems, `Ctrl+B` elsewhere).',
        ru: 'Панель форматирования — `role="toolbar"` с одной точкой Tab и стрелками; у кнопок `aria-keyshortcuts` и подсказка с клавишами (`⌘B` на системах Apple, `Ctrl+B` на остальных).',
      },
      {
        en: "The action button is named by what it does — «Отправить», «Сохранить», «Записать голосовое», «Записать видеосообщение», «Отправить запись» — and described by how to record. While sending it is `aria-busy` and the field is read-only.",
        ru: "Кнопка отправки меняет имя по состоянию: «Отправить», «Сохранить», «Записать голосовое», «Записать видеосообщение», «Отправить запись»; способ записи — в её описании. Во время отправки она `aria-busy`, поле только для чтения.",
      },
      {
        en: 'A live region (`role="status"`) announces a recording started, locked, deleted and sent, and the record mode after a switch («Голосовое сообщение» / «Видеосообщение»); a refused microphone is a `role="alert"` message that also describes the field, never a thrown error.',
        ru: 'Live-область (`role="status"`) объявляет начало, закрепление, удаление и отправку записи, а после переключения — режим («Голосовое сообщение» / «Видеосообщение»); ошибка доступа к микрофону — `role="alert"`, она же описывает поле.',
      },
      {
        en: 'While recording the paperclip and the field are `inert` under the bar; the bar\'s buttons are «Удалить запись» and «Приостановить запись» / «Продолжить запись» (`aria-keyshortcuts="Space"`), the action button «Отправить запись». Deleting brings the focus back to the action button. Pause and resume are announced. The timer and the waveform are decorative. While a finger holds a recording only `Escape` works (it throws the recording away); the delete and pause buttons keep their own Enter and Space.',
        ru: 'Во время записи скрепка и поле `inert` под полосой записи; у её кнопок имена «Удалить запись» и «Приостановить запись» / «Продолжить запись» (`aria-keyshortcuts="Space"`), после удаления фокус возвращается на кнопку действия. Пауза и продолжение объявляются в live-области. Таймер и волна декоративны. Пока палец держит запись, действует только `Escape` (выбрасывает запись); у кнопок удаления и паузы свои Enter и Space.',
      },
      {
        en: "The attachments are one `<ul>` named «Вложения» (FileUpload.Queue `layout=\"strip\"`): every tile is «Фото N: name» / «Видео N: name» / «Файл N: name» with its upload state, `aria-keyshortcuts` for `Alt + ←` / `→` and `Delete`, a remove button «Убрать name»; the upload disk is a `progressbar` while the file goes up. Moves are announced by Dnd's live region, finished and failed files by the queue's. «Отправить как файлы, без сжатия» is a labelled Checkbox.",
        ru: 'Вложения — один `<ul>` с именем «Вложения» (FileUpload.Queue `layout="strip"`): каждая плитка — «Фото N: имя» / «Видео N: имя» / «Файл N: имя» с состоянием загрузки, `aria-keyshortcuts` для `Alt + ←` / `→` и `Delete`, кнопкой «Убрать имя»; диск загрузки — `progressbar`, пока файл уходит. Перестановки объявляет live-область Dnd, готовые и сорвавшиеся файлы — область очереди. «Отправить как файлы, без сжатия» — Checkbox с подписью.',
      },
      {
        en: "Touch: the buttons get a 44 px hit area; Enter breaks the line, the button sends.",
        ru: "Касание: кнопки получают область нажатия 44 px; Enter переносит строку, отправка — кнопкой.",
      },
      {
        en: "Voice and video together: a single press records without holding, a double press (within 300 ms) switches the mode. The first press records silently until the window ends, so a double press shows no recording and sends nothing.",
        ru: "Голос и видео вместе: одиночное нажатие пишет без удержания, двойное (в пределах 300 мс) переключает режим. Первое нажатие пишет незаметно до конца окна, поэтому двойное не показывает записи и ничего не отправляет.",
      },
      {
        en: "A reply keyboard is a `group` named «Клавиатура бота» of native buttons in Tab order; its toggle is a button of the same name with `aria-expanded` and `aria-controls`. A key whose send is pending is `aria-busy`. Closed, the keys leave the Tab order and the accessibility tree; a `oneTime` keyboard hands the focus to the field.",
        ru: "Клавиатура ответов — `group` с именем «Клавиатура бота» из нативных кнопок в порядке Tab; переключатель — кнопка с тем же именем, `aria-expanded` и `aria-controls`. Кнопка, чья отправка идёт, — `aria-busy`. Закрытая клавиатура уходит из порядка Tab и дерева доступности; клавиатура `oneTime` передаёт фокус полю.",
      },
    ],
  },
};
