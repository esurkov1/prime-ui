import { api } from "@/layout/app-header/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelTopDashed } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "app-header",
    label: "App Header",
    summary: "Шапка приложения: где вы, поиск, действия, кнопка меню",
    keywords: [
      "шапка",
      "хедер",
      "верхняя панель",
      "поиск",
      "меню",
      "header",
      "topbar",
      "search",
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
    "Полоса вверху панели приложения: где вы находитесь, глобальный поиск и несколько действий. Высотой со строку бренда Sidebar и раскладывается по своей ширине.",
  examples: [
    {
      slot: "overview",
      description:
        "Верх экрана: где вы, глобальный поиск, уведомления и главное действие — `AppHeader.Title`, `AppHeader.Search`, `AppHeader.Actions`.",
    },
    {
      scenario: "breadcrumbs",
      title: "Хлебные крошки",
      description:
        "Вложенная страница: кнопка «назад», разделитель и путь вместо названия, действия над записью в конце — `AppHeader.Separator`, `AppHeader.Actions`.",
    },
    {
      scenario: "page-title",
      title: "Заголовок страницы в шапке",
      description:
        "Шапка несёт страницу: название — заголовок страницы, инструменты страницы (разделы, период, главное действие) — её вторая строка и раскладываются по её ширине — `AppHeader.Title`, `as`, `AppHeader.Tools`.",
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
        "На телефоне: кнопка меню открывает навигацию, описание уходит, поиск сворачивается в иконку — `AppHeader.MenuButton`, `show`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Проходит по кнопке меню, ссылкам пути, поиску и действиям в порядке чтения, затем по инструментам страницы во второй строке.",
      },
      { keys: "Enter · Space", action: "Нажимает кнопку: открывает меню, поиск или действие." },
    ],
    aria: [
      "Root — ориентир `<header>` (banner), когда стоит на верхнем уровне страницы.",
      "Search — кнопка, названная своим текстом; подсказка клавиши скрыта от скринридеров (`aria-hidden`), сочетание назначает приложение.",
      "MenuButton названа `labels.menu`; передайте `aria-expanded` — открыт ли Sidebar.",
      'Title по умолчанию не заголовок: `<h1>` страницы — PageContent.Title. С `as="h1"` заголовком страницы становится название; описание остаётся вне его имени.',
      "`AppHeader.Tools` стоит в DOM после строки заголовка, поэтому Tab проходит строку заголовка, затем инструменты страницы.",
    ],
  },
};
