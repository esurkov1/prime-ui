import { api } from "@/components/modal/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
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
        "Необязательные части: плашка с иконкой в окне из одной шапки и шапка с подвалом без тела — `Modal.Icon`, `Modal.Body`, `Modal.Footer`.",
    },
    {
      slot: "sizes",
      description:
        "Все ширины; в s и m кнопки подвала равной ширины, в l и xl — по содержимому у края — `size`.",
    },
    {
      scenario: "long-content",
      title: "Длинное содержимое",
      description:
        "Длинное тело прокручивается само, шапка и подвал остаются на месте — `Modal.Body`.",
    },
    {
      scenario: "custom-container",
      title: "Свой контейнер",
      description: "Окно монтируется в заданный узел вместо тела документа — `container`.",
    },
    {
      slot: "dismiss",
      description:
        "Подтверждение удаления закрывается только кнопками, а пока идёт запрос — никак — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель и открывает окно из кода, без триггера — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма настроек в окне: кнопка подвала отправляет форму, пустое название не даёт закрыть окно — `Modal.Body`, `Modal.Footer`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        action: "Закрывает окно (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Enter",
        action:
          "Нажимает `Modal.Confirm` из текстового поля или самого окна; на кнопке или ссылке (включая «Отмена») срабатывает она сама; textarea, select, чекбокс и шапка оставляют Enter себе.",
      },
      { keys: "Tab · Shift+Tab", action: "Переводит фокус по кругу внутри окна." },
    ],
    aria: [
      '`role="dialog"` и `aria-modal="true"`; имя — `Modal.Title` (или `aria-label`), описание — `Modal.Description`.',
      "При открытии фокус уходит в окно (поле с `autoFocus` побеждает), при закрытии — на элемент, открывший окно, в том числе после клика по подложке.",
      "Страница за окном неактивна (`inert`), прокрутка заблокирована.",
      "Реагирует только верхний слой: Select, открытый внутри окна, закрывается первым.",
    ],
  },
};

export default function ModalSection() {
  return <ComponentPage page={page} />;
}
