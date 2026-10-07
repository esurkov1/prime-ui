import { api } from "@/components/segmented-control/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "segmented-control",
  title: "SegmentedControl",
  kind: "control",
  description:
    "Выбор одного из 2–5 вариантов или режимов с мгновенным эффектом: период, вид списка, тема. Для переключения панелей — Tabs.",
  examples: [
    {
      slot: "overview",
      description:
        "Одно значение из нескольких; бегунок скользит к выбранному сегменту — `defaultValue`, `aria-label`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; внешняя высота равна высоте контрола того же яруса — `size`.",
    },
    {
      slot: "states",
      description:
        "Без выбора, неактивный сегмент и неактивная группа рядом с обычной — `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка перед подписью и квадратные сегменты только с иконкой и именем для скринридеров — `SegmentedControl.Icon`, `aria-label`.",
    },
    {
      scenario: "colors",
      title: "Цвет варианта",
      description:
        "Статус у каждого варианта: точка его оттенка перед подписью и окрашенный бегунок при выборе — `color`.",
    },
    {
      scenario: "full-width",
      title: "На всю ширину",
      description:
        "Группа заполняет колонку; сегменты делят ширину поровну и обрезают длинные подписи — `fullWidth`.",
    },
    {
      scenario: "scroll",
      title: "Прокрутка",
      description:
        "Сегменты не переносятся: в колонке уже ряда он прокручивается с затуханием краёв и показывает выбранный сегмент.",
    },
    {
      scenario: "two-line",
      title: "Две строки",
      description:
        "Подпись и счётчик в первой строке, показатель во второй — `SegmentedControl.Label`, `SegmentedControl.Count`, `SegmentedControl.Description`.",
    },
    {
      slot: "controlled",
      description:
        "Выбор хранит родитель и обновляет по нему другой контент — `value`, `onValueChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "ArrowRight · ArrowDown",
        action: "Следующий вариант по кругу, пропуская неактивные; фокус и выбор двигаются вместе.",
      },
      { keys: "ArrowLeft · ArrowUp", action: "Предыдущий вариант." },
      { keys: "Home · End", action: "Первый и последний доступный вариант." },
      {
        keys: "Tab",
        action: "Входит в группу на выбранном варианте (или первом доступном) и выходит из неё.",
      },
    ],
    aria: [
      'Корень — `role="radiogroup"`: всегда назовите его `aria-label` или `aria-labelledby`; при `disabled` — `aria-disabled`.',
      'Варианты — `<button role="radio" aria-checked>` с перемещаемым `tabIndex`.',
      "В двухстрочном сегменте имя — подпись и счётчик, описание — `aria-describedby`.",
      "Иконки скрыты (`aria-hidden`); сегменту только с иконкой нужен `aria-label`.",
    ],
  },
};

export default function SegmentedControlSection() {
  return <ComponentPage page={page} />;
}
