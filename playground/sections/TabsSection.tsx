import { api } from "@/components/tabs/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutList } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "tabs",
    label: "Tabs",
    summary: "Вкладки: навигация между панелями",
    keywords: [
      "вкладки",
      "табы",
      "папка",
      "tab menu",
      "value",
      "onValueChange",
      "orientation",
      "fullWidth",
      "закрыть",
      "onRemove",
    ],
    icon: LayoutList,
    order: 1,
  },
  dir: "tabs",
  title: "Tabs",
  kind: "navigation",
  description:
    "Полоса вкладок-папок для переключения между панелями одного экрана: активная вкладка — поверхность хоста, вросшая в полосу, а панель — контент хоста без своей рамки и отступов. Для выбора значения или режима — SegmentedControl.",
  examples: [
    {
      slot: "overview",
      description:
        "Разделы одного экрана; активная вкладка вырастает в полосу и скользит к следующей — `defaultValue`.",
    },
    {
      slot: "variants",
      description:
        "Активная вкладка основным текстом с акцентной иконкой или целиком в акцентном цвете — `tone`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: кегль, иконка, скругление папки и отступы растут вместе; вкладки по ширине содержимого — `size`, `fullWidth`.",
    },
    {
      slot: "states",
      description: "Неактивная вкладка, которую пропускают клик и стрелки — `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Приглушённая иконка перед подписью и черта перед служебным разделом — `Tabs.Icon`, `Tabs.Label`, `Tabs.Separator`.",
    },
    {
      slot: "orientation",
      description:
        "Настройки аккаунта с боковым списком разделов: активный раздел вдаётся в колонку из панели, а уже 600px список встаёт над панелью — `orientation`.",
    },
    {
      slot: "overflow",
      description:
        "Потяните рамку уже: сначала уходят иконки, затем подписи, и остаются иконки с подсказками; дальше список прокручивается — `Tabs.Icon`.",
    },
    {
      scenario: "closable",
      title: "Закрываемые вкладки",
      description:
        "Открытые карточки заказов как вкладки браузера: закрываются кнопкой, Delete или средним кликом; ширина вкладки держится между двумя пределами, а если вкладки не помещаются, список прокручивается — `onRemove`, `minItemWidth`, `maxItemWidth`.",
    },
    {
      scenario: "two-line",
      title: "Две строки",
      description:
        "Подпись и счётчик в первой строке, сводка во второй — `Tabs.Count`, `Tabs.Description`.",
    },
    {
      scenario: "in-drawer",
      title: "В Drawer",
      description:
        "Карточка заказа в Drawer: полоса вкладок идёт по низу шапки и прокручивается вбок, когда вкладки шире дровера; активная вкладка — тело Drawer, вросшее в шапку, каждая панель — собственный контент тела, а форма доставки сохраняет правки при переходе между вкладками — `Tabs.Root`, `Tabs.List`, `Tabs.Panel`, `keepMounted`.",
    },
    {
      slot: "controlled",
      description:
        "Активная вкладка хранится у родителя, например синхронизирована с URL — `value`, `onValueChange`.",
    },
  ],
  api,
};
