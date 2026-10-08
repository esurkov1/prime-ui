import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "BottomNav.Root",
      en: "`ref` → `HTMLElement`. The `<nav>`: the bar of items (equal columns, surface fill with a faint top divider, the bottom safe-area inset below the items) and the actions beside it. Inside `AppShell.Footer` it shows only while the shell has no Sidebar rail on screen (no `AppShell.Nav`, or the Sidebar is off-canvas).",
      ru: "`<nav>`: полоса пунктов (равные колонки, заливка поверхности с тонким разделителем сверху, нижний безопасный отступ под пунктами) и действия рядом с ней. Внутри `AppShell.Footer` видна, только пока у каркаса нет рейла Sidebar на экране (нет `AppShell.Nav` или Sidebar выдвижной).",
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
          en: "A glass capsule over the content: the iOS 26 tab bar at three quarters its size: a dense `--prime-color-bg-glass` tint over a strong backdrop blur with a hairline rim of light, 46 high (40 with `iconOnly`), across the width left beside its actions; the items share it equally. A selection capsule glides under the current item, an 18 icon over a 9 semibold label. A `BottomNav.Action` becomes a glass disk as tall as the capsule. Inset `--prime-bottom-nav-floating-inset` from the edges and above the home indicator; positions itself at the bottom of its positioned container (`AppShell.Footer`, which then takes no height), so the page scrolls under it. Opaque under `prefers-reduced-transparency`.",
          ru: "Стеклянная капсула над содержимым: как панель вкладок iOS 26, на четверть меньше: плотная заливка с сильным размытием и тонким светлым ободком, высота 46 (40 с `iconOnly`), во всю ширину рядом с действиями; пункты делят её поровну. Под текущим пунктом скользит капсула выбора. `BottomNav.Action` становится стеклянным кругом высотой с капсулу. Отступает от краёв экрана и от полоски «домой»; встаёт внизу своего позиционированного контейнера (`AppShell.Footer`, который тогда не занимает высоты), страница прокручивается под ней. При `prefers-reduced-transparency` — непрозрачная.",
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
          en: "`children` (2–6 `BottomNav.Item`, optional `BottomNav.Action` before or after them), `aria-label` (replaces `labels.nav`), `className` and the other attributes.",
          ru: "`children` (2–6 `BottomNav.Item`, необязательный `BottomNav.Action` до или после них), `aria-label` (заменяет `labels.nav`), `className` и остальные атрибуты.",
        },
      ],
    },
    {
      name: "BottomNav.Item",
      en: '`ref` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`: the icon (20) above a short label (10).',
      ru: "Кнопка, ссылка при `href` или единственный дочерний элемент при `asChild`: иконка (20) над короткой подписью (10).",
      props: [
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'Current section: `aria-current="page"`; the icon and the label turn primary (the others are muted); floating, the item is in the accent on the selection capsule (the others in full ink).',
          ru: 'Текущий раздел: `aria-current="page"`; иконка и подпись становятся основного цвета (остальные приглушены); в капсуле — акцентного цвета на капсуле выбора (остальные основного).',
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
      en: "`ref` → `HTMLSpanElement`. The item glyph (`aria-hidden`, 20) above the label.",
      ru: "Значок пункта (20, скрыт от скринридеров) над подписью.",
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
    {
      name: "BottomNav.Action",
      en: '`ref` → `HTMLButtonElement`. A round `<button type="button">` beside the bar for the screen\'s main action (create, search, assistant): a soft disk at the edge of a flat bar, a glass disk as tall as the capsule when `floating`. Placed before the first item it stands at the start, otherwise at the end.',
      ru: "Круглая кнопка рядом с полосой для главного действия экрана (создать, поиск, ассистент): мягкий круг у края плоской полосы, стеклянный круг высотой с капсулу при `floating`. Перед первым пунктом встаёт в начале, иначе в конце.",
      props: [
        {
          name: "aria-label",
          type: "string",
          required: true,
          en: "The name of the action: the button has no visible text.",
          ru: "Имя действия: у кнопки нет видимого текста.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The glyph, e.g. `<Icon name="action.add" />`.',
          ru: 'Значок, например `<Icon name="action.add" />`.',
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">',
          en: "`onClick`, `disabled`, `className` and the other button attributes.",
          ru: "`onClick`, `disabled`, `className` и остальные атрибуты кнопки.",
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
