import { LayoutGrid } from "lucide-react";
import { api } from "@/components/button-group/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "actions",
  nav: {
    segment: "button-group",
    label: "Button Group",
    summary: "Сгруппированные кнопки и переключатели",
    keywords: ["группа кнопок", "toolbar", "pressed", "orientation"],
    icon: LayoutGrid,
    order: 2,
  },
  dir: "button-group",
  title: "ButtonGroup",
  kind: "control",
  description:
    "Соединённые кнопки и сегменты-переключатели в одной нейтральной полосе: связанные действия или переключатели панели инструментов.",
  examples: [
    {
      slot: "overview",
      description: "Связанные действия в одной полосе с именем группы — `aria-label`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы, от 28 до 48 px, один раз на корне — `size`.",
    },
    {
      slot: "states",
      description: "Обычный сегмент, включённый и неактивный — `pressed`, `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка перед подписью и квадратные сегменты только с иконкой — `ButtonGroup.Icon`, `aria-label`.",
    },
    {
      slot: "orientation",
      description: "Сегменты в ряд и столбец связанных вариантов — `orientation`.",
    },
    {
      scenario: "full-width",
      title: "На всю ширину",
      description: "Группа заполняет колонку, сегменты делят ширину поровну — `fullWidth`.",
    },
    {
      slot: "controlled",
      description: "Один из нескольких: активный сегмент хранит родитель и ставит `pressed`.",
    },
    {
      slot: "in-form",
      description:
        "Сегменты — нативные кнопки, поэтому отправка и сброс работают в одной группе — `type`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переводит фокус между сегментами; неактивный пропускается." },
      { keys: "Enter · Space", action: "Нажимает сегмент (нативная `<button>`)." },
    ],
    aria: [
      'Корень — `role="group"`: дайте ему `aria-label`; для нескольких групп поставьте `role="toolbar"` на общий контейнер.',
      "Сегменты-переключатели объявляют `aria-pressed`; в наборе переключателей передайте `pressed={false}` остальным.",
      "Сегменту только с иконкой нужен `aria-label`; `ButtonGroup.Icon` скрыт (`aria-hidden`).",
    ],
  },
};
