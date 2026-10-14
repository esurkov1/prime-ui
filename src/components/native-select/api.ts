import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { NATIVE_SELECT_LABELS } from "./NativeSelect";

export const api: ComponentApi = {
  parts: [
    {
      name: "NativeSelect",
      en: "`ref` → `HTMLSelectElement`. The system `<select>` in the field look with the label row and the support row; the kit chevron over its end.",
      ru: "Системный `<select>` в виде поля со строкой подписи и строкой поддержки; шеврон кита поверх его конца.",
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
          ru: '`false` скрывает кольцо фокуса, но не фокус и не кольцо ошибки. Атрибут — `data-focus-ring="false"`.',
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
  labels: labelRows(NATIVE_SELECT_LABELS, {
    optional: {
      en: "Muted marker after the label when `optional`.",
      ru: "Приглушённая пометка после подписи при `optional`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space · ArrowDown",
        native: true,
        en: "Open the system list (browser and OS behaviour).",
        ru: "Открывают системный список (поведение браузера и ОС).",
      },
      {
        keys: "ArrowUp · ArrowDown",
        native: true,
        en: "On the closed field change the value (in most browsers).",
        ru: "На закрытом поле меняют значение (в большинстве браузеров).",
      },
    ],
    aria: [
      {
        en: "It is a real `<select>`: the role, the keyboard and the list come from the browser and the OS.",
        ru: "Это настоящий `<select>`: роль, клавиатура и список — от браузера и ОС.",
      },
      {
        en: "`label` is a `<label htmlFor>`; the hint and the error are linked by `aria-describedby`, the error sets `aria-invalid`.",
        ru: "`label` — `<label htmlFor>`; подсказка и ошибка связаны через `aria-describedby`, ошибка ставит `aria-invalid`.",
      },
      {
        en: "The chevron is decorative (`aria-hidden`).",
        ru: "Шеврон декоративен (`aria-hidden`).",
      },
    ],
  },
};
