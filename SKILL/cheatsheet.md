# Cheatsheet — the decisions agents get wrong

One line per decision: **do** this, **not** that. Every name here exists in the kit; the full
reference is each component's `COMPONENT.md` ([components.md](components.md)), the reasons are in
[composition.md](composition.md) and [api-contract.md](api-contract.md).

## Setup

- Import the styles once at the app root: `import "prime-ui-kit/bundle.css"` (tokens, themes, components), plus the opt-in `prime-ui-kit/fonts.css` and `prime-ui-kit/reset.css` when the app has no fonts or reset of its own — not per page, not a copied token file.
- Switch the theme with `applyTheme("light" | "dark")` — not a class or `style` on `<html>`.
- Put `NotificationProvider` and `AppShell.Root` in the app root once — not inside a page component.
- Import everything from `"prime-ui-kit"` — not from `prime-ui-kit/src/...` or `lucide-react` for a glyph the kit has.

## Size

- Omit `size` for the default `m` — never write `size="m"`.
- Set `size` on the root (`Input.Root size="s"`, `Select.Root size="s"`) — not on `Input.Field` or `Select.Trigger`.
- One tier for a whole region: `<ControlSizeProvider value="s">` around a dense toolbar — not `size="s"` on one control to make it fit.
- Inside a host (Popover, Banner, LoginForm, the DataTable `toolbar`) leave `Button.Root` / `Input.Root` without `size` — the host passes its tier.
- A control in a table cell or a card header row is one tier down: `<Button.Root size="s" variant="ghost" tone="neutral">`.

## Structure

- Components with parts render through `.Root` + parts: `<Button.Root>`, `<Modal.Root>` — `<Button>` and `<Modal>` are not components.
- Leaves are single exports with no `.Root`: `<Typography>`, `<Divider />`, `<Spinner />`, `<Kbd>`, `<LinkButton>`, `<DataTable>`, `<Pagination>`, `<ProgressBar>` — not `<Typography.Root>`.
- Data-driven components take data as props: `DataTable columns rows`, `SmartFilter.Root fields`, `TagSelect options`, `ProgressBar segments` — not mapped child parts.

## Fields

- Frame a field with props on the root: `<Input.Root label="Email" hint="…" error="…" required>` — not a separate `Label` / `Hint` next to it.
- Mark the minority: `required` when most fields are optional, `optional` when most are required — not both everywhere.
- Placeholder is an example value (`name@company.ru`) — never the label.
- Checkbox, Switch, Radio: the text is the part `<Checkbox.Label>`, `hint` / `error` sit on `Checkbox.Root` — not a `label` prop.
- Show `error` after blur or on submit; `<form noValidate onSubmit>` + `<Button.Root type="submit" loading>` — not validation on every keystroke.

## State

- Uncontrolled by default: `defaultValue`, `defaultChecked`, `defaultOpen`.
- Controlled triads, same names everywhere: `value` / `onValueChange`, `checked` / `onCheckedChange`, `open` / `onOpenChange` — not `onChange(event)` (except the native `Input.Field` / Textarea `onChange`), `isOpen`, `onToggle`.
- Selection count is `multiple` (`Select.Root multiple`) — not `type="multiple"`.

## Text: labels vs children

- Visible text goes in children or content props: `<Button.Root>Сохранить</Button.Root>`, `<Modal.Title>`.
- System strings (aria names, counters, default texts) go through `labels`: `<Modal.Root labels={{ close: "Закрыть окно" }}>` — not a `closeLabel` prop. Defaults are Russian; override only what differs.

## Icons

