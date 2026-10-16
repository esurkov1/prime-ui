import { api } from "@/components/sheet/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelBottom } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "sheet",
    label: "Sheet",
    summary: "Шторка снизу для короткой задачи",
    keywords: ["шторка", "нижняя шторка", "bottom sheet", "sheet", "свайп", "open", "onOpenChange"],
    icon: PanelBottom,
    order: 6,
  },
  dir: "sheet",
  title: "Sheet",
  kind: "overlay",
  description:
    "Шторка, которая поднимается от нижнего края, для короткой задачи, завершающейся сама: выбрать дату, нажать действие, оставить пару слов. Боковая рабочая панель — Drawer, решение по центру — Modal.",
  examples: [
    {
      slot: "overview",
      description:
        "Действия с заказом снизу: шапка называет заказ, под ней столбец действий, и каждое действие закрывает шторку — `Sheet.Trigger`, `Sheet.Header`, `Sheet.Close`.",
    },
    {
      slot: "structure",
      description:
        "Только содержимое: шторка с датой без шапки и подвала, календарь во всю её ширину, имя даёт `aria-label`; закрывают выбор даты или свайп вниз — `aria-label`, `Sheet.Body`.",
    },
    {
      scenario: "header-actions",
      title: "Иконка и действия в шапке",
      description:
        "Курьер у двери: шторку открывает плашка с иконкой, статус оплаты открывает строку под заголовком, меню ⋯ стоит перед крестиком, две равные кнопки заполняют подвал — `Sheet.Icon`, `Sheet.Description`, `Sheet.Actions`, `layout`.",
    },
    {
      scenario: "guard",
      title: "Удержание формы",
      description:
        "Отзыв удерживает шторку: после правки свайп, подложка, Escape и «Отмена» спрашивают, прежде чем сбросить текст, подвал об этом говорит, а отправка закрывает все выходы — `Sheet.Guard`, `Sheet.Meta`.",
    },
    {
      slot: "dismiss",
      description:
        "Передачу заказа курьер обязан подтвердить: свайп, подложка и Escape не закрывают шторку, только две её кнопки — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель и поднимает шторку из ссылки в тексте, без триггера — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Короткая форма, которой нужна явная отправка, — единственный случай для подвала: «Отмена» и «Отправить» под полем, пустой комментарий не даёт закрыть шторку — `Sheet.Footer`, `error`.",
    },
  ],
  api,
};
