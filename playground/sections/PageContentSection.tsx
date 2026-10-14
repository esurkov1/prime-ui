import { api } from "@/components/page-content/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelTop } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "page-content",
    label: "Page Content",
    summary: "Страница: заголовок, действия, разделы, сетка плиток",
    keywords: ["страница", "заголовок", "раздел", "сетка", "дашборд", "плитки", "grid", "section"],
    icon: PanelTop,
    order: 3,
  },
  dir: "page-content",
  title: "PageContent",
  kind: "layout",
  description:
    "Структура страницы внутри основной колонки: заголовок, действия и блоки содержимого, разделы с заголовком и сетка плиток дашборда; страница во всю высоту панели и раскладка «список + детали».",
  examples: [
    {
      slot: "overview",
      description:
        "Страница в основной колонке: заголовок, описание и действия, затем блоки тела — `PageContent.Actions`.",
    },
    {
      slot: "variants",
      description:
        "Одна колонка с тремя ограничениями: весь main, широкая колонка дашборда, колонка для чтения — `maxWidth`.",
    },
    {
      scenario: "grid",
      title: "Сетка плиток",
      description:
        "Доска дашборда: четыре KPI, график на два ряда рядом с двумя плитками, один отступ по обеим осям — `PageContent.Grid`, `PageContent.Cell`, `span`, `rows`.",
    },
    {
      scenario: "sections",
      title: "Разделы",
      description:
        "Плитки одного экрана рядом, новая тема отделена воздухом, ссылка в конце заголовка, колонка заголовка рядом с панелью — `PageContent.Section`, `label`, `description`, `PageContent.Actions`, `layout`.",
    },
    {
      scenario: "list-detail",
      title: "Список и детали",
      description:
        "Обращения поддержки списком и перепиской на странице во всю высоту: рядом на широкой панели, по одной панели с кнопкой «назад» на узкой — `PageContent.Split`, `PageContent.BackButton`, `fill`.",
    },
    {
      slot: "narrow",
      description:
        "В колонке ширины телефона действия страницы переносятся под заголовок, а не сжимают его.",
    },
    {
      slot: "screen",
      description:
        "Страница настроек: разделы с колонкой заголовка и панелью, форма со своим сохранением, переключатели, которые применяются сразу, и опасная зона с подтверждением — `layout`, `maxWidth`.",
    },
  ],
  api,
};
