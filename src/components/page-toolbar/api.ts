import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "PageToolbar.Root",
      en: "`ref` → `HTMLDivElement`. The page panel: one row from 56rem of its own width, stacked rows below. Any slot may be left out; whatever the JSX order, the DOM and Tab order is Tools, Sections, View, Actions, Chips. Named (`aria-label`), it is a `group`.",
      ru: "Панель страницы: одна строка от 56rem своей ширины, уже — строки друг под другом. Любой слот можно опустить; каким бы ни был порядок в JSX, порядок в DOM и Tab — Tools, Sections, View, Actions, Chips. С именем (`aria-label`) — `group`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageToolbar.Sections",
      en: "`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts; scrolls inside when it does not fit.",
      ru: "Разделы страницы — SegmentedControl с `fullWidth` и счётчиками; не помещается — прокрутка внутри.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageToolbar.Tools",
      en: "`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one; it gives way first when the row runs short.",
      ru: "Поиск и кнопка фильтра (`SmartFilter.Toolbar`): всегда первый слот и резиновый; уступает место первым, когда строке тесно.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageToolbar.View",
      en: "`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it equally.",
      ru: "Как показаны данные: период, таблица / карточки, колонки. Широко — по содержимому; узко — своя строка во всю ширину, контролы делят её поровну.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageToolbar.Actions",
      en: "`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row; on a phone, when the search would get less than 18rem beside it, its own full row right under the search.",
      ru: "Главное действие страницы: в конце верхней строки; на телефоне, когда поиску рядом осталось бы меньше 18rem, — своя строка во всю ширину прямо под поиском.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "PageToolbar.Chips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the top row; the row takes no space while it is empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) отдельной строкой под верхней строкой; пока пусто, строка не занимает места.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other div attributes.",
          ru: "`children`, `className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: 'With an `aria-label` the root is `role="group"` named by it: when a page has more than one panel, name each.',
        ru: 'С `aria-label` корень — `role="group"` с этим именем: если на странице несколько панелей, назовите каждую.',
      },
      {
        en: "The root renders the slots in the wide layout's reading order — Tools, Sections, View, Actions, Chips — whatever the JSX order; the narrow layout moves them only visually (`order`).",
        ru: "Корень выводит слоты в порядке чтения широкой раскладки — инструменты, разделы, вид, действие, чипы — независимо от порядка в JSX; узкая раскладка двигает их только визуально (`order`).",
      },
      {
        en: "An icon-only primary action carries `aria-label`.",
        ru: "Главное действие только с иконкой получает `aria-label`.",
      },
    ],
  },
};
