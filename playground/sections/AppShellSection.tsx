import { api } from "@/layout/app-shell/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutTemplate } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "app-shell",
    label: "App Shell",
    summary: "Каркас приложения: рельс навигации и панель контента",
    keywords: ["каркас", "оболочка", "layout", "nav", "main", "footer", "fillViewport"],
    icon: LayoutTemplate,
    order: 1,
  },
  dir: "app-shell",
  base: "layout",
  title: "AppShell",
  kind: "layout",
  description:
    "Каркас приложения — навигация и страница: колонка навигации на холсте, панель со страницей в прокручиваемом main и нижняя полоса телефона.",
  examples: [
    {
      slot: "overview",
      description:
        "Каркас приложения: Sidebar в колонке навигации, страница в main с заголовком и действием в своей верхней полосе; прокручивается только main — `fillViewport`.",
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
        "Root, навигация, main и нижняя полоса одним компонентом; main прокручивается наверх при каждой смене страницы — `AppShell.Template`, `scrollResetKey`.",
    },
    {
      slot: "screen",
      description:
        "Каркас приложения для компьютера и телефона: боковая панель на широком экране, нижняя панель разделов на телефоне, чья кнопка «Ещё» открывает боковую панель, верхняя полоса страницы с кнопкой меню, которую она рисует сама, заголовком страницы и строкой данных и страница, которая сменяется вместе с разделом — `fillViewport`, `scrollResetKey`, `useAppShellNav`.",
    },
  ],
  api,
};
