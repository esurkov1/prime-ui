import { api } from "@/components/digit-input/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Hash } from "../icons";

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
    {
      slot: "states",
      description:
        "Обычный код рядом с неактивным, ошибочным без текста и принятым — `disabled`, `invalid`, `success`.",
    },
    {
      slot: "validation",
      description:
        "Код проверяется, когда введён целиком: неверный код встряхивает поле с одним сообщением и уходит при следующем вводе; подсказка и необязательный код — `required`, `optional`, `hint`, `error`.",
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
        "Код проверяется на сервере, как только заполнена последняя ячейка: ячейки ждут, верный окрашивает их в успех, неверный стирает код и встаёт причиной с покачиванием — `onComplete`, `hint`.",
    },
    {
      slot: "controlled",
      description: "Кодом владеет родитель и очищает его кнопкой — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Скрытый PIN карты отправляется с формой; короткий или неверный PIN встряхивает поле с ошибкой, которая уходит при новом вводе — `name`, `mask`, `required`, `error`.",
    },
  ],
  api,
};
