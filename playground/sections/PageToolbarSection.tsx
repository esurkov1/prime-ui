import { api } from "@/components/page-toolbar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelsTopLeft } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "page-toolbar",
    label: "Page Toolbar",
    summary: "Панель страницы: разделы, фильтр и поиск, вид, главное действие, чипы",
    keywords: [
      "панель",
      "тулбар",
      "toolbar",
      "фильтр",
      "поиск",
      "разделы",
      "адаптив",
      "responsive",
    ],
    icon: PanelsTopLeft,
    order: 4,
  },
  dir: "page-toolbar",
  title: "PageToolbar",
  kind: "layout",
  description:
    "Полоса сверху страницы: поиск и фильтр, разделы, вид данных и главное действие. Раскладывается по своей ширине — широко в одну строку, узко строками друг под другом, — поиск и фильтр всегда первые, активные фильтры прямо под ними.",
  examples: [
    {
      slot: "overview",
      description:
        "Панель страницы заказов: поиск и фильтр, разделы со счётчиками, период и главное действие в одну строку, активные фильтры прямо под поиском — `PageToolbar.Tools`, `PageToolbar.Sections`, `PageToolbar.View`, `PageToolbar.Actions`, `PageToolbar.Chips`.",
    },
    {
      scenario: "without-search",
      title: "Без поиска",
      description:
        "Панель дашборда без поиска в колонке планшета: разделы заполняют верхнюю строку, селектор периода один в нижней и растянут на всю ширину — `PageToolbar.Sections`, `PageToolbar.View`.",
    },
    {
      scenario: "save-changes",
      title: "Сохранение формы",
      description:
        "Страница настроек: разделы формы слева, сохранение со счётчиком изменений в конце верхней строки — а не липкая полоса внизу экрана телефона — `PageToolbar.Actions`.",
    },
    {
      slot: "narrow",
      description:
        "Колонка шириной с телефон: поиск и фильтр сверху, главное действие своей строкой под ними, дальше активные фильтры, разделы и период, все строки через 12 — `PageToolbar.Root`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      'Обычный `<div>`: если на странице несколько панелей, дайте каждой `role="group"` и `aria-label` — имя на `<div>` без роли скринридер не читает.',
      "Порядок слотов меняется только визуально (`order`); порядок Tab совпадает с порядком в JSX — пишите слоты в порядке чтения: инструменты, разделы, вид, действие, чипы.",
      "Главное действие только с иконкой получает `aria-label`.",
    ],
  },
};
