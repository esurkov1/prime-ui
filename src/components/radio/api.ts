import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Radio.Group",
      en: '`forwardRef` → `HTMLDivElement` (the `role="radiogroup"` element). Owns the value, the shared `name` and size; renders the group label above and the hint / error below the options.',
      ru: "Держит значение, общий `name` и размер; подпись группы сверху, подсказка или ошибка под вариантами.",
      props: [
        {
          name: "value",
          type: "string",
          en: "Controlled value (the `value` of the chosen `Radio.Root`).",
          ru: "Управляемое значение (`value` выбранного `Radio.Root`).",
        },
        {
          name: "defaultValue",
          type: "string",
          en: "Initial value when uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the value of the newly chosen option.",
          ru: "Значение нового выбранного варианта.",
        },
        {
          name: "name",
          type: "string",
          en: "Native `name` shared by the radios; generated when omitted.",
          ru: "Нативный `name` для всех вариантов; иначе генерируется.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of every circle, text, the label and the hint.",
          ru: "Ярус кружков, текста, подписи и подсказки.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading above the options; names the radiogroup through `aria-labelledby`. Without it, pass `aria-label`.",
          ru: "Подпись группы; называет radiogroup через `aria-labelledby`. Без неё — `aria-label`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label, native `required` on the radios and `aria-required` on the group.",
          ru: "Красная `*` после подписи, нативный `required` и `aria-required` на группе.",
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
          en: "Help text under the options. Hidden while `error` is shown.",
          ru: "Подсказка под вариантами; скрывается, пока показан `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message under the options; implies `invalid`.",
          ru: "Текст ошибки под вариантами; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger ring on the unchecked circles and `aria-invalid` on the group and the inputs. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо у невыбранных кружков, `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables every option.",
          ru: "Отключает все варианты.",
        },
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          en: "`vertical` stacks the options; `horizontal` lays them out in a wrapping row. Sets `aria-orientation`.",
          ru: "`vertical` — столбец; `horizontal` — ряд с переносом. Ставит `aria-orientation`.",
        },
        {
          name: "labels",
          type: "Partial<RadioGroupLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the outer field `<div>` (label, options, support row).",
          ru: "Класс на внешнем `<div>` поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir">',
          en: "`id`, `aria-label`, `aria-labelledby`, `aria-describedby` and the other attributes of the radiogroup element.",
          ru: "`id`, `aria-label`, `aria-describedby` и остальные атрибуты radiogroup.",
        },
      ],
    },
    {
      name: "Radio.Root",
      en: "`forwardRef` → `HTMLInputElement` (the native radio). One option inside `Radio.Group`: the `<label>` row with the input and the circle, and its hint; native input props go to the input.",
      ru: "Один вариант внутри `Radio.Group`: строка-`<label>` с input и кружком и его подсказка.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Value reported to the group when this option is chosen.",
          ru: "Значение, которое получает группа при выборе варианта.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Description under the option text, linked through `aria-describedby`.",
          ru: "Описание под текстом варианта, связано через `aria-describedby`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables this option only.",
          ru: "Отключает только этот вариант.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Radio.Label`. Without it only the circle renders — give the root an `aria-label`.",
          ru: "`Radio.Label`. Без него — только кружок; задайте `aria-label`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the option `<div>`.",
          ru: "Класс на `<div>` варианта.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange" | "name" | "value">',
          en: "`id`, `aria-label`, `aria-describedby`, `onBlur`… on the native input.",
          ru: "`id`, `aria-label`, `aria-describedby`… на нативном input.",
        },
      ],
    },
    {
      name: "Radio.Label",
      en: "`ref` → `HTMLSpanElement`. The visible text in the text column of the option row. Native `<span>` props.",
      ru: "Видимый текст варианта в колонке текста.",
      props: [],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the group label when `optional`.",
      ru: "Пометка после подписи группы при `optional`.",
    },
  ],
};
