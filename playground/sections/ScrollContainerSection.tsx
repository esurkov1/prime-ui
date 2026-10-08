import { ScrollText } from "lucide-react";
import { api } from "@/components/scroll-container/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "layout",
  nav: {
    segment: "scroll-container",
    label: "Scroll Container",
    summary: "Прокручиваемая область с тонким скроллбаром",
    keywords: ["прокрутка", "скролл", "scroll", "axis"],
    icon: ScrollText,
    order: 6,
  },
  dir: "scroll-container",
  title: "ScrollContainer",
  kind: "layout",
  description:
    "Область прокрутки с тонким скроллбаром кита, которая правильно сжимается внутри flex и grid: лента, тело панели, полоса фильтров.",
  examples: [
    {
      slot: "overview",
      description:
        "Лента, которая прокручивается сама внутри карточки фиксированной высоты, с тонким скроллбаром кита.",
    },
    {
      slot: "variants",
      description:
        "Полоса с прокруткой вбок и широкое расписание с прокруткой в обе стороны — `axis`.",
    },
    {
      scenario: "edge-fade",
      title: "Затухание краёв",
      description:
        "Края затухают там, где скрыто содержимое; горизонтальная полоса ещё и прячет скроллбар — `fade`, `scrollbar`.",
    },
    {
      scenario: "overscroll",
      title: "Передача прокрутки",
      description:
        "В конце списка прокрутка переходит к странице, а не останавливается — `overscrollBehavior`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Обычный элемент без роли: если внутри нет фокусируемого содержимого, дайте `tabIndex={0}` и `aria-label`, чтобы область прокручивалась с клавиатуры.",
      "Для области-ориентира выберите `as` (`main`, `nav`, `aside`).",
      "`fade` — только маска: содержимое под ней доступно и прокручивается колесом, касанием и фокусом.",
    ],
  },
};
