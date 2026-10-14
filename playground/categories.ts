/**
 * Sidebar categories of the playground, one per task the user has (the same axis as
 * `SKILL/choosing.md`), no overlaps. A component's category is `page.category` in its section; its
 * `COMPONENT.md` declares the same id (`**Category:**`), checked by the docs contract. `en` and
 * `summary` head the category in the generated component indexes (README, `SKILL/components.md`).
 */
export const PLAYGROUND_NAV_CATEGORIES = [
  {
    id: "foundations",
    label: "Основа",
    en: "Foundations",
    summary: "Text roles and icons.",
  },
  { id: "actions", label: "Действия", en: "Actions", summary: "Trigger an action." },
  {
    id: "inputs",
    label: "Ввод",
    en: "Inputs",
    summary: "Type a value, and the field anatomy: label, hint, error.",
  },
  {
    id: "selection",
    label: "Выбор",
    en: "Selection",
    summary: "Pick from options: toggles, lists, ranges, filters, dates, colors.",
  },
  {
    id: "data-display",
    label: "Данные",
    en: "Data display",
    summary:
      "Show data: labels, people, objects, cards, tables, boards, feeds, code, disclosed sections.",
  },
  {
    id: "messages",
    label: "Сообщения",
    en: "Messages",
    summary: "A conversation: message bubbles of every kind and the composer.",
  },
  {
    id: "status",
    label: "Статус и загрузка",
    en: "Status and loading",
    summary:
      "Say what happens: system messages, progress, loading placeholders, state swaps, empty states.",
  },
  {
    id: "navigation",
    label: "Навигация",
    en: "Navigation",
    summary:
      "Move between places: app navigation (side rail, bottom bar on phones), tabs, the records of a list, the path, pages, steps.",
  },
  {
    id: "overlays",
    label: "Оверлеи",
    en: "Overlays",
    summary: "Floating layers above the page, from tooltip to modal.",
  },
  {
    id: "page",
    label: "Страница",
    en: "Page",
    summary:
      "The frame and structure of a screen: app shell, app header, page column, page panel, separators, scroll regions, and ready-made screen blocks (sign-in).",
  },
  {
    id: "interaction",
    label: "Взаимодействие",
    en: "Interaction",
    summary: "Direct manipulation: drag and drop (Kanban builds a board on it).",
  },
  {
    id: "infrastructure",
    label: "Инфраструктура",
    en: "Infrastructure",
    summary: "Docs tooling, not product UI.",
  },
] as const;

export type PlaygroundCategoryId = (typeof PLAYGROUND_NAV_CATEGORIES)[number]["id"];

export type PlaygroundCategoryMeta = (typeof PLAYGROUND_NAV_CATEGORIES)[number];
