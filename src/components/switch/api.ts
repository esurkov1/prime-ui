import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP, FIELD_OPTIONAL_LABEL_DOCS } from "../../internal/field.api";
import { SWITCH_LABELS } from "./Switch";

export const api: ComponentApi = {
  parts: [
    {
      name: "Switch.Root",
      en: '`ref` → `HTMLInputElement` (the native `input type="checkbox" role="switch"`). Renders the field `<div>`, the `<label>` row with the input and the track, and the support row. `className` goes to the field `<div>`, native input props to the input.',
      ru: "Рендерит `<div>` поля, строку-`<label>` с input и дорожкой и строку поддержки. `className` — на `<div>` поля, нативные пропсы input — на input.",
      props: [
        {
          name: "checked",
          type: "boolean",
          en: "Controlled state.",
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
          en: "Called with the new state on every toggle. Return the save's promise: the thumb waits with a spinner; a controlled owner sets `checked` before resolving; on reject the thumb goes back (say why with `error`).",
          ru: "Новое состояние при каждом переключении. Верните промис сохранения: бегунок ждёт со спиннером; управляемый владелец ставит `checked` до resolve; при reject бегунок возвращается (причину покажите через `error`).",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Saving, for an owner that tracks the request itself: a spinner in the thumb, `aria-busy` on the input, presses do nothing. A promise from `onCheckedChange` does the same on its own.",
          ru: "Сохранение, когда владелец сам следит за запросом: спиннер в бегунке, `aria-busy` на input, нажатия не действуют. Промис из `onCheckedChange` делает то же сам.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the track (24×16 … 44×24), the text and the gap. Without it the tier of its host (a form, a panel), else `m`.",
          ru: "Ярус дорожки (24×16 … 44×24), текста и отступа. Без него — ярус хоста (форма, панель), иначе `m`.",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted `labels.optional` after the label text; the field may stay off.",
          ru: "Приглушённое `labels.optional` после текста подписи; поле можно не включать.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: 'A settings row as wide as its container: the text and its hint at the start, the track at the end of the first line (`data-control="end"`). The label stays inside the row, so the whole row toggles.',
          ru: 'Строка настроек на всю ширину контейнера: текст и подсказка в начале, дорожка в конце первой строки (`data-control="end"`). Подпись остаётся внутри строки, поэтому переключает вся строка.',
        },
        {
          name: "labels",
          type: "Partial<SwitchLabels>",
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
          en: "Danger ring on the off track and `aria-invalid`. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо у выключенной дорожки, `aria-invalid`. Непустой `error` включает его.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "No toggling; muted track (on = `accent-soft`), dimmed text and hint.",
          ru: "Без переключения; приглушённая дорожка (включённая — `accent-soft`), текст и подсказка.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "The state is shown and focusable but does not change (`aria-readonly`); no hover or press.",
          ru: "Состояние видно и фокусируется, но не меняется (`aria-readonly`); без наведения и нажатия.",
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
          en: "`Switch.Label`. Without it only the track renders — name it with `aria-label` or `aria-labelledby`.",
          ru: "`Switch.Label`. Без него — только дорожка; задайте `aria-label` или `aria-labelledby`.",
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
          en: "`name`, `value`, `required` (also a red `*` after the text), `aria-label`, `aria-labelledby`… on the native input.",
          ru: "`name`, `value`, `required` (ещё и красная `*` после текста), `aria-label`, `aria-labelledby`… на нативном input.",
        },
      ],
    },
    {
      name: "Switch.Label",
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
  ],
  labels: labelRows(SWITCH_LABELS, FIELD_OPTIONAL_LABEL_DOCS),
  accessibility: {
    keyboard: [
      { keys: "Tab", en: "Moves focus to the switch.", ru: "Переводит фокус на переключатель." },
      {
        keys: "Space",
        en: "Toggles it (not while `readOnly` or saving).",
        ru: "Переключает его (кроме `readOnly` и пока идёт сохранение).",
      },
    ],
    aria: [
      {
        en: 'A native `<input type="checkbox" role="switch">` (its native checked state is the switch state), visually hidden over the track and wrapped by the `<label>` row.',
        ru: 'Нативный `<input type="checkbox" role="switch">` (его нативное отмеченное состояние и есть состояние переключателя), визуально скрыт поверх дорожки и обёрнут строкой-`<label>`.',
      },
      {
        en: "`aria-invalid`, `aria-readonly` and `aria-describedby` (your ids + the hint or the error) are set on the input.",
        ru: "`aria-invalid`, `aria-readonly` и `aria-describedby` (ваши id, затем подсказка или ошибка) — на input.",
      },
      {
        en: "Without visible text, name it with `aria-label` or `aria-labelledby` on `Switch.Root`.",
        ru: "Без видимого текста назовите его через `aria-label` или `aria-labelledby` на `Switch.Root`.",
      },
      {
        en: "While a change is saved (`loading` or a pending promise) the input has `aria-busy`; the thumb's spinner is hidden from assistive tech. A refused save puts the state back — say why with `error`.",
        ru: "Пока изменение сохраняется (`loading` или ожидающий промис), на input `aria-busy`, а спиннер в бегунке скрыт от вспомогательных технологий; при отказе состояние возвращается, причину покажите через `error`.",
      },
    ],
  },
};
