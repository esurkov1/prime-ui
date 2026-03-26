# Sidebar

**Проектирование по умолчанию:** для оси размера используйте **`size="m"`**, если отдельно не задано другое.

## About

`Sidebar` — вертикальная навигационная колонка: `Sidebar.Root` задаёт контекст и layout, `Sidebar.NavPanel` — сама панель (header/content/footer), а `Menu`/`Group`/`NavCategory` формируют структуру пунктов.

## Composition

- **`Sidebar.Root`** — обязательная обёртка (`aside`) и источник состояния `expanded | compact | hidden`.
- **`Sidebar.NavPanel`** — контейнер панели (`nav`) с layout-частями.
- Типичный порядок: **`Header`** → **`ToggleButton`** → **`Content`** → **`Footer`**.
- В **`compact`** (не mobile) для пунктов меню включены **встроенные тултипы**: оборачивают **`MenuButton`**, **`MenuRouterLink`** и **`MenuLink`** (через общий **`MenuButton`**). Текст: явный **`tooltip`** (где есть в типах), иначе **`aria-label`**, иначе текст из **`children`**. Провайдер: **`Tooltip`** справа (`side="right"`), **`delayDuration={0}`**. На mobile тултипы не показываются.

## Visual Contract

- `NavPanel` без скругления и без «рамки» вокруг всей панели (`border: 0` на самой панели). Фон: в **светлой** теме — **`color-mix(in srgb, surface-default 88%, border-subtle 12%)`**; в **тёмной** — **`surface-default`**. Грань к основному контенту — **`border-subtle`** на стороне, смотрящей в main (`border-inline-end` / `border-inline-start` в зависимости от **`side`**).
- Трек меню визуально отделён от полотна страницы; `Dropdown`/`Popover` по-прежнему опираются на **`surface-elevated`**, чтобы слои не сливались.

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

Полные примеры и таблицы: `playground/sections/SidebarSection.tsx` и `playground/sections/sidebarApiRows.ts`.

### `Sidebar.MenuButton` (дополнительно к нативным атрибутам `button`)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | Визуально выделенный пункт. |
| asChild | `boolean` | `false` | No | Рендер через `Slot` вместо `button`. |
| tooltip | `React.ReactNode` | — | No | Текст тултипа в **`compact`**; если не задан — из **`aria-label`** или из текста **`children`**. Пустая строка отключает тултип. |

### `Sidebar.MenuRouterLink` (наследует пропсы `NavLink`)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| tooltip | `React.ReactNode` | — | No | То же, что у **`MenuButton`**: явный текст или fallback из **`aria-label`** / **`children`**. |
