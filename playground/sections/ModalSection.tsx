import { api } from "@/components/modal/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Maximize2 } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "modal",
    label: "Modal",
    summary: "Модальное окно и подтверждение",
    keywords: ["модалка", "диалог", "окно", "dialog", "open", "onOpenChange"],
    icon: Maximize2,
    order: 4,
  },
  dir: "modal",
  title: "Modal",
  kind: "overlay",
  description:
    "Окно поверх страницы для подтверждений, коротких форм и важного текста. Страница за окном неактивна, пока оно открыто.",
  examples: [
    {
      slot: "overview",
      description:
        "Триггер открывает окно с заголовком, полем и двумя действиями; Enter нажимает подтверждение — `Modal.Trigger`, `Modal.Confirm`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части: плашка с иконкой в окне из одной шапки и шапка, где статус открывает строку под заголовком, с подвалом без тела между ними — `Modal.Icon`, `Modal.Description`, `Modal.Footer`.",
    },
    {
      slot: "sizes",
      description:
        "Все ширины; в xs, s и m кнопки подвала равной ширины, в l и xl — по содержимому у края — `size`.",
    },
    {
      scenario: "long-content",
      title: "Длинное содержимое",
      description:
        "Длинное тело из разделов с заголовками прокручивается само, шапка и подвал остаются на месте; главная кнопка закрывает окно и срабатывает по Enter — `Modal.Body`, `Modal.Section`, `Modal.Confirm`.",
    },
    {
      scenario: "custom-container",
      title: "Свой контейнер",
      description: "Окно монтируется в заданный узел вместо тела документа — `container`.",
    },
    {
      scenario: "guard",
      title: "Удержание формы",
      description:
        "Форма правки удерживает окно: после изменений любая попытка закрыть сначала спрашивает, в подвале — заметка, кнопка отправки сохраняет форму, а пока идёт сохранение, окно не закрывается — `Modal.Guard`, `Modal.Meta`.",
    },
    {
      scenario: "enter-key",
      title: "Клавиша Enter",
      description:
        "Enter в окне: пространство передаётся только кликом, не Enter в его поле; в окне тегов Enter добавляет набранный тег вместо закрытия — `confirmOnEnter`, `onEnterConfirm`.",
    },
    {
      slot: "dismiss",
      description:
        "Шаг, который нужно завершить: окно реквизитов закрывают только его кнопки, а пока реквизиты сохраняются — ничто — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель и открывает окно из кода, без триггера — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма настроек в окне: кнопка отправки в подвале отправляет форму, Enter в поле делает то же, а пустое название трясёт поле и не даёт закрыть окно, пока его не заполнят — `Modal.Body`, `Modal.Footer`, `error`.",
    },
  ],
  api,
};
