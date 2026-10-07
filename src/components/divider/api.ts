import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Divider",
      en: '`ref` → `HTMLDivElement`. A `role="separator"` hairline in `border-subtle`; children become its label.',
      ru: 'Волосяная линия `role="separator"` цвета `border-subtle`; children становятся подписью.',
      props: [
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          en: "`vertical` stretches to the height of its flex row and sets `aria-orientation`.",
          ru: "`vertical` растягивается на высоту flex-ряда и ставит `aria-orientation`.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          en: "Position of the label on the line; `start` reads as a section heading.",
          ru: "Положение подписи на линии; `start` читается как заголовок секции.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the label: type, gap and icon size. Match the content around the divider.",
          ru: "Ярус подписи: шрифт, отступ и размер иконки. Совпадает с ярусом контента вокруг.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Label: text, an `Icon`, or both. Omit for a plain line.",
          ru: "Подпись: текст, `Icon` или оба. Без children — просто линия.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: '`className`, `role` (`"presentation"` for a purely visual line), `aria-label` and the other div attributes.',
          ru: '`className`, `role` (`"presentation"` для чисто визуальной линии), `aria-label` и остальные атрибуты div.',
        },
      ],
    },
  ],
  labels: [],
};
