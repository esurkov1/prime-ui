import { api } from "@/components/input/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { TextCursorInput } from "../icons";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "input",
    label: "Input",
    summary: "Текстовое поле: подпись, подсказка, ошибка, иконки",
    keywords: ["поле", "ввод", "инпут", "label", "hint", "error", "invalid", "onValueChange"],
    icon: TextCursorInput,
    order: 1,
  },
  dir: "input",
  title: "Input",
  kind: "field",
  description:
    "Однострочное поле и эталон системы полей: подпись сверху, поле на заливке, строка поддержки снизу. Select, Datepicker, TagSelect и Textarea повторяют этот контракт.",
  examples: [
    { slot: "overview", description: "Поле с подписью и подсказкой под ним — `label`, `hint`." },
    { slot: "sizes", description: "Все ярусы; подпись и подсказка берут ярус поля — `size`." },
    {
      slot: "states",
      description:
        "Обычное поле рядом с неактивным, только для чтения и ошибочным без текста — `disabled`, `readOnly`, `invalid`.",
    },
    {
      slot: "validation",
      description:
        "Живая проверка: с ошибкой поле встряхивается, сообщение выезжает и уходит, как только значение исправлено; пометки обязательного и необязательного поля, подсказка и строка поддержки без сдвига — `required`, `optional`, `hint`, `error`, `reserveSupportRow`.",
    },
    {
      slot: "with-icon",
      description: "Декоративная иконка у любого края значения — `Input.Icon`, `side`.",
    },
    {
      scenario: "affixes",
      title: "Аффиксы",
      description:
        "Постоянные префикс и суффикс у краёв и единица рядом со значением, которую скринридер слышит словом, — `Input.Affix`, `Input.InlineAffix`, `aria-label`.",
    },
    {
      scenario: "password-strength",
      title: "Пароль",
      description:
        "Новый пароль с кнопкой показа и шкалой, которая заполняется по шагам и называет уровень рядом с подсказкой, и пароль сервисного аккаунта по собственному правилу компании — `Input.RevealButton`, `strength`, `getStrength`.",
    },
    {
      scenario: "password-policy",
      title: "Смена пароля",
      description:
        "Смена пароля по требованию: новый пароль ниже нужного уровня красит шкалу и не даёт отправить форму, а повтор получает галочку, как только совпал, — `strength`, `minStrength`, `valid`.",
    },
    {
      scenario: "edge-actions",
      title: "Действия в поле",
      description:
        "Действия у конца поля: ссылка на письмо с подсказкой рядом с копированием значения и ссылка на профиль у поля только для чтения — `Input.Action`, `Input.CopyButton`.",
    },
    {
      scenario: "inline-edit",
      title: "Правка на месте",
      description:
        "Поля карточки записи сохраняются при выходе из поля и по Enter, Escape отменяет правку, отказ сервера показан ошибкой — `onCommit`, `error`.",
    },
    {
      scenario: "suggestions",
      title: "Ввод с подсказками",
      description:
        "Где хранится возврат: свободный текст, а прошлые места предлагаются списком под полем — `suggestions`.",
    },
    {
      scenario: "with-select",
      title: "Выбор внутри поля",
      description:
        "Иконка и название раздела одним полем: селект только с иконкой — начальный сегмент поля — `Input.Wrapper`, `Select.Root`, `aria-label`.",
    },
    {
      scenario: "amount-currency",
      title: "Сумма и валюта",
      description:
        "Сумма и её валюта одним полем: селект после поля — конечный сегмент, в триггере символ, в строках символ как иконка и название — `Input.Wrapper`, `Select.Root`, `renderValue`, `Select.ItemIcon`, `aria-label`.",
    },
    {
      scenario: "time",
      title: "Время суток",
      description:
        "Время звонка: сегменты часов и минут браузера, стрелки меняют их, только рабочие часы — `type`, `step`, `min`, `max`.",
    },
    {
      slot: "dismiss",
      description:
        "Город доставки: подсказки остаются открытыми при нажатии рядом, пока адрес копируют из письма, а Escape их закрывает — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: кнопка очистки и счётчик символов следуют за ним — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`.",
    },
    {
      slot: "in-form",
      description:
        "Реквизиты компании: обязательные поля проверяются при отправке, ошибка уходит, как только поле исправлено, а сохранённая форма красит кнопку в зелёный; соседние поля держат низ на одной линии — `required`, `error`, `reserveSupportRow`.",
    },
  ],
  api,
};
