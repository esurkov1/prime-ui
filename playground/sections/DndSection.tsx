import { api } from "@/components/dnd/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { GripVertical } from "../icons";

export const page: ComponentPageConfig = {
  category: "interaction",
  nav: {
    segment: "dnd",
    label: "Dnd",
    summary: "Перетаскивание: сортируемые списки, Draggable и DropZone",
    keywords: ["drag", "drop", "перетаскивание", "сортировка", "порядок", "sortable", "доска"],
    icon: GripVertical,
    order: 1,
  },
  dir: "dnd",
  title: "Dnd",
  kind: "composite",
  description:
    "Перетаскивание указателем: сортируемые списки, переносимые элементы и зоны сброса на одной сессии — с поднятым клоном, зазором на месте падения, автопрокруткой, касанием и клавиатурой.",
  examples: [
    {
      slot: "overview",
      description:
        "Задачи проекта переставляются за всю строку; один корень сверху, перестановка через помощник — `Dnd.Root`, `Dnd.Sortable`, `onReorder`, `moveBefore`.",
    },
    {
      scenario: "handle",
      title: "Ручка",
      description:
        "Каналы уведомлений с переключателями: тянуть можно только за ручку, асинхронное сохранение может откатить порядок — `handle`, `Dnd.Handle`, `onReorder`.",
    },
    {
      scenario: "board",
      title: "Доска",
      description:
        "Доска тикетов: у колонок общий вид, тикет встаёт в другую колонку на точное место, заполненная колонка отказывает до отпускания — `kind`, `canDrop`, `onReorder`.",
    },
    {
      scenario: "drop-zones",
      title: "Зоны сброса",
      description:
        "Документы переносятся в папки: зона принимает по виду, закрытая папка отказывает до отпускания, цель вспыхивает там, куда лёг файл — `Dnd.Draggable`, `Dnd.DropZone`, `canDrop`, `flashOnDrop`.",
    },
    {
      slot: "narrow",
      description:
        "Ряд фильтров статуса в полосе 320 px: теги переставляются вбок, полоса прокручивается, когда тег держат у края — `axis`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переходит к элементам списка (с `handle` — к ручкам)." },
      {
        keys: "Alt + ↑ · Alt + ↓",
        action: 'Сдвигает элемент на одно место (`axis="x"` — Alt + ← / →).',
      },
      { keys: "Escape", action: "Отменяет перетаскивание в процессе." },
    ],
    aria: [
      'Live-область (`role="status"`, `aria-live="polite"`) объявляет: взят, перемещён, возвращён, отменён, позиция N из M (`labels`).',
      "У каждого перетаскиваемого элемента `aria-roledescription` и `aria-keyshortcuts`; клон в полёте — `aria-hidden`.",
      "Касание: перетаскивание начинается после удержания, движение пальца раньше — обычная прокрутка.",
      "У `Dnd.Draggable` нет клавиатурного пути — дайте кнопку или меню для того же действия.",
    ],
  },
};
