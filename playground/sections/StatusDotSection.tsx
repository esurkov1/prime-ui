import { api } from "@/components/status-dot/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CircleDot } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "status-dot",
    label: "StatusDot",
    summary: "Точка состояния перед словом в строке текста",
    keywords: ["статус", "точка", "состояние", "индикатор", "status", "dot"],
    icon: CircleDot,
    order: 5,
  },
  dir: "status-dot",
  title: "StatusDot",
  kind: "primitive",
  description:
    "Состояние в строке текста: точка тона и слово, которое его называет. Берёт шрифт и цвет окружающего текста; плашка со статусом — это Badge.",
  examples: [
    { slot: "overview", description: "Состояние словом с точкой — `tone`." },
    {
      slot: "variants",
      description: "Все тона точки; слово называет состояние и без цвета — `tone`.",
    },
    {
      scenario: "in-text",
      title: "В тексте",
      description: "Состояние в начале описания карточки, в её шрифте и цвете — `tone`.",
    },
  ],
  api,
};
