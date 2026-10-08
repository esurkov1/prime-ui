/**
 * Sidebar categories of the playground (one axis each, no overlaps), ordered from primitives to
 * page structure. A component's category is `page.category` in its section; its `COMPONENT.md`
 * declares the same id (`**Category:**`), checked by the docs contract.
 *
 * - **foundations** — tokens: color, typography, spacing, size tiers, radius, elevation, motion, focus.
 * - **actions** — explicit actions on click (buttons, link button).
 * - **inputs** — typing values and field anatomy (input, textarea, upload, label, hint).
 * - **selection** — choosing from options (toggles, lists, slider, date and color pickers).
 * - **data-display** — labels and data (badge, tag, avatar, card, table, timeline, code).
 * - **feedback** — system messages, progress, loading placeholders and empty states.
 * - **navigation** — moving between views, places and steps.
 * - **overlays** — floating layers, from tooltip to modal surfaces.
 * - **layout** — app frame, page regions, disclosure, dividers, scrolling.
 * - **composition** — whole screens built from the kit (`SKILL/patterns/`) and the rules behind them.
 * - **infrastructure** — demo tooling, not product UI.
 */
export const PLAYGROUND_NAV_CATEGORIES = [
  { id: "foundations", label: "Основа" },
  { id: "actions", label: "Действия" },
  { id: "inputs", label: "Поля ввода" },
  { id: "selection", label: "Выбор" },
  { id: "data-display", label: "Данные" },
  { id: "feedback", label: "Обратная связь" },
  { id: "navigation", label: "Навигация" },
  { id: "overlays", label: "Оверлеи" },
  { id: "layout", label: "Раскладка" },
  { id: "composition", label: "Композиция" },
  { id: "infrastructure", label: "Инфраструктура" },
] as const;

export type PlaygroundCategoryId = (typeof PLAYGROUND_NAV_CATEGORIES)[number]["id"];

export type PlaygroundCategoryMeta = (typeof PLAYGROUND_NAV_CATEGORIES)[number];
