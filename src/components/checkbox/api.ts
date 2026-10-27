import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP, FIELD_OPTIONAL_LABEL_DOCS } from "../../internal/field.api";
import { CHECKBOX_LABELS } from "./Checkbox";

export const api: ComponentApi = {
  parts: [
    {
      name: "Checkbox.Root",
      en: "`ref` → `HTMLInputElement` (the native checkbox). Renders the field `<div>`, the `<label>` row with the input and the box, and the support row. Field-root rule for a leaf: `className` goes to the field `<div>`; `id`, `ref` and native input props to the input.",
      ru: "Рендерит `<div>` поля, строку-`<label>` с нативным input и квадратом и строку поддержки. Правило корня поля для листа: `className` — на `<div>` поля; `id`, `ref` и нативные пропсы input — на input.",
      props: [
        {
          name: "checked",
          type: "boolean",
          en: "Controlled checked state.",
          ru: "Управляемое состояние.",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          en: "Initial state when uncontrolled.",
          ru: "Начальное состояние без контроля.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void | Promise<void>",
          en: "Called with the new state on every toggle (not while `readOnly`). Return the save's promise: the box waits (`aria-busy`); a controlled owner sets `checked` before resolving; on reject it goes back (say why with `error`).",
          ru: "Новое состояние при каждом переключении (кроме `readOnly`). Верните промис сохранения: квадрат ждёт (`aria-busy`); управляемый владелец ставит `checked` до resolve; при reject он вернётся (причину покажите в `error`).",
        },
        {
          name: "indeterminate",
          type: "boolean",
          default: "false",
          en: "Mixed state (a partial «select all»): a bar instead of the check; wins over `checked` visually and sets the native `indeterminate`.",
          ru: "Частичный выбор («выбрать все»): полоска вместо галочки; визуально важнее `checked` и ставит нативный `indeterminate`.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the box, the text and the gap. Without it the tier of its host (a form, a panel, a table), else `m`.",
          ru: "Ярус квадрата, текста и отступа. Без него — ярус хоста (форма, панель, таблица), иначе `m`.",
        },
        {
          name: "shape",
          type: '"square" | "circle"',
          default: '"square"',
          en: "Outline of the box: `square` is the rounded square; `circle` is a full circle (a selection mark in lists and chats). Size, the check draw-in, the indeterminate bar and states are the same.",
          ru: "Контур: `square` — скруглённый квадрат; `circle` — круг (отметка выбора в списках и чатах). Размер, анимация галочки, полоска и состояния те же.",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted `labels.optional` after the label text; the field may stay off.",
          ru: "Приглушённое `labels.optional` после текста подписи; поле можно не включать.",
        },
        {
          name: "labels",
          type: "Partial<CheckboxLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the label text. Hidden while `error` is shown.",
          ru: "Подсказка под текстом; скрывается, пока показан `error`.",
        },
        FIELD_HINT_TONE_PROP,
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
          en: "Danger ring on the unchecked box and `aria-invalid`. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо у неотмеченного квадрата, `aria-invalid`. Непустой `error` включает его.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled fill, dimmed label and hint, no toggling.",
          ru: "Неактивный вид, приглушённые подпись и подсказка, без переключения.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "The state is shown and focusable but does not change (`aria-readonly`); no hover or press. The native checkbox ignores `readOnly`, so the root guards the toggle.",
          ru: "Состояние видно и фокусируется, но не меняется (`aria-readonly`); без наведения и нажатия. Нативный чекбокс не знает `readOnly`, поэтому переключение сторожит корень.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the input (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id input; иначе генерируется. Связывает подпись, подсказку и ошибку. Id подсказки — `<id>-hint`, ошибки — `<id>-error`.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids.",
          ru: "Добавляется перед id подсказки и ошибки.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Checkbox.Label`. Without it only the box renders — give the root an `aria-label`.",
          ru: "`Checkbox.Label`. Без него — только квадрат; задайте `aria-label`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the field `<div>`.",
          ru: "Класс на `<div>` поля.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange">',
          en: "`name`, `value`, `required` (also a red `*` after the text), `aria-label`, `onBlur`… on the native input.",
          ru: "`name`, `value`, `required` (ещё и красная `*` после текста), `aria-label`, `onBlur`… на нативном input.",
        },
      ],
    },
    {
      name: "Checkbox.Label",
      en: "`ref` → `HTMLSpanElement`. The visible text in the text column of the label row. Native `<span>` props.",
      ru: "Видимый текст в колонке текста строки-подписи. Нативные пропсы `<span>`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Checkbox.Indicator",
      en: '`ref` → `HTMLSpanElement`. The box alone, without an input (`aria-hidden`, no focus or clicks) for rows that carry the state themselves: `role="option"` + `aria-selected`, `role="menuitemcheckbox"` + `aria-checked`, a toggle `<button>` + `aria-pressed`.',
      ru: 'Квадрат без input (`aria-hidden`, без фокуса и кликов) для строк, которые сами несут состояние: `role="option"` + `aria-selected`, `role="menuitemcheckbox"` + `aria-checked`, `<button>`-переключатель + `aria-pressed`.',
      props: [
        {
          name: "checked",
          type: "boolean",
          default: "false",
          en: "Shows the check.",
          ru: "Показывает галочку.",
        },
        {
          name: "indeterminate",
          type: "boolean",
          default: "false",
          en: "Shows the bar; wins over `checked`.",
          ru: "Показывает полоску; важнее `checked`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled fill.",
          ru: "Неактивная заливка.",
        },
        {
          name: "shape",
          type: '"square" | "circle"',
          default: '"square"',
          en: "Outline of the box: `square` is the rounded square; `circle` is a full circle (a selection mark in lists and chats). The rest is the same.",
          ru: "Контур: `square` — скруглённый квадрат; `circle` — круг (отметка выбора в списках и чатах). Остальное то же.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          en: "Box tier; without it the nearest control size (the Select or menu it sits in), else `m`.",
          ru: "Ярус квадрата; без него — ярус ближайшего контрола (Select или меню, в котором он стоит), иначе `m`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className`, `data-*` and the other span attributes.",
          ru: "`className`, `data-*` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(CHECKBOX_LABELS, FIELD_OPTIONAL_LABEL_DOCS),
  accessibility: {
    keyboard: [
      { keys: "Tab", en: "Moves focus to the checkbox.", ru: "Переводит фокус на флажок." },
      {
        keys: "Space",
        en: "Toggles it (not while `readOnly` or saving).",
        ru: "Переключает его (кроме `readOnly` и пока идёт сохранение).",
      },
    ],
    aria: [
      {
        en: 'A native `<input type="checkbox">` (visually hidden over the box, so validation bubbles point at it), wrapped by the `<label>` row.',
        ru: 'Нативный `<input type="checkbox">` визуально скрыт поверх квадрата (подсказки валидации указывают на него) и обёрнут строкой-`<label>`.',
      },
      {
        en: "`aria-invalid` is set when invalid; `aria-describedby` = your ids + the hint or the error id.",
        ru: "`aria-invalid` при ошибке; `aria-describedby` — ваши id, затем id подсказки или ошибки.",
      },
      {
        en: "Without visible text, pass `aria-label` on `Checkbox.Root` (it lands on the input).",
        ru: "Без видимого текста задайте `aria-label` на `Checkbox.Root` — он попадёт на input.",
      },
      {
        en: "`required` goes to the native input and draws a red `*` after the text; the `*` is `aria-hidden`, the input reports the requirement.",
        ru: "`required` уходит в нативный input и рисует красную `*` после текста; `*` скрыта (`aria-hidden`), обязательность сообщает input.",
      },
      {
        en: "While a change is saved (a pending promise from `onCheckedChange`) the input has `aria-busy`. A refused save puts the state back — say why with `error`.",
        ru: "Пока изменение сохраняется (ожидающий промис из `onCheckedChange`), на input `aria-busy`; при отказе состояние возвращается, причину покажите через `error`.",
      },
      {
        en: "`Checkbox.Indicator` is `aria-hidden`; the host row carries `aria-selected` / `aria-checked` / `aria-pressed`.",
        ru: "`Checkbox.Indicator` скрыт (`aria-hidden`); состояние несёт строка (`aria-selected` / `aria-checked` / `aria-pressed`).",
      },
      {
        en: 'Under a `Tooltip.Trigger` a disabled checkbox is `aria-disabled="true"` with no native `disabled`, `name` or `required`: it keeps its tab stop and its node, a press changes nothing, the form skips it.',
        ru: 'В `Tooltip.Trigger` выключенный чекбокс — `aria-disabled="true"` без нативного `disabled`, `name` и `required`: остаётся точкой Tab и тем же узлом, нажатие ничего не меняет, форма его пропускает.',
      },
    ],
  },
};
