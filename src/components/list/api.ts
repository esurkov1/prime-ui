import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { LIST_LABELS } from "./List";

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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Row tier: height, text, icon and avatar size; counts take one tier down. Without it the tier of its host, else `m`.",
          ru: "Ярус строк: высота, кегль, размер иконки и аватара; счётчики — на ярус меньше. Без него — ярус контейнера, иначе `m`.",
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
          en: "Name of the list for screen readers («Обращения»), when no visible heading names it.",
          ru: "Имя списка для скринридеров («Обращения»), если его не называет видимый заголовок.",
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
          ru: "Делает строку ссылкой `<a>` вместо `<button>`; при `disabled` убирается.",
        },
        {
          name: "target",
          type: "string",
          en: "Where the `<a>` opens (`href` only).",
          ru: "Где открывается `<a>` (только с `href`).",
        },
        {
          name: "rel",
          type: "string",
          en: "Relationship of the `<a>` (`href` only).",
          ru: "Отношение ссылки `<a>` (только с `href`).",
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
          en: "`List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions`; loose text becomes the text line.",
          ru: "`List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`, `List.ItemCount`, `List.ItemActions`; просто текст становится основной строкой.",
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
      en: "`ref` → `HTMLSpanElement`. Leading `aria-hidden` slot: an `Avatar.Root` (without its own `size` it takes the row tier), an `Icon` or a colour `Badge.Dot` in an icon-wide box. After the text it is a trailing glyph.",
      ru: "Ведущий слот `aria-hidden`: `Avatar.Root` (без своего `size` берёт ярус строки), `Icon` или цветная `Badge.Dot` в рамке шириной с иконку. После текста — замыкающий значок.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An `Avatar.Root`, an `Icon`, or a `Badge.Dot` with `color` (a stage, a project): the large dot.",
          ru: "`Avatar.Root`, `Icon` или `Badge.Dot` с `color` (этап, проект): крупная точка.",
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
    {
      name: "List.ItemActions",
      en: "`ref` → `HTMLDivElement`. The row's own controls (a `Switch`, a `Dropdown` with its icon `Button`) at its end, beside the row element and never inside it, one tier below the row.",
      ru: "Собственные контролы строки (`Switch`, `Dropdown` с иконочной `Button`) в её конце — рядом с элементом строки, не внутри него, на ярус меньше строки.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the controls, each named on its own), `className` and the other `div` attributes.",
          ru: "`children` (контролы, у каждого своё имя), `className` и остальные атрибуты `div`.",
        },
      ],
    },
  ],
  labels: labelRows(LIST_LABELS, {
    reorderItem: {
      en: "`aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text line.",
      ru: "`aria-label` ручки строки (`onReorder`); `{label}` — текст строки.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus between rows; a disabled row is skipped.",
        ru: "Переводит фокус по строкам; недоступная строка пропускается.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the record; a link row takes Enter only.",
        ru: "Открывает запись; у строки-ссылки — только Enter.",
      },
      {
        keys: "Alt + ↑ · Alt + ↓",
        en: "With `onReorder`, moves the row one place up or down (from its handle or the row).",
        ru: "С `onReorder` переносит строку на место выше или ниже (с ручки или со строки).",
      },
    ],
    aria: [
      {
        en: "`<ul>` named by `aria-label` (or `aria-labelledby` to a visible heading); each row is an `<li>` with a button or link.",
        ru: "Список — `<ul>` с именем из `aria-label` (или `aria-labelledby` на видимый заголовок); каждая строка — `<li>` с кнопкой или ссылкой.",
      },
      {
        en: 'The open record: `aria-current="true"` on a button (a selection inside the screen), `aria-current="page"` on a link (`href`, `asChild`) — the link points at the current URL. A router link may set it itself.',
        ru: 'Открытая запись — `aria-current="true"` на кнопке, `aria-current="page"` на ссылке (`href`, `asChild`).',
      },
      {
        en: "The row's name is its text, description, meta and count, in that order; the leading icon or avatar is `aria-hidden` — the text names the row.",
        ru: "Имя строки складывается из текста, описания, меты и счётчика; ведущая иконка или аватар скрыты (`aria-hidden`).",
      },
      {
        en: "Arrow keys do not move between rows: rows are ordinary Tab stops, as in the Sidebar.",
        ru: "Стрелки не переводят между строками: строки — обычные остановки Tab, как в Sidebar.",
      },
      {
        en: "`List.ItemActions` stand beside the row element, never inside it: the row's name stays its text, and Tab goes from the row to its controls.",
        ru: "`List.ItemActions` стоят рядом с элементом строки, не внутри: имя строки — её текст, Tab ведёт от строки к её контролам.",
      },
      {
        en: "With `onReorder` each row gets a handle named «Переместить {label}» (`labels.reorderItem`, `{label}` is the row's text line) and `aria-keyshortcuts`; the new place is announced politely («Новый лид: позиция 2 из 5»), a row being saved is `aria-busy`.",
        ru: "С `onReorder` у каждой строки ручка «Переместить {label}» (`labels.reorderItem`, `{label}` — текст строки) и `aria-keyshortcuts`; новое место объявляется вежливо («Новый лид: позиция 2 из 5»), сохраняемая строка — `aria-busy`.",
      },
    ],
  },
};
