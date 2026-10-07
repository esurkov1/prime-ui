import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Textarea.Root",
      en: "`forwardRef` → `HTMLTextAreaElement`. Renders the label row, the field box with the native `<textarea>` and the support row; native `<textarea>` props go to the textarea.",
      ru: "Подпись, поле с нативным `<textarea>` и строка поддержки; нативные пропсы уходят в `<textarea>`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier for text, padding, radius, label and hint. One line of text sits exactly like an Input of the same size.",
          ru: "Ярус: кегль, отступы, радиус, подпись и подсказка. Одна строка стоит как Input того же яруса.",
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
          ru: "Ошибка без текста: красное кольцо, `aria-invalid`, `data-invalid`.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on the field box (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: "`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются.",
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
          en: "Height follows the content (minimum three lines, no scrollbar, no resize handle). `false` → fixed height (three lines or `rows`) with native vertical resize.",
          ru: "Высота следует за текстом (минимум три строки). `false` — фиксированная высота (три строки или `rows`) и нативный resize.",
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
          ru: "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids.",
          ru: "Добавляется перед id подсказки и ошибки.",
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
          en: "Class on the visible field box (not on the outer wrapper).",
          ru: "Класс на видимом поле, не на внешней обёртке.",
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
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    {
      key: "counter",
      default: "{current} из {max} символов",
      en: "Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Textarea.Counter`; `{current}` и `{max}` подставляются.",
    },
  ],
};
