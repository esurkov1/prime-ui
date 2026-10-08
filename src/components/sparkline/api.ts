import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Sparkline",
      en: '`ref` → `HTMLDivElement` (the root). A headline (title · date, value · change) over a line chart; the chart is a `role="slider"` that picks a point.',
      ru: 'Заголовок (название · дата, значение · изменение) над линейным графиком; график — `role="slider"`, выбирающий точку.',
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
          en: "Visible title above the value and the accessible name of the chart.",
          ru: "Видимое название над значением и доступное имя графика.",
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
