# Sidebar

**Проектирование по умолчанию:** для оси размера используйте **`size="m"`**, если отдельно не задано другое.

## About

`Sidebar` — вертикальная навигационная колонка: `Sidebar.Root` задаёт контекст и layout, `Sidebar.NavPanel` — сама панель (header/content/footer), а `Menu`/`Group`/`NavCategory` формируют структуру пунктов.

## Composition

- **`Sidebar.Root`** — обязательная обёртка (`aside`) и источник состояния `expanded | compact | hidden`.
- **`Sidebar.NavPanel`** — контейнер панели (`nav`) с layout-частями.
- Типичный порядок: **`Header`** → **`ToggleButton`** → **`Content`** → **`Footer`**.
- В `compact` рекомендуемый UX: показывать `Tooltip` для `MenuButton`/`MenuRouterLink` (обычно `side="right"`, `delay=0`).

## Visual Contract

- `NavPanel` без обводки (`border: 0`), фон — близкий к `surface-default` на семантических токенах.
- Цвет панели намеренно отличается от `Dropdown`/`Popover` (они используют `surface-elevated`), чтобы слои не сливались.

## State Model

- Актуальный API состояния: **`state`**, **`defaultState`**, **`onStateChange`**.
- Legacy API (`open`, `defaultOpen`, `onOpenChange`, `mode`, `defaultMode`, `onModeChange`) оставлен для совместимости, но для нового кода используйте `state`-модель.
- При `responsive={true}` и узком viewport панель уходит в `hidden`, появляется mobile overlay + floating open button.

## Data API Pattern (для продуктового меню)

Для динамического меню (режимы продукта, роли, бренды) используйте слой данных над `Sidebar`:

- у режима храните **`navTag`** (например `crm | traffic | autorpark`);
- у категорий/пунктов храните **`tags`** и опционально **`switchByTag`**;
- на рендере фильтруйте по `tags` и накладывайте `switchByTag[activeTag]`.

Это позволяет переключать не только пункты, но и сами категории без изменения JSX-структуры `Sidebar`.

## Rules

- `ToggleButton` и floating toggle связываются с `NavPanel` через `aria-controls`.
- `useSidebarContext` используйте только внутри `Sidebar.Root`.
- `sidebarSlot="page-nav"` — режим встраивания в макет страницы рядом с main-контентом.

## API

Актуальные примеры и таблицы пропсов: `playground/sections/SidebarSection.tsx` и `playground/sections/sidebarApiRows.ts`.
