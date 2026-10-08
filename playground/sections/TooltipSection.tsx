import { CircleHelp } from "lucide-react";
import { api } from "@/components/tooltip/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "tooltip",
    label: "Tooltip",
    summary: "Короткая подсказка при наведении",
    keywords: ["подсказка", "тултип", "hover", "side"],
    icon: CircleHelp,
    order: 1,
  },
  dir: "tooltip",
  title: "Tooltip",
  kind: "overlay",
  description:
    "Короткая подсказка рядом с элементом при наведении и фокусе с клавиатуры: имя иконки-кнопки, сочетание клавиш, причина недоступности.",
  examples: [
    {
      slot: "overview",
      description:
        "Кнопка-иконка с подсказкой, которая повторяет её имя при наведении и фокусе — `Tooltip.Trigger`, `Tooltip.Content`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы рядом с кнопками того же яруса; берите ярус контрола, который поясняете — `size`.",
    },
    {
      slot: "placement",
      description:
        "Все стороны и выравнивание по началу и концу триггера; без места чип переворачивается и сдвигается, стрелка указывает на триггер — `side`, `align`.",
    },
    {
      scenario: "toolbar",
      title: "Панель инструментов",
      description:
        "Панель форматирования в одной группе: после первой подсказки соседние открываются сразу, у каждой имя и сочетание клавиш — `Tooltip.Provider`.",
    },
    {
      scenario: "disabled-trigger",
      title: "Неактивная кнопка",
      description:
        "Почему действие недоступно: неактивная кнопка в фокусируемой обёртке показывает подсказку при наведении и Tab — `Tooltip.Trigger`.",
    },
    {
      scenario: "delay",
      title: "Задержка",
      description:
        "Задержка показа одной подсказки: сразу, 400 мс по умолчанию и секунда — `delayDuration`.",
    },
    {
      scenario: "long-content",
      title: "Длинный текст",
      description:
        "Предложение пояснения переносится по максимальной ширине; всё с действиями — в Popover — `Tooltip.Content`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель: переключатель показывает подсказку из кода, наведение и фокус тоже работают — `open`, `onOpenChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус на триггере открывает подсказку после задержки." },
      { keys: "Escape", action: "Скрывает подсказку; фокус остаётся на триггере." },
    ],
    aria: [
      'Чип — `role="tooltip"`; пока он открыт, триггер ссылается на него через `aria-describedby`.',
      "Подсказка — описание, а не имя: иконке-кнопке нужен свой `aria-label`.",
      "Указатель может перейти на чип — подсказка не закроется (WCAG 1.4.13); касание не открывает её, фокус — открывает.",
      "Неактивная кнопка не получает событий: оберните её в `<span tabIndex={0}>`.",
    ],
  },
};
