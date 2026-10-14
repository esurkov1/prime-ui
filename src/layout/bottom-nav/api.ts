import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BOTTOM_NAV_LABELS } from "./BottomNav";

export const api: ComponentApi = {
  parts: [
    {
      name: "BottomNav.Root",
      en: "`ref` → `HTMLElement`. The `<nav>`: the bar of items in equal columns and the actions beside it. Inside `AppShell.Footer` it shows only while no Sidebar rail is on screen.",
      ru: "`<nav>`: полоса пунктов равными колонками и действия рядом с ней. Внутри `AppShell.Footer` видна, только пока на экране нет рейла Sidebar.",
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
          en: "A glass capsule floating over the content at the bottom of its positioned container (`AppShell.Footer`), with a selection capsule gliding under the current item; the page scrolls under it.",
          ru: "Стеклянная капсула над содержимым внизу своего позиционированного контейнера (`AppShell.Footer`); под текущим пунктом скользит капсула выбора, страница прокручивается под ней.",
        },
        {
          name: "labels",
          type: "Partial<BottomNavLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
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
      ru: '`<button type="button">`, ссылка `<a>` при `href` или единственный дочерний элемент при `asChild`: иконка (20) над короткой подписью (10).',
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
          en: "Not interactive: `disabled` / `aria-disabled`, `data-disabled`, out of the Tab order; an `href` link loses its `href`, an `asChild` child keeps its own and only its clicks are blocked.",
          ru: "Неактивный пункт: `disabled` / `aria-disabled`, `data-disabled`, вне порядка Tab; ссылка из `href` теряет `href`, у потомка `asChild` ссылка остаётся, но клики гасятся.",
        },
        {
          name: "href",
          type: "string",
          en: "Renders an `<a>` (with `target`, `rel`).",
          ru: "Рендерит `<a>` (с `target`, `rel`).",
        },
        {
          name: "target",
          type: "string",
          en: "Where the `<a>` opens (`href` only).",
          ru: "Где открывается `<a>` (только с `href`).",
        },
        {
          name: "rel",
          type: "string",
          en: "Relationship of the `<a>` (`href` only).",
          ru: "Отношение ссылки `<a>` (только с `href`).",
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
      ru: "Значок пункта (`aria-hidden`, 20) над подписью.",
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
      en: '`ref` → `HTMLButtonElement`. A Button `shape="circle"` (`l`, neutral solid) beside the bar for the screen\'s main action. Placed before the first item it stands at the start, otherwise at the end.',
      ru: 'Круглая Button (`shape="circle"`, `l`, нейтральная заливка) рядом с полосой для главного действия экрана. Перед первым пунктом встаёт в начале, иначе в конце.',
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
  labels: labelRows(BOTTOM_NAV_LABELS, {
    nav: { en: "`aria-label` of the `<nav>` landmark.", ru: "`aria-label` ориентира `<nav>`." },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab · Shift+Tab",
        en: "Moves focus through the sections and the action; a disabled one is skipped.",
        ru: "Переводит фокус по разделам и действию; недоступный пропускается.",
      },
      {
        keys: "Enter",
        en: "Opens the section (a link or a button) or runs the action.",
        ru: "Открывает раздел (ссылка или кнопка) или выполняет действие.",
      },
    ],
    aria: [
      {
        en: "A `<nav>` landmark named by `labels.nav` («Основные разделы») or its own `aria-label`.",
        ru: "Ориентир `<nav>` с именем `labels.nav` («Основные разделы») или своим `aria-label`.",
      },
      {
        en: 'The current section has `aria-current="page"`; visually it is the primary-color item among muted ones (a contrast step, not a hue); floating, it also sits on the selection capsule, so the accent is never the only cue.',
        ru: 'Текущий раздел — `aria-current="page"`: иконка и подпись основного цвета, остальные приглушены; в капсуле — акцентного цвета на капсуле выбора, так что цвет не единственный признак.',
      },
      {
        en: "The icon is hidden from assistive tech; the item is named by its label, the count is read after it («Заказы 12»).",
        ru: "Иконка скрыта от скринридеров; имя пункта — подпись, счётчик читается после неё («Заказы 12»).",
      },
      {
        en: "`BottomNav.Action` is a button without text, named by its required `aria-label`; it sits inside the landmark, before or after the items (where it is placed).",
        ru: "`BottomNav.Action` — кнопка без текста, её имя — обязательный `aria-label`; она внутри ориентира, до или после пунктов (где написана).",
      },
      {
        en: "A disabled item is a `disabled` button, an `aria-disabled` link without `href`, or an `aria-disabled` `asChild` child out of the Tab order (`tabIndex={-1}`).",
        ru: "Недоступный пункт — `disabled` у кнопки, `aria-disabled` у ссылки без `href` или `aria-disabled` у потомка `asChild` вне порядка Tab (`tabIndex={-1}`).",
      },
    ],
  },
};
