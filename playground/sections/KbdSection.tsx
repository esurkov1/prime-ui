import { api } from "@/components/kbd/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "kbd",
  title: "Kbd",
  kind: "primitive",
  description:
    "Подпись клавиши или сочетания: нативный `<kbd>`, моноширинный шрифт на утопленной подложке без обводки. Внутри кнопки или поля клавиша сама берёт ярус на ступень ниже контрола.",
  examples: [
    {
      slot: "overview",
      description:
        "Сочетание — по одному `Kbd` на клавишу; у символов есть имя — `aria-label`, `title`.",
    },
    { slot: "sizes", description: "Все ярусы бейджа, высота от 16 до 32 px — `size`." },
    {
      scenario: "in-controls",
      title: "Внутри контрола",
      description:
        "В кнопке и поле клавиша берёт ярус на ступень ниже; явный `size` перекрывает его.",
    },
    {
      scenario: "shortcut-list",
      title: "Справка по клавишам",
      description: "Действие слева, клавиши справа, иконка внутри клавиши.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Нативный `<kbd>`: текст клавиши читается как есть.",
      "Символьным клавишам (⌘ ⌥ ⇧ ↵) нужны `aria-label` и `title` («Command», «Shift»).",
      'Визуальный «+» между клавишами — `aria-hidden="true"`.',
    ],
  },
};

export default function KbdSection() {
  return <ComponentPage page={page} />;
}
