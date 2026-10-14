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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the label: type, gap and icon size. Without it the tier of the content around (a menu, a panel with a size), else `m`.",
          ru: "Ярус подписи: шрифт, отступ и размер иконки. Без него — ярус контента вокруг (меню, панель с размером), иначе `m`.",
        },
        {
          name: "inset",
          type: "boolean",
          default: "false",
          en: "The line stands off its neighbours by the tier gap; a vertical one is one text line tall, centred in its row (a header, a toolbar).",
          ru: "Линия отступает от соседей на отступ яруса; вертикальная — высотой в строку текста, по центру ряда (шапка, панель).",
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
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: '`role="separator"`; vertical sets `aria-orientation="vertical"`.',
        ru: '`role="separator"`; у вертикального — `aria-orientation="vertical"`.',
      },
      {
        en: 'A purely visual line between rows that are separate anyway → `role="presentation"`.',
        ru: 'Чисто визуальная линия (между строками, которые и так разделены) — `role="presentation"`.',
      },
      {
        en: "A labelled separator is named by its label (`aria-labelledby`); an icon-only divider needs `aria-label`.",
        ru: "Разделитель с подписью назван ею (`aria-labelledby`); разделителю с одной иконкой задайте `aria-label`.",
      },
    ],
  },
};