- Take a glyph from the kit: `<Icon name="action.add" />` (or `IconAdd`) — not `import { Plus } from "lucide-react"`. Names: [api-contract.md](api-contract.md#icons).
- Put icons into the part: `<Button.Icon>`, `<Input.Icon side="start">`, `<Sidebar.ItemIcon>`, `<Dropdown.ItemIcon>`, `<EmptyPage.Icon>` — not an `icon` prop (only data arrays such as `notify()` take `icon`).
- Icon-only button: `<Button.Root variant="ghost" tone="neutral" aria-label="Удалить">` with a `Tooltip` — not an unnamed icon.
- `lucide-react` only for a domain glyph the kit lacks — not for `Plus`, `Search`, `Bell`, `Settings`…

## Buttons and actions

- One primary per area (page header, card, dialog): the default `solid` accent, last in the row. Others `variant="soft" tone="neutral"`; dismiss `variant="ghost" tone="neutral"` (pages), `variant="outline" tone="neutral"` (Modal / Drawer footer).
- Destructive is `tone="danger"` — never `tone="error"`. Standalone trigger `variant="outline"`, menu item `<Dropdown.Item tone="danger">` last, confirm `solid` in a `<Modal.Root closeOnOutsideClick={false}>`.
- Going somewhere is a link: `<LinkButton href>` or `<Button.Root asChild><a href>…</a></Button.Root>` — not `onClick={() => location.assign(url)}`.
- Busy action: `<Button.Root loading>` — not a hand-made spinner or «Загрузка…» text.
- An action on a coloured host (a solid Banner, an accent strip): `<Button.Root variant="ghost" tone="inherit">` — it takes the host's text colour; never recolour a Button with a CSS override.

## Cards and surfaces

- `Card.Root` only for a bounded block with its own title: a KPI tile (`variant="stat-trend"`), a settings panel (`variant="panel"`), side facts — not around a whole section, a form field or a page.
- Never a card in a card, and never a `DataTable` inside a Card — the table is already a filled block.
- Section without a card: `<Typography as="h2" variant="title-m">` + the content.
- Depth from fill, not lines: no borders around blocks; `<Divider />` only inside a block.

## Tables

- A list page is `<DataTable columns rows getRowKey toolbar={…}>` with `<SmartFilter.Root fields value onValueChange>` + `<SmartFilter.Toolbar />` + `<SmartFilter.Chips />` in `toolbar`; filter rows with `matchesSmartFilter` — not a search Input and a row of Selects above the table.
- Paging is built in: `paging="pages"` (default) with `pageSize`, `paging="infinite"` for feeds, `paging="none"` for short lists — not a separate `<Pagination>` under a DataTable.
- Amounts, counts and dates are `numeric` columns; statuses are `Badge.Root color` from one status → color map.

## Overlays

- Blocking decision or ≤ 4 fields → `Modal` (`<Modal.Content size="s">` for a confirm); long form, filters, details → `Drawer`; small panel at a control → `Popover`; list of actions → `Dropdown`; a field value → `Select`; a name for an icon button → `Tooltip`; ⌘K → `CommandMenu`.
- Never a hand-made `div` backdrop, dialog, menu or tooltip.
- While a request runs: `closeOnEscape={false}`, `<Modal.Header showClose={false}>`, Cancel disabled.

## Empty, loading, error

- Table states in place: `loading` (+ `loadingRows`), `empty`, `error` on `DataTable` — the head and toolbar stay.
- First run of a page or region: `EmptyPage.Root` + `EmptyPage.Icon` + `EmptyPage.Title` + `EmptyPage.Description` + `EmptyPage.Actions` with one action — not «Здесь пока ничего нет».
- Region loading: `aria-busy` on the region + `<Spinner aria-hidden="true" />` in place — not a skeleton or shimmer you draw.
- A region that switches between loading, data, empty and error: its content in `<Crossfade state={status}>` — the states fade into each other and the height glides; not an instant swap that makes the page jump. DataTable does this itself.
- Page-level persistent problem: `<Banner.Root tone="danger">` first in `PageContent.Body`; the result of an action: `useNotifications().notify({ tone, title })`.

## Sidebar

- Brand header: `Sidebar.Header` > `Sidebar.Brand href description` (with `Sidebar.BrandLogo`) + `<Sidebar.Toggle variant="header" />` — not a Toggle in the footer when the rail has a brand.
- Off-canvas: `offCanvas="auto"` (default, below 768px) with `open` / `onOpenChange` and a menu button that opens it; `offCanvas="always"` for navigation behind a menu at any width; `offCanvas="never"` for a rail that always stays.
- Every item has `Sidebar.ItemIcon` (compact mode shows only icons) and is a link: `href` or `asChild` with the router `NavLink`; `current` marks the page.
- The signed-in user: `Sidebar.Account` inside `Dropdown.Trigger` at the end of `Sidebar.Footer`.

## Spacing and values

- Gaps are `gap` on the parent with `--prime-space-N` (N × 4px): 8 in a row of buttons, 20 field → field, 32 group → group; `PageContent.Body` already spaces blocks 40 — not margins, not outer padding.
- Tokens only: `var(--prime-space-4)`, `var(--prime-color-text-secondary)`, `var(--prime-radius-m)` — never raw `px` / `rem` / hex, never `--prime-ref-*`, never inline `style`.
- Text through `Typography` roles (`title-m`, `title-s`, `body-m`, `caption`) and `tone="secondary" | "muted"` — not `font-size` or `color` in CSS.

## Anti-slop top 10

1. One component per look: two statuses are two `Badge.Root`s, never a Badge and a styled `span`.
2. No card around everything, no card in a card, no card around a table.
3. One primary button per area; the rest soft / ghost / outline with `tone="neutral"`.
4. One size per row; mixed `s` and `m` in a toolbar reads as a bug.
5. Labels above fields; placeholder is an example.
6. Three levels of air (inside an item, between items, between blocks) — not one gap for the page.
7. No emoji, no icon next to every label, no gradients, glows or colored section backgrounds.
8. No subtitle that repeats the title, no filler copy; an empty state says what to do and gives the action.
9. No hand-made overlays, spinners, dividers, badges or filter bars — the kit has each.
10. No overrides of kit internals (`.form :global(button)`); a part's `className` is for placement only.

## Two snippets to copy

App root, once:

```tsx
import "prime-ui-kit/bundle.css";
import "prime-ui-kit/fonts.css";
import "prime-ui-kit/reset.css";
import { AppShell, applyTheme, Icon, NotificationProvider, Sidebar } from "prime-ui-kit";
import type { ReactNode } from "react";

applyTheme("light");

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <AppShell.Root fillViewport>
        <AppShell.Nav>
          <Sidebar.Root>
            <Sidebar.Header>
              <Sidebar.Brand href="/" description="Отдел продаж">
                <Sidebar.BrandLogo>
                  <Icon name="nav.layoutGrid" />
                </Sidebar.BrandLogo>
                Прайм CRM
              </Sidebar.Brand>
              <Sidebar.Toggle variant="header" />
            </Sidebar.Header>
            <Sidebar.Content>
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
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell.Root>
    </NotificationProvider>
  );
}
```

On phones this rail becomes an off-canvas panel: add the menu button from
[layouts.md](layouts.md#app-frame-once-per-app).

A page with one primary action and a field frame:

```tsx
import { Button, Icon, Input, PageContent } from "prime-ui-kit";
import styles from "./ProfilePage.module.css"; // .form { display: grid; gap: var(--prime-space-5); }

export function ProfilePage() {
  return (
    <PageContent.Root maxWidth="readable">
      <PageContent.Header>
        <PageContent.Title>Профиль</PageContent.Title>
      </PageContent.Header>
      <PageContent.Body>
        <form className={styles.form} noValidate onSubmit={(event) => event.preventDefault()}>
          <Input.Root label="Рабочая почта" hint="На неё придут счета" required>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="field.email" />
              </Input.Icon>
              <Input.Field type="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root type="submit">Сохранить</Button.Root>
        </form>
      </PageContent.Body>
    </PageContent.Root>
  );
}
```
