import { PanelTopDashed } from "lucide-react";
import { api } from "@/layout/app-header/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

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
        action: "Проходит по кнопке меню, ссылкам пути, поиску и действиям в порядке чтения.",
      },
      { keys: "Enter · Space", action: "Нажимает кнопку: открывает меню, поиск или действие." },
    ],
    aria: [
      "Root — ориентир `<header>` (banner), когда стоит на верхнем уровне страницы.",
      "Search — кнопка, названная своим текстом; подсказка клавиши скрыта от скринридеров (`aria-hidden`), сочетание назначает приложение.",
      "MenuButton названа `labels.menu`; передайте `aria-expanded` — открыт ли Sidebar.",
      "Title — не заголовок: `<h1>` страницы остаётся за PageContent.Title.",
    ],
  },
};
