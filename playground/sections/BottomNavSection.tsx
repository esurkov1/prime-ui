import { PanelBottom } from "lucide-react";
import { api } from "@/layout/bottom-nav/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

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
    ],
    icon: PanelBottom,
    order: 6,
  },
  dir: "bottom-nav",
  base: "layout",
  title: "BottomNav",
  kind: "layout",
  description:
    "Навигация по 3–5 главным разделам приложения внизу экрана телефона. В `AppShell.Footer` видна, пока панель уже 640px; шире навигацию ведёт Sidebar.",
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
        "Стеклянная капсула над страницей: список клиентов прокручивается под размытием, с подписями или одними иконками — `floating`, `iconOnly`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Ссылка роутера как пункт: роутер ставит `aria-current`, и пункт показан текущим; рендерьте внутри роутера — `asChild`.",
    },
    {
      scenario: "in-app-shell",
      title: "В каркасе приложения",
      description:
        "Каркас приложения на телефоне: AppHeader, страница и полоса в нижней зоне, которая уходит, когда панель шире 640px — `AppShell.Footer`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab · Shift+Tab", action: "Переводит фокус по разделам; недоступный пропускается." },
      { keys: "Enter", action: "Открывает раздел (ссылка или кнопка)." },
    ],
    aria: [
      "Ориентир `<nav>` с именем `labels.nav` («Основные разделы») или своим `aria-label`.",
      'Текущий раздел — `aria-current="page"`: иконка и подпись основного цвета, остальные приглушены.',
      "Иконка скрыта от скринридеров; имя пункта — подпись, счётчик читается после неё («Заказы 12»).",
      "Недоступный пункт — `disabled` у кнопки или `aria-disabled` у ссылки без `href`.",
    ],
  },
};
