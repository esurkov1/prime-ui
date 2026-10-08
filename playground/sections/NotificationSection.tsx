import { api } from "@/components/notification/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Bell } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "notification",
    label: "Notification",
    summary: "Всплывающие уведомления (тосты)",
    keywords: ["уведомление", "тост", "toast", "tone"],
    icon: Bell,
    order: 2,
  },
  dir: "notification",
  title: "Notification",
  kind: "overlay",
  description:
    "Всплывающие уведомления: `NotificationProvider` в корне приложения и `notify()` с любого экрана — короткая реакция на действие. Постоянное сообщение о состоянии — Banner.",
  examples: [
    {
      slot: "overview",
      description:
        "Провайдер в корне приложения и уведомление об успехе с любого экрана — `NotificationProvider`, `notify`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части на статичных карточках: своя иконка, счётчик, действие и закрытие или один заголовок — `icon`, `badge`, `action`, `onDismiss`.",
    },
    { slot: "sizes", description: "Каждый ярус меняет отступы, иконку и текст карточки — `size`." },
    {
      slot: "placement",
      description: "Уведомления в каждом углу или по центру верхнего и нижнего края — `position`.",
    },
    {
      scenario: "tones",
      title: "Тоны",
      description: "Четыре тона: смысл несёт иконка; danger и warning объявляются сразу — `tone`.",
    },
    {
      scenario: "stacking",
      title: "Стопка",
      description:
        "Уведомления одной позиции и тона складываются в стопку; наведение раскрывает её и ставит таймеры на паузу — `max`, `items`, `dismissAll`.",
    },
    {
      slot: "dismiss",
      description:
        "Короткий таймер, уведомление до закрытия и без кнопки закрытия — `duration`, `persistent`, `closable`.",
    },
    {
      slot: "in-form",
      description:
        "Сохранение формы: кнопка в загрузке, затем успех или ошибка с повтором — `notify`, `action`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Фокус на действии и кнопке закрытия; фокус внутри стопки раскрывает её и ставит таймеры на паузу.",
      },
      { keys: "Enter · Space", action: "Нажимает действие или кнопку закрытия." },
    ],
    aria: [
      'Каждая стопка — `<ol>` с именем из `labels` для своей позиции; карточка — `<article>` с `role="status"` (`aria-live="polite"`) или `role="alert"` для danger и warning.',
      "Иконка скрыта (`aria-hidden`); кнопка закрытия названа `labels.close`.",
      "Важное не держите только в уведомлении с таймером — используйте `persistent` или Banner.",
    ],
  },
};
