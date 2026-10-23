import { api } from "@/components/list/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { List } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "list",
    label: "List",
    summary: "Список записей: заявки, письма, счета",
    keywords: [
      "список",
      "обращения",
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
    "Список выбираемых строк — левая половина экрана «список + карточка»: заявки, письма, записи. Открытая запись — `current`, строки — кнопки или ссылки.",
  examples: [
    {
      slot: "overview",
      description:
        "Очередь обращений: тема с бейджем, состояние и клиент под ней, время обновления и число открытых в конце; клик открывает обращение и делает строку текущей — `current`, `onClick`, `List.ItemBadges`, `StatusDot`.",
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
        "Аватары клиентов, иконки очередей, устройства сеансов, сроки аренд и цветные точки проектов в начале строки; рядом с двумя строками аватар и кольцо высотой в эти строки, иконка — на плашке, точка — в рамке шириной с иконку — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Badge.Dot`.",
    },
    {
      slot: "overflow",
      description:
        "Длинный список в панели фиксированной высоты: он прокручивается в ScrollContainer, длинные названия и превью обрезаются — `List.ItemText`, `List.ItemDescription`.",
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
        "Этапы воронки одним списком: переключатели завершают строки; «Изменить порядок» меняет их на ручки, этапы команды переносят за ручку или Alt + стрелками и сохраняют на сервере, системные держат место — на месте ручки замок — `onReorder`, `value`, `locked`, `List.ItemActions`.",
    },
    {
      scenario: "row-controls",
      title: "Контролы в строке",
      description:
        "Этапы воронки со своими контролами: цветная точка называет оттенок этапа, переключатель показывает его на доске, меню правит его — всё рядом со строкой, которая открывает этап — `List.ItemActions`, `Badge.Dot`.",
    },
  ],
  api,
};
