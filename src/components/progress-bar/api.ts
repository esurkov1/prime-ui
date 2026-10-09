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
          en: "Shows the rounded filled percentage at the end of the label row (`aria-hidden`); `bar` layout only.",
          ru: "Показывает округлённый процент в конце строки подписи (`aria-hidden`); только раскладка `bar`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The data is on its way: a Skeleton in the bar's geometry (and of the legend or the rows) that cross-fades into the data; the label stays, the root is `aria-busy`. Pass the last known `value` or `segments` (or `0` / `[]`).",
          ru: "Данные загружаются: Skeleton в геометрии полосы (и легенды или строк), который плавно сменяется данными; подпись остаётся, корень `aria-busy`. Передайте последнее известное `value` или `segments` (или `0` / `[]`).",
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
        {
          name: "steps",
          type: "boolean",
          default: "false",
          en: "Draws the scale as `max` equal cells (2–12), each filled whole; `value` rounds to a cell. In one change the cells go one after another — from the start when filling, from the end when emptying. For a level out of a few: password strength, onboarding steps.",
          ru: "Шкала из `max` равных ячеек (2–12), каждая заполняется целиком; `value` округляется до ячейки. За одно изменение ячейки идут друг за другом — от начала при росте, с конца при убывании. Для уровня из нескольких: надёжность пароля, шаги настройки.",
        },
      ],
    },
    {
      name: "ProgressBar · segments mode",
      en: 'A `role="group"` bar of parts, named by `label` and described by the legend or the distribution text; with `layout="rows"` an `<ol>` named by `label`.',
      ru: 'Полоса частей с `role="group"`: имя — `label`, описание — легенда или текст долей; с `layout="rows"` — `<ol>` с именем из `label`.',
      props: [
        {
          name: "segments",
          type: "ProgressSegment[]",
          required: true,
          en: "Parts in order, `{ value, label?, tone? | color? }`: `tone` names a meaning (default `accent`), `color` a category — its step of the chart palette, the same color the category has in charts. Each part's width is its share of `max`.",
          ru: "Части по порядку, `{ value, label?, tone? | color? }`: `tone` — смысл (по умолчанию `accent`), `color` — категория, её цвет из палитры графиков, тот же, что у категории на графиках. Ширина части — её доля от `max`.",
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
          en: "`none` — one continuous pill; `hairline` — every part and the rest are separate pills. `bar` layout.",
          ru: "`none` — одна сплошная капсула; `hairline` — каждая часть и остаток отдельно. Раскладка `bar`.",
        },
        {
          name: "legend",
          type: "boolean",
          default: "false",
          en: "A legend under the bar, one row per part: color · name · value · share; it becomes the group's description. `bar` layout.",
          ru: "Легенда под полосой, строка на часть: цвет · название · число · доля; она же описание группы. Раскладка `bar`.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          default: "Russian digit groups",
          en: "Display of a part's value in the legend and the rows («1 840 000 ₽»).",
          ru: "Вид значения части в легенде и строках («1 840 000 ₽»).",
        },
        {
          name: "layout",
          type: '"bar" | "rows"',
          default: '"bar"',
          en: "`bar` — every part in one bar; `rows` — a ranking: an `<ol>`, one row per part with label · value · share over its own bar.",
          ru: "`bar` — все части в одной полосе; `rows` — рейтинг: `<ol>`, строка на часть — подпись · число · доля над своей полосой.",
        },
        {
          name: "scale",
          type: '"sum" | "max" | "first"',
          default: '"sum"',
          en: "`rows` only: what 100% is. `sum` — bars and shares of the total (`max` raises it); `max` — the leader is a full bar, shares stay of the total; `first` — bars and shares against the first row (a funnel).",
          ru: "Только `rows`: что такое 100%. `sum` — полосы и доли от суммы (`max` её поднимает); `max` — лидер на всю ширину, доли от суммы; `first` — полосы и доли от первой строки (воронка).",
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
