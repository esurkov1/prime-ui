import { LayoutList } from "lucide-react";
import { api } from "@/components/tabs/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "tabs",
    label: "Tabs",
    summary: "Вкладки: навигация между панелями",
    keywords: ["вкладки", "табы", "tab menu", "value", "onValueChange", "orientation"],
    icon: LayoutList,
    order: 1,
  },
  dir: "tabs",
  title: "Tabs",
  kind: "navigation",
  description:
    "Вкладки для переключения между панелями одного экрана. Для выбора значения или режима — SegmentedControl.",
  examples: [
    {
      slot: "overview",
      description:
        "Разделы одного экрана; акцентная полоса скользит к активной вкладке — `defaultValue`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; высота вкладки равна высоте контрола того же яруса — `size`.",
    },
    {
      slot: "states",
      description: "Неактивная вкладка, которую пропускают клик и стрелки — `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Приглушённая иконка перед подписью; у активной вкладки она акцентная — `Tabs.Icon`, `Tabs.Label`.",
    },
    {
      slot: "orientation",
      description:
        "Вкладки над панелью и боковой список разделов, который уже 600px встаёт сверху — `orientation`.",
    },
    {
      slot: "overflow",
      description:
        "Вкладок больше, чем помещается в колонку ширины телефона: список прокручивается с затуханием краёв и держит активную вкладку в поле зрения.",
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
        keys: "Tab",
        action: "Входит в активную вкладку (roving tabindex), затем переходит в панель.",
      },
    ],
    aria: [
      "Паттерн WAI-ARIA tabs: `tablist` / `tab` / `tabpanel`, `aria-controls` и `aria-labelledby` связываются сами; дайте `Tabs.List` `aria-label`.",
      "Выбор следует за фокусом; панель фокусируема (`tabIndex=0`).",
      "В двухстрочной вкладке имя — подпись и счётчик, `Tabs.Description` — `aria-describedby`.",
      "`Tabs.Icon` скрыт (`aria-hidden`).",
    ],
  },
};
