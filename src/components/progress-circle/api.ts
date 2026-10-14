import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { PROGRESS_SEGMENTS_LABELS } from "../../internal/progressSegments";

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
          en: "Content in the center (number, percent, `Icon`): text from `m`, an icon from `s`, nothing on `xs`. A string or number also becomes `aria-valuetext`.",
          ru: "Содержимое в центре (число, процент, `Icon`): текст — от `m`, иконка — от `s`, на `xs` ничего. Строка или число становятся и `aria-valuetext`.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "Accessible name of the ring (set on the svg). Always pass it.",
          ru: "Доступное имя кольца (ставится на svg). Передавайте всегда.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The data is on its way: a Skeleton ring of the same diameter and stroke (and legend lines) that cross-fades into the data; the inner content waits, the root is `aria-busy`.",
          ru: "Данные загружаются: Skeleton-кольцо того же диаметра и толщины (и строки легенды), которое плавно сменяется данными; содержимое в центре ждёт, корень `aria-busy`.",
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
      en: 'The svg is `role="progressbar"`: a track and one round-capped arc from 12 o\'clock.',
      ru: 'Svg с `role="progressbar"`: дорожка и одна дуга со скруглёнными концами от 12 часов.',
      props: [
        {
          name: "value",
          type: "number | null",
          required: true,
          en: "The current value, clamped to `0…max`; it glides to a new value (`base`). `null` — under way, the share unknown: a quarter arc that always turns, no `aria-valuenow`.",
          ru: "Текущее значение, ограничено `0…max`; к новому значению дуга скользит (`base`). `null` — идёт, доля неизвестна: дуга в четверть круга всегда вращается, `aria-valuenow` нет.",
        },
        {
          name: "spin",
          type: "boolean",
          default: "false",
          en: "The ring turns at any share (one turn = 3 × `--prime-motion-loop`; slower under reduced motion, never still) and the arc never drops under 8%: a sync whose share grows. `null` always turns.",
          ru: "Кольцо вращается при любой доле (оборот = 3 × `--prime-motion-loop`; при reduced motion медленнее, но не останавливается), дуга не короче 8 %: синхронизация, у которой доля растёт. `null` вращается всегда.",
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
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info" | "inherit"',
          default: '"accent"',
          en: "Arc color, telling the outcome. `inherit` — the arc in the host's text color over a 32% track of it, for a ring on a colored host or over media.",
          ru: "Цвет дуги, показывает исход. `inherit` — дуга цветом текста подложки на дорожке из 32 % этого цвета: кольцо на цветном фоне или поверх медиа.",
        },
      ],
    },
    {
      name: "ProgressCircle · segments mode",
      en: 'The svg is `role="group"`: parts clockwise from the top, described by the legend or the distribution text.',
      ru: 'Svg с `role="group"`: части по часовой стрелке от верха, описание — легенда или текст долей.',
      props: [
        {
          name: "segments",
          type: "ProgressSegment[]",
          required: true,
          en: "Parts in order, `{ value, label?, tone? | color? }`: `tone` names a meaning (default `accent`), `color` a category — its step of the chart palette. Each part's length is its share of `max`.",
          ru: "Части по порядку, `{ value, label?, tone? | color? }`: `tone` — смысл (по умолчанию `accent`), `color` — категория, её цвет из палитры графиков. Длина части — её доля от `max`.",
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
          name: "legend",
          type: "boolean",
          default: "false",
          en: "A legend beside the ring (below it when the row is narrow), one row per part: color · name · value · share; it becomes the group's description. The root turns into the row of ring and legend.",
          ru: "Легенда рядом с кольцом (под ним, когда ряд узкий), строка на часть: цвет · название · число · доля; она же описание группы. Корень становится рядом из кольца и легенды.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          default: "Russian digit groups",
          en: "Display of a part's value in the legend («38 ГБ»).",
          ru: "Вид значения части в легенде («38 ГБ»).",
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
  labels: labelRows(PROGRESS_SEGMENTS_LABELS, {
    empty: {
      en: "Accessible text when `segments` is empty.",
      ru: "Текст для скринридеров, когда `segments` пуст.",
    },
    allEmpty: {
      en: "Accessible text when every segment is 0.",
      ru: "Текст для скринридеров, когда все сегменты равны 0.",
    },
  }),
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: 'Value mode: the svg is `role="progressbar"` with `aria-valuenow` / `-min` / `-max`; a string or number child becomes `aria-valuetext`. With `value={null}` there is no `aria-valuenow` — the share is unknown.',
        ru: 'Режим значения: svg с `role="progressbar"` и `aria-valuenow` / `-min` / `-max`; строка или число в центре — `aria-valuetext`. С `value={null}` `aria-valuenow` нет — доля неизвестна.',
      },
      {
        en: "The turn never stops under reduced motion (twice as slow): it is the only sign the work goes on.",
        ru: "Вращение не останавливается и при reduced motion (оборот вдвое медленнее): это единственный знак, что работа идёт.",
      },
      {
        en: 'Segments mode: the svg is `role="group"`; with `aria-label` it is described by the distribution («Видео: 38%, Документы: 21%») or by the legend, without it the distribution is its name.',
        ru: 'Режим сегментов: svg с `role="group"`; с `aria-label` доли — описание (с `legend` — сама легенда), без него доли — имя.',
      },
      {
        en: "A category color always sits beside its name in the legend, so color is never the only cue.",
        ru: "Цвет категории всегда стоит рядом с её названием в легенде — смысл не передаётся только цветом.",
      },
      {
        en: "While `loading` the root is `aria-busy` and the Skeletons are `aria-hidden`.",
        ru: "Во время `loading` корень помечен `aria-busy`, заглушки скрыты от скринридеров.",
      },
      {
        en: "Always pass `aria-label`: a caption next to the ring is not linked to it.",
        ru: "Всегда передавайте `aria-label`: подпись рядом с кольцом с ним не связана.",
      },
      {
        en: "The inner text is `aria-hidden` when it is already the `aria-valuetext`.",
        ru: "Текст в центре скрыт (`aria-hidden`), когда он уже стал `aria-valuetext`.",
      },
    ],
  },
};
