import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "BottomNav.Root",
      en: "`ref` → `HTMLElement`. The `<nav>` bar: equal columns, surface fill with a faint top divider, the bottom safe-area inset below the items. Inside `AppShell.Footer` it shows only while the panel is narrower than 640px.",
      ru: "Полоса `<nav>`: равные колонки, заливка поверхности с тонким разделителем сверху, нижний безопасный отступ под пунктами. Внутри `AppShell.Footer` видна, пока панель уже 640px.",
      props: [
        {
          name: "iconOnly",
          type: "boolean",
          default: "false",
          en: "Icons without visible labels; the labels stay in the DOM as visually hidden text and name the items.",
          ru: "Только иконки: подписи скрыты визуально, но остаются в DOM и называют пункты для скринридеров.",
        },
        {
          name: "floating",
          type: "boolean",
          default: "false",
          en: "A glass capsule over the content: translucent `--prime-color-bg-glass` with a backdrop blur, a bright rim, inset `--prime-bottom-nav-floating-inset` from the edges and above the home indicator. Positions itself at the bottom of its positioned container (`AppShell.Footer`, which then takes no height), so the page scrolls under it; with `iconOnly` the capsule hugs its square items, centred. Opaque under `prefers-reduced-transparency`.",
          ru: "Стеклянная капсула над содержимым: полупрозрачная заливка с размытием фона и светлым краем, с отступом от краёв экрана и над полоской «домой». Встаёт внизу своего позиционированного контейнера (`AppShell.Footer`, который тогда не занимает высоты), страница прокручивается под ней; с `iconOnly` капсула сжимается до квадратных пунктов по центру. При `prefers-reduced-transparency` — непрозрачная.",
        },
        {
          name: "labels",
          type: "Partial<BottomNavLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`children` (3–5 `BottomNav.Item`), `aria-label` (replaces `labels.nav`), `className` and the other attributes.",
          ru: "`children` (3–5 `BottomNav.Item`), `aria-label` (заменяет `labels.nav`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "BottomNav.Item",
      en: '`ref` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`: the icon (24) above a short label (10).',
      ru: "Кнопка, ссылка при `href` или единственный дочерний элемент при `asChild`: иконка (24) над короткой подписью (10).",
      props: [
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'Current section: `aria-current="page"`; the icon and the label turn primary (the others are muted).',
          ru: 'Текущий раздел: `aria-current="page"`; иконка и подпись становятся основного цвета (остальные приглушены).',
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`.",
          ru: "Неактивный пункт: `disabled` / `aria-disabled`; ссылка теряет `href`.",
        },
        {
          name: "href",
          type: "string",
          en: "Renders an `<a>` (with `target`, `rel`).",
          ru: "Рендерит `<a>` (с `target`, `rel`).",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts.",
          ru: "Рендерит единственный дочерний элемент (например `NavLink`) как пункт; его дети — подпись и части.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`BottomNav.ItemIcon`, an optional `BottomNav.ItemCount` and a short label (one word).",
          ru: "`BottomNav.ItemIcon`, необязательный `BottomNav.ItemCount` и короткая подпись (одно слово).",
        },
        {
          name: "…rest",
          type: "ButtonHTMLAttributes<HTMLButtonElement>",
          en: "`onClick`, `aria-*`, `className` and the other attributes.",
          ru: "`onClick`, `aria-*`, `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "BottomNav.ItemIcon",
      en: "`ref` → `HTMLSpanElement`. The item glyph (`aria-hidden`, 24) above the label.",
      ru: "Значок пункта (24, скрыт от скринридеров) над подписью.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="nav.home" />`.',
          ru: 'Иконка, например `<Icon name="nav.home" />`.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "BottomNav.ItemCount",
      en: "`ref` → `HTMLSpanElement` (the Badge). An `xs` Badge on the icon's top-end corner; read after the label («Заказы 12»).",
      ru: "Бейдж `xs` на верхнем углу иконки; читается после подписи («Заказы 12»).",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number (or a short status such as «99+»).",
          ru: "Число (или короткий статус, например «99+»).",
        },
        {
          name: "color",
          type: "PaletteColor",
          default: '"red"',
          en: "Badge hue: a count on a section asks for attention.",
          ru: "Цвет бейджа: счётчик на разделе просит внимания.",
        },
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          default: '"solid"',
          en: "Badge treatment.",
          ru: "Подача бейджа.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "nav",
      default: "Основные разделы",
      en: "`aria-label` of the `<nav>` landmark.",
      ru: "`aria-label` ориентира `<nav>`.",
    },
  ],
};
