import { api } from "@/components/example-frame/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "example-frame",
  title: "ExampleFrame",
  kind: "layout",
  description:
    "Рамка документации: живой пример, его исходник и ширина устройства в одном блоке. На ней построены все страницы этого сайта.",
  examples: [
    {
      slot: "overview",
      description:
        "Живой пример рядом с исходником, с переключателями вида, ширины, темы и копированием — `code`, `previewLayout`.",
    },
    {
      slot: "controlled",
      description:
        "Рамки одной страницы делят ширину превью и тему: обе хранит родитель — `viewport`, `colorScheme`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Переводит фокус по переключателям, кнопкам темы и копирования, области кода.",
      },
      {
        keys: "ArrowLeft · ArrowRight",
        action: "Выбирают вид или ширину внутри переключателя (SegmentedControl).",
      },
    ],
    aria: [
      "Переключатели вида и ширины — радиогруппы с `aria-label` из `labels.paneSwitch` и `labels.viewportSwitch`.",
      "Кнопки темы и копирования — кнопки только с иконкой и `aria-label`; после копирования метка меняется на `labels.copied`.",
      "Область кода — фокусируемая `section` с `aria-label` из `labels.codeRegion`, её можно прокручивать с клавиатуры.",
    ],
  },
};

export default function ExampleFrameSection() {
  return <ComponentPage page={page} />;
}
