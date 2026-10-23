import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BADGE_GROUP_LABELS } from "../badge/Badge";

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
      en: "`ref` → `HTMLButtonElement`. The `<button>` that toggles the item, a header row: `Accordion.Icon`, the title with `Accordion.Badges`, the `Accordion.Description` under it, the chevron at the end that turns when open. Nothing wraps.",
      ru: "Кнопка `<button>` раздела, устроена как строка заголовка: метка (`Accordion.Icon`), название с `Accordion.Badges` на одной строке, `Accordion.Description` под ним и шеврон в конце, который поворачивается при открытии. Каждая — одна строка, ничего не переносится.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Optional `Accordion.Icon`, `Accordion.Badges` and `Accordion.Description` (in any order); the rest is the title.",
          ru: "Необязательные `Accordion.Icon`, `Accordion.Badges` и `Accordion.Description` (в любом порядке); остальное — название.",
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
      name: "Accordion.Badges",
      en: "`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the section, the meaning in its `tone` or `color`. The title gives way first; what does not fit folds into «+N».",
      ru: "`Badge.Group` после названия, на его строке: все бейджи раздела, смысл — в `tone` или `color`. Название уступает первым, что не влезло — «+N».",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The `Badge.Root`s of the section (a status, a count).",
          ru: "`Badge.Root` раздела (статус, число).",
        },
        {
          name: "labels",
          type: "Partial<BadgeGroupLabels>",
          en: "Built-in strings of the «+N» badge, see the `Badge.Group` labels.",
          ru: "Системные строки бейджа «+N», см. подписи `Badge.Group`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other `div` attributes.",
          ru: "`className` и остальные атрибуты `div`.",
        },
      ],
    },
    {
      name: "Accordion.Description",
      en: "`ref` → `HTMLSpanElement`. The line under the title: plain text with new data only, one line cut with an ellipsis; 12/16 · 13/20 · 14/20 by size. A `StatusDot` first states the section's state, and a «·» is put after it by itself.",
      ru: "Строка под названием: простой текст только с новыми данными, одна строка с обрезкой; 12/16 · 13/20 · 14/20 по размеру. `StatusDot` первым называет состояние раздела, «·» после него ставится сам.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The text, with an optional `StatusDot` first.",
          ru: "Текст, первым может идти `StatusDot`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
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
  labels: labelRows(BADGE_GROUP_LABELS, {
    more: {
      en: "Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many.",
      ru: "Видимый текст бейджа «+N» для не поместившихся бейджей; `{count}` — сколько их.",
      part: "Accordion.Badges",
    },
    moreCount: {
      en: "What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip.",
      ru: "Что читают ассистивные технологии вместо видимого текста этого бейджа; `{count}` — сколько. Сами значения — в его подсказке.",
      part: "Accordion.Badges",
    },
  }),
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
