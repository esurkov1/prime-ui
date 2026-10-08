import { api } from "@/components/drawer/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelRight } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "drawer",
    label: "Drawer",
    summary: "Боковая панель: детали, формы, фильтры",
    keywords: ["панель", "боковая панель", "drawer", "open", "onOpenChange", "side"],
    icon: PanelRight,
    order: 5,
  },
  dir: "drawer",
  title: "Drawer",
  kind: "overlay",
  description:
    "Модальная панель, которая выезжает сбоку: фильтры, формы и детали записи без ухода со страницы. Подтверждения и короткие решения — Modal, короткая задача снизу — Sheet.",
  examples: [
    {
      slot: "overview",
      description:
        "Детали заказа рядом со списком: три зоны любой панели — шапка с кнопкой закрытия, тело только для чтения и футер с «Закрыть» и главным действием — `Drawer.Trigger`, `Drawer.Body`, `Drawer.Footer`.",
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
        "Панель выезжает справа для деталей и слева для фильтров; скругление только со стороны страницы — `side`.",
    },
    {
      scenario: "header-actions",
      title: "Действия в шапке",
      description:
        "Карточка записи: статус и меню ⋯ стоят в шапке перед крестиком, на ярус меньше — `Drawer.Actions`.",
    },
    {
      scenario: "guard",
      title: "Удержание формы",
      description:
        "Форма удерживает панель изнутри: после правок Escape, подложка и «Отмена» спрашивают «Не сохранять изменения?», подвал об этом говорит, а сохранение закрывает все выходы — `Drawer.Guard`, `Drawer.Meta`.",
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
      "Свайпа нет: панель закрывают крестик, `Drawer.Close`, Escape и подложка.",
      '`Drawer.Guard busy` оставляет крестик и кнопку в `Drawer.Close` на месте выключенными; `dirty` открывает подтверждение `role="alertdialog"` с фокусом на «Продолжить».',
    ],
  },
};
