# Cheatsheet — the decisions agents get wrong

One line per decision: **do** this, **not** that. Every name here exists in the kit; the full
reference is each component's `COMPONENT.md` ([components.md](components.md)), the reasons are in
[composition.md](composition.md) and [api-contract.md](api-contract.md).

## Setup

- Import the styles once at the app root: `import "prime-ui-kit/bundle.css"` (tokens, themes, components), plus the opt-in `prime-ui-kit/fonts.css` and `prime-ui-kit/reset.css` when the app has no fonts or reset of its own — not per page, not a copied token file.
- Switch the theme with `applyTheme("light" | "dark")` — not a class or `style` on `<html>`.
- Put `NotificationProvider` and `AppShell.Root` in the app root once — not inside a page component.
- Import everything from `"prime-ui-kit"` — not from `prime-ui-kit/src/...` or `lucide-react` for a glyph the kit has. The one subpath: `import { ColorPicker, parseColor } from "prime-ui-kit/color-picker"` (needs the optional peer `react-aria-components`); `ColorPresets` and `ColorSwatches` come from the root.

## Size

- Omit `size` for the default `m` — never write `size="m"`.
- Set `size` on the root (`Input.Root size="s"`, `Select.Root size="s"`) — not on `Input.Field` or `Select.Trigger`.
- One tier for a whole region: `<ControlSizeProvider value="s">` around a dense toolbar — not `size="s"` on one control to make it fit.
- Inside a host (Popover, Banner, LoginForm, the DataTable `toolbar`) leave fields and controls (`Button.Root`, `Input.Root`, `Textarea.Root`, `Checkbox.Root`, `DigitInput`…) without `size` — the host passes its tier.
- A control in a table cell or a card header row is one tier down: `<Button.Root size="s" variant="ghost" tone="neutral">`.

## Structure

- Components with parts render through `.Root` + parts: `<Button.Root>`, `<Modal.Root>` — `<Button>` and `<Modal>` are not components.
- Leaves are single exports with no `.Root`: `<Typography>`, `<Divider />`, `<Spinner />`, `<Skeleton />`, `<Kbd>`, `<LinkButton>`, `<DataTable>`, `<Pagination>`, `<ProgressBar>` — not `<Typography.Root>`.
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

