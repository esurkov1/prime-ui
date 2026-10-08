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
    "Панель фильтров для списков и таблиц: кнопка фильтра и поиск с панелью значений, применённые фильтры — удаляемые теги, каждое значение можно показать или скрыть.",
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
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переходит по значениям панели и их «−» (появляется при фокусе)." },
      { keys: "Enter · Space", action: "Показывает только это значение; повтор снимает выбор." },
      { keys: "Shift + Enter", action: "Скрывает значение." },
      { keys: "Enter · Escape", action: "В поле поиска закрывают панель." },
    ],
    aria: [
      'Кнопка фильтра — `aria-expanded`, `aria-haspopup="dialog"`; панель — немодальный `role="dialog"` со скрытым заголовком `labels.filter`.',
      "Значения — переключатели с `aria-pressed`; у «−» своё имя (`labels.hideValue` / `labels.unhideValue`); скрытое значение несёт текст «НЕ», смысл не только в цвете.",
      'Поля без совпадений при поиске объявляются через `role="status"`.',
      "Каждый тег фильтра удаляется кнопкой с именем `labels.remove`.",
    ],
  },
};
