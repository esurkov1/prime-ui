import { api } from "@/components/popover/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
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
      description: "Все ярусы с шапкой и действиями; панель берёт ярус своего триггера — `size`.",
    },
    {
      slot: "placement",
      description:
        "Все стороны и выравнивания относительно триггера; у края экрана панель переворачивается и сдвигается — `side`, `align`.",
    },
    {
      scenario: "match-trigger-width",
      title: "Ширина триггера",
      description:
        "В узкой колонке панель точно по ширине кнопки на всю ширину, текст переносится — `matchTriggerWidth`.",
    },
    {
      scenario: "flush",
      title: "Без полей",
      description:
        "Список уведомлений, строки и разделители которого доходят до краёв; отступы у каждой строки свои — `flush`.",
    },
    {
      slot: "dismiss",
      description:
        "Подтверждение удаления закрывается только кнопками, а пока идёт запрос — никак — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель: другая кнопка открывает панель из кода, своя кнопка закрывает — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма приглашения в панели: Tab не выходит наружу, список ролей не считается кликом снаружи, отправка закрывает панель — `trapFocus`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        action: "На триггере открывает и закрывает панель.",
      },
      {
        keys: "Escape",
        action: "Закрывает панель (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab",
        action: "Переходит по содержимому панели; с `trapFocus` фокус ходит по кругу внутри неё.",
      },
    ],
    aria: [
      'Панель — `role="dialog"` без `aria-modal`; имя — `Popover.Title`, иначе триггер; описание — `Popover.Description`.',
      'Триггер получает `aria-haspopup="dialog"`, `aria-expanded` и `aria-controls`.',
      "Клик снаружи закрывает панель без возврата фокуса на триггер: фокус остаётся там, куда нажали.",
      "Реагирует только верхний слой: Select, открытый внутри панели, закрывается первым.",
    ],
  },
};

export default function PopoverSection() {
  return <ComponentPage page={page} />;
}
