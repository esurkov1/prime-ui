import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Skeleton",
      en: '`ref` → `HTMLSpanElement`. A pulsing placeholder in the shape of loading content; `aria-hidden="true"`.',
      ru: 'Пульсирующая заглушка в форме загружаемого содержимого; `aria-hidden="true"`.',
      props: [
        {
          name: "shape",
          type: '"text" | "control" | "chip" | "circle" | "block"',
          default: '"text"',
          en: "`text` — lines of the tier's text; `control` — a field or button of the tier; `chip` — a badge of the tier; `circle` — an avatar of the tier; `block` — a box that fills its container (image, chart, card).",
          ru: "`text` — строки текста яруса; `control` — поле или кнопка яруса; `chip` — бейдж яруса; `circle` — аватар яруса; `block` — блок на всю площадь контейнера (картинка, график, карточка).",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of the text line (control text size and line height), the control height or the avatar size.",
          ru: "Ярус строки текста (кегль и интерлиньяж контрола), высоты контрола или размера аватара.",
        },
        {
          name: "lines",
          type: "number",
          default: "1",
          en: "`text` only: number of lines; the last of several is 60% wide.",
          ru: "Только для `text`: число строк; последняя из нескольких — 60% ширины.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` (width, height of a `block`), `data-*` and the other span attributes.",
          ru: "`className` (ширина, высота у `block`), `data-*` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: 'Decorative: `aria-hidden="true"`, screen readers skip it.',
        ru: 'Заглушка декоративная: `aria-hidden="true"`, скринридер её не читает.',
      },
      {
        en: 'The loading region announces itself: `aria-busy` on it (Crossfade, a card, a form) and, when the wait matters, a `role="status"` text.',
        ru: 'О загрузке сообщает область: `aria-busy` на ней (Crossfade, карточка, форма), при необходимости — `role="status"` с текстом.',
      },
      {
        en: "Under `prefers-reduced-motion` the placeholder does not pulse.",
        ru: "Под `prefers-reduced-motion` заглушка не пульсирует.",
      },
    ],
  },
};
