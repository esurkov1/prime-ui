# Sidebar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Боковая навигация: `Sidebar.Root` задаёт контекст и оболочку `aside`; `Sidebar.NavPanel` — основная колонка (шапка, прокручиваемый контент, подвал), группы, меню, doc-блоки.

**When to use**

- Постоянная вертикальная навигация приложения: продуктовые разделы, настройки, админка.
- SPA: `MenuRouterLink` + React Router для активного пункта по URL.

**When not to use**

- Навигация, которая умещается в одну горизонтальную полосу — рассмотреть верхнее меню или drawer.

## Composition

- **`Sidebar.Root`** — обязательная обёртка: `aside`, `aria-label`, `data-*` для `size`, `open`, `responsive`, опционально `sidebarSlot`. Подложка и плавающая кнопка на узком viewport при `responsive`.
- **`Sidebar.NavPanel`** — главная колонка (`nav`).
- Типичный порядок: **`Header`** → **`HeaderRow`** → **`HeaderMain`** и **`ToggleButton`** → **`Content`** (**`NavCategory`**, **`Group`** + **`Menu`**) → опционально **`Footer`**.

## Rules

- **`open`**: контролируемый или неконтролируемый; при **`responsive={true}`** и узком окне стартовое `open` может быть `false`.
- Узкий viewport: **`SIDEBAR_MEDIA_QUERY_NARROW`** в `sidebarLayout.ts` (в CSS те же `64rem`).
- **`ToggleButton`** / плавающая кнопка: `aria-expanded`, `aria-controls` → id **`NavPanel`**.
- **`useSidebarContext`** — только под **`Sidebar.Root`**.

## API

См. плейграунд и типы в `Sidebar.tsx` / `SidebarRoot.tsx`.
