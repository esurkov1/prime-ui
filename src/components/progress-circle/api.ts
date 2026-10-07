import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ProgressCircle",
      en: "`ref` → `HTMLDivElement` (the root). Props of both modes; pass either `value` (value mode) or `segments` (segments mode), never both.",
      ru: "Пропы обоих режимов; передайте `value` (режим значения) или `segments` (режим сегментов), но не оба.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Diameter 24 · 32 · 48 · 64 · 80 px; the stroke is 1/12 of it.",
          ru: "Диаметр 24 · 32 · 48 · 64 · 80 px; толщина — 1/12 диаметра.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Content in the center (number, percent, `Icon`). Not rendered on `xs` / `s`; a string or number stays available as `aria-valuetext`.",
          ru: "Содержимое в центре (число, процент, `Icon`). Не рендерится на `xs` / `s`; строка или число остаются в `aria-valuetext`.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name of the ring (set on the svg). Always pass it.",
          ru: "Доступное имя кольца (ставится на svg). Передавайте всегда.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `data-*` and the other div attributes on the root.",
          ru: "`className`, `data-*` и остальные атрибуты div на корне.",
        },
      ],
    },
    {
      name: "ProgressCircle · value mode",
      en: 'The svg is `role="progressbar"`: a track and one round-capped arc.',
      ru: 'Svg с `role="progressbar"`: дорожка и одна дуга со скруглёнными концами.',
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
          en: "Arc color, telling the outcome.",
          ru: "Цвет дуги, показывает исход.",
        },
      ],
    },
    {
      name: "ProgressCircle · segments mode",
      en: 'The svg is `role="group"`: parts clockwise from the top, described by the distribution text.',
      ru: 'Svg с `role="group"`: части по часовой стрелке от верха, описание — текст долей.',
      props: [
        {
          name: "segments",
          type: "ProgressSegment[]",
          required: true,
          en: "Parts in order, `{ value, label?, tone? }` (`tone` default `accent`); each part's length is its share of `max`.",
          ru: "Части по порядку, `{ value, label?, tone? }` (`tone` по умолчанию `accent`); длина части — её доля от `max`.",
        },
        {
          name: "max",
          type: "number",
          en: "Total capacity. Default: the sum of the parts (they close the ring); a larger `max` leaves the rest as track.",
          ru: "Полная ёмкость. По умолчанию — сумма частей (кольцо замкнуто); больший `max` оставляет остаток дорожкой.",
        },
        {
          name: "segmentGap",
          type: '"none" | "hairline"',
          default: '"none"',
          en: "`none` — one continuous ring; `hairline` — every part and the rest are separate round arcs.",
          ru: "`none` — одно сплошное кольцо; `hairline` — каждая часть и остаток отдельными дугами.",
        },
        {
          name: "labels",
          type: "Partial<ProgressCircleLabels>",
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