- Take a glyph from the kit: `<Icon name="action.add" />` — not `import { Plus } from "lucide-react"`. Names: [api-contract.md](api-contract.md#icons). A domain glyph the kit lacks: `const IconBike = createIcon(Bike)` once, then `<IconBike />`.
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

## Motion — it comes with the components

- Changed button text is new children: `<Button.Root>{saved ? "Сохранено" : "Сохранить"}</Button.Root>` flows in by letters — not two buttons swapped with a condition.
- A long job from a button: `<Button.Root progress={0.42}>Экспорт 42%</Button.Root>` — not a ProgressBar next to it.
- A reversible delete without a dialog: `<Button.Root tone="danger" variant="soft" holdToConfirm onConfirm={remove}>` — the action in `onConfirm`, not `onClick`.
- Counts: a number child of `Badge` rolls its digits — not a string you re-render with your own fade.
- New password: `<Input.Root strength>`; steps of a whole: `<ProgressBar steps value={2} max={5} />`; a trend tile: `<Sparkline data label formatValue />`.
- A rare milestone only: `celebrate({ origin: event.currentTarget })` — never for a saved form.
- No motion on keyboard-driven or high-frequency actions; tokens only, no bounce. Full guide: [motion.md](motion.md).

## Empty, loading, error — states flow, they never flip

State change is continuous in the whole kit: every region that changes what it shows cross-fades, and loading holds the shape of what is coming.

- Every region with loading / data / empty / error (or one record at a time): its content in `<Crossfade state={status} aria-busy={status === "loading"}>` — not `{loading ? <A /> : <B />}` that flips and makes the page jump. DataTable does this itself.
- Region loading: `<Skeleton>` in the geometry of the data — same rows, same gaps (`<Skeleton />` for a text line, `shape="circle"` for an avatar, `shape="control"` for a field, `shape="block"` for an image or chart) — not a spinner in an empty card, not a grey box or shimmer you draw.
- `Spinner` only where there is no shape to hold (a running job, a status line); a busy button is `<Button.Root loading>`.
- Refreshing data already on screen: keep it, set `aria-busy` — not back to a skeleton on every refetch.
- Table states in place: `loading` (+ `loadingRows`), `empty`, `error` on `DataTable` — the head and toolbar stay.
- First run of a page or region: `EmptyPage.Root` + `EmptyPage.Icon` + `EmptyPage.Title` + `EmptyPage.Description` + `EmptyPage.Actions` with one action — not «Здесь пока ничего нет».
- Page-level persistent problem: `<Banner.Root tone="danger">` first in `PageContent.Body`; the result of an action: `useNotifications().notify({ tone, title })`.

## Sidebar

- Brand header: `Sidebar.Header` > `Sidebar.Brand href description` (with `Sidebar.BrandLogo`) + `<Sidebar.Toggle variant="header" />` — not a Toggle in the footer when the rail has a brand.
- Off-canvas: `offCanvas="auto"` (default, below 768px) with `open` / `onOpenChange` and a menu button that opens it; `offCanvas="always"` for navigation behind a menu at any width; `offCanvas="never"` for a rail that always stays.
- Every item has `Sidebar.ItemIcon` (compact mode shows only icons) and is a link: `href` or `asChild` with the router `NavLink`; `current` marks the page.
- The signed-in user: `Sidebar.Account` inside `Dropdown.Trigger` at the end of `Sidebar.Footer`.
- Structure: everyday places on top without a label, categories as `Sidebar.Group label collapsible` (one short word, 3–7 items), views of one section as `Sidebar.Sub` (one level, the parent only discloses) — not every group folded, not a sub-list inside a sub-list.
- Counts: plain `Sidebar.ItemCount` for information; `color` only when it needs action — it becomes a dot on the rail and on folded parents.
- Remember the rail and folded groups with `persistKey` on `Sidebar.Root` — not your own `localStorage` code.

## Narrow screens and touch

Full rules: [responsive.md](responsive.md).

- The page panel is `<PageToolbar.Root>` with `Sections` (a `fullWidth` SegmentedControl), `Tools` (`SmartFilter.Toolbar`), `View`, `Actions`, `Chips` — not a hand-made flex row of tabs, search and buttons.
- Rearrange, never hide: every desktop function is on the phone, in another place or a menu — not `display: none` below a breakpoint.
- Breakpoints 640 · 768 · 1024 · 1280 only for the app frame; inside a page — intrinsic grids (`auto-fill, minmax`) and container queries.
- A wide table scrolls inside itself; offer `hiddenColumns` through a column chooser — never drop columns by breakpoint.
- App sections on phones: `BottomNav` in `AppShell.Footer`; a phone sheet: `Drawer.Content side="bottom"` — Select, Dropdown, Popover become sheets below 640 by themselves.
- Your hover styles inside `@media (hover: hover)`; nothing hover-only. Do not wrap kit fields to raise their text for iOS — they keep 16px on touch already.
- A long form saves through the panel action with a count («Сохранить 3 изменения») — not a sticky bar at the bottom of a phone.

## Spacing and values

- Gaps are `gap` on the parent with `--prime-space-N` (N × 4px): 8 in a row of buttons, 20 field → field, 32 group → group; `PageContent.Body` already spaces blocks 40 — not margins, not outer padding.
- Tokens only: `var(--prime-space-4)`, `var(--prime-color-text-secondary)`, `var(--prime-radius-m)` — never raw `px` / `rem` / hex, never `--prime-ref-*`, never inline `style`.
- Text through `Typography` roles (`title-m`, `title-s`, `body-m`, `caption`) and `tone="secondary" | "muted"` — not `font-size` or `color` in CSS.

## Anti-slop top 11

1. One component per look: two statuses are two `Badge.Root`s, never a Badge and a styled `span`.
2. No card around everything, no card in a card, no card around a table.
3. One primary button per area; the rest soft / ghost / outline with `tone="neutral"`.
4. One size per row; mixed `s` and `m` in a toolbar reads as a bug.
5. Labels above fields; placeholder is an example.
6. Three levels of air (inside an item, between items, between blocks) — not one gap for the page.
7. No emoji, no icon next to every label, no gradients, glows or colored section backgrounds.
8. No subtitle that repeats the title, no filler copy; an empty state says what to do and gives the action.
9. No hand-made overlays, spinners, skeletons, dividers, badges or filter bars — the kit has each.
10. No state that flips: every region swaps through `Crossfade`, loading is a `Skeleton` of the content.
11. No overrides of kit internals (`.form :global(button)`); a part's `className` is for placement only.

## Snippets to copy

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

A region with all its states — loading, data, empty, error — that flow into each other. Copy this
shape for every block that fetches data (a table uses DataTable `loading` / `empty` / `error` instead):

```tsx
import { Button, Card, Crossfade, EmptyPage, Icon, Skeleton, Typography } from "prime-ui-kit";
import styles from "./InvoicesCard.module.css";
// .rows { display: grid; gap: var(--prime-space-3); margin: 0; padding: 0; list-style: none; }
// .row { display: flex; align-items: center; justify-content: space-between; gap: var(--prime-space-4); }
// .client { width: 55%; }  .amount { width: 20%; }

type Invoice = { id: string; client: string; amount: string };

type InvoicesCardProps = {
  status: "loading" | "ready" | "error";
  invoices: Invoice[];
  onRetry: () => void;
};

const PLACEHOLDER_ROWS = ["a", "b", "c"];

export function InvoicesCard({ status, invoices, onRetry }: InvoicesCardProps) {
  // One key per state: Crossfade cross-fades whenever it changes and glides the height.
  const state = status === "ready" && invoices.length === 0 ? "empty" : status;

  return (
    <Card.Root variant="panel">
      <Card.Header>
        <Card.Title as="h2">Неоплаченные счета</Card.Title>
      </Card.Header>
      <Card.Body>
        <Crossfade state={state} aria-busy={state === "loading"}>
          {state === "loading" ? (
            // Loading: Skeleton rows in the geometry of the data rows — not a Spinner.
            <ul className={styles.rows}>
              {PLACEHOLDER_ROWS.map((key) => (
                <li key={key} className={styles.row}>
                  <Skeleton className={styles.client} />
                  <Skeleton className={styles.amount} />
                </li>
              ))}
            </ul>
          ) : null}
          {state === "ready" ? (
            <ul className={styles.rows}>
              {invoices.map((invoice) => (
                <li key={invoice.id} className={styles.row}>
                  <Typography as="span" variant="body-m">
                    {invoice.client}
                  </Typography>
                  <Typography as="span" variant="body-m">
                    {invoice.amount}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : null}
          {state === "empty" ? (
            <EmptyPage.Root size="s" aria-labelledby="invoices-empty">
              <EmptyPage.Icon>
                <Icon name="status.success" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="h3" id="invoices-empty">
                Все счета оплачены
              </EmptyPage.Title>
              <EmptyPage.Description>Новые счета появятся здесь после выставления.</EmptyPage.Description>
            </EmptyPage.Root>
          ) : null}
          {state === "error" ? (
            <EmptyPage.Root size="s" role="alert" aria-labelledby="invoices-error">
              <EmptyPage.Icon tone="danger">
                <Icon name="status.danger" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="h3" id="invoices-error">
                Счета не загрузились
              </EmptyPage.Title>
              <EmptyPage.Description>Сервер не ответил. Данные не потеряны.</EmptyPage.Description>
              <EmptyPage.Actions>
                <Button.Root variant="soft" tone="neutral" onClick={onRetry}>
                  Повторить
                </Button.Root>
              </EmptyPage.Actions>
            </EmptyPage.Root>
          ) : null}
        </Crossfade>
      </Card.Body>
    </Card.Root>
  );
}
```

A refetch of data already on screen keeps `status="ready"` and the rows (set `aria-busy` on the
card) — it does not go back to the skeleton.
