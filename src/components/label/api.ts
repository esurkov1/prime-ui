import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { LABEL_LABELS } from "./Label";

export const api: ComponentApi = {
  parts: [
    {
      name: "Label.Root",
      en: "`ref` → `HTMLLabelElement`. The native `<label>`: text, then the required `*` or the optional marker; provides its size to the icons inside.",
      ru: "Нативный `<label>`: текст, затем обязательная `*` или пометка «необязательно»; передаёт размер иконкам внутри.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Size of the paired field: xs/s 12/16 · m 13/20 · l/xl 14/20, weight 500. Without it the tier of its host, else `m`; the label provides its tier to the icons inside.",
          ru: "Ярус поля под подписью: xs/s 12/16 · m 13/20 · l/xl 14/20, начертание 500. Без него — ярус хоста, иначе `m`; подпись передаёт свой ярус иконкам внутри.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Appends a red `*` (`aria-hidden`). Put native `required` on the control itself.",
          ru: "Красная `*` после текста (`aria-hidden`). Нативный `required` ставьте на сам контрол.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Appends the muted optional marker (`labels.optional`).",
          ru: "Приглушённая пометка «необязательно» (`labels.optional`).",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Disabled color for the text and the markers, `aria-disabled`. A disabled `Fieldset` around the label sets it too.",
          ru: "Цвет неактивного текста для подписи и пометок, `aria-disabled`. Выключенный `Fieldset` вокруг подписи включает его тоже.",
        },
        {
          name: "secondary",
          type: "boolean",
          en: "Quieter: secondary text on one line, cut with an ellipsis — a column heading under the group's own label (FieldList).",
          ru: "Тише: вторичный цвет в одну строку с многоточием — заголовок колонки под подписью группы (FieldList).",
        },
        {
          name: "labels",
          type: "Partial<LabelLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "htmlFor",
          type: "string",
          en: "Id of a native control. For a custom control give the label an `id` and set `aria-labelledby` on the control.",
          ru: "Id нативного контрола. Для кастомного — `id` на подписи и `aria-labelledby` на контроле.",
        },
        {
          name: "…rest",
          type: 'Omit<LabelHTMLAttributes<HTMLLabelElement>, "size">',
          en: "`id`, `className` and the other label attributes.",
          ru: "`id`, `className` и остальные атрибуты label.",
        },
      ],
    },
    {
      name: "Label.Icon",
      en: "`ref` → `HTMLSpanElement`. A muted, non-shrinking `<span>` icon slot (`aria-hidden`) before the text; kit icons take the label size.",
      ru: "Приглушённый несжимаемый слот `<span>` иконки (`aria-hidden`) перед текстом; иконки кита берут размер подписи.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Label.Description",
      en: "`ref` → `HTMLSpanElement`. A regular-weight muted `<span>` in the same line (units, context); part of the accessible name.",
      ru: "Приглушённый `<span>` обычного начертания в той же строке (единицы, контекст); входит в доступное имя.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(LABEL_LABELS, {
    optional: {
      en: "Marker after the text when `optional`.",
      ru: "Пометка после текста при `optional`.",
    },
  }),
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: 'Bind with `htmlFor` to a native control, or set `id` on the label and `aria-labelledby` on a custom control (a `role="radiogroup"`, a `fieldset` of cells).',
        ru: 'Свяжите подпись с нативным контролом через `htmlFor`, с кастомным (`role="radiogroup"`, `fieldset` из ячеек) — через `id` на подписи и `aria-labelledby` на контроле.',
      },
      {
        en: "The `*` is `aria-hidden`; requiredness must come from the control (`required`).",
        ru: "`*` скрыта (`aria-hidden`): обязательность сообщает сам контрол (`required`).",
      },
      {
        en: "The optional marker and `Label.Description` are visible text and part of the accessible name; `Label.Icon` is `aria-hidden`.",
        ru: "Пометка «необязательно» и `Label.Description` — видимый текст и входят в имя поля; `Label.Icon` — `aria-hidden`.",
      },
    ],
  },
};
