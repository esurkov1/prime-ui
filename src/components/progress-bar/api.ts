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
          en: "Line thickness 4 → 8 px (`--prime-control-<tier>-track`, shared with Slider) and label type. Without it the tier of its host, else `m`.",
          ru: "Толщина линии 4 → 8 px (`--prime-control-<tier>-track`, как у Slider) и шрифт подписи. Без него — ярус хоста, иначе `m`.",
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
          en: "Value mode: top of the scale. Segments mode: total capacity; a `max` above the sum of the parts leaves the rest as track.",
          ru: "Режим значения: верх шкалы. Режим сегментов: полная ёмкость; `max` больше суммы частей оставляет остаток дорожкой.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"accent"',
          en: "Value mode: fill color, telling the outcome.",
          ru: "Режим значения: цвет заливки, показывает исход.",
        },
        {
          name: "steps",
          type: "boolean",
          default: "false",
          en: "Value mode: draws the scale as `max` equal cells (2–12), each filled whole; `value` rounds to a cell. For a level out of a few: password strength, onboarding steps.",
          ru: "Режим значения: шкала из `max` равных ячеек (2–12), каждая заполняется целиком; `value` округляется до ячейки. Для уровня из нескольких: надёжность пароля, шаги настройки.",
        },
        {
          name: "segments",
          type: "ProgressSegment[]",
          en: "Segments mode: parts `{ value, label?, href?, onClick?, tone? | color? }`; share of `max` is the width. `rows` only: `href` makes the row a link, `onClick` runs on its press.",
          ru: "Режим сегментов: части `{ value, label?, href?, onClick?, tone? | color? }`; ширина — доля от `max`. Только `rows`: `href` делает строку ссылкой, `onClick` — на её нажатие.",
        },
        {
          name: "segmentGap",
          type: '"none" | "hairline"',
          default: '"none"',
          en: "Segments mode: `none` — one continuous pill; `hairline` — every part and the rest are separate pills. `bar` layout.",
          ru: "Режим сегментов: `none` — одна сплошная капсула; `hairline` — каждая часть и остаток отдельно. Раскладка `bar`.",
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
          type: '"sum" | "max" | "first"',
          default: '"sum"',
          en: "Segments mode: `rows` only: what 100% is. `sum` — bars and shares of the total (`max` raises it); `max` — the leader is a full bar, shares stay of the total; `first` — bars and shares against the first row (a funnel).",
          ru: "Режим сегментов: только `rows`: что такое 100%. `sum` — полосы и доли от суммы (`max` её поднимает); `max` — лидер на всю ширину, доли от суммы; `first` — полосы и доли от первой строки (воронка).",
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
