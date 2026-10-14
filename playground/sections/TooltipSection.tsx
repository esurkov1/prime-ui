import { api } from "@/components/tooltip/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CircleQuestionMark } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "tooltip",
    label: "Tooltip",
    summary: "Короткая подсказка при наведении",
    keywords: ["подсказка", "тултип", "hover", "side"],
    icon: CircleQuestionMark,
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
        "Все стороны, выравнивание по месту, по началу и концу триггера; без места чип переворачивается и сдвигается, стрелка указывает на триггер — `side`, `align`.",
    },
    {
      scenario: "toolbar",
      title: "Панель инструментов",
      description:
        "Панель форматирования в одной группе: после первой подсказки соседние полсекунды открываются сразу, у каждой имя и сочетание клавиш — `Tooltip.Provider`, `skipDelayDuration`.",
    },
    {
      scenario: "disabled-trigger",
      title: "Неактивная кнопка",
      description:
        "Почему действие недоступно: неактивная кнопка показывает подсказку при наведении и Tab без обёртки — `Tooltip.Trigger`.",
    },
    {
      scenario: "non-interactive-trigger",
      title: "Бейдж, аватар, иконка",
      description:
        "Бейдж статуса, аватар и информационная иконка поясняют себя: кит делает их фокусируемыми, подсказка открывается и с клавиатуры — `Tooltip.Trigger`.",
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
};
