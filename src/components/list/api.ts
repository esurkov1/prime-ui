import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "List.Root",
      en: "`ref` → `HTMLUListElement`. `<ul>` of selectable rows: the master half of a list + detail screen; sets the row tier for its items and their parts.",
      ru: "`<ul>` выбираемых строк — список в связке «список + карточка»; задаёт ярус строк и их частей.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Row tier: height, text, icon and avatar size; counts take one tier down.",
          ru: "Ярус строк: высота, кегль, размер иконки и аватара; счётчики — на ярус меньше.",
        },
        {
          name: "onReorder",
          type: "(id: string, beforeId: string | null) => void | Promise<void>",
          en: "Rows reorder by a leading handle (drag, touch hold, Alt + ↑ / ↓): item `value` `id` goes before `beforeId` (`null` = last). Apply with `moveBefore`; a returned promise keeps the row busy, a rejection moves it back.",
          ru: "Перестановка за ведущую ручку (перетаскивание, удержание, Alt + ↑ / ↓): строка `id` (`value`) встаёт перед `beforeId` (`null` — в конец). Применяйте через `moveBefore`; промис держит строку занятой, отказ возвращает её.",
        },
        {
          name: "labels",
          type: "Partial<ListLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Name of the list for screen readers («Диалоги»), when no visible heading names it.",
          ru: "Имя списка для скринридеров («Диалоги»), если его не называет видимый заголовок.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`List.Item`s.",
          ru: "`List.Item`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLUListElement>",
          en: "`className` and the other `ul` attributes.",
          ru: "`className` и остальные атрибуты `ul`.",
        },
      ],
    },
    {
      name: "List.Item",
      en: "`ref` → `HTMLElement` (the `<button>`, `<a>` or `asChild` element, not the `<li>`). `<li>` holding a full-width row: a button, a link (`href`) or your router link (`asChild`).",
      ru: "`<li>` со строкой во всю ширину: кнопка, ссылка (`href`) или ссылка роутера (`asChild`).",
      props: [
        {
          name: "value",
          type: "string",
          en: "Stable id of the row; required in a reorderable list (`onReorder` reports it).",
          ru: "Стабильный id строки; обязателен в переставляемом списке (его сообщает `onReorder`).",
        },
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'The open record: the selected fill and `aria-current` — `"true"` on a button, `"page"` on a link.',
          ru: 'Открытая запись: заливка выбранного и `aria-current` — `"true"` на кнопке, `"page"` на ссылке.',
        },
        {
          name: "onClick",
          type: "(event: MouseEvent<HTMLButtonElement>) => void",
          en: "Opens the record; not called while `disabled`.",
          ru: "Открывает запись; при `disabled` не вызывается.",
        },
        {
          name: "href",
          type: "string",
          en: "Renders an `<a>` instead of a `<button>`; dropped while `disabled`.",
          ru: "Делает строку ссылкой `<a>`; при `disabled` убирается.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the single child (a router link) as the row; its children are the content.",
          ru: "Отрисовывает единственного ребёнка (ссылку роутера) строкой; его дети — содержимое.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Muted and out of the Tab order: a disabled button, or `aria-disabled` and no navigation on a link.",
          ru: "Приглушена и вне порядка Tab: недоступная кнопка или `aria-disabled` без перехода у ссылки.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`; loose text becomes the text line.",
          ru: "`List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`; просто текст становится основной строкой.",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`className` and native attributes of the row element (`target`, `rel` on a link).",
          ru: "`className` и нативные атрибуты элемента строки (`target`, `rel` у ссылки).",
        },
      ],
    },
    {
      name: "List.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. Leading `aria-hidden` slot: an `Avatar.Root` sized to the tier, or an `Icon`. After the text it is a trailing glyph.",
      ru: "Ведущий слот `aria-hidden`: `Avatar.Root` под ярус строки или `Icon`. После текста — замыкающий значок.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An `Avatar.Root` or an `Icon`.",
          ru: "`Avatar.Root` или `Icon`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other `span` attributes.",
          ru: "`className` и остальные атрибуты `span`.",
        },
      ],
    },
    {
      name: "List.ItemText",
      en: "`ref` → `HTMLSpanElement`. The primary line: medium weight, one line, truncated with an ellipsis.",
      ru: "Основная строка: средняя насыщенность, одна строка, обрезается многоточием.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className`, `title` (full text when truncated) and the other `span` attributes.",
          ru: "`className`, `title` (полный текст при обрезке) и остальные атрибуты `span`.",
        },
      ],
    },
    {
      name: "List.ItemDescription",
      en: "`ref` → `HTMLSpanElement`. The second line (a preview, a status): muted, smaller, truncated.",
      ru: "Вторая строка (превью, статус): приглушённая, мельче, обрезается.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other `span` attributes.",
          ru: "`className` и остальные атрибуты `span`.",
        },
      ],
    },
    {
      name: "List.ItemMeta",
      en: "`ref` → `HTMLSpanElement`. Small muted text at the end of the row (a time, a date, an amount); on top beside two lines.",
      ru: "Мелкий приглушённый текст в конце строки (время, дата, сумма); сверху, если строк две.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className` and the other `span` attributes.",
          ru: "`className` и остальные атрибуты `span`.",
        },
      ],
    },
    {
      name: "List.ItemCount",
      en: "`ref` → `HTMLSpanElement` (the Badge). A soft `Badge` one tier below the rows at the end of the row; below the meta beside two lines.",
      ru: "Мягкий `Badge` на ярус меньше строк в конце строки; под метой, если строк две.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Badge hue; a hue for what needs attention (unread).",
          ru: "Оттенок бейджа; цветной — для того, что требует внимания (непрочитанное).",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number or a short status.",
          ru: "Число или короткий статус.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">',
          en: "`className` and the other `span` attributes.",
          ru: "`className` и остальные атрибуты `span`.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "reorderItem",
      default: "Переместить {label}",
      en: "`aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text line.",
      ru: "`aria-label` ручки строки (`onReorder`); `{label}` — текст строки.",
    },
  ],
};
