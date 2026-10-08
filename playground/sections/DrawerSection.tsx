import { api } from "@/components/drawer/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelRight } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "drawer",
    label: "Drawer",
    summary: "Выезжающая панель сбоку или шторка снизу",
    keywords: [
      "шторка",
      "панель",
      "drawer",
      "bottom sheet",
      "свайп",
      "open",
      "onOpenChange",
      "side",
    ],
    icon: PanelRight,
    order: 5,
  },
  dir: "drawer",
  title: "Drawer",
  kind: "overlay",
  description:
    "Модальная панель, которая выезжает от края экрана: фильтры, формы и детали записи без ухода со страницы, а снизу — шторка для телефона. Подтверждения и короткие решения — Modal.",
  examples: [
    {
      slot: "overview",
      description:
        "Детали заказа рядом со списком: триггер, шапка с кнопкой закрытия и тело только для чтения — `Drawer.Trigger`, `Drawer.Body`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части: плашка с иконкой в шапке и одно действие во всю ширину в подвале — `Drawer.Icon`, `Drawer.Footer`, `layout`.",
    },
    {
      slot: "sizes",
      description:
        "Все ширины панели, от 360 до 800 px; уже 640 px экрана панель занимает всю ширину — `size`.",
    },
    {
      slot: "placement",
      description:
        "Панель выезжает справа для деталей, слева для фильтров и снизу шторкой — `side`.",
    },
    {
      scenario: "date-sheet",
      title: "Шторка снизу",
      description:
        "Дата в шторке снизу: ручка сверху, свайп вниз или выбор даты закрывают её — `side`, `Drawer.Body`.",
    },
    {
      scenario: "long-content",
      title: "Длинное содержимое",
      description:
        "Длинное тело прокручивается само, шапка и подвал остаются на месте — `Drawer.Body`.",
    },
    {
      slot: "dismiss",
      description:
        "Импорт закрывается только кнопками, а пока идёт — никак — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель и открывает панель из ссылки, без триггера — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма настроек в панели: кнопка подвала отправляет форму, пустое название трясёт поле и не даёт закрыть панель, пока его не заполнят — `Drawer.Body`, `Drawer.Footer`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        action: "Закрывает панель (`closeOnEscape`); фокус возвращается на триггер.",
      },
      { keys: "Tab · Shift+Tab", action: "Переводит фокус по кругу внутри панели." },
    ],
    aria: [
      '`role="dialog"` и `aria-modal="true"`; имя — `Drawer.Title` (или `aria-label`), описание — `Drawer.Description`.',
      "При открытии фокус уходит в панель, при закрытии — на элемент, открывший её, в том числе после клика по подложке.",
      "Страница за панелью неактивна (`inert`), прокрутка заблокирована; реагирует только верхний слой.",
      "Панель, открытая из Modal, встаёт над ним.",
      "Свайп к краю (шторку — за ручку или шапку, боковую — касанием) — дополнительный способ закрыть панель; кнопка закрытия и Escape остаются. Ручка скрыта от скринридеров.",
    ],
  },
};
