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
        "Ссылка роутера как пункт: роутер ставит `aria-current`, и пункт показан текущим; рендерьте внутри роутера — `asChild`.",
    },
    {
      scenario: "in-app-shell",
      title: "В каркасе приложения",
      description:
        "Каркас приложения на телефоне: AppHeader, страница и полоса в нижней зоне, которая уступает место рейлу Sidebar, когда он на экране — `AppShell.Footer`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab · Shift+Tab",
        action: "Переводит фокус по разделам и действию; недоступный пропускается.",
      },
      { keys: "Enter", action: "Открывает раздел (ссылка или кнопка) или выполняет действие." },
    ],
    aria: [
      "Ориентир `<nav>` с именем `labels.nav` («Основные разделы») или своим `aria-label`.",
      'Текущий раздел — `aria-current="page"`: иконка и подпись основного цвета, остальные приглушены; в капсуле — акцентного цвета на капсуле выбора, так что цвет не единственный признак.',
      "Иконка скрыта от скринридеров; имя пункта — подпись, счётчик читается после неё («Заказы 12»).",
      "`BottomNav.Action` — кнопка без текста, её имя — обязательный `aria-label`; она внутри ориентира после пунктов.",
      "Недоступный пункт — `disabled` у кнопки или `aria-disabled` у ссылки без `href`.",
    ],
  },
};
