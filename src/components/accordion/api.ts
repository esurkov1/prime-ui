import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Accordion.Root",
      en: "`forwardRef` → `HTMLDivElement`. Owns which items are open; sets the size tier and the layout.",
      ru: "Хранит открытые разделы; задаёт ярус и раскладку.",
      props: [
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          en: "Any number of open items; `value` becomes a `string[]`.",
          ru: "Сколько угодно открытых разделов; `value` становится `string[]`.",
        },
        {
          name: "value",
          type: "string | string[]",
          en: 'Open item (`""` — none), or the list of open items with `multiple` (controlled).',
          ru: 'Открытый раздел (`""` — ни одного) или список открытых при `multiple` (управляемый режим).',
        },
        {
          name: "defaultValue",
          type: "string | string[]",
          en: "Initially open item(s) (uncontrolled).",
          ru: "Изначально открытые разделы (неуправляемый режим).",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void | (value: string[]) => void",
          en: "Called with the new open item, or the new list with `multiple`.",
          ru: "Вызывается с новым открытым разделом или новым списком при `multiple`.",
        },
        {
          name: "collapsible",
          type: "boolean",
          default: "true",
          en: "Without `multiple`: `false` keeps the open item open on a second click.",
          ru: "Без `multiple`: `false` не даёт закрыть открытый раздел повторным кликом.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of trigger height, text, icon and padding.",
          ru: "Ярус высоты заголовка, кегля, иконки и отступов.",
        },
        {
          name: "layout",
          type: '"grouped" | "separate"',
          default: '"grouped"',
          en: "`grouped` — one surface with hairlines between items; `separate` — every item is its own card.",
          ru: "`grouped` — одна поверхность с тонкими линиями между разделами; `separate` — каждый раздел отдельной карточкой.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Accordion.Item`s.",
          ru: "Разделы `Accordion.Item`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Accordion.Item",
      en: '`forwardRef` → `HTMLDivElement`. One section; `data-state="open" | "closed"`.',
      ru: "Один раздел.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Item id used in `value`.",
          ru: "Идентификатор раздела в `value`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "The item cannot be toggled; its trigger is disabled.",
          ru: "Раздел нельзя открыть или закрыть; заголовок неактивен.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Accordion.Header",
      en: "`forwardRef` → `HTMLHeadingElement`. The `<h3>` around the trigger.",
      ru: "Заголовок `<h3>` вокруг кнопки раздела.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "`className` and the other heading attributes.",
          ru: "`className` и остальные атрибуты заголовка.",
        },
      ],
    },
    {
      name: "Accordion.Trigger",
      en: "`forwardRef` → `HTMLButtonElement`. The `<button>` that toggles the item; draws a chevron after its children that turns when open.",
      ru: "Кнопка раздела; после содержимого рисует шеврон, который поворачивается при открытии.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Optional `Accordion.Icon`, then the label.",
          ru: "Необязательная `Accordion.Icon`, затем подпись.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">',
          en: "`onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes.",
          ru: "`onClick` (выполняется первым; `preventDefault()` отменяет переключение), `className` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Accordion.Icon",
      en: "No ref. Decorative leading icon (`aria-hidden`) of the trigger; the content then lines up with the label.",
      ru: "Декоративная иконка перед подписью; содержимое выравнивается по подписи.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="field.calendar" />`.',
          ru: 'Иконка, например `<Icon name="field.calendar" />`.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Accordion.Content",
      en: "`forwardRef` → `HTMLElement`. The `<section>` region; closed content is `inert` and `aria-hidden`. `className` goes to the padded inner block.",
      ru: "Область `<section>`; закрытое содержимое `inert` и `aria-hidden`. `className` попадает на внутренний блок с отступами.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Panel content.",
          ru: "Содержимое раздела.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "Attributes of the `<section>`.",
          ru: "Атрибуты `<section>`.",
        },
      ],
    },
  ],
  labels: [],
};
