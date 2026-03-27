# AppShell

## About

Каркас приложения: **сетка** `nav` + **`main`** (прокручиваемая колонка). **`AppShell.Template`** — каноничный способ собрать оболочку: он задаёт **`data-layout-template="app"`** (зазор у колонки nav при открытом **Sidebar** с `sidebarSlot="page-nav"`), **всегда** оборачивает дочерние маршруты в **`AppShell.MainInset`** с едиными полями контентной колонки (**`--prime-sys-spacing-x6`** по вертикали и горизонтали — тот же формат, что в playground до выделения в кит), и при монтировании **внутри React Router** сбрасывает прокрутку **`main`** на смене пути.

**Не** добавляйте второй слой с теми же полями вокруг страницы: используйте **`PageContent.Section`** или **`PageContent.Root`** (без дублирующих внешних отступов у корня — их даёт **`MainInset`**).

## Composition

- **`AppShell.Root`** — корневая сетка; опционально **`fillViewport`** (типично для фиксированной высоты вьюпорта и прокрутки только в **`main`**).
- **`AppShell.Nav`** — слот навигации (**`data-layout-region="nav"`**).
- **`AppShell.Main`** — основная колонка (**`<main>`**, **`ScrollContainer`**, **`data-layout-region="main"`**).
- **`AppShell.MainInset`** — **единый** внутренний отступ контентной колонки; в **`Template`** уже вложен в **`Main`**. Используйте отдельно только в особых маршрутах без **`Template`** (например **`AppShell.Root`** + один **`Main`** + **`MainInset`** без боковой колонки — корень сетки растянет **`main`** на всю ширину).
- **`AppShell.Template`** — **`Root`** + **`Nav`** + **`Main`**, внутри **`Main`** — **`MainInset`** (дети шаблона) + сброс прокрутки при смене **`pathname`** (только если предок — React Router).

### Canonical example (приложение с сайдбаром)

```tsx
import { AppShell, Sidebar } from "prime-ui-kit";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <AppShell.Template fillViewport nav={<Sidebar.Root /* … */>{/* … */}</Sidebar.Root>}>
      <Outlet />
    </AppShell.Template>
  );
}
```

### Canonical example (одна колонка без `nav`, те же поля)

```tsx
import { AppShell } from "prime-ui-kit";

export function FullWidthMainRoute() {
  return (
    <AppShell.Root fillViewport>
      <AppShell.Main>
        <AppShell.MainInset>{/* страница */}</AppShell.MainInset>
      </AppShell.Main>
    </AppShell.Root>
  );
}
```

## Rules

- Обертка-приложения с **`AppShell.Template`** должна находиться **внутри** **`BrowserRouter`** / **`MemoryRouter`**, чтобы сброс прокрутки работал; в тестах без роутера сброс не подключается (это нормально).
- **`ref`**, переданный в **`AppShell.Template`**, по-прежнему вешается на элемент **`main`** (как на **`AppShell.Main`**).
- Не дублируйте классы/обёртки с теми же отступами, что у **`MainInset`**, и не задавайте произвольные «поля страницы» литералами — один источник правды в ките.

## API

### AppShell.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| fillViewport | `boolean` | `false` | No | Растягивает корень на высоту вьюпорта. |
| className | `string` | — | No | Класс на корневом `div`. |
| children | `React.ReactNode` | — | No | Обычно `Nav` + `Main`. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### AppShell.Template

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| fillViewport | `boolean` | — | No | Пробрасывается в `Root`. |
| className | `string` | — | No | Класс на `Root`. |
| nav | `React.ReactNode` | — | **Yes** | Левая колонка (напр. `Sidebar.Root`). |
| children | `React.ReactNode` | — | No | Контент внутри `MainInset` внутри `main`. |
| navProps | `Omit<AppShellNavProps, "children">` | — | No | Пропсы на слот навигации. |
| mainProps | `Omit<AppShellMainProps, "children">` | — | No | Пропсы на `main` (напр. `id`, `tabIndex`). |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | Остальное на `Root` (без `children` / без `ref` на типе — `ref` на `main`). |

### AppShell.MainInset

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Доп. класс; поля заданы модулем кита. |
| children | `React.ReactNode` | — | No | Содержимое колонки. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

`AppShell.Nav` и `AppShell.Main` — см. исходные типы в **`AppShell.tsx`**.

## Related

- [PageContent](../../components/page-content/COMPONENT.md) — секции и корень страницы внутри инсета.
- [Sidebar](../sidebar/COMPONENT.md) — навигация в слоте `nav`.
