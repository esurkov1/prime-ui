import { CircleDot } from "lucide-react";
import { api } from "@/components/radio/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "radio",
    label: "Radio",
    summary: "Радиокнопки: выбор одного варианта",
    keywords: ["радио", "переключатель", "RadioGroup", "value", "onValueChange"],
    icon: CircleDot,
    order: 2,
  },
  dir: "radio",
  title: "Radio",
  kind: "control",
  description:
    "Один вариант из нескольких взаимоисключающих, когда все варианты должны быть видны сразу и выбор отправляется с формой.",
  examples: [
    {
      slot: "overview",
      description: "Группа с подписью и вариантом по умолчанию — `label`, `defaultValue`.",
    },
    { slot: "sizes", description: "Все размеры; кружок и текст берут ярус группы — `size`." },
    {
      slot: "states",
      description:
        "Все состояния, каждое в своей группе и подписано пропом — `value`, `invalid`, `disabled`.",
    },
    {
      slot: "group",
      description:
        "Обязательная группа с описаниями вариантов и ошибкой группы под ними — `label`, `required`, `hint`, `error`.",
    },
    {
      slot: "orientation",
      description: "Варианты столбцом и рядом с переносом — `orientation`.",
    },
    {
      slot: "controlled",
      description:
        "Выбранным тарифом владеет родитель и показывает его в подсказке — `value`, `onValueChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус на выбранный вариант (или первый, если ничего не выбрано)." },
      {
        keys: "ArrowDown · ArrowRight · ArrowUp · ArrowLeft",
        action: "Выбирает следующий или предыдущий вариант группы (нативное поведение radio).",
      },
      { keys: "Space", action: "Выбирает вариант в фокусе." },
    ],
    aria: [
      '`Radio.Group` — `role="radiogroup"`, названный подписью (`label`) через `aria-labelledby` или `aria-label`.',
      "`aria-required`, `aria-invalid`, `aria-orientation` на группе; подсказка или ошибка группы — в её `aria-describedby`.",
      'Каждый вариант — нативный `<input type="radio">` с общим `name`; описание варианта (`hint`) связано через `aria-describedby`.',
    ],
  },
};
