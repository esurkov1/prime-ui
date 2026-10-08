import { PanelTop } from "lucide-react";
import { api } from "@/components/page-content/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "page-content",
    label: "Page Content",
    summary: "Страница: заголовок, описание, действия, секции",
    keywords: ["страница", "заголовок", "секция", "title", "description", "actions"],
    icon: PanelTop,
    order: 3,
  },
  dir: "page-content",
  title: "PageContent",
  kind: "layout",
  description:
    "Структура страницы внутри основной колонки: заголовок, описание, действия страницы и блоки содержимого.",
  examples: [
    {
      slot: "overview",
      description:
        "Страница в основной колонке: заголовок, описание и действия, затем блоки тела — `PageContent.Actions`.",
    },
    {
      slot: "variants",
      description:
        "Одна колонка с тремя ограничениями: весь main, широкая колонка дашборда, колонка для чтения — `maxWidth`.",
    },
    {
      slot: "narrow",
      description:
        "В колонке ширины телефона действия страницы переносятся под заголовок, а не сжимают его.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "`PageContent.Title` — `<h1>`; один на страницу.",
      "Назовите `PageContent.Section` через `aria-labelledby` на `id` заголовка.",
    ],
  },
};
