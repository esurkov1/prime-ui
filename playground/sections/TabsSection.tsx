import { LayoutList } from "lucide-react";
import { api } from "@/components/tabs/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

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
    "Вкладки-папки для переключения между панелями одного экрана: активная вкладка вырастает из панели. Для выбора значения или режима — SegmentedControl.",
  examples: [
    {
      slot: "overview",
      description:
        "Разделы одного экрана; активная вкладка вырастает из панели и скользит к следующей — `defaultValue`.",
    },
    {
      slot: "variants",
      description:
        "Активная вкладка основным текстом с акцентной иконкой или целиком в акцентном цвете — `tone`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: кегль, иконка, скругление папки и отступы растут вместе — `size`.",
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
        "Вкладки над панелью и боковой список разделов, который уже 600px встаёт сверху — `orientation`.",
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
        "Открытые карточки заказов как вкладки браузера: закрываются кнопкой, Delete или средним кликом; ширина вкладки держится между двумя пределами, а за нижним список прокручивается — `onRemove`, `minItemWidth`, `maxItemWidth`.",
    },
    {
      scenario: "two-line",
      title: "Две строки",
      description:
        "Подпись и счётчик в первой строке, сводка во второй — `Tabs.Count`, `Tabs.Description`.",
    },
    {
      slot: "controlled",
      description:
        "Активная вкладка хранится у родителя, например синхронизирована с URL — `value`, `onValueChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "ArrowLeft · ArrowRight",
        action:
          "Выбирают соседнюю вкладку по кругу, пропуская неактивные; в вертикальном списке тоже работают.",
      },
      {
        keys: "ArrowUp · ArrowDown",
        action: "То же в вертикальном списке.",
      },
      { keys: "Home · End", action: "Первая и последняя доступная вкладка." },
      {
        keys: "Delete · Backspace",
        action:
          "Закрывают вкладку с `onRemove`; если она была активной, выбор и фокус переходят к соседней.",
      },
      {
        keys: "Tab",
        action: "Входит в активную вкладку (roving tabindex), затем переходит в панель.",
      },
    ],
    aria: [
      "Паттерн WAI-ARIA tabs: `tablist` / `tab` / `tabpanel`, `aria-controls` и `aria-labelledby` связываются сами; дайте `Tabs.List` `aria-label`.",
      "Выбор следует за фокусом; панель фокусируема (`tabIndex=0`).",
      "В двухстрочной вкладке имя — подпись и счётчик, `Tabs.Description` — `aria-describedby`.",
      "`Tabs.Icon` и `Tabs.Separator` скрыты (`aria-hidden`).",
      'Кнопка закрытия названа по вкладке (`labels.remove`) и не входит в порядок Tab; у вкладки `aria-keyshortcuts="Delete"`.',
      "Когда остаются только иконки, подпись остаётся для экранного диктора, а при наведении и фокусе показывается в `Tooltip`.",
    ],
  },
};
