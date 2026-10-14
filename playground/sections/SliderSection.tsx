import { api } from "@/components/slider/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { SlidersHorizontal } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "slider",
    label: "Slider",
    summary: "Ползунок числового значения в диапазоне",
    keywords: ["ползунок", "слайдер", "range", "value", "min", "max", "step"],
    icon: SlidersHorizontal,
    order: 5,
  },
  dir: "slider",
  title: "Slider",
  kind: "control",
  description:
    "Примерное число в диапазоне, когда положение важнее точного значения: громкость, порог, бюджет. Точное число вводят в Input.",
  examples: [
    {
      slot: "overview",
      description: "Ползунок с подписью и текущим значением — `label`, `showValue`.",
    },
    {
      slot: "variants",
      description:
        "Все цвета заливки; accent по умолчанию, смысловые тона — когда значение несёт смысл — `tone`.",
    },
    {
      slot: "sizes",
      description: "Все размеры; ползунок, подпись и значение растут с ярусом — `size`.",
    },
    {
      slot: "states",
      description:
        "Заливка на обоих краях, ошибочный и неактивный ползунки — `invalid`, `disabled`.",
    },
    {
      slot: "orientation",
      description:
        "Уровни звука уведомлений в ряд вертикальных ползунков, минимум внизу — `orientation`.",
    },
    {
      scenario: "value-format",
      title: "Формат значения",
      description:
        "Единицы в показанном значении, которые читает и скринридер — `formatValue`, `showValue`.",
    },
    {
      scenario: "range-step",
      title: "Диапазон и шаг",
      description:
        "Свои границы, крупный или дробный шаг; ползунок без видимой подписи — `min`, `max`, `step`, `aria-label`.",
    },
    {
      scenario: "hint-and-error",
      title: "Подсказка и ошибка",
      description:
        "Ползунок в рамке поля, как остальные: пометка обязательности, подсказка и ошибка на её месте — `required`, `hint`, `error`, `optional`.",
    },
    {
      scenario: "autosave",
      title: "Автосохранение",
      description:
        "Настройка сохраняется, когда ползунок отпустили, а не на каждом шаге: ползунок ждёт приглушённым, а значение, от которого сервер отказался, плавно возвращается — `onCommit`, `hint`, `error`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель и делит его с числовым полем для точного ввода — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Лимиты кампании уходят с формой по `name`, спокойная заметка подтверждает сохранение — `name`, `label`.",
    },
  ],
  api,
};
