import { api } from "@/components/color-swatches/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { SwatchBook } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "color-swatches",
    label: "Color Swatches",
    summary: "Выбор цвета из образцов прямо в форме",
    keywords: ["цвет", "образцы", "палитра", "swatches", "inline", "value", "onValueChange"],
    icon: SwatchBook,
    order: 13,
  },
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
    {
      slot: "sizes",
      description:
        "Все размеры: высота образца от 20 до 40 px с зазором яруса, подпись остаётся подписью формы — `size`.",
    },
    {
      slot: "states",
      description: "Обычная палитра рядом с ошибочной и неактивной — `invalid`, `disabled`.",
    },
    {
      scenario: "wrapping",
      title: "Перенос",
      description:
        "Двенадцать цветов этапа в узкой колонке сами переносятся поровну по рядам, а стрелки ходят по видимым рядам — `presets`.",
    },
    {
      scenario: "palette",
      title: "Палитра кита",
      description:
        "Этап воронки берёт оттенок палитры кита, поэтому его бейдж и колонка читаются одинаково в обеих темах — `mode`, `palette`.",
    },
    {
      slot: "controlled",
      description:
        "Цветом владеет родитель, включая «без цвета», и называет его в подсказке — `value`, `onValueChange`, `allowEmpty`.",
    },
    {
      slot: "in-form",
      description:
        "Форма события календаря: цвет отправляется по `name` и обязателен при сохранении: пустое название или цвет без выбора трясут поле, ввод и выбор снимают ошибку — `name`, `required`, `error`.",
    },
  ],
  api,
};
