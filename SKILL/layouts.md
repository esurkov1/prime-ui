# Screen recipes

Every screen sits in one frame: `AppShell.Root` with Nav / `AppHeader` / Main (nav rail on the canvas +
content panel on the surface) → `PageContent` (header + body). `AppShell.Main` carries the page gutters
and `PageContent.Body` spaces its blocks 40 apart, so your code adds **no outer padding and no
margins**. Your CSS only lays out the inside of a block (grids, rows) with `gap` on `--prime-space-*`.

The page recipes are whole, working screens in [patterns/](patterns/) — start from the closest one
(table below) and keep its skeleton. The rules behind them are in [composition.md](composition.md).

## App frame (once per app)

Every `Sidebar.Item` gets a `Sidebar.ItemIcon` (in compact mode only icons remain) and is a link:
`href`, or `asChild` with the router's `NavLink`; `current` marks the current page (`aria-current`), a
router link sets it itself. Counters go in `Sidebar.ItemCount`. Below 768px the Sidebar becomes an
off-canvas panel — the app must render a menu button that opens it, otherwise navigation is unreachable
on phones. `AppHeader` is the top bar of the panel on every width: `AppHeader.MenuButton` shows itself
below 768px (the Sidebar's own breakpoint), the title says where you are, `AppHeader.Search` opens the
CommandMenu and folds into an icon on a narrow header. Its row is as high as the Sidebar brand row, so
the brand and the title read as one line.

```tsx
import { AppHeader, AppShell, Icon, NotificationProvider, Sidebar } from "prime-ui-kit";
import { type ReactNode, useState } from "react";

type AppLayoutProps = { title: string; onSearch: () => void; children: ReactNode };

export function AppLayout({ title, onSearch, children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <NotificationProvider>
      <AppShell.Root fillViewport>
        <AppShell.Nav>
          <Sidebar.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Sidebar.Header>
              <Sidebar.Brand href="/" description="Интернет-магазин">
                <Sidebar.BrandLogo>
                  <Icon name="object.cart" />
                </Sidebar.BrandLogo>
                Магазин
              </Sidebar.Brand>
              <Sidebar.Toggle variant="header" />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group label="Продажи">
                <Sidebar.Item href="/" current>
                  <Sidebar.ItemIcon>
                    <Icon name="nav.dashboard" />
                  </Sidebar.ItemIcon>
                  Обзор
                </Sidebar.Item>
                <Sidebar.Item href="/orders">
                  <Sidebar.ItemIcon>
                    <Icon name="object.cart" />
                  </Sidebar.ItemIcon>
                  Заказы
                  <Sidebar.ItemCount>12</Sidebar.ItemCount>
                </Sidebar.Item>
                <Sidebar.Item href="/clients">
                  <Sidebar.ItemIcon>
                    <Icon name="object.users" />
                  </Sidebar.ItemIcon>
                  Клиенты
                </Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Item href="/settings">
                <Sidebar.ItemIcon>
                  <Icon name="action.settings" />
                </Sidebar.ItemIcon>
                Настройки
              </Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.MenuButton aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} />
            <AppHeader.Title>{title}</AppHeader.Title>
          </AppHeader.Start>
          {/* Opens the app's CommandMenu; bind ⌘K to the same handler. */}
          <AppHeader.Search onClick={onSearch}>Поиск заказов и клиентов</AppHeader.Search>
        </AppHeader.Root>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell.Root>
    </NotificationProvider>
  );
}
```

A nested record page puts a back `Button` and a `Breadcrumb` into `AppHeader.Start` instead of the
title. `AppHeader.Actions` holds at most notifications, the account and one primary action; page
actions stay in `PageContent.Actions`. With `offCanvas="always"` pass `show="always"` to the menu button.

With React Router put `<Outlet />` as the child and pass `NavLink` through `Sidebar.Item asChild`
(see `src/layout/sidebar/examples/router.tsx`).

## Navigation structure (the sidebar's content)

The sidebar is the product's map: people scan it, remember where things are and come back. Build it
from what people do, not from how the backend is split. The full guide with the reasoning is in
[Sidebar COMPONENT.md → Building the navigation](../src/layout/sidebar/COMPONENT.md#building-the-navigation).

| Level | Kit part | Rule |
|---|---|---|
| Everyday places | `Sidebar.Group` without `label` at the top | 2–4 items (Обзор, Входящие); never folded |
| Category of work | `Sidebar.Group label collapsible` | 3–7 items by frequency; label is one short word with a distinct start (the rail shows its first letters); fold only long or rarely used groups |
| Views of one section | `Sidebar.Sub` | 2–6 children; the parent only discloses (overview page = first child); one level only |
| Meta | `Sidebar.Footer` | help, settings, then `Sidebar.Account` with its menu last |

- Icons on every top-level item and sub-list parent, distinct shapes; none on sub-list children.
- `Sidebar.ItemCount` plain for information (12 new); `color` only when it asks for action (3
  unanswered, 2 overdue) — it becomes a dot on the rail and on every folded parent, so keep it rare:
  red for blocked or overdue, blue for new or unread.
- `persistKey` on `Sidebar.Root` keeps the rail mode and folded groups across reloads; give groups an
  `id` when labels are translated.

## Page wrapper

- App pages with actions (dashboard, list, detail): `PageContent.Section` — the full width of the panel.
- Settings and long forms: `PageContent.Root maxWidth="wide"` with a heading column + panel per section
  ([patterns/settings-page.tsx](patterns/settings-page.tsx)), or `maxWidth="readable"` for a single
  narrow column of fields.
- Long reading text (terms, help): `PageContent.Root maxWidth="readable"`.

## Which pattern to start from

| Screen | Pattern | Skeleton and rhythm |
|---|---|---|
| List of orders / invoices / clients | [list-page.tsx](patterns/list-page.tsx) | header (1 primary) → DataTable with SmartFilter in `toolbar`, pages, `empty` |
| One record (order, invoice, deal) | [detail-page.tsx](patterns/detail-page.tsx) | Breadcrumb + title + status → main column (sections) + side column (Cards: facts, Timeline); 24 between columns |
| Settings | [settings-page.tsx](patterns/settings-page.tsx) | sections 40 apart: heading column + panel Card; form saves by its own button, Switches apply at once, danger zone last |
| Create / edit without leaving the page | [form-drawer.tsx](patterns/form-drawer.tsx) | Drawer: groups 32 apart, fields 20, footer outside the form with `form={id}` |
| Overview / dashboard | [dashboard.tsx](patterns/dashboard.tsx) | period switch in actions → KPI row (16) → panels grid (16) → short table section |
| Loading, empty, error | [screen-states.tsx](patterns/screen-states.tsx) | Banner for the page, `error` / `loading` in place, EmptyPage for a first run |

A short form (≤ 4 fields: rename, invite, confirm with a reason) belongs in a `Modal` with the same
form rules: `Modal.Body` holds the `<form id>`, `Modal.Footer` holds Cancel + submit with `form={id}`
(see `src/components/modal/examples/in-form.tsx`).

## Multi-step form

`Stepper.Root` (controlled `value`) above one Card that shows the current step's fields; actions
«Назад» (`variant="soft" tone="neutral"`) and «Далее» / «Готово» at the bottom of the card
(`Card.Footer`). Mark a failed step with `Stepper.Item status="danger"`. See
`src/components/stepper/examples/controlled.tsx` and `states.tsx`.

## Auth (sign in, code)

No AppShell. `LoginForm` is the whole card: logo, title, provider buttons, the form and the footer link;
center it on the canvas. Code step: `DigitInput` inside `LoginForm.Form`. Scenarios for sign-up, password
reset and code confirmation are in `src/components/login-form/examples/`.

```tsx
import { Button, Icon, Input, LinkButton, LoginForm } from "prime-ui-kit";
import styles from "./SignIn.module.css";

export function SignIn() {
  return (
    <main className={styles.page}>
      <LoginForm.Root align="center">
        <LoginForm.Header>
          <LoginForm.Logo>
            <Icon name="object.package" />
          </LoginForm.Logo>
          <LoginForm.Title>Вход</LoginForm.Title>
          <LoginForm.Description>Отправим код на рабочую почту</LoginForm.Description>
        </LoginForm.Header>
        <LoginForm.Body>
          <LoginForm.Form onSubmit={(event) => event.preventDefault()}>
            <Input.Root label="Email" required>
              <Input.Wrapper>
                <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth>
              Получить код
            </Button.Root>
          </LoginForm.Form>
          <LoginForm.Footer>
            Нет аккаунта? <LinkButton href="/signup">Зарегистрироваться</LinkButton>
          </LoginForm.Footer>
        </LoginForm.Body>
      </LoginForm.Root>
    </main>
  );
}
```

```css
/* SignIn.module.css */
.page {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--prime-space-4);
  background: var(--prime-color-bg-canvas);
}
```
