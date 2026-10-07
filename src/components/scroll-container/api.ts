import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ScrollContainer",
      en: "`forwardRef` → `HTMLElement`. A scroll region with the kit's thin scrollbar that shrinks inside flex and grid parents; no padding of its own.",
      ru: "Область прокрутки с тонким скроллбаром кита; сжимается внутри flex и grid, своих отступов нет.",
      props: [
        {
          name: "axis",
          type: '"vertical" | "horizontal" | "both"',
          default: '"vertical"',
          en: "Scroll axis; the other axis is clipped (except `both`).",
          ru: "Ось прокрутки; другая ось обрезается (кроме `both`).",
        },
        {
          name: "fade",
          type: "boolean",
          default: "false",
          en: 'Fades the edge where more content is hidden (`--prime-space-8` mask): horizontal for `axis="horizontal"`, vertical otherwise. Follows scroll and size changes.',
          ru: 'Затухание края, за которым скрыто содержимое: по горизонтали для `axis="horizontal"`, иначе по вертикали. Следит за прокруткой и размером.',
        },
        {
          name: "scrollbar",
          type: '"thin" | "hidden"',
          default: '"thin"',
          en: "`thin` — the kit's quiet scrollbar; `hidden` — no scrollbar, only together with `fade` so the overflow stays visible.",
          ru: "`thin` — тихий скроллбар кита; `hidden` — без скроллбара, только вместе с `fade`.",
        },
        {
          name: "overscrollBehavior",
          type: '"auto" | "contain" | "none"',
          default: '"contain"',
          en: "CSS `overscroll-behavior`; `contain` stops scroll chaining into the page.",
          ru: "CSS `overscroll-behavior`; `contain` не передаёт прокрутку странице.",
        },
        {
          name: "as",
          type: '"div" | "main" | "aside" | "section" | "nav" | "article"',
          default: '"div"',
          en: "Root element; a landmark tag when the region is one.",
          ru: "Корневой элемент; тег-ориентир, если область им является.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children`, `className` (height, padding), `aria-label`, `tabIndex`, `role`, event handlers and the other attributes.",
          ru: "`children`, `className` (высота, отступы), `aria-label`, `tabIndex`, `role`, обработчики и остальные атрибуты.",
        },
      ],
    },
  ],
  labels: [],
};
