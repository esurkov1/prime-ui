import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Slider",
      en: 'No ref (renders a `<div>`). The label row with the value, then a native `<input type="range">` (transparent, on top) over the visual track, fill and thumb.',
      ru: 'Подпись со значением, под ней нативный `<input type="range">` поверх дорожки, заливки и ползунка.',
      props: [
        {
          name: "value",
          type: "number",
          en: "Controlled value; clamped to `min`…`max`.",
          ru: "Управляемое значение; ограничивается `min`…`max`.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "min",
          en: "Initial value when uncontrolled.",
          ru: "Начальное значение без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          en: "Called with the new number while dragging and on every key step.",
          ru: "Новое число при перетаскивании и каждом шаге с клавиатуры.",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          en: "Lower bound.",
          ru: "Нижняя граница.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          en: "Upper bound.",
          ru: "Верхняя граница.",
        },
        {
          name: "step",
          type: "number",
          default: "1",
          en: "Step of the keyboard and of the snapping; fractions allowed.",
          ru: "Шаг клавиатуры и привязки; можно дробный.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the track thickness T (thumb 4.5T × 3T), the label and the value.",
          ru: "Ярус толщины дорожки T (ползунок 4.5T × 3T), подписи и значения.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Color of the filled part of the track.",
          ru: "Цвет заполненной части дорожки.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Muted track and thumb, dimmed label and value, no interaction.",
          ru: "Приглушённые дорожка, ползунок, подпись и значение; без взаимодействия.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Visible label linked to the range input (`<label htmlFor>`). Without it, set `aria-label`.",
          ru: "Видимая подпись, связанная с input. Без неё задайте `aria-label`.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          en: "Shows the current value at the end of the label row (tabular numbers, `aria-hidden` — the input announces it).",
          ru: "Текущее значение в конце строки подписи (табличные цифры).",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          en: "Formats the shown value and `aria-valuetext` (units, currency).",
          ru: "Формат показанного значения и `aria-valuetext` (единицы, валюта).",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name when there is no visible `label`.",
          ru: "Доступное имя, когда нет видимой подписи.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the root `<div>`.",
          ru: "Класс на корневом `<div>`.",
        },
      ],
    },
  ],
  labels: [],
};
