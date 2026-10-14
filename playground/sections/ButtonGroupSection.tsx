import { api } from "@/components/button-group/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutGrid } from "../icons";

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
      description:
        "Обычный сегмент, включённый, неактивный и группа с ошибкой — `pressed`, `disabled`, `invalid`.",
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
      description: "Один из нескольких: активный сегмент хранит родитель — `pressed`.",
    },
    {
      slot: "in-form",
      description:
        "Форма задачи: переключатели приоритета — поле с подписью, которое проверяется при отправке, необязательное напоминание, а нативные отправка и сброс стоят в одной группе — `label`, `required`, `hint`, `error`, `optional`, `type`.",
    },
  ],
  api,
};
