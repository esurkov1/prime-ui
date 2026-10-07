import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Switch.Root",
      en: '`forwardRef` → `HTMLInputElement` (the native `input type="checkbox" role="switch"`). Renders the field `<div>`, the `<label>` row with the input and the track, and the support row; native input props go to the input.',
      ru: 'Поле: строка-`<label>` с нативным input (`role="switch"`) и дорожкой, под ней подсказка или ошибка.',
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
          type: "(checked: boolean) => void",
          en: "Called with the new state on every toggle (not while `readOnly`).",
          ru: "Новое состояние при каждом переключении (кроме `readOnly`).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the track (24×16 … 44×24), the text and the gap.",
          ru: "Ярус дорожки (24×16 … 44×24), текста и отступа.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the label text. Hidden while `error` is shown.",
          ru: "Подсказка под текстом; скрывается, пока показан `error`.",
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
          en: "Danger ring on the off track and `aria-invalid`. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо у выключенной дорожки, `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "No toggling; muted track (on = `accent-soft`), dimmed text and hint.",
          ru: "Без переключения; приглушённая дорожка, текст и подсказка.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          en: "The state is shown and focusable but does not change (`aria-readonly`); no hover or press.",
          ru: "Состояние видно и фокусируется, но не меняется (`aria-readonly`).",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the input (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id input; иначе генерируется. Связывает подпись, подсказку и ошибку.",
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
          en: "`name`, `value`, `required`, `aria-label`, `aria-labelledby`… on the native input.",
          ru: "`name`, `value`, `required`, `aria-label`… на нативном input.",
        },
      ],
    },
    {
      name: "Switch.Label",
      en: "`ref` → `HTMLSpanElement`. The visible text in the text column of the label row. Native `<span>` props.",
      ru: "Видимый текст в колонке текста строки-подписи.",
      props: [],
    },
  ],
  labels: [],
};
