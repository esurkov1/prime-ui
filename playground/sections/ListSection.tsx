import { api } from "@/components/list/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { List } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "list",
    label: "List",
    summary: "Список записей: диалоги, заявки, письма",
    keywords: [
      "список",
      "диалоги",
      "заявки",
      "почта",
      "список + карточка",
      "master detail",
      "current",
      "asChild",
    ],
    icon: List,
    order: 7,
  },
  dir: "list",
  title: "List",
  kind: "navigation",
  description:
    "Список выбираемых строк — левая половина экрана «список + карточка»: диалоги, заявки, письма, записи. Открытая запись — `current`, строки — кнопки или ссылки.",
  examples: [
    {
      slot: "overview",
      description:
        "Диалоги поддержки с превью, временем и счётчиком непрочитанных; клик открывает диалог и делает строку текущей — `current`, `onClick`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: высота строки, кегль, иконка и счётчик следуют ярусу — `size`.",
    },
    {
      slot: "states",
      description: "Открытая запись, обычная строка и недоступная — `current`, `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Аватары клиентов и иконки очередей в начале строки; слот подгоняет аватар под ярус — `List.ItemIcon`.",
    },
    {
      slot: "overflow",
      description:
        "Длинный список в панели фиксированной высоты: он прокручивается в ScrollContainer, длинные названия и превью обрезаются.",
    },
    {
      scenario: "as-link",
      title: "Ссылками",
      description:
        "Строки — ссылки на страницы счетов: обычная ссылка или ссылка роутера через слот — `href`, `asChild`.",
    },
    {
      scenario: "reorder",
      title: "Перестановка",
      description:
        "Этапы воронки в порядке команды: этап переносят за ручку или Alt + стрелками, порядок сохраняется на сервере — `onReorder`, `value`.",
    },
  ],
  api,
};
