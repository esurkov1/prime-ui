import { api } from "@/components/timeline/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { History } from "../icons";

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
        "Лента операций: одна подписанная группа, линия через точки, строка под курсором выделяется — `Timeline.Group`, `Timeline.ItemValue`.",
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
        "История обслуживания с промежутками между событиями, подписью справа у промежутка, двумя строками меты под ремонтом и второй строкой суммы — `Timeline.Gap`, `Timeline.Description`, `Timeline.ItemMeta`.",
    },
    {
      scenario: "links",
      title: "Открытие строки",
      description:
        "Строки, которые что-то открывают: страницу операции — ссылкой или ссылкой роутера через слот, чек на месте — кнопкой; по одной точке табуляции и кольцо фокуса — `href`, `asChild`, `onClick`.",
    },
    {
      slot: "narrow",
      description:
        "На 375 px заголовок переносится, а сумма остаётся справа; уже 20rem собственной ширины сумма уходит под строку даты — `Timeline.ItemValue`.",
    },
  ],
  api,
};
