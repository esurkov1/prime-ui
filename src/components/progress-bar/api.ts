import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { PROGRESS_SEGMENTS_LABELS } from "../../internal/progressSegments";

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
          en: "The data is on its way: a Skeleton in the bar's geometry cross-fades into the data; the label stays. Pass the last known `value` or `segments` (or `0` / `[]`).",
          ru: "Данные загружаются: Skeleton в геометрии полосы плавно сменяется данными; подпись остаётся. Передайте последнее известное `value` или `segments` (или `0` / `[]`).",
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
          en: "Draws the scale as `max` equal cells (2–12), each filled whole; `value` rounds to a cell. For a level out of a few: password strength, onboarding steps.",
          ru: "Шкала из `max` равных ячеек (2–12), каждая заполняется целиком; `value` округляется до ячейки. Для уровня из нескольких: надёжность пароля, шаги настройки.",
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
          en: "Parts in order, `{ value, label?, tone? | color? }`: `tone` names a meaning (default `accent`), `color` a category, as in its charts. Each part's width is its share of `max`.",
          ru: "Части по порядку, `{ value, label?, tone? | color? }`: `tone` — смысл (по умолчанию `accent`), `color` — категория, как на её графиках. Ширина части — её доля от `max`.",
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
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
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
        en: "Value mode: native `<progress>` — role `progressbar` with value and max.",
        ru: "Режим значения: нативный `<progress>` — роль `progressbar` со значением и максимумом.",
      },
      {
        en: 'Segments mode: `role="group"`; its text lists the shares of `max` («Видео: 38%, Документы: 21%»). With `label` (or `aria-label`) the group is named by it and described by the distribution — or by the legend when `legend` is on; without a name the distribution is the name.',
        ru: 'Режим сегментов: `role="group"`; доли читаются текстом «Видео: 38%, Документы: 21%». С `label` полоса названа подписью, а доли — описание; с `legend` описанием становится легенда.',
      },
      {
        en: "Rows: an `<ol>` named by `label`; each row reads as text («Москва 1 284 52%»), the bars are `aria-hidden`.",
        ru: 'Рейтинг (`layout="rows"`): список `<ol>` с именем из `label`; каждая строка читается текстом «Москва 1 284 52%», полосы скрыты от скринридеров.',
      },
      {
        en: "A category color always sits beside its name (legend, row), so color is never the only cue.",
        ru: "Цвет категории всегда стоит рядом с её названием в легенде или строке — смысл не передаётся только цветом.",
      },
      {
        en: "Without `label`, pass `aria-label`, otherwise a value bar has no accessible name.",
        ru: "Без `label` задайте `aria-label`, иначе у полосы значения нет имени.",
      },
      {
        en: "The `showValue` percentage is `aria-hidden`; while `loading` the root is `aria-busy` and the Skeletons are `aria-hidden`.",
        ru: "Процент `showValue` скрыт от скринридеров (`aria-hidden`); во время `loading` корень помечен `aria-busy`, а заглушки скрыты (`aria-hidden`).",
      },
    ],
  },
};
