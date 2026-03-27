# PageContent

## About

Семантические примитивы **контентной колонки**: **`PageContent.Section`** (регион страницы **`<section>`** без собственных внешних полей), **`PageContent.Root`** (обёртка страницы с опциональным **`maxWidth`**, **без** дублирующих полей к краю колонки), **`PageContent.Title`** → **`<h1>`**, **`PageContent.Description`** с **`measure`**, **`PageContent.Body`**. Типографика — токены кита.

- **В приложении с `AppShell.Template`** внешние поля колонки задаёт **`AppShell.MainInset`** (встроен в шаблон). Тогда для маршрута чаще берут **`PageContent.Section`** + **`Header`** / **`Body`**, либо **`PageContent.Root`** только ради **`maxWidth`**, без ожидания «второго» слоя полей.
- **`PageContent.Root`** — когда нужен **`maxWidth`** (`full` | `readable` | `wide`; по умолчанию **`full`**) и структура шапки/тела; краевые поля **не** входят в корень — их даёт **`MainInset`**.
- **`Description`** с **`measure="full"`**, если ширину уже ограничивает родитель; по умолчанию **`measure="readable"`** — узкая мера лида ~65ch.

## Composition

- **`PageContent.Root`** — внешняя обёртка: **`maxWidth`** через `data-max-width` (кроме `full`), **padding по краям колонки — 0** (поля у **`AppShell.MainInset`**).
- **`PageContent.Section`** — **`<section>`**; сочетайте с **`aria-labelledby`** на заголовок **`PageContent.Title`**.
- **`PageContent.Header`** — заголовок + описание с отступами.
- **`PageContent.Title`** — **`<h1>`** (один на вью).
- **`PageContent.Description`** — лид **`<p>`**; **`measure`** — ширина текста.
- **`PageContent.Body`** — блоки под шапкой.

### Canonical example (маршрут внутри `AppShell.Template`)

```tsx
import { PageContent } from "prime-ui-kit";

export function SettingsPage() {
  return (
    <PageContent.Section aria-labelledby="page-heading">
      <PageContent.Header>
        <PageContent.Title id="page-heading">Settings</PageContent.Title>
        <PageContent.Description measure="full">
          Manage your workspace profile and notifications.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>{/* блоки страницы */}</PageContent.Body>
    </PageContent.Section>
  );
}
```

### Canonical example (узкая колонка + `maxWidth`)

```tsx
import { PageContent } from "prime-ui-kit";

export function AccountPage() {
  return (
    <PageContent.Root maxWidth="readable">
      <PageContent.Header>
        <PageContent.Title>Account</PageContent.Title>
        <PageContent.Description>Billing and security.</PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>{/* … */}</PageContent.Body>
    </PageContent.Root>
  );
}
```

### Playground

Живые примеры и таблицы API: **`playground/sections/PageContentSection.tsx`**.

## Rules

- На вью — **один** `h1` через **`PageContent.Title`**.
- **Не** вкладывайте **`PageContent.Root`** в область, где уже есть тот же слой полей, что у **`AppShell.MainInset`** — у корня **нет** своих краевых полей; при необходимости используйте **`Section`**.
- **`Description`**: по умолчанию узкая мера; **`measure="full"`**, когда колонка уже ограничена снаружи.

## API

### PageContent.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| maxWidth | `full` \| `readable` \| `wide` | `full` | No | Ограничение ширины контентной колонки; `data-max-width`, кроме `full`. |
| className | `string` | — | No | Класс на корневой обёртке. |
| children | `React.ReactNode` | — | No | Шапка, тело, секции. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### PageContent.Section

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на **`<section>`**. |
| children | `React.ReactNode` | — | No | Обычно **`Header`** + **`Body`**. |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### PageContent.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на блоке шапки. |
| children | `React.ReactNode` | — | No | **`Title`**, **`Description`**. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Атрибуты `div`. |

### PageContent.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на **`<h1>`**. |
| children | `React.ReactNode` | — | No | Заголовок страницы. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### PageContent.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| measure | `readable` \| `full` | `readable` | No | `readable` — ~65ch; `full` — ширина родителя. |
| className | `string` | — | No | Класс на **`<p>`**. |
| children | `React.ReactNode` | — | No | Вводный текст. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | В т.ч. `ref` (`forwardRef`). |

### PageContent.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Класс на обёртке контента под шапкой. |
| children | `React.ReactNode` | — | No | Основное содержимое. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Атрибуты `div`. |

## Related

- [Typography](../typography/COMPONENT.md) — роли текста на странице.
- [AppShell](../../layout/app-shell/COMPONENT.md) — сетка и **`MainInset`**.
