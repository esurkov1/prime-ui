import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Pagination",
      en: "`ref` → `HTMLElement`. A `<nav>` named by `labels.nav` with ghost `Button`s: previous, page numbers with ellipses, next.",
      ru: "`<nav>` с именем из `labels.nav` и ghost-кнопками: назад, номера страниц с многоточием, вперёд.",
      props: [
        {
          name: "totalPages",
          type: "number",
          required: true,
          en: "Number of pages. Below `1` nothing is rendered.",
          ru: "Число страниц; меньше `1` — ничего не рендерится.",
        },
        {
          name: "value",
          type: "number",
          en: "Current page (1-based), controlled; clamped to `1…totalPages`.",
          ru: "Текущая страница (с 1), управляемо; ограничивается `1…totalPages`.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "1",
          en: "Initial page, uncontrolled.",
          ru: "Начальная страница без контроля.",
        },
        {
          name: "onValueChange",
          type: "(page: number) => void",
          en: "Called when a page button or an arrow picks another page.",
          ru: "Выбор другой страницы номером или стрелкой.",
        },
        {
          name: "siblingCount",
          type: "number",
          default: "1",
          en: "Pages on each side of the current one before an ellipsis (when `totalPages > 7`).",
          ru: "Сколько номеров по бокам от текущей до многоточия (при `totalPages > 7`).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Control tier of the buttons: height 28 · 32 · 36 · 40 · 48.",
          ru: "Ярус кнопок: высота 28 · 32 · 36 · 40 · 48, как у Button и Input.",
        },
        {
          name: "compact",
          type: 'boolean | "auto"',
          default: "false",
          en: '`true` — arrows + «current / total» instead of numbers; `"auto"` — fills the parent and turns compact below 22rem of its width.',
          ru: '`true` — стрелки и «текущая / всего» вместо номеров; `"auto"` — на всю ширину родителя и компактно уже 22rem.',
        },
        {
          name: "labels",
          type: "Partial<PaginationLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "defaultValue" | "onChange">',
          en: "`className`, `data-*` and the other `<nav>` attributes; `aria-label` comes from `labels.nav`.",
          ru: "`className`, `data-*` и остальные атрибуты `<nav>`; `aria-label` берётся из `labels.nav`.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "nav",
      default: "Навигация по страницам",
      en: "`aria-label` of the `<nav>`.",
      ru: "`aria-label` навигации.",
    },
    {
      key: "previous",
      default: "Предыдущая страница",
      en: "Name of the previous-page arrow.",
      ru: "Имя стрелки «назад».",
    },
    {
      key: "next",
      default: "Следующая страница",
      en: "Name of the next-page arrow.",
      ru: "Имя стрелки «вперёд».",
    },
    {
      key: "page",
      default: "Страница {page}",
      en: "Name of a page button; `{page}` is replaced.",
      ru: "Имя кнопки страницы; `{page}` заменяется номером.",
    },
    {
      key: "of",
      default: "из",
      en: "Hidden word between the current and the total page in the compact view.",
      ru: "Скрытое слово между текущей и общей страницей в компактном виде.",
    },
  ],
};
