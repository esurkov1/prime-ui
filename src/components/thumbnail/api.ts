import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Thumbnail.Root",
      en: "`ref` → `HTMLDivElement`. The frame: height of the tier, width from `ratio`, radius, palette fill; tracks the image load for the Fallback.",
      ru: "Рамка: высота яруса, ширина по `ratio`, скругление и заливка палитры; следит за загрузкой картинки для Fallback.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Height 24 · 32 · 40 · 48 · 64 px, radius 4 · 6 · 8 · 8 · 12; width follows `ratio`.",
          ru: "Высота 24 · 32 · 40 · 48 · 64 px, скругление 4 · 6 · 8 · 8 · 12; ширина по `ratio`.",
        },
        {
          name: "ratio",
          type: '"1:1" | "4:3" | "3:2" | "16:9" | "3:4"',
          default: '"1:1"',
          en: "Aspect ratio, width ÷ height.",
          ru: "Соотношение сторон, ширина ÷ высота.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Fallback fill and icon hue; a color that means something (category, vehicle color).",
          ru: "Оттенок заливки и иконки подложки; цвет со смыслом (категория, цвет машины).",
        },
        {
          name: "variant",
          type: '"soft" | "solid"',
          default: '"soft"',
          en: "Fallback fill: a soft tint with a hue icon, or a solid hue with a contrasting icon.",
          ru: "Заливка подложки: мягкий оттенок с цветной иконкой или насыщенный цвет с контрастной.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Fills the container width (cards, galleries); the height follows `ratio`.",
          ru: "Во всю ширину контейнера (карточки, галереи); высота по `ratio`.",
        },
        {
          name: "ring",
          type: "boolean",
          default: "false",
          en: "A faint inner ring, for photos with a white background on a light surface.",
          ru: "Тонкое внутреннее кольцо — для фото на белом фоне на светлой поверхности.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `aria-label` + `role` for a fallback-only thumbnail, and the other div attributes.",
          ru: "`className`, `aria-label` + `role` для превью без картинки и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Thumbnail.Image",
      en: "`ref` → `HTMLImageElement`. The picture; hidden while it loads and after an error, so the Fallback shows through. A new `src` starts again.",
      ru: "Картинка; скрыта, пока грузится и после ошибки, — видна подложка. Новый `src` начинает загрузку заново.",
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          en: "Image URL.",
          ru: "Адрес картинки.",
        },
        {
          name: "alt",
          type: "string",
          default: '""',
          en: "Empty when the text next to the thumbnail names the object, otherwise a description.",
          ru: "Пустой, когда объект назван текстом рядом, иначе — описание.",
        },
        {
          name: "fit",
          type: '"cover" | "contain"',
          default: '"cover"',
          en: "`cover` crops to fill; `contain` shows the whole image on the fallback fill (logos).",
          ru: "`cover` обрезает по рамке; `contain` показывает картинку целиком на заливке (логотипы).",
        },
        {
          name: "…rest",
          type: 'Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">',
          en: "`className`, `onLoad`, `onError` and the other img attributes.",
          ru: "`className`, `onLoad`, `onError` и остальные атрибуты img.",
        },
      ],
    },
    {
      name: "Thumbnail.Fallback",
      en: "A `<span>` with an icon (sized to the tier) or a short label on the fill; `aria-hidden` once the image has loaded.",
      ru: "`<span>` с иконкой (размер по ярусу) или короткой подписью на заливке; `aria-hidden`, когда картинка загрузилась.",
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
  labels: [],
};
