import { Minus } from "lucide-react";
import { api } from "@/components/divider/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "divider",
    label: "Divider",
    summary: "Разделитель с подписью и без",
    keywords: ["разделитель", "линия", "separator"],
    icon: Minus,
    order: 5,
  },
  dir: "divider",
  title: "Divider",
  kind: "primitive",
  description:
    "Волосяная линия внутри одной поверхности: между строками списка, группами кнопок, как заголовок секции или «или». Карточки и панели разделяют заливкой и воздухом, а не линией.",
  examples: [
    { slot: "overview", description: "Линии между строками списка настроек." },
    {
      slot: "sizes",
      description: "Подпись на каждом ярусе — под размер контента вокруг — `size`.",
    },
    {
      slot: "with-icon",
      description: "Иконка перед подписью и одна иконка на линии; размер задаёт разделитель.",
    },
    {
      scenario: "align",
      title: "Положение подписи",
      description: "Подпись в начале, по центру или в конце; `start` — заголовок секции — `align`.",
    },
    {
      scenario: "vertical",
      title: "Вертикальный",
      description: "Вертикальная линия между группами кнопок панели — `orientation`.",
    },
    {
      scenario: "or-separator",
      title: "Разделитель «или»",
      description: "Линия «или» между двумя способами входа.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      '`role="separator"`; у вертикального — `aria-orientation="vertical"`.',
      'Чисто визуальная линия (между строками, которые и так разделены) — `role="presentation"`.',
      "Подпись читается как текст разделителя; у разделителя с одной иконкой задайте `aria-label`.",
    ],
  },
};
