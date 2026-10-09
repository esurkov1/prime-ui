import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ScrollContainer",
      en: "`ref` → `HTMLElement`. A scroll region with the kit's thin scrollbar that shrinks inside flex and grid parents; no padding of its own.",
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
          name: "anchor",
          type: '"start" | "end"',
          default: '"start"',
          en: "`end` — a chat or a log: the region opens at the end and stays there while content arrives, as long as the person is at the end (within 4 px); scrolled away, what they look at stays put. Sets `data-anchor` and turns the browser's own scroll anchoring off.",
          ru: "`end` — чат или журнал: область открывается в конце и остаётся там, пока приходит содержимое, если человек в конце (ближе 4 px); если он прокрутил выше, видимое остаётся на месте. Ставит `data-anchor` и выключает собственную привязку прокрутки браузера.",
        },
        {
          name: "onReachStart",
          type: "() => void | Promise<void>",
          en: "The scroll position came within 120 px of the start: load older content. Fires once per approach (again after leaving the zone or when the content grows); a returned promise blocks repeat calls and sets `aria-busy` until it settles. Content added above keeps the view in place.",
          ru: "Прокрутка подошла к началу ближе 120 px: подгрузите более старое. Срабатывает один раз за подход (снова — после ухода из зоны или когда содержимое выросло); пока возвращённый промис не завершён, повторов нет и стоит `aria-busy`. Добавленное сверху не сдвигает видимое.",
        },
        {
          name: "onReachEnd",
          type: "() => void | Promise<void>",
          en: "The scroll position came within 120 px of the end: load the next page. Same once-per-approach and promise rules as `onReachStart`.",
          ru: "Прокрутка подошла к концу ближе 120 px: подгрузите следующую порцию. Те же правила, что у `onReachStart`.",
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
