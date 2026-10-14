import { api } from "@/components/segmented-control/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Rows3 } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "segmented-control",
    label: "Segmented Control",
    summary: "Переключатель между взаимоисключающими вариантами",
    keywords: ["сегменты", "переключатель", "value", "onValueChange"],
    icon: Rows3,
    order: 4,
  },
  dir: "segmented-control",
  title: "SegmentedControl",
  kind: "control",
  description:
    "Выбор одного из 2–5 вариантов или режимов с мгновенным эффектом: период, вид списка, тема; в форме — поле с подписью, подсказкой и ошибкой. Для переключения панелей — Tabs.",
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
        "Без выбора, ошибочная группа, неактивный сегмент и неактивная группа рядом с обычной — `invalid`, `disabled`.",
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
        "Группа заполняет колонку; сегменты стремятся к равной ширине, длинная подпись сохраняет свою — `fullWidth`.",
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
    {
      slot: "in-form",
      description:
        "Форма расхода: выбор — поле с подписью и подсказкой, проверяется при отправке, ошибка уходит, как только выбран сегмент; рядом необязательный выбор — `label`, `hint`, `required`, `error`, `optional`.",
    },
  ],
  api,
};
