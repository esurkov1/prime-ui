import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";
import {
  FIELD_COMMIT_LABELS,
  FIELD_COPY_LABELS,
  fieldActionPart,
  fieldCommitProp,
  fieldCopyPart,
} from "../../internal/field.api";

const side = (en: string, ru: string): ApiProp => ({
  name: "side",
  type: '"start" | "end"',
  required: true,
  en,
  ru,
});

export const api: ComponentApi = {
  parts: [
    {
      name: "Input.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). Size, label, support row and the context for `Wrapper` and `Field`.",
      ru: "Размер, подпись, строка поддержки и контекст для `Wrapper` и `Field`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier for height, padding, radius, text, label and hint. Without it the field takes the tier of its host (LoginForm, Popover, a panel with a size), else `m`. Also provided to nested controls via the control-size context.",
          ru: "Ярус поля: высота, отступы, радиус, кегль поля, подписи и подсказки. Без него поле берёт ярус контейнера (LoginForm, Popover, панель с размером), иначе `m`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the field, rendered as `<label htmlFor>`. Without it, give `Input.Field` an `aria-label`.",
          ru: "Подпись над полем (`<label htmlFor>`). Без неё задайте `aria-label` на `Input.Field`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label (`aria-hidden`) and native `required` on `Input.Field`.",
          ru: "Красная `*` после подписи (`aria-hidden`) и нативный `required` на `Input.Field`.",
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
          en: "Danger inset ring on the field, `aria-invalid` on the input. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо, `aria-invalid`, `data-invalid`.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on `Input.Wrapper` (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: "`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются.",
        },
        {
          name: "counter",
          type: "ReactNode",
          en: "Right side of the support row, usually `<Input.Counter />`.",
          ru: "Правая часть строки поддержки, обычно `<Input.Counter current max />`.",
        },
        {
          name: "reserveSupportRow",
          type: "boolean",
          default: "false",
          en: "Always render the support row (min height = hint line height), so an appearing error does not shift the layout.",
          ru: "Строка поддержки есть всегда, поэтому ошибка не сдвигает вёрстку.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the `<input>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку.",
        },
        {
          name: "strength",
          type: "boolean",
          default: "false",
          en: "A password strength meter for new-password fields: a stepped `ProgressBar` under the field and the level word (weak … hard) in the support row. Follows the value of `Input.Field`.",
          ru: "Шкала надёжности для поля нового пароля: ступенчатый `ProgressBar` под полем и слово уровня (слабый … сложный) в строке поддержки. Следит за значением `Input.Field`.",
        },
        {
          name: "getStrength",
          type: "(value: string) => 0 | 1 | 2 | 3 | 4",
          default: "getPasswordStrength",
          en: "Replaces the kit's estimate of `strength`. Return 0 for empty, 1 weak … 4 hard. A hint for the person typing, not a security check.",
          ru: "Заменяет оценку кита для `strength`. Верните 0 для пустого, 1 — слабый … 4 — сложный. Подсказка для человека, а не проверка безопасности.",
        },
        fieldCommitProp({ en: "Enter", ru: "Enter" }),
        {
          name: "labels",
          type: "Partial<InputLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Usually `Input.Wrapper`.",
          ru: "Обычно `Input.Wrapper` с полем и слотами.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
    {
      name: "Input.Wrapper",
      en: "`ref` → `HTMLDivElement`. The visible field: fill, hover, focus ring, invalid ring; `data-size` and `data-invalid` come from the root.",
      ru: "Видимое поле: заливка, наведение, фокус, ошибка; `data-size` и `data-invalid` приходят из контекста.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Field` and the slots: `Icon`, `Affix`, `InlineAffix`; the end segments `ClearButton`, `CopyButton`, `RevealButton`, `Action` in source order.",
          ru: "`Field`, `Icon`, `Affix`, `InlineAffix`; сегменты у конца — `ClearButton`, `CopyButton`, `RevealButton`, `Action` в порядке разметки.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the `<div>`.",
          ru: "`className` и остальные атрибуты `<div>`.",
        },
      ],
    },
    {
      name: "Input.Field",
      en: "`ref` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root, `disabled` also from a disabled `Fieldset` around it.",
      ru: "Нативный `<input>` с id, aria-связями и `aria-invalid` из контекста; `disabled` — также от неактивного `Fieldset` вокруг.",
      props: [
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new string; native `onChange` still fires first.",
          ru: "Новое строковое значение; нативный `onChange` тоже вызывается.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged with the hint/error ids from the root.",
          ru: "Добавляется к id подсказки и ошибки из контекста.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Overrides the root's `required` for the native input.",
          ru: "Переопределяет `required` корня для нативного поля.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id">',
          en: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`…",
          ru: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`…",
        },
      ],
    },
    {
      name: "Input.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`), centered between the edge and the text.",
      ru: "Декоративная иконка (`aria-hidden`) по центру между краем и текстом.",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An icon; kit icons without an explicit `size` take the field tier.",
          ru: "Иконка; без `size` берёт ярус поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "Input.Affix",
      en: "`ref` → `HTMLDivElement`. Tinted section flush with the edge (`aria-hidden`); the wrapper drops its padding there.",
      ru: "Секция с подложкой вплотную к краю (`aria-hidden`); обёртка убирает там свой отступ.",
      props: [
        side("Edge the section sits on.", "Край, к которому прилегает секция с подложкой."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Static text: protocol, domain, country code.",
          ru: "Постоянный текст: протокол, домен, код страны.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the `<div>`.",
          ru: "`className` и остальные атрибуты `<div>`.",
        },
      ],
    },
    {
      name: "Input.InlineAffix",
      en: "`ref` → `HTMLSpanElement`. Muted unit next to the value (`aria-hidden`).",
      ru: "Приглушённая единица рядом со значением (`aria-hidden`).",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Short unit: `₽`, `%`, `кг`.",
          ru: "Короткая единица: `₽`, `%`, `кг`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "Input.ClearButton",
      en: "`ref` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.",
      ru: "Сегмент очистки на всю высоту поля у конца. Рендерите его, только пока есть значение.",
      props: [
        {
          name: "onClick",
          type: "MouseEventHandler<HTMLButtonElement>",
          en: "Clear the value here. Afterwards focus returns to the input unless `event.preventDefault()` was called.",
          ru: "Очистите значение здесь; затем фокус вернётся в поле (если не вызван `preventDefault`).",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label">',
          en: "The other button attributes.",
          ru: "Остальные атрибуты кнопки.",
        },
      ],
    },
    fieldCopyPart("Input.CopyButton", {
      en: "as a full-height segment at the end edge",
      ru: "сегментом на всю высоту поля у конца",
    }),
    {
      name: "Input.RevealButton",
      en: '`ref` → `HTMLButtonElement`. A full-height toggle segment that shows a `type="password"` field as text and back (`aria-pressed`, named by `labels.reveal`); the focus, caret and selection stay in the field.',
      ru: "Сегмент-переключатель, который показывает пароль текстом и прячет обратно (`aria-pressed`, имя `labels.reveal`); фокус, курсор и выделение остаются в поле.",
      props: [
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label" | "aria-pressed">',
          en: "The other button attributes.",
          ru: "Остальные атрибуты кнопки.",
        },
      ],
    },
    fieldActionPart("Input.Action", {
      en: "at the end edge («Позвонить», «Открыть профиль»)",
      ru: "у конца поля («Позвонить», «Открыть профиль»)",
    }),
    {
      name: "Input.Counter",
      en: "`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/40` and announces `labels.counter`.",
      ru: "Счётчик символов для строки поддержки; показывает `14/40` и объявляет `labels.counter`.",
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
          en: 'Limit; `current > max` turns the counter danger (`data-invalid="true"`).',
          ru: "Лимит; при `current > max` счётчик красный (`data-invalid`).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    {
      key: "clear",
      default: "Очистить",
      en: "Accessible name of `Input.ClearButton`.",
      ru: "Имя `Input.ClearButton`.",
    },
    ...FIELD_COPY_LABELS,
    {
      key: "reveal",
      default: "Показать пароль",
      en: "Accessible name of `Input.RevealButton`;`aria-pressed` says whether the password is shown.",
      ru: "Имя `Input.RevealButton`; `aria-pressed` говорит, показан ли пароль.",
    },
    ...FIELD_COMMIT_LABELS,
    {
      key: "counter",
      default: "{current} из {max} символов",
      en: "Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Input.Counter`; `{current}` и `{max}` подставляются.",
    },
    {
      key: "strength",
      default: "Надёжность пароля",
      en: "Accessible name of the `strength` meter and the spoken prefix of the level word.",
      ru: "Имя шкалы `strength` и озвучиваемое начало слова уровня.",
    },
    {
      key: "strengthWeak",
      default: "Слабый",
      en: "Level word for strength 1.",
      ru: "Слово уровня 1.",
    },
    {
      key: "strengthEasy",
      default: "Лёгкий",
      en: "Level word for strength 2.",
      ru: "Слово уровня 2.",
    },
    {
      key: "strengthMedium",
      default: "Средний",
      en: "Level word for strength 3.",
      ru: "Слово уровня 3.",
    },
    {
      key: "strengthHard",
      default: "Сложный",
      en: "Level word for strength 4.",
      ru: "Слово уровня 4.",
    },
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the field, then the segments at its end (clear, copy, reveal, actions).",
        ru: "Фокус в поле, затем на кнопки у его конца (очистка, копирование, показ пароля, действия).",
      },
      {
        keys: "Enter · Space",
        en: "On a segment: runs its action (the clear button returns focus to the field).",
        ru: "На кнопке у конца поля: выполняет её действие (кнопка очистки возвращает фокус в поле).",
      },
      {
        keys: "Enter",
        en: "With `onCommit`: saves a changed value; focus stays in the field.",
        ru: "С `onCommit`: сохраняет изменённое значение, фокус остаётся в поле.",
      },
      {
        keys: "Escape",
        en: "With `onCommit`: puts the committed value back.",
        ru: "С `onCommit`: возвращает сохранённое значение.",
      },
    ],
    aria: [
      {
        en: "`label` renders a `<label htmlFor>` bound to the input. Without `label`, set `aria-label` on `Input.Field`. A placeholder never replaces the label.",
        ru: "`label` — настоящий `<label htmlFor>`; без него задайте `aria-label` на `Input.Field`. Плейсхолдер не заменяет подпись.",
      },
      {
        en: 'Hint and error are linked through `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.',
        ru: 'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      },
      {
        en: '`Input.Icon`, `Input.Affix`, `Input.InlineAffix` are `aria-hidden`: put the meaning in the label (e.g. "Сумма, ₽").',
        ru: "`Input.Icon`, `Input.Affix`, `Input.InlineAffix` скрыты (`aria-hidden`): смысл единицы или префикса дублируйте в подписи.",
      },
      {
        en: "`Input.ClearButton` is a real button named by `labels.clear`, with `aria-controls` on the input.",
        ru: "`Input.ClearButton` — кнопка с именем `labels.clear` и `aria-controls` на поле.",
      },
      {
        en: "`Input.Action` and `Input.CopyButton` are buttons (or a link with `asChild`) named by their label, with a tooltip; copying announces `labels.copied` through a polite live region.",
        ru: "`Input.Action` и `Input.CopyButton` — кнопки с именем и подсказкой; копирование объявляет `labels.copied` через живой регион.",
      },
      {
        en: "`Input.RevealButton` is a toggle: a constant name `labels.reveal`, `aria-pressed` and `aria-controls` on the input; a pointer press keeps the focus in the field.",
        ru: "`Input.RevealButton` — переключатель с `aria-pressed` и постоянным именем `labels.reveal`.",
      },
      {
        en: 'With `onCommit` the input carries `aria-busy="true"` while saving; a polite live region says `labels.saving`, then `labels.saved`.',
        ru: "С `onCommit` поле ставит `aria-busy`, пока идёт сохранение, а живой регион говорит `labels.saving` и `labels.saved`.",
      },
      {
        en: '`Input.Counter` shows `14/40` visually and announces `labels.counter` through `aria-live="polite"`.',
        ru: '`Input.Counter` показывает «14/40», а скринридер читает `labels.counter` через `aria-live="polite"`.',
      },
    ],
  },
};
