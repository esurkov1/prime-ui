import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "EmptyPage.Root",
      en: "`ref` → `HTMLDivElement`. A centered column: icon tile, title, description, actions; parts rise in one after another on first render.",
      ru: "Колонка по центру: плашка с иконкой, заголовок, описание, действия; части появляются по очереди при первом показе.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Icon tile, title type and padding; given to the controls inside.",
          ru: "Плашка иконки, шрифт заголовка и отступы; передаётся контролам внутри.",
        },
        {
          name: "layout",
          type: '"default" | "fill" | "compact"',
          default: '"default"',
          en: "`default` sizes by content; `fill` stretches to the parent's height and centers; `compact` — a quiet state inside a menu or list: smaller text and icon, no entrance motion.",
          ru: "`default` — по содержимому; `fill` — на всю высоту родителя по центру; `compact` — тихое состояние в меню или списке: текст и иконка меньше, без анимации появления.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `role` (`status` in a filtered list), `aria-labelledby` and the other div attributes.",
          ru: "`className`, `role` (`status` в фильтруемом списке), `aria-labelledby` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "EmptyPage.Icon",
      en: "`ref` → `HTMLDivElement`. A `<div>` tile holding one icon.",
      ru: "Плашка `<div>` с одной иконкой.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "danger"',
          default: '"neutral"',
          en: "`neutral` — no data yet, `accent` — a first run and a call to start, `danger` — a failed load.",
          ru: "`neutral` — данных пока нет, `accent` — первый запуск и призыв начать, `danger` — ошибка загрузки.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (the icon), `className` and the other div attributes.",
          ru: "`children` (иконка), `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "EmptyPage.Title · EmptyPage.Description",
      en: "`ref` → the element. `<h2>` (or `as`) and `<p>`, both capped at the reading width.",
      ru: "`<h2>` (или `as`) и `<p>`, обе ограничены шириной чтения.",
      props: [
        {
          name: "as",
          type: '"h2" | "h3" | "h4" | "p"',
          default: '"h2"',
          en: "Title: tag that fits the outline; the look does not change. `p` inside menus, lists and table cells.",
          ru: "Title: тег по структуре страницы; вид не меняется. `p` внутри меню, списков и ячеек таблицы.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `id` (for `aria-labelledby`), `className` and the other attributes.",
          ru: "`children`, `id` (для `aria-labelledby`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "EmptyPage.Actions",
      en: "`ref` → `HTMLDivElement`. A `<div>` row of buttons that wraps when narrow.",
      ru: "Ряд кнопок `<div>`, переносится в узком месте.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` (Buttons in the same `size`), `className` and the other div attributes.",
          ru: "`children` (Button того же `size`), `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [],
};
