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
    "Панель фильтров для списков и таблиц: кнопка фильтра и поиск — рядом или одним полем — с панелью значений и диапазонов, применённые фильтры — удаляемые теги, каждое значение можно показать или скрыть.",
  examples: [
    {
      slot: "overview",
      description:
        "Фильтры над списком запросов: кнопка и поиск, применённые фильтры тегами, строки сужаются по значению и тексту — `fields`, `value`, `search`, `matchesSmartFilter`.",
    },
    {
      slot: "variants",
      description:
        "Четыре формы одной панели: только кнопка фильтра, только поиск, поиск рядом с кнопкой, одно поле с секцией фильтра — `searchable`, `fields`, `layout`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: кнопка фильтра, поиск, теги и панель следуют одному ярусу — `size`.",
    },
    {
      scenario: "combined",
      title: "Поиск и фильтр в одном поле",
      description:
        "Заказы сужаются из одного поля: поиск слева, справа секция фильтра со счётчиком, та же панель из любой части; на телефоне у секции остаются иконка и счётчик — `layout`, `search`, `value`.",
    },
    {
      scenario: "search-and-filters",
      title: "Поиск и фильтры вместе",
      description:
        "Клиенты по имени и статусу сразу: Enter закрепляет набранное имя первым тегом, поле очищается для следующего фильтра, в списке остаются строки, подходящие под оба условия — `search`, `value`, `labels`, `matchesSmartFilter`.",
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
        "Колонка 320 px, как на телефоне: обе формы компактны — поиск рядом с кнопкой фильтра из одной иконки со счётчиком или одно поле, где у секции фильтра остаётся только иконка; теги переносятся под ними — `size`, `layout`.",
    },
  ],
  api,
};
