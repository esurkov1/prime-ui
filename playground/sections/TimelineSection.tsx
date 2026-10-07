import { api } from "@/components/timeline/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "timeline",
  title: "Timeline",
  kind: "composite",
  description:
    "Лента событий: точки на тонкой линии, событие и дата, сумма справа, группы под заголовками. Шаги процесса — Stepper.",
  examples: [
    {
      slot: "overview",
      description:
        "Лента операций: одна подписанная группа, линия через точки и выделенная текущая строка — `Timeline.Group`, `current`.",
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
      scenario: "selectable",
      title: "Выбор строки",
      description:
        "Строки с обработчиком клика становятся кнопками и открывают детали; открытая строка остаётся текущей — `onClick`, `current`.",
    },
    {
      scenario: "hover-highlight",
      title: "Выделение при наведении",
      description:
        "Строки-ссылки выделяются только под курсором или в фокусе, без постоянной текущей строки — `highlight`, `href`.",
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
      '`current` ставит `aria-current="true"`.',
    ],
  },
};

export default function TimelineSection() {
  return <ComponentPage page={page} />;
}
