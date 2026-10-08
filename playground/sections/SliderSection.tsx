import { api } from "@/components/slider/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
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
    { slot: "states", description: "Заливка на обоих краях и неактивный ползунок — `disabled`." },
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
      slot: "controlled",
      description:
        "Значением владеет родитель и делит его с числовым полем для точного ввода — `value`, `onValueChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "ArrowRight · ArrowUp", action: "Увеличивает значение на `step`." },
      { keys: "ArrowLeft · ArrowDown", action: "Уменьшает значение на `step`." },
      { keys: "PageUp · PageDown", action: "Меняет значение крупным шагом." },
      { keys: "Home · End", action: "Переход к `min` / `max`." },
    ],
    aria: [
      'Нативный `<input type="range">` (`role="slider"`) поверх визуального слоя.',
      "`label` — настоящий `<label htmlFor>`; без него обязателен `aria-label`.",
      "`formatValue` задаёт `aria-valuetext`, скринридер читает единицы; видимый `<output>` скрыт (`aria-hidden`).",
      "`aria-describedby` поля — ваши id и подсказка или ошибка; `aria-invalid` при ошибке.",
    ],
  },
};

export default function SliderSection() {
  return <ComponentPage page={page} />;
}
