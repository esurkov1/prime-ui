import { api } from "@/layout/bottom-nav/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelBottom } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "bottom-nav",
    label: "Bottom Nav",
    summary: "Нижняя навигация по разделам на телефоне",
    keywords: [
      "нижняя навигация",
      "таб-бар",
      "мобильный",
      "телефон",
      "стекло",
      "liquid glass",
      "bottom",
      "tab bar",
      "current",
      "floating",
      "iconOnly",
      "action",
    ],
    icon: PanelBottom,
    order: 6,
  },
  dir: "bottom-nav",
  base: "layout",
  title: "BottomNav",
  kind: "layout",
  description:
    "Навигация по 2–6 главным разделам приложения внизу экрана телефона. В `AppShell.Footer` видна, пока рейла Sidebar нет на экране; когда он есть, навигацию ведёт Sidebar.",
  examples: [
    {
      slot: "overview",
      description:
        "Четыре раздела приложения: текущий основного цвета, касание переносит выбор — `current`, `BottomNav.ItemIcon`.",
    },
    {
      slot: "structure",
      description:
        "Счётчики на иконках и раздел, который пока недоступен — `BottomNav.ItemCount`, `disabled`.",
    },
    {
      scenario: "icon-only",
      title: "Только иконки",
      description:
        "Одни иконки: подписи скрыты, но называют разделы для скринридеров — `iconOnly`.",
    },
    {
      scenario: "floating",
      title: "Парящая капсула",
      description:
        "Стеклянная капсула над страницей во всю ширину: список клиентов прокручивается под размытием, выбор скользит к нажатому разделу, с подписями или одними иконками — `floating`, `iconOnly`.",
    },
    {
      scenario: "floating-action",
      title: "Капсула с действием",
      description:
        "Круглое действие рядом со стеклянной капсулой для главного действия экрана, с подписями или одними иконками — `BottomNav.Action`, `floating`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Ссылка роутера как пункт: роутер отмечает открытый раздел, и пункт показан текущим; рендерьте внутри роутера — `asChild`.",
    },
    {
      scenario: "in-app-shell",
      title: "В каркасе приложения",
      description:
        "Каркас приложения на телефоне: страница со своей верхней полосой и полоса в нижней зоне, которая уступает место рейлу Sidebar, когда он на экране — `AppShell.Footer`.",
    },
  ],
  api,
};
