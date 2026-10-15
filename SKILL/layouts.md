# Layouts — app frame, page wrappers, auth

The app is navigation and the page: `AppShell.Root` with the Sidebar in `AppShell.Nav` and
`AppShell.Main` (the content panel is the page, the nav rail one layer above it). The frame is the
app's; everything inside Main is the page's — a screen renders one `Page.Root` with its own top
(`Page.TopBar`: the page title and the page's tools, [composition.md](composition.md#1-page-skeleton))
and its body in `Page.Body`.
`AppShell.Main` hands the page its gutters and its edge air and `Page` spaces it — blocks 24, a titled
`Page.Section` 40, tiles in a `Page.Grid` 16 on both axes — so your code adds **no outer padding and no margins**. Your CSS only lays out the inside of a block (grids, rows) with `gap` on `--prime-space-*`.
The edge air is part of the frame. On top: 24, then 32 from 1024px, where a page without a bar
starts; under a `Page.TopBar` the body starts 24 below the bar's controls. At the bottom: a long
page keeps a 64 scroll tail, a `Page.Root fill` page only the side gutter, beside the Sidebar rail
as well. Never cancel it with a negative margin or a padding override.

The page recipes are whole, working screens — the `screen.tsx` example of their main component
([the list](composition.md#screens)): start from the closest one and keep its skeleton. The rules behind them are in [composition.md](composition.md).

## App frame (once per app)

The frame is the root layout and nothing else: the providers, `AppShell.Root`, the Sidebar in
`AppShell.Nav` and `AppShell.Main` around the page. It holds no header and no menu state:

- **Everything at the top belongs to the page.** There is no app-wide header and no global search:
  every page renders its own `Page.TopBar` with only what it needs. Its title row is as high as the
  Sidebar brand row, so the brand and the title read as one line.
- **The phone menu comes with the frame.** Below 768px the Sidebar becomes an off-canvas panel
  (`offCanvas="auto"`) and `Page.TopBar` leads with the menu button that opens it by itself — never a
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

Every page renders its top and its body in one `Page.Root`:

```tsx
import { Page } from "prime-ui-kit";

export function OrdersPage() {
  return (
    <Page.Root>
      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Заказы</Page.Title>
          <Page.Description>128 в работе · 6 ждут оплаты</Page.Description>
        </Page.Heading>
      </Page.TopBar>
      <Page.Body>{/* the page's blocks */}</Page.Body>
    </Page.Root>
  );
}
```

What stands in the bar — the path ending in the title, the tools, every button, the active filters —
is [the top bar](composition.md#the-top-bar); where the title stands on a document page or an
overview is [the page skeleton](composition.md#1-page-skeleton).

With React Router the frame's `children` is `<Outlet />` and every item is `Sidebar.Item asChild`
around a `NavLink` ([the router example](../src/layout/sidebar/examples/router.tsx)). The same frame
as one component is `AppShell.Template` (`nav`, `footer`, `mainProps`, the page as children); give it the
pathname as `scrollResetKey`, so a new page opens at the top.

Phone navigation for 2–6 main sections is a `BottomNav.Root` in `AppShell.Footer` (the last child of
`AppShell.Root`, or the Template `footer` prop) — never in Main, never `position: fixed`, never behind
your own media query. The shell hides the footer while the Sidebar rail is on screen and shows it
while the Sidebar is off-canvas, so the bar and the rail never appear together.

Next.js App Router: the package is marked `"use client"`, but a server component cannot dot into it
(`<Button.Root>`) or pass it callbacks. Put the frame and every screen in a file that starts with
`"use client"` and render them from `app/layout.tsx` and the pages; import `bundle.css` in the root
layout and put `data-theme` on `<html>` there.

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

- App pages (dashboard, list, detail, a board): `Page.Root` — the full width of the panel; the
  page's title and tools are in its `Page.TopBar`, its blocks go into `Page.Body`
  ([the page skeleton](composition.md#1-page-skeleton)).
- Document pages — settings and long forms: `Page.Root maxWidth="wide"` with `Page.Header` in the
  flow (the page's h1) and a `Card.Root` with its own `Card.Header` per section
  ([the settings page](../src/layout/page/examples/screen.tsx)), or `maxWidth="readable"` for a single
  narrow column of fields.
- Long reading text (terms, help): `Page.Root maxWidth="readable"` with `Page.Header` in the flow.
- A page as high as the panel (a log, a board, a chat): `AppShell.Root fillViewport` +
  `Page.Root fill`; the body passes its free height to a filling child — DataTable
  `scrollHeight="fill"`, Crossfade `fill`, `Page.Split`. Never compute heights from `100vh`.
- List + detail (mail, a messenger, a ticket queue): `Page.Split` with `Page.List` and
  `Page.Detail` in a filling page. Side by side from 48rem of the split's own width, one pane
  at a time below it with `Page.BackButton` first in the detail's header; `open` is «a record
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
