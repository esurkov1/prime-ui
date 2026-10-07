import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ProgressBar",
      en: "`ref` → `HTMLDivElement` (the root). Props of both modes; pass either `value` (value mode) or `segments` (segments mode), never both.",
      ru: "Пропы обоих режимов; передайте `value` (режим значения) или `segments` (режим сегментов), но не оба.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Line thickness 4 → 8 px (`--prime-control-<tier>-track`, shared with Slider) and label type.",
          ru: "Толщина линии 4 → 8 px (`--prime-control-<tier>-track`, как у Slider) и шрифт подписи.",
        },
        {
          name: "label",
          type: "string",
          en: "Visible label above the line and its accessible name; a value bar without it needs `aria-label`.",
          ru: "Видимая подпись над линией и доступное имя.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          en: "Shows the rounded filled percentage at the end of the label row (`aria-hidden`).",
          ru: "Показывает округлённый процент в конце строки подписи (`aria-hidden`).",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `data-*` and the other div attributes on the root; `aria-label` names the bar when there is no `label`.",
          ru: "`className`, `data-*` и остальные атрибуты div на корне; `aria-label` называет полосу без `label`.",
        },
      ],
    },
    {
      name: "ProgressBar · value mode",
      en: "A native `<progress>` (transparent, for assistive tech) under the drawn line.",
      ru: "Нативный `<progress>` (прозрачный, для скринридеров) под нарисованной линией.",
      props: [
        {
          name: "value",
          type: "number",
          required: true,
          en: "The current value, clamped to `0…max`.",
          ru: "Текущее значение, ограничено `0…max`.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          en: "Top of the scale.",
          ru: "Верх шкалы.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Fill color, telling the outcome.",
          ru: "Цвет заливки, показывает исход.",
        },
      ],
    },
    {
      name: "ProgressBar · segments mode",
      en: 'A `role="group"` bar of parts, named by `label` and described by the distribution text.',
      ru: 'Полоса частей с `role="group"`: имя — `label`, описание — текст долей.',
      props: [
        {
          name: "segments",
          type: "ProgressSegment[]",
          required: true,
          en: "Parts in order, `{ value, label?, tone? }` (`tone` default `accent`); each part's width is its share of `max`.",
          ru: "Части по порядку, `{ value, label?, tone? }` (`tone` по умолчанию `accent`); ширина части — её доля от `max`.",
        },
        {
          name: "max",
          type: "number",
          en: "Total capacity. Default: the sum of the parts; a larger `max` leaves the rest as track.",
          ru: "Полная ёмкость. По умолчанию — сумма частей; больший `max` оставляет остаток дорожкой.",
        },
        {
          name: "segmentGap",
          type: '"none" | "hairline"',
          default: '"none"',
          en: "`none` — one continuous pill; `hairline` — every part and the rest are separate pills.",
          ru: "`none` — одна сплошная капсула; `hairline` — каждая часть и остаток отдельно.",
        },
        {
          name: "labels",
          type: "Partial<ProgressBarLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
      ],
    },
  ],
  labels: [
    {
      key: "empty",
      default: "Нет сегментов",
      en: "Accessible text when `segments` is empty.",
      ru: "Текст для скринридеров, когда `segments` пуст.",
    },
    {
      key: "allEmpty",
      default: "Все сегменты пусты",
      en: "Accessible text when every segment is 0.",
      ru: "Текст для скринридеров, когда все сегменты равны 0.",
    },
  ],
};
