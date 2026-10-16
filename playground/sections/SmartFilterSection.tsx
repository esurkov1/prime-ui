import { api } from "@/components/smart-filter/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ListFilter } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "smart-filter",
    label: "Smart Filter",
    summary: "Умные фильтры: панель значений, поиск и теги применённых фильтров",
    keywords: [
      "фильтры",
      "фильтр",
      "поиск",
      "filter",
      "include",
      "exclude",
      "скрыть",
      "показать",
      "chips",
    ],
    icon: ListFilter,
    order: 9,
  },
  dir: "smart-filter",
  title: "SmartFilter",
  kind: "composite",
  description:
    "Панель фильтров для списков и таблиц: кнопка фильтра и поиск с панелью значений и диапазонов, применённые фильтры — удаляемые теги, каждое значение можно показать или скрыть.",
  examples: [
    {
      slot: "overview",
      description:
        "Фильтры над списком запросов: кнопка и поиск, применённые фильтры тегами, строки сужаются по значению и тексту — `fields`, `value`, `search`, `matchesSmartFilter`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: кнопка фильтра, поиск, теги и панель следуют одному ярусу — `size`.",
    },
    {
      scenario: "many-values",
      title: "Много значений",
      description:
        "Открытый набор из двадцати сервисов, проблемные помечены иконкой, свёрнуты до «Ещё N»; ввод сужает панель и выделяет совпадение акцентным цветом — `finite`, `icon`, `collapsedLimit`.",
    },
    {
      scenario: "ranges",
      title: "Диапазоны",
      description:
        "Сделки сужаются суммой «от–до» и периодом из календаря с пресетами, двумя месяцами и «Применить»; каждый диапазон — один читаемый тег, а границы уходят на сервер параметрами from / to — `kind`, `formatValue`, `calendar`, `matchesSmartFilter`, `isSmartFilterRange`.",
    },
    {
      scenario: "single-value",
      title: "Одно значение, без поиска",
      description:
        "Для API, которое принимает одно значение на поле: кнопка фильтра без поиска, нажатие выбирает только это значение, скрывать нечего — `searchable`, `multiple`.",
    },
    {
      scenario: "option-groups",
      title: "Группы значений",
      description:
        "Значения разного рода в одном поле: типы ответственных и люди под своими заголовками — `options`, `group`.",
    },
    {
      slot: "controlled",
      description:
        "Сохранённый вид задаёт значение снаружи, выбор читается обратно как список для сервера — `value`, `onValueChange`, `resolveSmartFilterValues`.",
    },
    {
      slot: "narrow",
      description:
        "Колонка 320 px: поиск сжимается рядом с кнопкой фильтра, теги переносятся под ними — `size`.",
    },
  ],
  api,
};
