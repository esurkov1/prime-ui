import { api } from "@/layout/page/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelTop } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "page",
    label: "Page",
    summary: "Страница: верхняя полоса, заголовок, инструменты, разделы, сетка, список и детали",
    keywords: [
      "страница",
      "заголовок",
      "шапка",
      "верхняя полоса",
      "тулбар",
      "фильтр",
      "раздел",
      "сетка",
      "дашборд",
      "header",
      "topbar",
      "toolbar",
      "section",
      "grid",
    ],
    icon: PanelTop,
    order: 2,
  },
  dir: "page",
  base: "layout",
  title: "Page",
  kind: "layout",
  description:
    "Страница внутри каркаса: всё, что сверху, принадлежит ей — верхняя полоса с заголовком, действиями и инструментами, большой заголовок документа в потоке, разделы, сетка плиток и раскладка «список + детали».",
  examples: [
    {
      slot: "overview",
      description:
        "Рабочая страница в окне приложения: верхняя полоса с заголовком, строкой данных и действиями страницы, под ней тело — `Page.TopBar`, `Page.Header`, `Page.Actions`.",
    },
    {
      slot: "variants",
      description:
        "Одна страница с тремя ограничениями: весь main, широкая колонка дашборда, колонка для чтения — `maxWidth`.",
    },
    {
      slot: "structure",
      description:
        "Страница-документ в потоке: путь над большим заголовком, строка данных и действия страницы, затем тело с разделом — `Page.Header`, `Page.Description`, `Page.Section`.",
    },
    {
      scenario: "top-bar",
      title: "Верхняя полоса",
      description:
        "Вложенная запись в верхней полосе: путь, запись как заголовок страницы со строкой данных, её действия в конце, инструменты страницы второй строкой — `Page.TopBar`, `Page.Toolbar`.",
    },
    {
      scenario: "collapse",
      title: "Заголовок в полосе при прокрутке",
      description:
        "Обзор, чей большой заголовок уходит под верхнюю полосу: полоса повторяет его со строкой данных и держит действия страницы под рукой — `collapse`.",
    },
    {
      scenario: "tools",
      title: "Инструменты страницы",
      description:
        "Панель страницы заказов: поиск и фильтр, разделы со счётчиками, период и главное действие в одну строку, активные фильтры под верхней строкой — `Page.ToolbarTools`, `Page.ToolbarSections`, `Page.ToolbarView`, `Page.ToolbarActions`, `Page.ToolbarChips`.",
    },
    {
      scenario: "tools-without-search",
      title: "Инструменты без поиска",
      description:
        "Панель дашборда без поиска в колонке планшета: разделы заполняют верхнюю строку, селектор периода один в нижней и растянут на всю ширину — `Page.ToolbarSections`, `Page.ToolbarView`.",
    },
    {
      scenario: "sections",
      title: "Разделы",
      description:
        "Плитки одного экрана рядом, новая тема отделена воздухом, ссылка в конце заголовка, колонка заголовка рядом с панелью — `Page.Section`, `label`, `description`, `Page.Actions`, `layout`.",
    },
    {
      scenario: "grid",
      title: "Сетка плиток",
      description:
        "Доска дашборда: четыре KPI, график на два ряда рядом с двумя плитками, один отступ по обеим осям — `Page.Grid`, `Page.Cell`, `span`, `rows`.",
    },
    {
      scenario: "list-detail",
      title: "Список и детали",
      description:
        "Очередь обращений списком и историей на странице во всю высоту: рядом на широкой панели, по одной панели с кнопкой «назад» на узкой; выбранное обращение плавно сменяется — `Page.Split`, `Page.List`, `Page.Detail`, `Page.BackButton`, `fill`.",
    },
    {
      slot: "narrow",
      description:
        "На телефоне верхняя полоса сама начинается с кнопки меню, которая открывает навигацию, заголовок и строка данных обрезаются, второстепенные действия уходят в «⋯» — `offCanvas`, `Page.Actions`.",
    },
    {
      slot: "screen",
      description:
        "Страница настроек как документ: путь в верхней полосе, которая повторяет заголовок, когда он уходит, большой заголовок в потоке, разделы с колонкой заголовка и панелью, форма со своим сохранением, переключатели, которые применяются сразу, и опасная зона с подтверждением — `collapse`, `layout`, `maxWidth`.",
    },
  ],
  api,
};
