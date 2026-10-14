import { api } from "@/layout/app-shell/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutTemplate } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "app-shell",
    label: "App Shell",
    summary: "Каркас приложения: рельс навигации и панель контента",
    keywords: ["каркас", "оболочка", "layout", "nav", "header", "main", "footer", "fillViewport"],
    icon: LayoutTemplate,
    order: 1,
  },
  dir: "app-shell",
  base: "layout",
  title: "AppShell",
  kind: "layout",
  description:
    "Каркас приложения: колонка навигации на холсте и панель содержимого на поверхности, с местом для AppHeader и прокручиваемым main.",
  examples: [
    {
      slot: "overview",
      description:
        "Каркас приложения: Sidebar в колонке навигации, заголовок страницы и её действие в AppHeader, страница в main; прокручивается только main — `fillViewport`.",
    },
    {
      scenario: "contained",
      title: "Колонка для чтения",
      description:
        "Оболочка без навигации, main которой — колонка по центру с ограничением для длинных текстов — `contentWidth`.",
    },
    {
      scenario: "footer",
      title: "Нижняя полоса",
      description:
        "Приложение для телефона без Sidebar: полоса в нижней зоне стоит внизу, пока main прокручивается под ней — `AppShell.Footer`.",
    },
    {
      scenario: "template",
      title: "Шаблон",
      description:
        "Root, навигация, шапка и main одним компонентом; main прокручивается наверх при каждой смене страницы — `AppShell.Template`, `scrollResetKey`.",
    },
    {
      slot: "screen",
      description:
        "Каркас приложения для компьютера и телефона: боковая панель на широком экране, нижняя панель разделов на телефоне, чья кнопка «Ещё» открывает боковую панель, шапка с кнопкой меню, которую она рисует сама, заголовком страницы и строкой данных и страница, которая сменяется вместе с разделом — `fillViewport`, `scrollResetKey`, `useAppShellNav`.",
    },
  ],
  api,
};
