import { api } from "@/components/popover/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { MessageSquare } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "popover",
    label: "Popover",
    summary: "Всплывающая панель у элемента",
    keywords: ["поповер", "всплывающее окно", "open", "onOpenChange"],
    icon: MessageSquare,
    order: 2,
  },
  dir: "popover",
  title: "Popover",
  kind: "overlay",
  description:
    "Панель у кнопки для короткого текста, лёгкого подтверждения, фильтров или небольшой формы. Страница остаётся активной.",
  examples: [
    {
      slot: "overview",
      description:
        "Кнопка открывает панель фильтров с шапкой и действиями; кнопки в `Popover.Close` закрывают её — `Popover.Trigger`, `Popover.Close`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части: панель из одного текста и панель с заголовком, описанием и действиями — `Popover.Header`, `Popover.Actions`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы с шапкой и действиями; ярус свой у панели и задаётся на `Popover.Content`, а не берётся у триггера — `size`.",
    },
    {
      slot: "placement",
      description:
        "Все стороны и выравнивания относительно триггера; у края экрана панель переворачивается и сдвигается — `side`, `align`.",
    },
    {
      scenario: "width",
      title: "Ширина",
      description:
        "В узкой колонке панель точно по ширине кнопки на всю ширину и текст переносится, короткая кнопка открывает панель не уже себя, а таблица лимитов берёт нужную ей ширину — `width`.",
    },
    {
      scenario: "flush",
      title: "Без полей",
      description:
        "Список уведомлений, строки и разделители которого доходят до краёв; отступы у каждой строки свои — `flush`.",
    },
    {
      scenario: "from-menu",
      title: "Из пункта меню",
      description:
        "Команда меню открывает панель у той же кнопки: «Переименовать…» показывает форму у ⋯, и фокус попадает в её поле, а не обратно на кнопку меню — `Popover.Anchor`, `initialFocus`.",
    },
    {
      scenario: "hover-card",
      title: "По наведению",
      description:
        "Подсказка со ссылкой и карточка человека открываются наведением и фокусом с клавиатуры, Tab переходит внутрь — `openOn`.",
    },
    {
      scenario: "status-chip",
      title: "Чип статуса",
      description:
        "Чип статуса открывает подробности: бейдж — триггер, сохраняет свой тон, пока панель открыта, а время показывает второй строкой — `Popover.Trigger`, `Badge.Description`.",
    },
    {
      slot: "dismiss",
      description:
        "Набираемая заметка не пропадёт от случайного клика: панель закрывают только её кнопки, а пока заметка сохраняется — ничто — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель: другая кнопка открывает панель из кода, а своя кнопка в `Popover.Close` закрывает — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма приглашения в панели: Tab не выходит наружу, список ролей не считается кликом снаружи, неверная почта трясёт поле и не даёт закрыть панель, пока её не исправят — `trapFocus`, `error`.",
    },
  ],
  api,
};
