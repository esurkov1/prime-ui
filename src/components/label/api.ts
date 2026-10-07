import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Label.Root",
      en: "`forwardRef` → `HTMLLabelElement`. The native `<label>`: text, then the required `*` or the optional marker; provides its size to the icons inside.",
      ru: "Нативный `<label>`: текст, затем `*` или пометка «необязательно»; передаёт размер иконкам внутри.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Size of the paired field: xs/s 12/16 · m 13/20 · l/xl 14/20, weight 500.",
          ru: "Ярус поля под подписью: xs/s 12/16 · m 13/20 · l/xl 14/20, начертание 500.",
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
          en: "Disabled color for the text and the markers, `aria-disabled`.",
          ru: "Цвет неактивного текста для подписи и пометок, `aria-disabled`.",
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
      en: "No ref. A muted, non-shrinking icon slot (`aria-hidden`) before the text; kit icons take the label size. Native `<span>` props.",
      ru: "Приглушённая иконка перед текстом (`aria-hidden`); иконки кита берут размер подписи.",
      props: [],
    },
    {
      name: "Label.Description",
      en: "No ref. Regular-weight muted text in the same line (units, context); part of the accessible name. Native `<span>` props.",
      ru: "Приглушённое уточнение в той же строке (единицы, контекст); входит в имя поля.",
      props: [],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the text when `optional`.",
      ru: "Пометка после текста при `optional`.",
    },
  ],
};
