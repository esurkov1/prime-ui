import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const TONE = '"neutral" | "accent" | "success" | "warning" | "danger" | "info"';

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
          en: "Text, dot and row rhythm: rows 40 · 52 · 64 · 68 · 76 px.",
          ru: "Текст, точка и ритм строк: высота 40 · 52 · 64 · 68 · 76 px.",
        },
        {
          name: "highlight",
          type: '"current" | "hover"',
          default: '"current"',
          en: "Who gets the highlighted look (pill, accent title and dot): the `current` row, or the row under the pointer / keyboard focus.",
          ru: "Кто получает выделение (плашка, акцентные заголовок и точка): строка `current` или строка под курсором / в фокусе.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`children` (`Timeline.Group`), `className` and the other div attributes.",
          ru: "`children` (`Timeline.Group`), `className` и остальные атрибуты div.",
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
          name: "…rest",
          type: 'Omit<OlHTMLAttributes<HTMLOListElement>, "children">',
          en: "`children` (`Timeline.Item`, `Timeline.Gap`), `className` and the other ol attributes.",
          ru: "`children` (`Timeline.Item`, `Timeline.Gap`), `className` и остальные атрибуты ol.",
        },
      ],
    },
    {
      name: "Timeline.Item",
      en: "`ref` → the row element. An `<li>` with a row: `<div>`, `<button>` (`onClick`), `<a>` (`href`) or your element (`asChild`); the dot is prepended.",
      ru: "`<li>` со строкой: `<div>`, `<button>` (`onClick`), `<a>` (`href`) или свой элемент (`asChild`); точка добавляется в начало.",
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
          name: "current",
          type: "boolean",
          default: "false",
          en: 'The current row (open detail, latest event): `aria-current`, `data-state="active"`; highlighted in `highlight="current"`.',
          ru: 'Текущая строка (открытая деталь, последнее событие): `aria-current`, `data-state="active"`; выделена при `highlight="current"`.',
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
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "children" | "color" | "onClick">',
          en: "`children` (Title, Meta, Value), `className` and the other row attributes.",
          ru: "`children` (Title, Meta, Value), `className` и остальные атрибуты строки.",
        },
      ],
    },
    {
      name: "Timeline.Title · Timeline.Meta · Timeline.MetaPrimary",
      en: "`ref` → `HTMLSpanElement`. `<span>` lines: the event (medium, accent on the highlighted row, wraps), the muted date line with tabular numbers, and its emphasized part.",
      ru: "Строки `<span>`: событие (medium, акцент на выделенной строке, переносится), приглушённая строка даты и её выделенная часть.",
      props: [spanRest],
    },
    {
      name: "Timeline.Value · Timeline.ValueMeta",
      en: "`ref` → `HTMLSpanElement`. `<span>`: the trailing amount (right-aligned, tabular) and a muted second line under it. Moves under the meta below 20rem.",
      ru: "`<span>`: сумма справа (по правому краю, табличные цифры) и приглушённая строка под ней. Уже 20rem уходит под мету.",
      props: [
        {
          name: "tone",
          type: TONE,
          default: '"neutral"',
          en: "Value: text color (income `success`, refund `danger`).",
          ru: "Value: цвет текста (доход `success`, возврат `danger`).",
        },
        spanRest,
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
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`children` (the interval caption and an optional `Timeline.GapMeta`), `className` and the other div attributes.",
          ru: "`children` (подпись промежутка и необязательный `Timeline.GapMeta`), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Timeline.GapMeta",
      en: "`ref` → `HTMLSpanElement`. A caption on the right of the gap («сейчас»), in the gap tone.",
      ru: "Подпись справа у промежутка («сейчас»), в тоне промежутка.",
      props: [spanRest],
    },
  ],
  labels: [],
};
