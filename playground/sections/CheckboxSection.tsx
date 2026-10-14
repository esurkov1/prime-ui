import { api } from "@/components/checkbox/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { SquareCheckBig } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "checkbox",
    label: "Checkbox",
    summary: "Флажок: checked, indeterminate, группы",
    keywords: ["чекбокс", "флажок", "checked", "onCheckedChange", "indeterminate"],
    icon: SquareCheckBig,
    order: 1,
  },
  dir: "checkbox",
  title: "Checkbox",
  kind: "control",
  description:
    "Независимый выбор «да / нет», который отправляется вместе с формой: отмечено, частично, с подсказкой или ошибкой. Настройка, которая применяется сразу, — Switch.",
  examples: [
    {
      slot: "overview",
      description: "Флажок с подписью; клик по всей строке переключает его.",
    },
    {
      slot: "variants",
      description: "Скруглённый квадрат и круг рядом в трёх состояниях — `shape`.",
    },
    { slot: "sizes", description: "Все размеры; квадрат и текст берут ярус контрола — `size`." },
    {
      slot: "states",
      description:
        "Все состояния рядом, каждое подписано своим пропом — `checked`, `indeterminate`, `readOnly`, `invalid`, `disabled`.",
    },
    {
      scenario: "without-label",
      title: "Без подписи",
      description:
        "Квадраты в строках таблицы с именем из `aria-label`, отправляются с `name` и `value`.",
    },
    {
      scenario: "indicator",
      title: "Индикатор в строке списка",
      description:
        "Только квадрат в списке множественного выбора: строка несёт `aria-selected`, квадрат лишь показывает его — `Checkbox.Indicator`.",
    },
    {
      slot: "controlled",
      description:
        "Выбором владеет родитель; «выбрать все» становится частичным при неполном выборе — `checked`, `onCheckedChange`, `indeterminate`.",
    },
    {
      slot: "in-form",
      description:
        "Согласие в форме регистрации: подсказка под текстом, ошибка после отправки без галочки — `required`, `hint`, `error`.",
    },
  ],
  api,
};
