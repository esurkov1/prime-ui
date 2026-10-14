import { api } from "@/components/divider/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Minus } from "../icons";

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
    { slot: "overview", description: "Линии между строками карточки настроек — `Divider`." },
    {
      slot: "sizes",
      description: "Подпись на каждом ярусе — под размер контента вокруг — `size`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка перед подписью и одна иконка на линии с именем `aria-label`; размер иконки задаёт разделитель — `Icon`, `aria-label`.",
    },
    {
      scenario: "align",
      title: "Положение подписи",
      description: "Подпись в начале, по центру или в конце; `start` — заголовок секции — `align`.",
    },
    {
      scenario: "vertical",
      title: "Вертикальный",
      description:
        "Вертикальные линии между группами кнопок: одна на высоту ряда, другая с отступами, в строку текста — `orientation`, `inset`.",
    },
    {
      scenario: "or-separator",
      title: "Разделитель «или»",
      description:
        "Линия «или» между двумя способами входа; подпись даёт разделителю имя — `Divider`.",
    },
  ],
  api,
};
