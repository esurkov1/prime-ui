import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const TONE = '"neutral" | "accent" | "success" | "warning" | "danger" | "info"';

const CLASS_NAME: ApiProp = {
  name: "className",
  type: "string",
  en: "Class on the element.",
  ru: "Класс на элементе.",
};

/** The rows of a text part: its required text, the class and the native span attributes. */
const textProps = (en: string, ru: string): ApiProp[] => [
  { name: "children", type: "ReactNode", required: true, en, ru },
  CLASS_NAME,
  {
    name: "…rest",
    type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
    en: "The other span attributes.",
    ru: "Остальные атрибуты span.",
  },
];

const spanRest: ApiProp = {
  name: "…rest",
  type: "HTMLAttributes<HTMLSpanElement>",
  en: "`children`, `className` and the other span attributes.",
  ru: "`children`, `className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Timeline.Root",
      en: "`ref` → `HTMLDivElement`. A size container that sets the tier for every group and row.",
      ru: "Контейнер размера: задаёт ярус всем группам и строкам.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76 px, dot column → text 8 · 12 · 16 · 16 · 20 px.",
          ru: "Текст, точка и ритм строк: высота 40 · 52 · 64 · 68 · 76 px, от колонки точки до текста 8 · 12 · 16 · 16 · 20 px.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The `Timeline.Group`s.",
          ru: "Группы `Timeline.Group`.",
        },
        CLASS_NAME,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "The other div attributes.",
          ru: "Остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Timeline.Group",
      en: "`ref` → `HTMLOListElement`. A labelled `<ol>` of events; the line runs from its first dot to its last.",
      ru: "Подписанный `<ol>` событий; линия идёт от первой точки к последней.",
      props: [
        {
          name: "label",
          type: "ReactNode",
          en: "Group heading («Недавно»); names the list via `aria-labelledby`.",
          ru: "Заголовок группы («Недавно»); называет список через `aria-labelledby`.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Timeline.Item` and `Timeline.Gap` rows.",
          ru: "Строки `Timeline.Item` и `Timeline.Gap`.",
        },
        CLASS_NAME,
        {
          name: "…rest",
          type: 'Omit<OlHTMLAttributes<HTMLOListElement>, "children">',
          en: "The other ol attributes.",
          ru: "Остальные атрибуты ol.",
        },
      ],
    },
    {
      name: "Timeline.Item",
      en: "`ref` → the row element. An `<li>` with a row: `<div>`, `<button>` (`onClick`), `<a>` (`href`) or your element (`asChild`); the dot is prepended. The row under the pointer or keyboard focus is highlighted (pill, accent title and dot); an interactive row gives under the press and has the touch row height.",
      ru: "`<li>` со строкой: `<div>`, `<button>` (`onClick`), `<a>` (`href`) или свой элемент (`asChild`); точка добавляется в начало. Строка под курсором или в фокусе выделяется (плашка, акцентные заголовок и точка); интерактивная строка поддаётся при нажатии и не ниже сенсорной строки.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"blue"',
          en: "Decorative dot hue for categories, at reduced emphasis.",
          ru: "Декоративный оттенок точки для категорий, приглушённый.",
        },
        {
          name: "tone",
          type: TONE,
          en: "Status dot color at full emphasis; wins over `color`.",
          ru: "Цвет точки по статусу, в полную силу; важнее `color`.",
        },
        {
          name: "onClick",
          type: "MouseEventHandler<HTMLElement>",
          en: "Renders the row as a `<button>`.",
          ru: "Строка становится `<button>`.",
        },
        {
          name: "href",
          type: "string",
          en: "Renders the row as a link (with `target`, `rel`, `download`).",
          ru: "Строка становится ссылкой (с `target`, `rel`, `download`).",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the row as the single child element (a router link).",
          ru: "Строкой становится единственный дочерний элемент (ссылка роутера).",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Timeline.ItemTitle`, `Timeline.ItemMeta`, `Timeline.ItemValue`.",
          ru: "`Timeline.ItemTitle`, `Timeline.ItemMeta`, `Timeline.ItemValue`.",
        },
        CLASS_NAME,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "children" | "color" | "onClick">',
          en: "The other row attributes (`target`, `rel`, `download` with `href`).",
          ru: "Остальные атрибуты строки (`target`, `rel`, `download` при `href`).",
        },
      ],
    },
    {
      name: "Timeline.ItemTitle · Timeline.ItemMeta",
      en: "`ref` → `HTMLSpanElement`. `<span>` lines: the event (medium, accent on the highlighted row, wraps) and the muted secondary line with tabular numbers — under the title the date (emphasize a part with `<strong>`), inside `Timeline.ItemValue` the value's second line.",
      ru: "Строки `<span>`: событие (medium, акцент на выделенной строке, переносится) и приглушённая вторая строка с табличными цифрами — под заголовком дата (часть выделяет `<strong>`), внутри `Timeline.ItemValue` вторая строка значения.",
      props: textProps("The text of the line.", "Текст строки."),
    },
    {
      name: "Timeline.ItemValue",
      en: "`ref` → `HTMLSpanElement`. A `<span>` with the trailing amount (right-aligned, tabular), a `Timeline.ItemMeta` inside under it. Moves under the meta below 20rem.",
      ru: "`<span>` с суммой справа (по правому краю, табличные цифры), `Timeline.ItemMeta` внутри — под ней. Уже 20rem уходит под мету.",
      props: [
        {
          name: "tone",
          type: TONE,
          default: '"neutral"',
          en: "Text color (income `success`, refund `danger`).",
          ru: "Цвет текста (доход `success`, возврат `danger`).",
        },
        ...textProps("The amount.", "Сумма."),
      ],
    },
    {
      name: "Timeline.Gap",
      en: "`ref` → `HTMLDivElement`. An `<li>` interval between events: a shorter row with a hollow dot on a dashed segment and a muted caption.",
      ru: "`<li>`-промежуток между событиями: короткая строка с полой точкой на пунктире и приглушённой подписью.",
      props: [
        {
          name: "tone",
          type: TONE,
          default: '"neutral"',
          en: "Caption and dot color; `warning` / `danger` flag a long interval.",
          ru: "Цвет подписи и точки; `warning` / `danger` отмечают долгий промежуток.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The interval caption and an optional `Timeline.Description`.",
          ru: "Подпись промежутка и необязательный `Timeline.Description`.",
        },
        CLASS_NAME,
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "The other div attributes.",
          ru: "Остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Timeline.Description",
      en: "`ref` → `HTMLSpanElement`. The secondary caption of a gap, at its end («сейчас»), in the gap tone.",
      ru: "Вторая подпись промежутка, в его конце («сейчас»), в тоне промежутка.",
      props: [spanRest],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Interactive rows are one Tab stop each; the focus ring is drawn inside the row.",
        ru: "Интерактивные строки — по одной точке табуляции; кольцо фокуса внутри строки.",
      },
      {
        keys: "Enter · Space",
        en: "Activates a button row; Enter opens a link row.",
        ru: "Активирует строку-кнопку; Enter открывает строку-ссылку.",
      },
    ],
    aria: [
      {
        en: "Each group is an `<ol>` labelled by its heading (`aria-labelledby`); events are `<li>`.",
        ru: "Каждая группа — `<ol>` с именем из заголовка (`aria-labelledby`); события — `<li>`.",
      },
      {
        en: "The dot is `aria-hidden`: put the status into the title or meta, not only the dot color.",
        ru: "Точка скрыта (`aria-hidden`): статус пишите в заголовке или мете, а не только цветом.",
      },
    ],
  },
};
