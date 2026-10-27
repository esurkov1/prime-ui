import { api } from "@/components/radio/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CircleDot } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "radio",
    label: "Radio",
    summary: "Радиокнопки: выбор одного варианта",
    keywords: ["радио", "переключатель", "RadioGroup", "value", "onValueChange"],
    icon: CircleDot,
    order: 2,
  },
  dir: "radio",
  title: "Radio",
  kind: "control",
  description:
    "Один вариант из нескольких взаимоисключающих, когда все варианты должны быть видны сразу и выбор отправляется с формой.",
  examples: [
    {
      slot: "overview",
      description: "Группа с подписью и вариантом по умолчанию — `label`, `defaultValue`.",
    },
    { slot: "sizes", description: "Все размеры; кружок и текст берут ярус группы — `size`." },
    {
      slot: "states",
      description:
        "Все состояния, каждое в своей группе и подписано пропом — `value`, `invalid`, `disabled`.",
    },
    {
      slot: "group",
      description:
        "Обязательная группа с описаниями вариантов и ошибкой группы под ними — `label`, `required`, `hint`, `error`.",
    },
    {
      slot: "orientation",
      description: "Варианты столбцом и рядом с переносом — `orientation`.",
    },
    {
      scenario: "indicator",
      title: "Индикатор на плитке выбора",
      description:
        "Только кружок на плитках тарифов: `selected` на карточке отмечает её кнопку, а кружок лишь показывает это — `Card.Indicator`, `selected`.",
    },
    {
      scenario: "saving",
      title: "Сохранение на сервере",
      description:
        "Настройка применяется на сервере сразу: выбранный вариант стоит, пока идёт сохранение, а отказ сервера возвращает прежний и объясняет причину — `onValueChange`, `error`.",
    },
    {
      slot: "controlled",
      description:
        "Выбранным тарифом владеет родитель и показывает его в подсказке — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Выбор в форме заказа: обязательная группа показывает ошибку после отправки без выбора, необязательная помечена — `name`, `required`, `optional`, `error`.",
    },
  ],
  api,
};
