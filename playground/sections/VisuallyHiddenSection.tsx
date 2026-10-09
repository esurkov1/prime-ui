import { api } from "@/components/visually-hidden/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { EyeOff } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "visually-hidden",
    label: "VisuallyHidden",
    summary: "Текст только для скринридеров",
    keywords: ["скринридер", "доступность", "sr-only", "aria-live", "объявление", "a11y"],
    icon: EyeOff,
    order: 20,
  },
  dir: "visually-hidden",
  title: "VisuallyHidden",
  kind: "primitive",
  description:
    "Текст, который зачитывают скринридеры и не видит никто: слова за иконкой, бейджем или изменением на экране.",
  examples: [
    {
      slot: "overview",
      description:
        "Число, которое зрячие считывают по раскладке, словами для скринридера, и вежливое объявление после действия — `VisuallyHidden`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Текст остаётся в дереве доступности и входит в имя элемента вокруг.",
      'С `role="status"` и `aria-live="polite"` — вежливая живая область: держите её смонтированной и меняйте текст.',
    ],
  },
};
