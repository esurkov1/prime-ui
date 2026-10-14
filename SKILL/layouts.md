# Layouts — app frame, page wrappers, auth

Every screen sits in one frame: `AppShell.Root` with the Sidebar in `AppShell.Nav`, a header row and
`AppShell.Main` (the content panel is the page, the nav rail one layer above it). The frame is the
app's; the header row and the body are the page's — a screen renders its own `AppHeader.Root` (the
page title and the page's tools, [composition.md](composition.md#1-page-skeleton)) and its body in
`PageContent`.
`AppShell.Main` carries the page gutters and `PageContent` spaces the page — blocks 24, a titled
`PageContent.Section` 40, tiles in a `PageContent.Grid` 16 on both axes — so your code adds **no outer padding and no margins**. Your CSS only lays out the inside of a block (grids, rows) with `gap` on `--prime-space-*`.
Main's top air under the header is part of the frame — 24, then 32 from 1024px: the page's first block
starts there; never cancel it with a negative margin or a padding override.

The page recipes are whole, working screens — the `screen.tsx` example of their main component
([the list](composition.md#screens)): start from the closest one and keep its skeleton. The rules behind them are in [composition.md](composition.md).

## App frame (once per app)

The frame is the root layout and nothing else: the providers, `AppShell.Root`, the Sidebar in
`AppShell.Nav` and `AppShell.Main` around the page. It holds no header content and no menu state:

- **The header row belongs to the page.** An `AppHeader.Root` anywhere inside the shell — the page's
  own one, rendered at the top of its body — shows in the shell's header row; the latest one on
  screen wins, so every page brings its own. Its row is as high as the Sidebar brand row, so the brand
  and the title read as one line. Nothing app-wide goes into it — no global search, no notifications.
- **The phone menu comes with the frame.** Below 768px the Sidebar becomes an off-canvas panel
  (`offCanvas="auto"`) and the AppHeader leads with the menu button that opens it by itself — never a
  menu state or a menu button wired by hand. A trigger outside the rail (a BottomNav «Ещё», your own
  button) reads the shell's navigation with `useAppShellNav()` (`open`, `setOpen`, `navId`; see
  [the app frame screen](../src/layout/app-shell/examples/screen.tsx)).
- **Every Sidebar item is a link** (`href`, or `asChild` with the router's `NavLink`); `current`
  marks the current page (`aria-current`), a router link sets it itself. Icons and counts follow the
  [navigation structure](#navigation-structure-the-sidebars-content).

```tsx
import { AppShell, Icon, NotificationProvider, Sidebar } from "prime-ui-kit";
import type { ReactNode } from "react";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <AppShell.Root fillViewport>
        <AppShell.Nav>
          <Sidebar.Root>
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
              <Sidebar.Group>
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
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell.Root>
    </NotificationProvider>
  );
}
```

Every page renders its header and its body; the header shows in the frame's header row:

```tsx
import { AppHeader, PageContent } from "prime-ui-kit";

export function OrdersPage() {
  return (
    <>
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            Заказы
            <AppHeader.Description>128 в работе · 6 ждут оплаты</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
      </AppHeader.Root>
      <PageContent.Root as="section">
        <PageContent.Body>{/* the page's blocks */}</PageContent.Body>
      </PageContent.Root>
    </>
  );
}
```

A document page (settings, a long form, help) renders an `AppHeader.Root` without a title — only
its own buttons, and on a phone the menu button the header draws — and opens its body with
`PageContent.Header`.

With React Router the frame's `children` is `<Outlet />` and every item is `Sidebar.Item asChild`
around a `NavLink` ([the router example](../src/layout/sidebar/examples/router.tsx)). The same frame
as one component is `AppShell.Template` (`nav`, `footer`, the page as children); give it the
pathname as `scrollResetKey`, so a new page opens at the top.

Phone navigation for 2–6 main sections is a `BottomNav.Root` in `AppShell.Footer` (the last child of
`AppShell.Root`, or the Template `footer` prop) — never in Main, never `position: fixed`, never behind
your own media query. The shell hides the footer while the Sidebar rail is on screen and shows it
while the Sidebar is off-canvas, so the bar and the rail never appear together.

Next.js App Router: the package is marked `"use client"`, but a server component cannot dot into it
(`<Button.Root>`) or pass it callbacks. Put the frame and every screen in a file that starts with
`"use client"` and render them from `app/layout.tsx` and the pages; import `bundle.css` in the root
layout and put `data-theme` on `<html>` there.

A nested record page puts the path up before its title in the header — `Breadcrumb` (the list it
belongs to), `AppHeader.Separator`, `AppHeader.Title` with the record's name and its status as
the description ([the detail page](../src/components/description-list/examples/screen.tsx)).

### The page's tools in the header

The page's tools — its own search and filters, sections, the period or view, the primary action —
go into `AppHeader.Tools` as a `PageToolbar.Root`: the header's second row, full width, sticky with
it. The toolbar lays itself out from that width ([the page panel](responsive.md#page-panel--pagetoolbar)),
so the tools wrap under the title instead of squeezing it. `AppHeader.Actions` keeps the page's
other buttons (export, a more menu) in the title row.

```tsx
import { AppHeader, Button, Icon, PageToolbar, SegmentedControl } from "prime-ui-kit";

type DealsHeaderProps = { view: string; onViewChange: (view: string) => void };

export function DealsHeader({ view, onViewChange }: DealsHeaderProps) {
  return (
    <AppHeader.Root>
      <AppHeader.Start>
        <AppHeader.Title>
          Сделки
          <AppHeader.Description>7 сделок в работе · 6 461 750 ₽</AppHeader.Description>
        </AppHeader.Title>
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

## Navigation structure (the sidebar's content)

The sidebar is the product's map: people scan it, remember where things are and come back. Build it
from what people do, not from how the backend is split. The criteria — how many items, what folds,
when a count gets a colour — are in
[Sidebar COMPONENT.md → Building the navigation](../src/layout/sidebar/COMPONENT.md#building-the-navigation).

| Level | Kit part |
|---|---|
| Everyday places | `Sidebar.Group` without `label` at the top, never folded |
| Category of work | `Sidebar.Group label collapsible` |
| Views of one section | `Sidebar.Sub`, one level only |
| Meta | `Sidebar.Footer`: help, settings, then `Sidebar.Account` with its menu last |

### Sidebar icons

An icon on every top-level item and every sub-list parent, each a distinct shape (the compact rail
shows only icons); none on the children of a sub-list.

## Page wrapper

- App pages (dashboard, list, detail, a board): `PageContent.Root as="section"` — the full width of
  the panel; the page's title and tools are in its `AppHeader`, its blocks go into
  `PageContent.Body` ([the page skeleton](composition.md#1-page-skeleton)).
- Document pages — settings and long forms: `PageContent.Root maxWidth="wide"` with `PageContent.Header`
  (the page's h1) and a `PageContent.Section layout="aside"`
  (heading column + panel) per section ([the settings page](../src/components/page-content/examples/screen.tsx)), or `maxWidth="readable"` for a single
  narrow column of fields.
- Long reading text (terms, help): `PageContent.Root maxWidth="readable"` with `PageContent.Header`.
- A page as high as the panel (a log, a board, a chat): `AppShell.Root fillViewport` +
  `PageContent.Root fill`; the body passes its free height to a filling child — DataTable
  `scrollHeight="fill"`, Crossfade `fill`, `PageContent.Split`. Never compute heights from `100vh`.
- List + detail (mail, a messenger, a ticket queue): `PageContent.Split` with `PageContent.Panel kind="list"` and
  `PageContent.Panel kind="detail"` in a filling page. Side by side from 48rem of the split's own width, one pane
  at a time below it with `PageContent.BackButton` first in the detail's header; `open` is «a record
  is chosen». Each pane gives its last child the free height: a Card with its own `ScrollContainer`
  (`anchor="end"` for a thread). The records in the list pane are a `List` (`current` on the open
  one), the conversations of a messenger a `ChatList`. Details that open over a table and close
  again are a Drawer instead.

## Which screen to start from

The table of screens lives in [composition.md](composition.md#screens).

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
