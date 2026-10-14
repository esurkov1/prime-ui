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
          en: "Scroll axis; the other axis is clipped (except `both`). On `horizontal` a vertical mouse wheel scrolls the strip sideways.",
          ru: "Ось прокрутки; другая ось обрезается (кроме `both`). На `horizontal` вертикальное колесо мыши прокручивает полосу вбок.",
        },
        {
          name: "edges",
          type: '"fade" | "shadow" | "none"',
          default: '"fade"',
          en: "Edges that hide content: `fade` dissolves them over any background; `shadow` — a soft shadow on the region's own fill (a floating panel, a code well); `none` — plain edges.",
          ru: "Края, за которыми скрыто содержимое: `fade` растворяет их поверх любого фона; `shadow` — мягкая тень на собственной заливке области (плавающая панель, блок кода); `none` — обычные края.",
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
          en: "The person cannot scroll the region (wheel, touch, keys, a drag's auto-scroll); code still can. Sets `data-lock`.",
          ru: "Человек не может прокрутить область (колесо, касание, клавиши, автопрокрутка перетаскивания); код может. Ставит `data-lock`.",
        },
        {
          name: "snap",
          type: "boolean",
          default: "false",
          en: 'Scrolling comes to rest on the start of a child (proximity snapping). For strips of tiles and cards; not with `anchor="end"`.',
          ru: 'Прокрутка останавливается на начале дочернего элемента (мягкая привязка). Для полос плиток и карточек; не вместе с `anchor="end"`.',
        },
        {
          name: "anchor",
          type: '"start" | "end"',
          default: '"start"',
          en: "`end` — a chat or a log: opens at the end and follows new content while the person is at the end; scrolled away, the view holds still.",
          ru: "`end` — чат или журнал: открывается в конце и следует за новым содержимым, пока человек в конце; прокрутил выше — видимое стоит на месте.",
        },
        {
          name: "onReachStart",
          type: "() => void | Promise<void>",
          en: "Fires within 120 px of the start, once per approach: load older content. A returned promise blocks repeats and sets `aria-busy`; content added above keeps the view.",
          ru: "Срабатывает ближе 120 px к началу, раз за подход: подгрузите более старое. Возвращённый промис блокирует повторы и ставит `aria-busy`; добавленное сверху не сдвигает видимое.",
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
  accessibility: {
    keyboard: [
      {
        keys: "↑ · ↓ · ← · →",
        en: "Scroll the focused region (with `tabIndex={0}`) by a step",
        ru: "Прокручивают сфокусированную область (с `tabIndex={0}`) на шаг",
      },
      { keys: "PageUp · PageDown · Space", en: "Scroll by a screen", ru: "Прокручивают на экран" },
      { keys: "Home · End", en: "To the start and to the end", ru: "К началу и к концу" },
    ],
    aria: [
      {
        en: "Renders a plain element; add `tabIndex={0}` and `aria-label` when the region has no focusable content but must scroll from the keyboard (the browser scrolls it; the ring is inset).",
        ru: "Обычный элемент без роли: если внутри нет фокусируемого содержимого, дайте `tabIndex={0}` и `aria-label`, чтобы область прокручивалась с клавиатуры; кольцо фокуса — внутри края.",
      },
      {
        en: "Choose a semantic `as` (`main`, `nav`, `aside`) when the region is a landmark.",
        ru: "Для области-ориентира выберите `as` (`main`, `nav`, `aside`).",
      },
      {
        en: "`edges` is only decoration: content under a fade or a shadow stays reachable and scrolls by wheel, touch and focus; focus and `scrollIntoView` stop clear of a fade.",
        ru: "`edges` — только оформление: содержимое под затуханием или тенью доступно и прокручивается колесом, касанием и фокусом; фокус и `scrollIntoView` останавливаются вне затухания.",
      },
      {
        en: "`lock` keeps the content in the focus order: a locked region does not scroll, its items stay reachable.",
        ru: "`lock` не убирает содержимое из порядка фокуса: заблокированную область не прокрутить, но её элементы доступны.",
      },
      {
        en: "While an edge load is pending the region is `aria-busy`; announcing new entries is the feed's job (a polite status or `aria-live` on a counter), so a busy chat does not read every message aloud.",
        ru: "Пока промис `onReachStart` / `onReachEnd` не завершён, на области `aria-busy`; озвучить подгрузку — дело ленты (`aria-live` у счётчика или статуса).",
      },
    ],
  },
};
