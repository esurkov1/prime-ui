import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "ScrollContainer",
      en: "`ref` → `HTMLElement`. The kit's one scroll region: thin scrollbar, soft edges where content is hidden, shrinks inside flex and grid parents; no padding of its own. Scroll it from code with the element's own `scrollTo` / `scrollBy`.",
      ru: "Единственная область прокрутки кита: тонкий скроллбар, мягкие края там, где скрыто содержимое, сжимается внутри flex и grid; своих отступов нет. Из кода прокручивайте собственными `scrollTo` / `scrollBy` элемента.",
      props: [
        {
          name: "axis",
          type: '"vertical" | "horizontal" | "both"',
          default: '"vertical"',
          en: "Scroll axis; the other axis is clipped (except `both`). On `horizontal` a vertical mouse wheel scrolls the strip sideways while it can move (a trackpad's own sideways swipe, Shift + wheel and a page scroll passing over stay native).",
          ru: "Ось прокрутки; другая ось обрезается (кроме `both`). На `horizontal` вертикальное колесо мыши прокручивает полосу вбок, пока она может сдвинуться (свайп трекпада вбок, Shift + колесо и прокрутка страницы, проходящая над полосой, остаются нативными).",
        },
        {
          name: "edges",
          type: '"fade" | "shadow" | "none"',
          default: '"fade"',
          en: "Every edge of the scroll axes that hides content: `fade` dissolves it (an alpha mask, over any background; as deep as the hidden part, `--prime-space-8` at most, so it grows and melts with the scroll) and sets `scroll-padding` of that depth, so focus and `scrollIntoView` land clear of it; `shadow` — a soft shadow over the edge on the region's own fill `--prime-color-layer-current`, pure CSS (a region that is itself a surface: a floating panel, a code well); `none` — plain edges (a page column, a table that draws its own edge shadows).",
          ru: "Края по осям прокрутки, за которыми скрыто содержимое: `fade` растворяет их (альфа-маска поверх любого фона; глубиной со скрытую часть, не больше `--prime-space-8`, растёт и тает с прокруткой) и ставит `scroll-padding` той же глубины, чтобы фокус и `scrollIntoView` не уходили под затухание; `shadow` — мягкая тень над краем на собственной заливке `--prime-color-layer-current`, чистый CSS (область, которая сама поверхность: плавающая панель, блок кода); `none` — обычные края (колонка страницы, таблица со своими тенями краёв).",
        },
        {
          name: "scrollbar",
          type: '"thin" | "hidden"',
          default: '"thin"',
          en: "`thin` — the kit's quiet scrollbar; `hidden` — no scrollbar, keep `edges` on so the overflow stays visible.",
          ru: "`thin` — тихий скроллбар кита; `hidden` — без скроллбара, оставьте `edges`, чтобы переполнение было видно.",
        },
        {
          name: "lock",
          type: "boolean",
          default: "false",
          en: "The person cannot scroll the region — wheel, touch, keys and a drag's edge auto-scroll; it keeps its position (code may still set it). For a list behind an open review or a drag that must not move it. Sets `data-lock`.",
          ru: "Человек не может прокрутить область — колесом, касанием, клавишами и автопрокруткой перетаскивания; позиция сохраняется (код может её менять). Для списка за открытой проверкой или перетаскивания, которое не должно его сдвигать. Ставит `data-lock`.",
        },
        {
          name: "snap",
          type: "boolean",
          default: "false",
          en: 'Scrolling comes to rest on the start of a child (`scroll-snap-type: proximity` along the axis, `scroll-snap-align: start` on the children); a host aligns deeper items itself. For strips of tiles and cards; not with `anchor="end"`.',
          ru: 'Прокрутка останавливается на начале дочернего элемента (`scroll-snap-type: proximity` по оси, `scroll-snap-align: start` у детей); более глубокие элементы выравнивает хост. Для полос плиток и карточек; не вместе с `anchor="end"`.',
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
