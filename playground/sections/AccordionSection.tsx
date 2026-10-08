import { ChevronsDownUp } from "lucide-react";
import { api } from "@/components/accordion/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "layout",
  nav: {
    segment: "accordion",
    label: "Accordion",
    summary: "Раскрывающиеся секции",
    keywords: ["аккордеон", "раскрытие", "collapse", "value", "onValueChange"],
    icon: ChevronsDownUp,
    order: 4,
  },
  dir: "accordion",
  title: "Accordion",
  kind: "navigation",
  description:
    "Сворачиваемые разделы: вопросы и ответы, группы настроек, шаги оформления. Для переключения равноправных видов — Tabs.",
  examples: [
    {
      slot: "overview",
      description: "Вопросы и ответы, открыт один ответ за раз — `defaultValue`.",
    },
    {
      slot: "variants",
      description:
        "Одна поверхность с тонкими линиями между разделами или каждый раздел отдельной карточкой — `layout`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: высота заголовка, кегль, иконка и отступы растут вместе — `size`.",
    },
    {
      slot: "states",
      description: "Неактивный раздел, который нельзя открыть, рядом с обычными — `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка перед подписью каждого раздела; содержимое выравнивается по подписи — `Accordion.Icon`.",
    },
    {
      scenario: "multiple",
      title: "Несколько открытых",
      description: "Несколько разделов открыты одновременно; значение — список — `multiple`.",
    },
    {
      scenario: "collapsible",
      title: "Всегда открыт один",
      description: "Шаги оформления, где один шаг всегда остаётся открытым — `collapsible`.",
    },
    {
      slot: "controlled",
      description:
        "Открытые разделы хранит родитель и открывает или закрывает все сразу — `value`, `onValueChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Переводит фокус между заголовками разделов; неактивный пропускается.",
      },
      { keys: "Enter · Space", action: "Открывает или закрывает раздел." },
    ],
    aria: [
      "Заголовок — нативная `<button>` внутри `<h3>` с `aria-expanded` и `aria-controls`.",
      "Содержимое — `<section>` с `aria-labelledby`; закрытое — `inert` и `aria-hidden`, его поля выходят из порядка Tab.",
      "Шеврон и `Accordion.Icon` скрыты (`aria-hidden`).",
    ],
  },
};
