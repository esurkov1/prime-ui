import { LayoutTemplate } from "lucide-react";
import { api } from "@/layout/app-shell/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "layout",
  nav: {
    segment: "app-shell",
    label: "App Shell",
    summary: "Каркас приложения: рельс навигации и панель контента",
    keywords: ["каркас", "оболочка", "layout", "nav", "header", "main", "fillViewport"],
    icon: LayoutTemplate,
    order: 1,
  },
  dir: "app-shell",
  base: "layout",
  title: "AppShell",
  kind: "layout",
  description:
    "Каркас приложения: колонка навигации на холсте и панель содержимого на поверхности, с липкой шапкой и прокручиваемым main.",
  examples: [
    {
      slot: "overview",
      description:
        "Каркас приложения: Sidebar в колонке навигации, хлебные крошки в липкой шапке, страница в main; прокручивается только main — `fillViewport`.",
    },
    {
      scenario: "contained",
      title: "Колонка для чтения",
      description:
        "Оболочка без навигации, main которой — колонка по центру с ограничением для длинных текстов — `contentWidth`.",
    },
    {
      scenario: "template",
      title: "Шаблон",
      description:
        "Root, навигация, шапка и main одним компонентом; main прокручивается наверх при каждой смене страницы — `AppShell.Template` со `scrollResetKey`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Main — ориентир `<main>`, Header — `<header>`; ориентир навигации даёт Sidebar (`<nav>`).",
      "На странице один `<h1>` (PageContent.Title).",
    ],
  },
};
