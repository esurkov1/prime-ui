import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { PROGRESS_SEGMENTS_LABELS } from "../../internal/progressSegments";

export const api: ComponentApi = {
  parts: [
    {
      name: "ProgressBar",
      en: '`ref` → `HTMLDivElement` (the root). Pass `value` (value mode: a native `<progress>`, transparent, under the drawn line) or `segments` (segments mode: a `role="group"` bar of parts described by the legend or the distribution text; `layout="rows"` — an `<ol>`), never both.',
      ru: 'Передайте `value` (режим значения: нативный прозрачный `<progress>` под нарисованной линией) или `segments` (режим сегментов: полоса частей `role="group"` с описанием из легенды или текста долей; `layout="rows"` — `<ol>`), но не оба.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Line thickness 4 → 8 px (`--prime-control-<tier>-track`, shared with Slider) and label type; `ticks` stand 16 → 40 px tall. Without it the tier of its host, else `m`.",
          ru: "Толщина линии 4 → 8 px (`--prime-control-<tier>-track`, как у Slider) и шрифт подписи; штрихи `ticks` — высотой 16 → 40 px. Без него — ярус хоста, иначе `m`.",
        },
        {
          name: "variant",
          type: '"line" | "steps" | "ticks"',
          default: '"line"',
          en: "`line` — one line; `steps` (value mode) — `max` cells (2–12); `ticks` — thin tall ticks, as many as the width holds. Cells fill whole, by one front. `bar` layout.",
          ru: "`line` — одна линия; `steps` (режим значения) — `max` ячеек (2–12); `ticks` — тонкие высокие штрихи, сколько помещается по ширине. Ячейки заполняются целиком, одним фронтом. Раскладка `bar`.",
        },
        {
          name: "label",
          type: "string",
          en: "Visible label above the line and its accessible name; a value bar without it needs `aria-label`.",
          ru: "Видимая подпись над линией и доступное имя; полосе значения без неё нужен `aria-label`.",
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
          name: "value",
          type: "number",
          en: "Value mode: the current value, clamped to `0…max`.",
          ru: "Режим значения: текущее значение, ограничено `0…max`.",
        },
        {
          name: "max",
          type: "number",
          defaultNote: {
            en: "`100` (value mode), the sum of the parts (segments mode)",
            ru: "`100` (режим значения), сумма частей (режим сегментов)",
          },
          en: "Value mode: top of the scale. Segments mode: total capacity; a `max` above the sum of the parts leaves the rest as track. `scale` `own`: the top of every row without its own `max` (default `100`).",
          ru: "Режим значения: верх шкалы. Режим сегментов: полная ёмкость; `max` больше суммы частей оставляет остаток дорожкой. `scale` `own`: верх шкалы каждой строки без своего `max` (по умолчанию `100`).",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Value mode: fill color, telling the outcome.",
          ru: "Режим значения: цвет заливки, показывает исход.",
        },
        {
          name: "segments",
          type: "ProgressSegment[]",
          en: "Segments mode: parts `{ value, label?, max?, href?, onClick?, tone? | color? }`; the width is a share of `max`. `rows` only: `href` makes the row a link, `onClick` runs on its press, `max` tops the row's own scale.",
          ru: "Режим сегментов: части `{ value, label?, max?, href?, onClick?, tone? | color? }`; ширина — доля от `max`. Только `rows`: `href` делает строку ссылкой, `onClick` — на её нажатие, `max` — верх своей шкалы строки.",
        },
        {
          name: "segmentGap",
          type: '"none" | "hairline"',
          default: '"none"',
          en: "Segments mode: `none` — one continuous pill; `hairline` — every part and the rest are separate pills. `bar` layout, `line` variant.",
          ru: "Режим сегментов: `none` — одна сплошная капсула; `hairline` — каждая часть и остаток отдельно. Раскладка `bar`, вид `line`.",
        },
        {
          name: "legend",
          type: "boolean",
          default: "false",
          en: "Segments mode: a legend under the bar, one row per part: color · name · value · share; it becomes the group's description. `bar` layout.",
          ru: "Режим сегментов: легенда под полосой, строка на часть: цвет · название · число · доля; она же описание группы. Раскладка `bar`.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          defaultNote: { en: "Russian digit groups", ru: "русские группы разрядов" },
          en: "Segments mode: display of a part's value in the legend and the rows («1 840 000 ₽»).",
          ru: "Режим сегментов: вид значения части в легенде и строках («1 840 000 ₽»).",
        },
        {
          name: "layout",
          type: '"bar" | "rows"',
          default: '"bar"',
          en: "Segments mode: `bar` — every part in one bar; `rows` — a ranking: an `<ol>`, one row per part with label · value · share over its own bar.",
          ru: "Режим сегментов: `bar` — все части в одной полосе; `rows` — рейтинг: `<ol>`, строка на часть — подпись · число · доля над своей полосой.",
        },
        {
          name: "scale",
          type: '"sum" | "max" | "first" | "own"',
          default: '"sum"',
          en: "`rows` only: what 100% is. `sum` — the total (`max` raises it); `max` — the leader is a full bar, shares of the total; `first` — the first row (a funnel); `own` — each row's `max`, else the root `max`, else 100.",
          ru: "Только `rows`: что такое 100%. `sum` — сумма (`max` её поднимает); `max` — лидер на всю ширину, доли от суммы; `first` — первая строка (воронка); `own` — `max` строки, иначе `max` корня, иначе 100.",
        },
        {
          name: "showShare",
          type: "boolean",
          default: "true",
          en: "`rows` only: the share at the end of each row. `false` when the value already is the share — a load in percent under `scale` `own` with `max` `100`.",
          ru: "Только `rows`: доля в конце строки. `false`, когда значение уже и есть доля — загрузка в процентах при `scale` `own` и `max` `100`.",
        },
        {
          name: "labels",
          type: "Partial<ProgressBarLabels>",
          en: "Segments mode: built-in strings, see Labels.",
          ru: "Режим сегментов: системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `data-*` and the other div attributes on the root; `aria-label` names the bar when there is no `label`.",
          ru: "`className`, `data-*` и остальные атрибуты div на корне; `aria-label` называет полосу без `label`.",
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
    keyboard: [
      {
        keys: "Tab",
        native: true,
        en: "Rows with `href`: each link is a Tab stop, the whole row shows the focus ring. Without links the component takes no focus.",
        ru: "Строки с `href`: каждая ссылка — остановка Tab, кольцо фокуса обводит всю строку. Без ссылок компонент не получает фокус.",
      },
      {
        keys: "Enter",
        native: true,
        en: "Rows with `href`: follows the link (native `<a>`).",
        ru: "Строки с `href`: переходит по ссылке (нативное поведение `<a>`).",
      },
    ],
    aria: [
      {
        en: "Value mode: native `<progress>` — role `progressbar` with value and max.",
        ru: "Режим значения: нативный `<progress>` — роль `progressbar` со значением и максимумом.",
      },
      {
        en: 'Segments mode: `role="group"`; its text lists the shares of `max` («Видео: 38%, Документы: 21%»). With `label` (or `aria-label`) the group is named by it and described by the distribution — or by the legend when `legend` is on; without a name the distribution is the name.',
        ru: 'Режим сегментов: `role="group"`; его текст перечисляет доли от `max` («Видео: 38%, Документы: 21%»). С `label` (или `aria-label`) группа названа им и описана долями — или легендой, когда включён `legend`; без имени доли и есть имя.',
      },
      {
        en: "Rows: an `<ol>` named by `label`; each row reads as text («Москва 1 284 52%»), the bars are `aria-hidden`. A row with `href` is an `<a>` inside the item: a link named by the same text.",
        ru: "Строки: список `<ol>` с именем из `label`; каждая строка читается текстом («Москва 1 284 52%»), полосы — `aria-hidden`. Строка с `href` — `<a>` внутри пункта: ссылка с тем же именем.",
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
