import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import {
  FIELD_COMMIT_LABEL_DOCS,
  FIELD_COPY_LABEL_DOCS,
  fieldActionPart,
  fieldCommitProp,
  fieldCopyPart,
} from "../../internal/field.api";
import { formattingProp, TEXT_FORMATTING_LABEL_DOCS } from "../../internal/textFormatting.api";
import { TEXTAREA_LABELS } from "./Textarea";

export const api: ComponentApi = {
  parts: [
    {
      name: "Textarea.Root",
      en: "`ref` → `HTMLTextAreaElement`. Renders the label row, the field box with the native `<textarea>` and the support row. Field-root rule for a leaf without a `Field` part: `className` goes to the field frame; `id`, `ref` and the native `<textarea>` props to the textarea.",
      ru: "Подпись, поле с нативным `<textarea>` и строка поддержки; нативные пропсы уходят в `<textarea>`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier for text, padding, radius, label and hint. One line of text sits exactly like an Input of the same size. Without it the tier of its host (LoginForm, Popover, a panel with a size), else `m`.",
          ru: "Ярус: кегль, отступы, радиус, подпись и подсказка. Одна строка стоит как Input того же яруса. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the field (`<label htmlFor>`). Without it, set `aria-label`.",
          ru: "Подпись над полем (`<label htmlFor>`). Без неё задайте `aria-label`.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Native `required` on the textarea and a red `*` after the label (`aria-hidden`).",
          ru: "Нативный `required` и красная `*` после подписи (`aria-hidden`).",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается, пока показан `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in the hint slot; implies `invalid`.",
          ru: "Текст ошибки на месте подсказки; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring on the field box, `aria-invalid` on the textarea. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо, `aria-invalid`, `data-invalid`. Непустой `error` включает его.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on the field box (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: '`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются. Атрибут — `data-focus-ring="false"`.',
        },
        {
          name: "counter",
          type: "ReactNode",
          en: "Right side of the support row, usually `<Textarea.Counter />`.",
          ru: "Правая часть строки поддержки, обычно `<Textarea.Counter current max />`.",
        },
        {
          name: "reserveSupportRow",
          type: "boolean",
          default: "false",
          en: "Always render the support row (min height = hint line height), so an appearing error does not shift the layout.",
          ru: "Строка поддержки есть всегда, поэтому ошибка не сдвигает вёрстку.",
        },
        {
          name: "autoResize",
          type: "boolean",
          default: "true",
          en: "Height follows the content (minimum `rows` lines, no resize handle; up to `maxRows` lines when set, then it scrolls inside). `false` → fixed height of `rows` lines with native vertical resize.",
          ru: "Высота следует за текстом (минимум `rows` строк; с `maxRows` — до этого числа строк, дальше прокрутка внутри). `false` — фиксированная высота в `rows` строк и нативный resize.",
        },
        {
          name: "rows",
          type: "number",
          default: "3",
          en: "Minimum height in lines; with `autoResize={false}` the fixed height. `rows={1}` makes a field that starts as one line, like an Input.",
          ru: "Минимальная высота в строках; при `autoResize={false}` — фиксированная. `rows={1}` — поле начинается с одной строки, как Input.",
        },
        {
          name: "maxRows",
          type: "number",
          en: "With `autoResize`: the field grows up to this many lines, then scrolls inside (a chat composer: `rows={1} maxRows={8}`). Without it the field grows without a limit.",
          ru: "С `autoResize`: поле растёт до этого числа строк, дальше прокручивается внутри (поле чата: `rows={1} maxRows={8}`). Без него растёт без предела.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new string; native `onChange` still fires first.",
          ru: "Новое строковое значение; нативный `onChange` тоже вызывается.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the `<textarea>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку. Id подсказки — `<id>-hint`, ошибки — `<id>-error`.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids.",
          ru: "Добавляется перед id подсказки и ошибки.",
        },
        fieldCommitProp({ en: "Mod+Enter", ru: "Mod+Enter" }),
        formattingProp("false"),
        {
          name: "children",
          type: "ReactNode",
          en: "Actions in the field's top end corner: `Textarea.CopyButton`, `Textarea.Action`.",
          ru: "Действия в верхнем углу поля: `Textarea.CopyButton`, `Textarea.Action`.",
        },
        {
          name: "labels",
          type: "Partial<TextareaLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the field frame `<div>` (label, field box, support row), as on every field root.",
          ru: "Класс на `<div>` рамки поля (подпись, поле, строка поддержки), как у каждого корня поля.",
        },
        {
          name: "…rest",
          type: 'Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "children">',
          en: "`value`, `defaultValue`, `onChange`, `placeholder`, `rows`, `maxLength`, `name`, `disabled`, `readOnly`, `aria-label`…",
          ru: "`value`, `defaultValue`, `onChange`, `placeholder`, `rows`, `maxLength`, `disabled`, `readOnly`…",
        },
      ],
    },
    {
      name: "Textarea.Counter",
      en: "`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/280` and announces `labels.counter`.",
      ru: "Счётчик символов для строки поддержки; показывает `14/280` и объявляет `labels.counter`.",
      props: [
        {
          name: "current",
          type: "number",
          required: true,
          en: "Current length.",
          ru: "Текущая длина.",
        },
        {
          name: "max",
          type: "number",
          required: true,
          en: 'Limit; `current > max` turns the counter danger (`data-invalid="true"`). Add `maxLength` on the root for a hard limit.',
          ru: "Лимит; при `current > max` счётчик красный. Для жёсткого лимита добавьте `maxLength`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    fieldCopyPart("Textarea.CopyButton", {
      en: "from the field's top end corner (a read-only result)",
      ru: "из верхнего угла поля (готовый результат только для чтения)",
    }),
    fieldActionPart("Textarea.Action", {
      en: "in the field's top end corner",
      ru: "в верхнем углу поля",
    }),
  ],
  labels: labelRows(TEXTAREA_LABELS, {
    optional: {
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    counter: {
      en: "Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Textarea.Counter`; `{current}` и `{max}` подставляются.",
    },
    ...FIELD_COPY_LABEL_DOCS,
    ...FIELD_COMMIT_LABEL_DOCS,
    ...TEXT_FORMATTING_LABEL_DOCS,
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the field, then the buttons in its corner; Enter inserts a line break instead of submitting the form.",
        ru: "Фокус в поле, затем на кнопки в его углу; Enter переносит строку, а не отправляет форму.",
      },
      {
        keys: "Mod+Enter",
        en: "With `onCommit`: saves a changed text; focus stays in the field.",
        ru: "С `onCommit`: сохраняет изменённый текст, фокус остаётся в поле.",
      },
      {
        keys: "Escape",
        en: "With `formatting`: first clears a selection with the toolbar. With `onCommit`: puts the committed text back.",
        ru: "С `formatting`: сначала снимает выделение с панелью. С `onCommit`: возвращает сохранённый текст.",
      },
      {
        keys: "Mod + B · Mod + I · Mod + Shift + X · Mod + E · Mod + Shift + H · Mod + K · Mod + Shift + 9",
        en: "With `formatting`: bold, italic, strikethrough, code, spoiler, link and quote for the selection; the physical key counts, so any layout works.",
        ru: "С `formatting`: жирный, курсив, зачёркнутый, код, скрытый текст, ссылка и цитата для выделения; работает в любой раскладке.",
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
    ],
    aria: [
      {
        en: "`label` renders `<label htmlFor>` bound to the textarea; without it set `aria-label`. A placeholder never replaces the label.",
        ru: "`label` — настоящий `<label htmlFor>`; без него задайте `aria-label`. Плейсхолдер не заменяет подпись.",
      },
      {
        en: 'Hint and error are linked via `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.',
        ru: 'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      },
      {
        en: "The field box is a `<div>`, not a `<label>`, so counter and hint never leak into the accessible name; clicking its padding focuses the textarea.",
        ru: "Поле — `<div>`, а не `<label>`: счётчик и подсказка не попадают в имя поля. Клик по отступу фокусирует textarea.",
      },
      {
        en: '`Textarea.Counter` shows `12/280` visually and announces `labels.counter` (`aria-live="polite"`).',
        ru: '`Textarea.Counter` показывает «12/280», а скринридер читает `labels.counter` через `aria-live="polite"`.',
      },
      {
        en: "`Textarea.Action` and `Textarea.CopyButton` are buttons (or a link with `asChild`) named by their label, with a tooltip; copying announces `labels.copied`. A press on them never moves focus into the textarea.",
        ru: "`Textarea.Action` и `Textarea.CopyButton` — кнопки с именем и подсказкой; копирование объявляет `labels.copied`.",
      },
      {
        en: 'With `onCommit` the textarea carries `aria-busy="true"` while saving; a polite live region says `labels.saving`, then `labels.saved`.',
        ru: "С `onCommit` поле ставит `aria-busy`, пока идёт сохранение, а живой регион говорит `labels.saving` и `labels.saved`.",
      },
      {
        en: 'The formatting toolbar is `role="toolbar"` named `labels.formatting`, `aria-controls` the textarea, with one Tab stop and arrow keys; every button has `aria-keyshortcuts` and a tooltip with its keys (`⌘B` on Apple systems, `Ctrl+B` elsewhere). A press on a tool keeps the focus and the selection in the field.',
        ru: 'Панель форматирования — `role="toolbar"` с именем `labels.formatting` и `aria-controls` на поле, с одной точкой Tab и стрелками; у кнопок `aria-keyshortcuts` и подсказка с клавишами. Нажатие на кнопку оставляет фокус и выделение в поле.',
      },
    ],
  },
};
