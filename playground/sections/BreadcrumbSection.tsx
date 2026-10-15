import { api } from "@/components/breadcrumb/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ChevronsRight } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "breadcrumb",
    label: "Breadcrumb",
    summary: "Хлебные крошки: путь к странице",
    keywords: ["крошки", "путь", "breadcrumbs"],
    icon: ChevronsRight,
    order: 2,
  },
  dir: "breadcrumb",
  title: "Breadcrumb",
  kind: "navigation",
  description:
    "Путь к текущей странице над её заголовком: где находится страница и как подняться на уровень выше.",
  examples: [
    {
      slot: "overview",
      description:
        "Путь к странице: ссылки на уровни выше и текущая страница последней — `href`, `current`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; текст и шевроны следуют ярусу контрола — `size`.",
    },
    {
      slot: "with-icon",
      description:
        "Корневой уровень иконкой «дом»; ссылке без текста нужно имя для скринридеров — `aria-label`.",
    },
    {
      slot: "overflow",
      description:
        "Длинный путь: уровни обрезаются, а в контейнере 320px средние сворачиваются в меню «…», которое их перечисляет — `Breadcrumb.Item`, `current`.",
    },
    {
      scenario: "ellipsis",
      title: "Пропущенные уровни",
      description:
        "Намеренно пропущенные уровни как «…», скрытый текст которого называет их скринридеру — `Breadcrumb.Ellipsis`, `labels`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Ссылки роутера как уровни выше: путь переходит без перезагрузки; рендерите внутри роутера — `asChild`, `current`.",
    },
  ],
  api,
};
