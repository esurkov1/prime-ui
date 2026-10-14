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
        "Длинный путь: уровни обрезаются, а в контейнере 320px средние сворачиваются в «…», которое скринридер называет «Скрытые разделы» — `Breadcrumb.Item`, `current`.",
    },
    {
      scenario: "ellipsis",
      title: "Пропущенные уровни",
      description:
        "Намеренно пропущенные уровни как «…» со скрытым текстом для скринридеров — `Breadcrumb.Ellipsis`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Переводит фокус между ссылками уровней; текущая страница не фокусируется.",
      },
      { keys: "Enter", action: "Переходит по ссылке." },
    ],
    aria: [
      "Область `nav` с `aria-label` из `labels.nav` и упорядоченный список `<ol>`.",
      'Текущая страница — `aria-current="page"`; шевроны и знак «…» скрыты (`aria-hidden`).',
      "При 3+ уровнях в контейнере уже 30rem средние уровни получают `display: none` — уходят из раскладки, порядка Tab и дерева доступности; на их месте «…», скрытый текст которого (`labels.ellipsis`) читается скринридером.",
      "Ссылке только с иконкой нужен `aria-label`.",
    ],
  },
};
