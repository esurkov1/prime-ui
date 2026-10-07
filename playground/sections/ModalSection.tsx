import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";
import {
  dialogAriaApiRows,
  dialogBodyApiRows,
  dialogFooterApiRows,
  dialogHeaderApiRows,
  dialogIconApiRows,
  dialogRootApiRows,
  dialogSlotApiRows,
  dialogTextApiRows,
} from "./dialogApiRows";

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
  api: [
    {
      name: "Modal.Root",
      description: "Состояние открытия и политика закрытия; своего DOM нет.",
      rows: [
        ...dialogRootApiRows("Modal"),
        {
          prop: "confirmOnEnter",
          type: "boolean",
          defaultValue: "true",
          required: "Нет",
          description:
            "Enter нажимает элемент в `Modal.Confirm` (кроме textarea, select, чекбоксов, шапки).",
        },
        {
          prop: "onEnterConfirm",
          type: "(event: KeyboardEvent) => void",
          defaultValue: "—",
          required: "Нет",
          description: "Свой обработчик Enter вместо нажатия `Modal.Confirm`.",
        },
      ],
    },
    {
      name: "Modal.Content",
      description: "Портал, подложка и сам диалог: ловушка фокуса, блокировка прокрутки.",
      rows: [
        {
          prop: "size",
          type: '"s" | "m" | "l" | "xl"',
          defaultValue: '"m"',
          required: "Нет",
          description:
            "Ширина 440 · 560 · 720 · 960 px. Уже 640 px экрана — лист снизу на всю ширину.",
        },
        {
          prop: "container",
          type: "HTMLElement | null",
          defaultValue: "document.body",
          required: "Нет",
          description: "Узел для портала.",
        },
        ...dialogAriaApiRows,
      ],
    },
    { name: "Modal.Header", rows: dialogHeaderApiRows },
    { name: "Modal.Icon", rows: dialogIconApiRows },
    { name: "Modal.Title · Modal.Description", rows: dialogTextApiRows },
    { name: "Modal.Body", rows: dialogBodyApiRows },
    { name: "Modal.Footer", rows: dialogFooterApiRows('"fill" для s/m, "end" для l/xl') },
    {
      name: "Modal.Trigger · Modal.Close · Modal.Confirm",
      description:
        "Оборачивают один элемент: `Trigger` открывает, `Close` закрывает, `Confirm` делает кнопку целью Enter.",
      rows: dialogSlotApiRows,
    },
  ],
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        action: "Закрывает окно (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Enter",
        action:
          "Нажимает `Modal.Confirm`, если фокус не в textarea, select, чекбоксе, шапке или на самой кнопке.",
      },
      { keys: "Tab · Shift+Tab", action: "Переводит фокус по кругу внутри окна." },
    ],
    aria: [
      '`role="dialog"` и `aria-modal="true"`; имя — `Modal.Title` (или `aria-label`), описание — `Modal.Description`.',
      "При открытии фокус уходит в окно (поле с `autoFocus` побеждает), при закрытии — на элемент, открывший окно, в том числе после клика по подложке.",
      "Страница за окном неактивна (`inert`), прокрутка заблокирована.",
      "Реагирует только верхний слой: Select, открытый внутри окна, закрывается первым.",
    ],
    labels: [
      {
        key: "close",
        defaultValue: "Закрыть",
        description: "`aria-label` кнопки закрытия в шапке.",
      },
    ],
  },
};

export default function ModalSection() {
  return <ComponentPage page={page} />;
}
