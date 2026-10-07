import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "NativeSelect",
      en: "`ref` → `HTMLSelectElement`. The system `<select>` in the field look with the label row and the support row; the kit chevron over its end. + native `<select>` props except `size` and `multiple`.",
      ru: "Системный `<select>` в виде поля: подпись, поле, строка поддержки.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above; a `<label htmlFor>` of the select.",
          ru: "Подпись над полем; настоящий `<label htmlFor>`.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Support text under the field; linked by `aria-describedby`.",
          ru: "Подсказка под полем; связана через `aria-describedby`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message; replaces the hint and implies `invalid`.",
          ru: "Ошибка; заменяет подсказку и включает `invalid`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label and native `required`.",
          ru: "Красная `*` после подписи и нативный `required`.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted `labels.optional` after the label.",
          ru: "Приглушённое `labels.optional` после подписи.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring and `aria-invalid`.",
          ru: "Красное внутреннее кольцо и `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled field fill and text.",
          ru: "Неактивная заливка и текст.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Field tier: height, padding, text; the label and the hint follow it.",
          ru: "Ярус поля: высота, отступы, текст; подпись и подсказка следуют ему.",
        },
        {
          name: "placeholder",
          type: "string",
          en: "Empty first option shown in the placeholder color while nothing is picked.",
          ru: "Пустой первый пункт цвета плейсхолдера, пока ничего не выбрано.",
        },
        {
          name: "value",
          type: "string",
          en: "Controlled value (native); with `onValueChange` or `onChange`.",
          ru: "Управляемое значение (нативное); вместе с `onValueChange` или `onChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          en: "Initial value, uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the picked value; native `onChange` still fires.",
          ru: "Вызывается с выбранным значением; нативный `onChange` тоже срабатывает.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring.',
          ru: "`false` скрывает кольцо фокуса, но не фокус и не кольцо ошибки.",
        },
        {
          name: "labels",
          type: "Partial<NativeSelectLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Native `<option>` and `<optgroup>` elements.",
          ru: "Нативные `<option>` и `<optgroup>`.",
        },
        {
          name: "…rest",
          type: 'Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple">',
          en: "`id`, `name`, `onChange`, `aria-*`, `className` (on the field wrapper) and the other select attributes.",
          ru: "`id`, `name`, `onChange`, `aria-*`, `className` (на обёртке поля) и остальные атрибуты select.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Muted marker after the label when `optional`.",
      ru: "Приглушённая пометка после подписи при `optional`.",
    },
  ],
};
