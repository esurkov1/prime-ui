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
      en: "`ref` → `HTMLDivElement`. The page panel: lays its slots out from its own width — one row from a 56rem container (Tools · Sections · View · Actions), stacked rows below it (Tools + Actions, Chips, Sections, View). Search and filter always come first, so the Chips sit right under them. Every row is 12 from the next. Parts may be left out; JSX order is the Tab order — write Tools, Sections, View, Actions, Chips.",
      ru: "Панель страницы: раскладывает слоты по своей ширине — одна строка от 56rem (инструменты · разделы · вид · действие), уже — строки друг под другом (инструменты + действие, чипы, разделы, вид). Поиск и фильтр всегда первые, поэтому чипы стоят прямо под ними. Между любыми строками 12. Любой слот можно опустить; порядок в JSX — порядок Tab: Tools, Sections, View, Actions, Chips.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Sections",
      en: "`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts. After the Tools and sized by content when wide; a full row under the Chips when narrow (beside the action when there are no Tools); scrolls inside when it does not fit.",
      ru: "Разделы страницы — SegmentedControl с `fullWidth` и счётчиками. Широко — после инструментов, по содержимому; узко — на всю строку под чипами (рядом с действием, если инструментов нет); не помещается — прокрутка внутри.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Tools",
      en: "`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one, the Chips right under it. Wide, it gives way down to 18rem (a 9rem search and the button on one line), then the Sections shrink.",
      ru: "Поиск и кнопка фильтра (`SmartFilter.Toolbar`): всегда первый слот и резиновый, чипы — прямо под ним. Широко сжимается до 18rem (поиск 9rem и кнопка в одну строку), дальше сжимаются разделы.",
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
      en: "`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row at every width, never wraps down.",
      ru: "Главное действие страницы: в конце верхней строки на любой ширине, никогда не уходит вниз.",
      props: [SLOT_REST],
    },
    {
      name: "PageToolbar.Chips",
      en: "`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row right under the search and filter; the row takes no space while it is empty.",
      ru: "Активные фильтры (`SmartFilter.Chips`) отдельной строкой прямо под поиском и фильтром; пока пусто, строка не занимает места.",
      props: [SLOT_REST],
    },
  ],
  labels: [],
};
