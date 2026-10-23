import { api } from "@/components/list/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { List } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "list",
    label: "List",
    summary: "Список записей и мест: заявки, письма, счета, этапы",
    keywords: [
      "список",
      "строка",
      "обращения",
      "заявки",
      "почта",
      "список + карточка",
      "master detail",
      "выбор",
      "перестановка",
      "current",
    ],
    icon: List,
    order: 7,
  },
  dir: "list",
  title: "List",
  kind: "navigation",
  description:
    "Список записей или мест из единой строки кита — той же, что в Sidebar, меню, Select и Timeline. Открытая запись — `current`, строки — кнопки, ссылки или простые блоки; со значением список становится выбором, с `onReorder` — переставляется.",
  examples: [
    {
      slot: "overview",
      description:
        "Очередь обращений: тема с номером и бейджем, состояние и клиент под ней, время обновления над числом новых ответов; клик открывает обращение и делает строку текущей — `current`, `onClick`, `number`, `List.ItemBadges`, `StatusDot`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: строка от 28 до 48, с описанием от 44 до 68; метка, текст, счётчик и контролы следуют ярусу — `size`.",
    },
    {
      slot: "states",
      description:
        "Открытая запись, обычная строка и недоступная, у которой бледнеют заголовок, описание и метка — `current`, `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Все метки — в строке без описания и с описанием: иконка голая и на плитке, аватар, кольцо прогресса, миниатюра, цветная точка; метка без своего размера берёт размер строки и никогда её не растит — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Thumbnail.Root`, `Badge.Dot`.",
    },
    {
      slot: "overflow",
      description:
        "Длинный список в панели фиксированной высоты: он прокручивается в ScrollContainer, длинные темы и клиенты обрезаются в конце, номера — никогда — `List.ItemText`, `number`, `List.ItemDescription`.",
    },
    {
      scenario: "as-link",
      title: "Ссылками",
      description:
        "Строки — ссылки на страницы счетов: обычная ссылка или ссылка роутера через слот; сумма стоит в конце — `href`, `asChild`, `List.ItemMeta`.",
    },
    {
      scenario: "groups",
      title: "Группы",
      description:
        "Ящики по группам под подписями, как в Sidebar и меню: количество — простым числом, новое — цветным бейджем — `List.Group`, `label`, `List.ItemCount`.",
    },
    {
      scenario: "actions",
      title: "Кнопки в строке",
      description:
        "Документы со своими кнопками: кнопки-иконки с подсказкой, soft, высотой «строка минус 8»; список показывает их всегда или при наведении и фокусе в строке — `List.ItemActions`, `actions`.",
    },
    {
      scenario: "row-controls",
      title: "Переключатель в строке",
      description:
        "Этапы воронки с переключателем в конце: щелчок в любом месте строки переключает его, меню рядом — ghost, чтобы не спорить с переключателем — `List.ItemActions`, `List.ItemCount`, `Badge.Dot`.",
    },
    {
      scenario: "reorder",
      title: "Перестановка",
      description:
        "Этапы воронки в одном порядке: ручки видны всегда — по умолчанию в конце, в начале или тянется вся строка; этапы команды переносят и сохраняют на сервере, системные держат место — на месте ручки замок — `onReorder`, `handle`, `value`, `locked`.",
    },
    {
      slot: "controlled",
      description:
        "Выбор, которым владеет экран: несколько наблюдателей флажками (отмеченная строка — мягкий тон акцента) и одна роль с галочкой в конце — `value`, `onValueChange`, `multiple`, `indicator`.",
    },
    {
      slot: "narrow",
      description:
        "В колонке телефона ничего не переносится внутри строки: заголовок уступает до минимума, бейджи сворачиваются в счётчик, иконки остаются, подписанная кнопка уходит под текст — `List.ItemBadges`, `List.ItemActions`.",
    },
  ],
  api,
};
