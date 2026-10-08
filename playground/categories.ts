/**
 * Sidebar categories of the playground, one per task the user has (the same axis as
 * `SKILL/choosing.md`), no overlaps. A component's category is `page.category` in its section; its
 * `COMPONENT.md` declares the same id (`**Category:**`), checked by the docs contract.
 *
 * - **foundations** — tokens: color, typography, spacing, size tiers, radius, elevation, motion, focus.
 * - **actions** — trigger an action (buttons, link button).
 * - **inputs** — type a value, and the field anatomy (input, textarea, code, upload, label, hint).
 * - **selection** — pick from options (toggles, lists, slider, filters, date and color pickers).
 * - **data-display** — show data: labels, people, objects, cards, tables, boards, events, code,
 *   disclosed sections.
 * - **status** — say what happens: messages, progress, loading placeholders, state swaps, empty states.
 * - **navigation** — move between places: app navigation (sidebar, bottom bar), tabs, path, pages,
 *   steps.
 * - **overlays** — something on top of the page, from tooltip to modal surfaces.
 * - **page** — the frame and structure of a screen: app shell, page column, page panel, dividers,
 *   scroll regions.
 * - **interaction** — direct manipulation: drag and drop.
 * - **composition** — whole screens built from the kit (`SKILL/patterns/`), the rules behind them,
 *   and ready-made screen blocks (LoginForm).
 * - **infrastructure** — demo tooling, not product UI.
 */
export const PLAYGROUND_NAV_CATEGORIES = [
  { id: "foundations", label: "Основа" },
  { id: "actions", label: "Действия" },
  { id: "inputs", label: "Ввод" },
  { id: "selection", label: "Выбор" },
  { id: "data-display", label: "Данные" },
  { id: "status", label: "Статус и загрузка" },
  { id: "navigation", label: "Навигация" },
  { id: "overlays", label: "Оверлеи" },
  { id: "page", label: "Страница" },
  { id: "interaction", label: "Взаимодействие" },
  { id: "composition", label: "Композиция" },
  { id: "infrastructure", label: "Инфраструктура" },
] as const;

export type PlaygroundCategoryId = (typeof PLAYGROUND_NAV_CATEGORIES)[number]["id"];

export type PlaygroundCategoryMeta = (typeof PLAYGROUND_NAV_CATEGORIES)[number];
