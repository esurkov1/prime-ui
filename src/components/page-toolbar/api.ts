import type { ComponentApi } from "../../../scripts/docs/componentApi";

const SLOT_REST = {
  name: "…rest",
  type: "HTMLAttributes<HTMLDivElement>",
  en: "`children`, `className` and the other div attributes.",
  ru: "`children`, `className` и остальные атрибуты div.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "PageToolbar.Root",
      en: "`ref` → `HTMLDivElement`. The page panel: lays its slots out from its own width — one row from a 56rem container, exactly two rows below it. Parts may be left out; JSX order is the Tab order.",
      ru: "Панель страницы: раскладывает слоты по своей ширине — одна строка от 56rem, ровно две строки уже. Любой слот можно опустить; порядок в JSX — порядок Tab.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Sections",
      en: "`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts. Top row; sized by content when wide, stretches when narrow and scrolls inside when it does not fit.",
      ru: "Разделы страницы — SegmentedControl с `fullWidth` и счётчиками. Верхняя строка; широко — по содержимому, узко — на всю строку, не помещается — прокрутка внутри.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Tools",
      en: "`ref` → `HTMLDivElement`. Filter button and search (`SmartFilter.Toolbar`): the stretchy item of its row; gives way down to 18rem (the button and a 9rem search on one line), then the View wraps instead.",
      ru: "Кнопка фильтра и поиск (`SmartFilter.Toolbar`): резиновый элемент своей строки; сжимается до 18rem (кнопка и поиск 9rem в одну строку), дальше переносится слот вида.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.View",
      en: "`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content next to the Tools; alone in its row it stretches and its controls share the row equally.",
      ru: "Как показаны данные: период, таблица / карточки, колонки. Рядом с инструментами — по содержимому; один в строке — растягивается, контролы делят строку поровну.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Actions",
      en: "`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row at every width, never wraps down.",
      ru: "Главное действие страницы: в конце верхней строки на любой ширине, никогда не уходит вниз.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Chips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the panel; the row takes no space while it is empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) отдельной строкой под панелью; пока пусто, строка не занимает места.",
      props: [SLOT_REST],
    },
  ],
  labels: [],
};
