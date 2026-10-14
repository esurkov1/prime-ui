import { api } from "@/layout/app-header/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelTopDashed } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "app-header",
    label: "App Header",
    summary: "Шапка страницы: заголовок, строка данных, инструменты, кнопка меню",
    keywords: [
      "шапка",
      "хедер",
      "верхняя панель",
      "меню",
      "header",
      "topbar",
      "page title",
      "breadcrumbs",
    ],
    icon: PanelTopDashed,
    order: 2,
  },
  dir: "app-header",
  base: "layout",
  title: "AppHeader",
  kind: "layout",
  description:
    "Полоса страницы вверху панели приложения: заголовок страницы со строкой данных, её инструменты и собственные кнопки — только то, что нужно текущей странице. Высотой со строку бренда Sidebar и раскладывается по своей ширине.",
  examples: [
    {
      slot: "overview",
      description:
        "Шапка страницы: заголовок с иконкой и строкой данных под ним, собственные кнопки страницы в конце — `AppHeader.Title`, `AppHeader.Description`, `AppHeader.Actions`.",
    },
    {
      scenario: "breadcrumbs",
      title: "Хлебные крошки",
      description:
        "Вложенная запись: путь наверх, разделитель и запись как заголовок страницы, кнопки записи в конце — `AppHeader.Separator`, `AppHeader.Actions`.",
    },
    {
      scenario: "page-title",
      title: "Заголовок страницы в шапке",
      description:
        "Шапка несёт страницу: название — заголовок страницы со строкой данных, инструменты страницы (разделы, период, главное действие) — её вторая строка и раскладываются по её ширине — `AppHeader.Title`, `AppHeader.Tools`.",
    },
    {
      scenario: "in-app-shell",
      title: "В каркасе",
      description:
        "Шапка в каркасе приложения: одна строка с брендом Sidebar через обе плоскости, липкая над main — `AppShell`, `Sidebar.Brand`.",
    },
    {
      slot: "narrow",
      description:
        "На телефоне: кнопка меню открывает навигацию, заголовок и строка данных обрезаются, действие страницы остаётся иконкой — `AppHeader.MenuButton`, `show`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Проходит по кнопке меню, ссылкам пути и кнопкам страницы в порядке чтения, затем по инструментам страницы во второй строке.",
      },
      { keys: "Enter · Space", action: "Нажимает кнопку: открывает меню или выполняет действие." },
    ],
    aria: [
      "Root — ориентир `<header>` (banner), когда стоит на верхнем уровне страницы.",
      "MenuButton названа `labels.menu`; передайте `aria-expanded` — открыт ли Sidebar.",
      "Название `AppHeader.Title` — заголовок страницы `<h1>`; описание остаётся вне его имени. Один `<h1>` на странице: в шапке на страницах приложения, `PageContent.Title` на странице-документе (тогда в шапке нет заголовка).",
      "`AppHeader.Tools` стоит в DOM после строки заголовка, поэтому Tab проходит строку заголовка, затем инструменты страницы.",
    ],
  },
};
