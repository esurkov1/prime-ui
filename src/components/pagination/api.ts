import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { PAGINATION_LABELS } from "./Pagination";

export const api: ComponentApi = {
  parts: [
    {
      name: "Pagination",
      en: "`ref` → `HTMLElement`. A `<nav>` named by `labels.nav` with `Button`s: ghost previous and next, ghost page numbers with ellipses, the current page in the Button `current` state.",
      ru: "`<nav>` с именем из `labels.nav` и кнопками `Button`: ghost «назад» и «вперёд», ghost-номера страниц с многоточием, текущая — в состоянии `current` у Button.",
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
          en: "Pages on each side of the current one before an ellipsis (when `totalPages > 2·siblingCount+5`).",
          ru: "Сколько номеров по бокам от текущей до многоточия (при `totalPages > 2·siblingCount+5`).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Control tier of the buttons: height 28 · 32 · 36 · 40 · 48. Without it the tier of its host, else `m`.",
          ru: "Ярус кнопок: высота 28 · 32 · 36 · 40 · 48, как у Button и Input. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "compact",
          type: "boolean",
          default: "false",
          en: "Always arrows + «current / total» instead of numbers. Without it the nav fills its parent and shows that view only below 22rem of its width.",
          ru: "Всегда стрелки и «текущая / всего» вместо номеров. Без него навигация на всю ширину родителя и так выглядит только уже 22rem.",
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
  labels: labelRows(PAGINATION_LABELS, {
    nav: { en: "`aria-label` of the `<nav>`.", ru: "`aria-label` у `<nav>`." },
    previous: { en: "Name of the previous-page arrow.", ru: "Имя стрелки «назад»." },
    next: { en: "Name of the next-page arrow.", ru: "Имя стрелки «вперёд»." },
    page: {
      en: "Name of a page button; `{page}` is replaced.",
      ru: "Имя кнопки страницы; `{page}` заменяется номером.",
    },
    of: {
      en: "Hidden word between the current and the total page in the compact view.",
      ru: "Скрытое слово между текущей и общей страницей в компактном виде.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves between the arrows and the page numbers.",
        ru: "Переходит между стрелками и номерами страниц.",
      },
      {
        keys: "Enter · Space",
        en: "Opens the focused page.",
        ru: "Открывает страницу под фокусом.",
      },
    ],
    aria: [
      { en: "A `<nav>` landmark named by `labels.nav`.", ru: "`<nav>` с именем из `labels.nav`." },
      {
        en: 'The current page has `aria-current="page"`; every page button is named by `labels.page` («Страница 3»).',
        ru: 'Текущая страница — `aria-current="page"`; у каждой кнопки имя из `labels.page` («Страница 3»).',
      },
      {
        en: "The edge arrows are `disabled`; the ellipsis is `aria-hidden`.",
        ru: "Стрелки на краях отключены (`disabled`), многоточие — `aria-hidden`.",
      },
      {
        en: "The compact view reads «3 из 12» through the visually hidden `labels.of`.",
        ru: "В компактном виде «3 / 12» читается как «3 из 12» (`labels.of`).",
      },
    ],
  },
};
