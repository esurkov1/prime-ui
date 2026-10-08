import { api } from "@/components/hint/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Info } from "../icons";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "hint",
    label: "Hint",
    summary: "Подсказка и сообщение об ошибке под полем",
    keywords: ["подсказка", "ошибка", "hint", "error", "invalid"],
    icon: Info,
    order: 7,
  },
  dir: "hint",
  title: "Hint",
  kind: "primitive",
  description:
    "Подсказка или ошибка под полем. Поля с пропсами `hint` и `error` рисуют её сами; отдельный Hint — для контролов без них.",
  examples: [
    {
      slot: "overview",
      description:
        "Подсказка под контролом без своего пропа `hint`, связанная с ним через `id` и `aria-describedby`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы под стать полю: 12/16 для xs–m, 13/20 для l и xl — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычная подсказка рядом с ошибкой и подсказкой под неактивным контролом — `invalid`, `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка в начале по центру первой строки — в обычном состоянии и в ошибке — `Hint.Icon`.",
    },
    {
      scenario: "hint-or-error",
      title: "Ошибка вместо подсказки",
      description:
        "После проверки ошибка занимает место подсказки в том же элементе без скачка и озвучивается — `invalid`, `role`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Дайте подсказке `id` и добавьте его в `aria-describedby` контрола — скринридер прочтёт её вместе с полем.",
      'Ошибке, которая появляется после действия пользователя, добавьте `role="alert"`.',
      "`Hint.Icon` декоративна: смысл несёт текст.",
    ],
  },
};
