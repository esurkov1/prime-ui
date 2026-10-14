import { api } from "@/components/example-frame/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Frame } from "../icons";

export const page: ComponentPageConfig = {
  category: "infrastructure",
  nav: {
    segment: "example-frame",
    label: "Example Frame",
    summary: "Рамка примера: превью, код, вьюпорт",
    keywords: ["пример", "превью", "рамка", "viewport", "code"],
    icon: Frame,
    order: 1,
  },
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
      scenario: "initial-view",
      title: "Начальный вид",
      description:
        "Рамка матрицы открывается на ширине телефона в тёмной теме без переключателя темы и считает копирования кода — `previewLayout`, `defaultViewport`, `defaultColorScheme`, `showThemeToggle`, `onCopy`.",
    },
    {
      slot: "controlled",
      description:
        "Рамки одной страницы делят ширину превью и тему: обе хранит родитель — `viewport`, `onViewportChange`, `colorScheme`.",
    },
  ],
  api,
};
