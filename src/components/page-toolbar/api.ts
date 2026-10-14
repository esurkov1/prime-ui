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
      en: "`ref` → `HTMLDivElement`. The page panel: one row from 56rem of its own width, stacked rows below. Any slot may be left out; JSX order is the Tab order — write Tools, Sections, View, Actions, Chips.",
      ru: "Панель страницы: одна строка от 56rem своей ширины, уже — строки друг под другом. Любой слот можно опустить; порядок в JSX — порядок Tab: Tools, Sections, View, Actions, Chips.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Sections",
      en: "`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts; scrolls inside when it does not fit.",
      ru: "Разделы страницы — SegmentedControl с `fullWidth` и счётчиками; не помещается — прокрутка внутри.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Tools",
      en: "`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one; it gives way first when the row runs short.",
      ru: "Поиск и кнопка фильтра (`SmartFilter.Toolbar`): всегда первый слот и резиновый; уступает место первым, когда строке тесно.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.View",
      en: "`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it equally.",
      ru: "Как показаны данные: период, таблица / карточки, колонки. Широко — по содержимому; узко — своя строка во всю ширину, контролы делят её поровну.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Actions",
      en: "`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row; on a phone, when the search would get less than 18rem beside it, its own full row right under the search.",
      ru: "Главное действие страницы: в конце верхней строки; на телефоне, когда поиску рядом осталось бы меньше 18rem, — своя строка во всю ширину прямо под поиском.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Chips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the top row; the row takes no space while it is empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) отдельной строкой под верхней строкой; пока пусто, строка не занимает места.",
      props: [SLOT_REST],
    },
  ],
  labels: [],
};
