import { PanelsTopLeft } from "lucide-react";
import { api } from "@/components/page-toolbar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

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
    "Полоса сверху страницы: разделы, фильтр и поиск, вид данных и главное действие. Раскладывается по своей ширине — широко в одну строку, узко ровно в две, — и у каждого слота постоянное место.",
  examples: [
    {
      slot: "overview",
      description:
        "Панель страницы заказов: разделы со счётчиками, фильтр и поиск, период и главное действие в одну строку, активные фильтры строкой ниже — `PageToolbar.Sections`, `PageToolbar.Tools`, `PageToolbar.View`, `PageToolbar.Actions`, `PageToolbar.Chips`.",
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
        "Колонка шириной с телефон: ровно две строки — разделы и главное действие сверху, фильтр, поиск и период снизу; в каждой строке один резиновый элемент — `PageToolbar.Root`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Обычный `<div>`: назовите панель через `aria-label`, если на странице несколько панелей.",
      "Порядок слотов меняется только визуально (`order`); порядок Tab совпадает с порядком в JSX — пишите слоты в порядке чтения: разделы, инструменты, вид, действие.",
      "Главное действие только с иконкой на узкой ширине получает `aria-label`.",
    ],
  },
};
