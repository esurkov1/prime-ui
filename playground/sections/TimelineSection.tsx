import { History } from "lucide-react";
import { api } from "@/components/timeline/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "timeline",
    label: "Timeline",
    summary: "Лента событий: точки на линии, дата, сумма",
    keywords: [
      "таймлайн",
      "лента",
      "история",
      "события",
      "активность",
      "activity",
      "feed",
      "операции",
    ],
    icon: History,
    order: 8,
  },
  dir: "timeline",
  title: "Timeline",
  kind: "composite",
  description:
    "Лента событий: точки на тонкой линии, событие и дата, сумма справа, группы под заголовками. Шаги процесса — Stepper.",
  examples: [
    {
      slot: "overview",
      description:
        "Лента операций: одна подписанная группа, линия через точки, строка под курсором выделяется — `Timeline.Group`, `Timeline.Value`.",
    },
    {
      slot: "variants",
      description:
        "Оттенки точек для категорий приглушённо и тоны статуса на строках, суммах и промежутках в полную силу — `color`, `tone`.",
    },
    {
      slot: "sizes",
      description: "Каждый ярус меняет текст, точку и ритм строк, высота от 40 до 76 px — `size`.",
    },
    {
      slot: "structure",
      description:
        "История обслуживания с промежутками между событиями, подписью справа у промежутка и второй строкой суммы — `Timeline.Gap`, `Timeline.GapMeta`, `Timeline.ValueMeta`.",
    },
    {
      scenario: "links",
      title: "Строки-ссылки",
      description:
        "Строки, открывающие страницу операции, становятся ссылками: по одной точке табуляции и кольцо фокуса — `href`.",
    },
    {
      slot: "narrow",
      description:
        "На 375 px заголовок переносится, а сумма остаётся справа; уже 20rem собственной ширины сумма уходит под строку даты.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Интерактивные строки — по одной точке табуляции; кольцо фокуса внутри строки.",
      },
      { keys: "Enter · Space", action: "Активирует строку-кнопку; Enter открывает строку-ссылку." },
    ],
    aria: [
      "Каждая группа — `<ol>` с именем из заголовка (`aria-labelledby`); события — `<li>`.",
      "Точка скрыта (`aria-hidden`): статус пишите в заголовке или мете, а не только цветом.",
    ],
  },
};
