import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Sparkline",
      en: '`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over a line or bar chart; the chart is a `role="slider"` that picks a point. The change hides when a percentage means nothing (the previous value is 0 or the sign flips).',
      ru: 'Заголовок (название · дата, значение · изменение) над линейным графиком или столбиками; график — `role="slider"`, выбирающий точку. Изменение скрыто, когда процент бессмысленен (предыдущее значение 0 или знак сменился).',
      props: [
        {
          name: "data",
          type: "SparklinePoint[]",
          required: true,
          en: "Points oldest first, `{ label, value }`; `label` names the point («8 окт»). Two or more draw a line. A new array cross-fades the line in.",
          ru: "Точки от старой к новой, `{ label, value }`; `label` — имя точки («8 окт»). Линия рисуется от двух точек. Новый массив проявляет линию заново.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          en: 'Visible title above the value and the accessible name of the chart; with `layout="compact"` only the accessible name.',
          ru: 'Видимое название над значением и доступное имя графика; при `layout="compact"` — только доступное имя.',
        },
        {
          name: "layout",
          type: '"default" | "compact"',
          default: '"default"',
          en: "`default` — the headline over an 80 px plot; `compact` — the plot alone at an `xs` control height with the dot at rest, for a DataTable cell; the point stays in `aria-valuetext`.",
          ru: "`default` — заголовок над графиком 80 px; `compact` — только график высотой с контрол `xs` и точкой покоя, для ячейки DataTable; точка — в `aria-valuetext`.",
        },
        {
          name: "variant",
          type: '"line" | "bars"',
          default: '"line"',
          en: "`line` — a line over a soft area; `bars` — a bar per point standing on a zero line: up when positive, down (danger) when negative, the value end rounded.",
          ru: "`line` — линия над мягкой заливкой; `bars` — столбик на точку от нулевой линии: вверх при плюсе, вниз (danger) при минусе, конец значения скруглён.",
        },
        {
          name: "highlight",
          type: "number",
          default: "the latest point",
          en: "Index of the point at rest (the current month): the headline shows it when nobody scrubs and leaving the chart returns to it; `bars` draw the other bars quieter.",
          ru: "Индекс точки в покое (текущий месяц): заголовок показывает её, пока график не ведут, и возвращается к ней; в `bars` остальные столбики тише.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The series is on its way: Skeletons of the date, the value and the plot that cross-fade into the data; the title stays, the root is `aria-busy` and the chart is not focusable yet.",
          ru: "Ряд загружается: Skeleton даты, значения и графика, которые плавно сменяются данными; название остаётся, корень `aria-busy`, график пока не в фокусе.",
        },
        {
          name: "formatValue",
          type: "(value: number) => string",
          default: "Russian digit groups",
          en: "Display of a value in the headline and the spoken point («312 400 ₽»).",
          ru: "Вид значения в заголовке и в озвучке точки («312 400 ₽»).",
        },
        {
          name: "labels",
          type: "Partial<SparklineLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className`, `data-*` and the other div attributes on the root.",
          ru: "`className`, `data-*` и остальные атрибуты div на корне.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "point",
      default: "{label}: {value}",
      en: "Spoken value of the chosen point (`aria-valuetext`); `{label}` and `{value}` are replaced.",
      ru: "Озвучка выбранной точки (`aria-valuetext`); `{label}` и `{value}` подставляются.",
    },
  ],
};
