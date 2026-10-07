import { api } from "@/components/color-swatches/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "color-swatches",
  title: "ColorSwatches",
  kind: "control",
  description:
    "Выбор цвета прямо в форме: образцы палитры переносятся по ширине, без поповера. Компактный выбор рядом с полем — ColorPresets, свободный цвет — ColorPicker.",
  examples: [
    {
      slot: "overview",
      description: "Палитра кита под подписью поля, один цвет выбран — `label`, `defaultValue`.",
    },
    { slot: "sizes", description: "Все размеры, образец от 20 до 40 px с зазором яруса — `size`." },
    {
      slot: "states",
      description: "Обычная палитра рядом с ошибочной и неактивной — `invalid`, `disabled`.",
    },
    {
      scenario: "wrapping",
      title: "Перенос",
      description: "В узкой колонке образцы переносятся сами, а стрелки ходят по видимым рядам.",
    },
    {
      slot: "controlled",
      description:
        "Цветом владеет родитель, включая «без цвета», и называет его в подсказке — `value`, `onValueChange`, `allowEmpty`.",
    },
    {
      slot: "in-form",
      description:
        "Форма события календаря: цвет отправляется по `name` и обязателен при сохранении — `name`, `required`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Вход на выбранный образец (или первый)." },
      { keys: "ArrowRight · ArrowLeft", action: "Следующий / предыдущий образец с выбором." },
      { keys: "ArrowDown · ArrowUp", action: "На видимый ряд ниже / выше с выбором." },
      { keys: "Home · End", action: "Первый / последний образец с выбором." },
    ],
    aria: [
      '`role="radiogroup"` с кнопкой `role="radio"` на каждый образец; название цвета — имя и `title` образца.',
      "Группу называют `label`, `aria-labelledby`, `aria-label` или `labels.group`; подсказка или ошибка — через `aria-describedby`.",
      "Галочка декоративна; выбор объявляет `aria-checked`.",
    ],
  },
};

export default function ColorSwatchesSection() {
  return <ComponentPage page={page} />;
}
