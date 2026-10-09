# Layouts — app frame, page wrappers, auth

Every screen sits in one frame: `AppShell.Root` with Nav / `AppHeader` / Main (the content panel is the page,
the nav rail one layer above it) → `PageContent` (header + body). `AppShell.Main` carries the page gutters
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

Phone navigation for 2–6 main sections is a `BottomNav.Root` in `AppShell.Footer` (the last child of
`AppShell.Root`, or the Template `footer` prop) — never in Main, never `position: fixed`, never behind
your own media query. The shell hides the footer while the Sidebar rail is on screen and shows it
while the Sidebar is off-canvas, so the bar and the rail never appear together.

Next.js App Router: the package is marked `"use client"`, but a server component cannot dot into it
(`<Button.Root>`) or pass it callbacks. Put `AppLayout` and every screen in a file that starts with
`"use client"` and render them from `app/layout.tsx` and the pages; import `bundle.css` in the root
layout and put `data-theme` on `<html>` there.

A nested record page keeps its `Breadcrumb` at the top of `PageContent.Header`, above the title
([patterns/detail-page.tsx](patterns/detail-page.tsx)) — not in `AppHeader`. `AppHeader.Actions` holds at most notifications, the account and one primary action; page
actions stay in `PageContent.Actions`. With `offCanvas="always"` pass `show="always"` to the menu button.

### The page title in the header

A page that wants all its height for the work (a board, a chat, a dense register) may drop the
heading row in main and let the header carry the page — one or the other, never both:

- `AppHeader.Title as="h1"` is the page's only `<h1>` (the description stays outside its name);
  main then has no `PageContent.Header`.
- The page's tools — sections, the period, filters, the page's primary action — go into
  `AppHeader.Tools` as a `PageToolbar.Root`: the header's second row, full width, sticky with it. The
  toolbar lays itself out from that width (one row when wide, two on a phone), so the tools wrap
  under the title instead of squeezing it. `AppHeader.Actions` keeps notifications and the account.

```tsx
import { AppHeader, Button, Icon, PageToolbar, SegmentedControl } from "prime-ui-kit";

type DealsHeaderProps = { view: string; onViewChange: (view: string) => void };

export function DealsHeader({ view, onViewChange }: DealsHeaderProps) {
  return (
    <AppHeader.Root>
      <AppHeader.Start>
        <AppHeader.Title as="h1">Сделки</AppHeader.Title>
      </AppHeader.Start>
      <AppHeader.Tools>
        <PageToolbar.Root aria-label="Сделки">
          <PageToolbar.Sections>
            <SegmentedControl.Root
              fullWidth
              value={view}
              onValueChange={onViewChange}
              aria-label="Вид"
            >
              <SegmentedControl.Item value="board">Доска</SegmentedControl.Item>
              <SegmentedControl.Item value="list">Список</SegmentedControl.Item>
            </SegmentedControl.Root>
          </PageToolbar.Sections>
          <PageToolbar.Actions>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новая сделка
            </Button.Root>
          </PageToolbar.Actions>
        </PageToolbar.Root>
      </AppHeader.Tools>
    </AppHeader.Root>
  );
}
```

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
- A page as high as the panel (a log, a board, a chat): `AppShell.Root fillViewport` +
  `PageContent.Root fill`; the body passes its free height to a filling child — DataTable
  `scrollHeight="fill"`, Crossfade `fill`, `PageContent.Split`. Never compute heights from `100vh`.
- List + detail (mail, a messenger, a ticket queue): `PageContent.Split` with `PageContent.List` and
  `PageContent.Detail` in a filling page. Side by side from 48rem of the split's own width, one pane
  at a time below it with `PageContent.BackButton` first in the detail's header; `open` is «a record
  is chosen». Each pane gives its last child the free height: a Card with its own `ScrollContainer`
  (`anchor="end"` for a thread). Details that open over a table and close again are a Drawer instead.

## Which pattern to start from

The table of screens and their patterns lives in [composition.md](composition.md#patterns).

A short form (≤ 4 fields: rename, invite, confirm with a reason) belongs in a `Modal` with the same
form rules: `Modal.Body` holds the `<form id>`, `Modal.Footer` holds Cancel + submit with `form={id}`
(see [modal/examples/in-form.tsx](../src/components/modal/examples/in-form.tsx)).

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
            <Input.Root label="Рабочая почта" required>
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
  background: var(--prime-color-layer-current);
}
```
