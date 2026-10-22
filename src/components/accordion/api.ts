import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Accordion.Root",
      en: "`ref` → `HTMLDivElement`. Owns which items are open; sets the size tier and the layout.",
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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of trigger height, text, icon and padding. Without it the tier of its host, else `m`.",
          ru: "Ярус высоты заголовка, кегля, иконки и отступов. Без него — ярус хоста, иначе `m`.",
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
      en: '`ref` → `HTMLDivElement`. One section; `data-state="open" | "closed"`.',
      ru: 'Один раздел; `data-state="open" | "closed"`.',
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
      en: "`ref` → `HTMLHeadingElement`. The heading around the trigger (`<h3>` unless `as` says otherwise).",
      ru: "Заголовок вокруг кнопки раздела (`<h3>`, если `as` не задаёт другой уровень).",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4" | "h5" | "h6"',
          default: '"h3"',
          en: "Heading level in the page outline: one below the heading of the section that holds the accordion.",
          ru: "Уровень заголовка в структуре страницы: на ступень ниже заголовка раздела, где стоит аккордеон.",
        },
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
      en: "`ref` → `HTMLButtonElement`. The `<button>` that toggles the item; draws a chevron after its children that turns when open.",
      ru: "Кнопка `<button>` раздела; после содержимого рисует шеврон, который поворачивается при открытии.",
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
      en: "`ref` → `HTMLSpanElement`. Decorative leading icon (`aria-hidden`) of the trigger; the content then lines up with the label.",
      ru: "Декоративная иконка (`aria-hidden`) перед подписью; содержимое выравнивается по подписи.",
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
      en: "`ref` → `HTMLElement`. The `<section>` region; closed content is out of the tab order and the accessibility tree but found by find in page, which opens its item. `className` goes to the padded inner block.",
      ru: "Область `<section>`; закрытое содержимое вне порядка Tab и дерева доступности, но находится поиском по странице, который раскрывает его раздел. `className` попадает на внутренний блок с отступами.",
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
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus between triggers; a disabled one is skipped.",
        ru: "Переводит фокус между заголовками разделов; неактивный пропускается.",
      },
      {
        keys: "Enter · Space",
        en: "Opens or closes the section.",
        ru: "Открывает или закрывает раздел.",
      },
    ],
    aria: [
      {
        en: "The trigger is a native `<button>` inside a heading (`<h3>`, or the level of `as`) with `aria-expanded` and `aria-controls`.",
        ru: "Заголовок — нативная `<button>` внутри заголовка (`<h3>` или уровень из `as`) с `aria-expanded` и `aria-controls`.",
      },
      {
        en: 'The panel is a `<section>` with `aria-labelledby`; closed content is `inert` while it closes, then `hidden="until-found"`: out of the tab order and the accessibility tree, yet find in page reaches it and opens the item at once.',
        ru: 'Содержимое — `<section>` с `aria-labelledby`; закрытое — `inert`, пока закрывается, затем `hidden="until-found"`: вне порядка Tab и дерева доступности, но поиск по странице его находит и сразу раскрывает раздел.',
      },
      {
        en: "The chevron and `Accordion.Icon` are `aria-hidden`.",
        ru: "Шеврон и `Accordion.Icon` скрыты (`aria-hidden`).",
      },
    ],
  },
};
