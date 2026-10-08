import { Hash } from "lucide-react";
import { api } from "@/components/digit-input/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "inputs",
  nav: {
    segment: "digit-input",
    label: "Digit Input",
    summary: "Поле для кода из отдельных цифр (OTP)",
    keywords: ["код", "otp", "пин", "цифры", "value", "onValueChange"],
    icon: Hash,
    order: 3,
  },
  dir: "digit-input",
  title: "DigitInput",
  kind: "field",
  description:
    "Код фиксированной длины по ячейкам: одноразовый код из SMS, PIN, код выдачи. Подпись, подсказка и ошибка — как у любого поля.",
  examples: [
    {
      slot: "overview",
      description: "Шестизначный код из SMS с подписью и подсказкой — `label`, `hint`, `length`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы; ячейка — квадрат своей шкалы, на две ступени крупнее контролов — `size`.",
    },
    { slot: "states", description: "Обычный код рядом с неактивным — `disabled`." },
    {
      slot: "validation",
      description:
        "Пометки обязательного и необязательного поля, подсказка и ошибка на её месте — `required`, `optional`, `hint`, `error`.",
    },
    {
      scenario: "grouped",
      title: "Группы цифр",
      description:
        "Длинный код читается частями с увеличенным зазором между группами — `groupSize`.",
    },
    {
      scenario: "full-width",
      title: "На всю ширину",
      description:
        "Ячейки делят ширину контейнера и сохраняют высоту яруса, под ними кнопка на всю ширину — `fullWidth`.",
    },
    {
      scenario: "on-complete",
      title: "Проверка по заполнению",
      description:
        "Код проверяется, как только заполнена последняя ячейка: верный окрашивает ячейки в успех, неверный превращает подсказку в ошибку — `onComplete`, `success`, `error`.",
    },
    {
      slot: "controlled",
      description: "Кодом владеет родитель и очищает его кнопкой — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Скрытый PIN карты отправляется с формой; короткий PIN показывает ошибку — `name`, `mask`, `required`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "0–9", action: "Ввод в первую пустую ячейку и переход к следующей." },
      { keys: "Backspace", action: "Стирает цифру; в пустой ячейке — переход к предыдущей." },
      { keys: "ArrowLeft · ArrowRight", action: "Ходит по заполненным ячейкам и ячейке ввода." },
      { keys: "Home · End", action: "К первой ячейке / к ячейке ввода." },
      { keys: "Tab", action: "Уходит из кода." },
    ],
    aria: [
      'Ячейки — в `<fieldset>` (`role="group"`), названном подписью (`aria-labelledby`) или `labels.group`; клик по подписи фокусирует первую ячейку.',
      'Каждая ячейка названа `labels.cell` («Цифра 1 из 6»), с `autocomplete="one-time-code"` и `inputmode="numeric"`.',
      "Подсказка или ошибка связаны с группой через `aria-describedby`; ячейки при ошибке — `aria-invalid`.",
      "Вставка и автозаполнение всего кода в любую ячейку заполняют все ячейки.",
    ],
  },
};
