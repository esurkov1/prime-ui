import { api } from "@/components/drawer/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "drawer",
  title: "Drawer",
  kind: "overlay",
  description:
    "Модальная панель, которая выезжает от края экрана: фильтры, формы и детали записи без ухода со страницы. Подтверждения и короткие решения — Modal.",
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
      description: "Панель выезжает справа для деталей и слева для фильтров — `side`.",
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
        "Форма настроек в панели: кнопка подвала отправляет форму, пустое название не даёт закрыть панель — `Drawer.Body`, `Drawer.Footer`, `error`.",
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
    ],
  },
};

export default function DrawerSection() {
  return <ComponentPage page={page} />;
}
