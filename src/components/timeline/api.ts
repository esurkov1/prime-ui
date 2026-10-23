import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BADGE_GROUP_LABELS } from "../badge/Badge";

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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76 px, dot column → text 8 · 12 · 16 · 16 · 20 px. Without it the tier of its host, else `m`.",
          ru: "Текст, точка и ритм строк: высота 40 · 52 · 64 · 68 · 76 px, от колонки точки до текста 8 · 12 · 16 · 16 · 20 px. Без него — ярус контейнера, иначе `m`.",
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
      en: "`ref` → the row element. An `<li>` with a row: `<div>`, `<button>` (`onClick`), `<a>` (`href`) or your element (`asChild`); the dot is prepended. The row is the kit's list row: hover, press, keyboard focus and `aria-current` are its fills.",
      ru: "`<li>` со строкой: `<div>`, `<button>` (`onClick`), `<a>` (`href`) или свой элемент (`asChild`); точка добавляется в начало. Строка — строка списка кита: наведение, нажатие, фокус с клавиатуры и `aria-current` — её заливки.",
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
      en: "`ref` → `HTMLSpanElement`. `<span>` lines, one line each, cut with an ellipsis: the event (medium) and the muted secondary line, tabular; a `StatusDot` first states the state. Inside `Timeline.ItemValue` the meta is the value's second line.",
      ru: "Строки `<span>`, каждая одна, с обрезкой: событие (medium) и приглушённая вторая строка, табличные цифры; `StatusDot` первым называет состояние. Внутри `Timeline.ItemValue` мета — вторая строка значения.",
      props: textProps("The text of the line.", "Текст строки."),
    },
    {
      name: "Timeline.ItemBadges",
      en: "`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the event, the meaning in its `tone` or `color`. The title gives way first; what does not fit folds into «+N».",
      ru: "`Badge.Group` после названия, на его строке: все бейджи события, смысл — в `tone` или `color`. Название уступает первым, что не влезло — «+N».",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The `Badge.Root`s of the event (a status, a kind).",
          ru: "`Badge.Root` события (статус, вид).",
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
  labels: labelRows(BADGE_GROUP_LABELS, {
    more: {
      en: "Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many.",
      ru: "Видимый текст бейджа «+N» для не поместившихся бейджей; `{count}` — сколько их.",
      part: "Timeline.ItemBadges",
    },
    moreCount: {
      en: "What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip.",
      ru: "Что читают ассистивные технологии вместо видимого текста этого бейджа; `{count}` — сколько. Сами значения — в его подсказке.",
      part: "Timeline.ItemBadges",
    },
  }),
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
        en: 'Each group is an `<ol role="list">` labelled by its heading (`aria-labelledby`); events are `<li>`. The role keeps the list semantics that WebKit drops under `list-style: none`.',
        ru: 'Каждая группа — `<ol role="list">` с именем из заголовка (`aria-labelledby`); события — `<li>`. Роль сохраняет семантику списка, которую WebKit теряет при `list-style: none`.',
      },
      {
        en: "The dot is `aria-hidden`: put the status into the title or meta, not only the dot color.",
        ru: "Точка скрыта (`aria-hidden`): статус пишите в заголовке или мете, а не только цветом.",
      },
    ],
  },
};
