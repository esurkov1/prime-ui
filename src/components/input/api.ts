import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const side = (en: string, ru: string): ApiProp => ({
  name: "side",
  type: '"start" | "end"',
  required: true,
  en,
  ru,
});

const className = (element: string): ApiProp => ({
  name: "className",
  type: "string",
  en: `Class on the \`${element}\`.`,
  ru: `Класс на \`${element}\`.`,
});

export const api: ComponentApi = {
  parts: [
    {
      name: "Input.Root",
      en: "No ref (renders a `<div>`). Does not forward native props. Size, label, support row and the context for `Wrapper` and `Field`.",
      ru: "Размер, подпись, строка поддержки и контекст для `Wrapper` и `Field`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier for height, padding, radius, text, label and hint. Also provided to nested controls via the control-size context.",
          ru: "Ярус поля: высота, отступы, радиус, кегль поля, подписи и подсказки.",
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
        className("<div>"),
      ],
    },
    {
      name: "Input.Wrapper",
      en: "No ref. The visible field: fill, hover, focus ring, invalid ring.",
      ru: "Видимое поле: заливка, наведение, фокус, ошибка.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Field` and the slots: `Icon`, `Affix`, `InlineAffix`, `Badge`, `ClearButton`.",
          ru: "`Field`, `Icon`, `Affix`, `InlineAffix`, `Badge`, `ClearButton`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the field `<div>`; `data-size` and `data-invalid` come from the root.",
          ru: "Класс поля; `data-size` и `data-invalid` приходят из контекста.",
        },
      ],
    },
    {
      name: "Input.Field",
      en: "`forwardRef` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root.",
      ru: "Нативный `<input>` с id, aria-связями и `aria-invalid` из контекста.",
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
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size">',
          en: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`…",
          ru: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`…",
        },
      ],
    },
    {
      name: "Input.Icon",
      en: "No ref. Decorative icon (`aria-hidden`), centered between the edge and the text.",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An icon; kit icons without an explicit `size` take the field tier.",
          ru: "Иконка; без `size` берёт ярус поля.",
        },
        className("<span>"),
      ],
    },
    {
      name: "Input.Affix",
      en: "No ref. Tinted section flush with the edge (`aria-hidden`); the wrapper drops its padding there.",
      props: [
        side("Edge the section sits on.", "Край, к которому прилегает секция с подложкой."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Static text: protocol, domain, country code.",
          ru: "Постоянный текст: протокол, домен, код страны.",
        },
        className("<div>"),
      ],
    },
    {
      name: "Input.InlineAffix",
      en: "No ref. Muted unit next to the value (`aria-hidden`).",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Short unit: `₽`, `%`, `кг`.",
          ru: "Короткая единица: `₽`, `%`, `кг`.",
        },
        className("<span>"),
      ],
    },
    {
      name: "Input.Badge",
      en: "No ref. Soft palette badge one tier below the field, at the trailing edge.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Palette hue of the soft badge.",
          ru: "Цвет палитры мягкого бейджа.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Short status text.",
          ru: "Короткий статус: «Проверен», «Новое».",
        },
        className("<span>"),
      ],
    },
    {
      name: "Input.ClearButton",
      en: "`forwardRef` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.",
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
    {
      name: "Input.Counter",
      en: "No ref. Character counter for the support row; shows `14/40` and announces `labels.counter`.",
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
        className("<span>"),
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
    {
      key: "counter",
      default: "{current} из {max} символов",
      en: "Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Input.Counter`; `{current}` и `{max}` подставляются.",
    },
  ],
};
