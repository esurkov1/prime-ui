# Cheatsheet — the decisions agents get wrong

One line per decision: **do** this, **not** that. Every name here exists in the kit; the full
reference is each component's `COMPONENT.md` ([components.md](components.md)), the reasons are in
[composition.md](composition.md) and [api-contract.md](api-contract.md).

## Setup

- Import the styles once at the app root: `import "prime-ui-kit/bundle.css"` (tokens, themes, components), plus the opt-in `prime-ui-kit/fonts.css` and `prime-ui-kit/reset.css` when the app has no fonts or reset of its own — not per page, not a copied token file.
- Switch the theme with `applyTheme("light" | "dark")` — not a class or `style` on `<html>`.
- Put `NotificationProvider` and `AppShell.Root` in the app root once — not inside a page component.
- Import everything from `"prime-ui-kit"` — not from `prime-ui-kit/src/...` or `lucide-react` for a glyph the kit has. Two subpaths: `import { ColorField, ColorPicker, parseColor } from "prime-ui-kit/color-picker"` (needs the optional peer `react-aria-components`; `ColorPresets` and `ColorSwatches` come from the root), and `import { BellIcon } from "prime-ui-kit/icons"` for a glyph outside the `<Icon name>` set.

## Size

- Omit `size` for the default `m` — never write `size="m"`.
- Set `size` on the root (`Input.Root size="s"`, `Select.Root size="s"`) — not on `Input.Field` or `Select.Trigger`.
- One tier for a whole region: `<ControlSizeProvider value="s">` around a dense toolbar — not `size="s"` on one control to make it fit. Select, NativeSelect, TagSelect, Datepicker, Tabs and SmartFilter do not read the host tier: give them the same `size` yourself.
- Inside a host (Popover, Banner, LoginForm, the DataTable `toolbar`) leave `Button.Root`, `Input.Root`, `Textarea.Root`, `Checkbox.Root`, `DigitInput` and the other host-reading controls without `size` — the host passes its tier ([full list](api-contract.md)).
- A control in a table cell or a card header row is one tier down: `<Button.Root size="s" variant="ghost" tone="neutral">`.

## Structure

- Components with parts render through `.Root` + parts: `<Button.Root>`, `<Modal.Root>` — `<Button>` and `<Modal>` are not components.
- Leaves are single exports with no `.Root` (`<Typography>`, `<Skeleton />`, `<DataTable>`, `<Sparkline>`… — [the list](api-contract.md)) — not `<Typography.Root>`.
- Data-driven components take data as props: `DataTable columns rows`, `SmartFilter.Root fields`, `TagSelect options`, `ProgressBar segments` — not mapped child parts.

## Fields

- Frame a field with props on the root: `<Input.Root label="Почта" hint="…" error="…" required>` — not a separate `Label` / `Hint` next to it.
- Mark the minority: `required` when most fields are optional, `optional` when most are required — not both everywhere.
- Placeholder is an example value (`name@company.ru`) — never the label.
- Checkbox, Switch, Radio: the text is the part `<Checkbox.Label>`, `hint` / `error` sit on `Checkbox.Root` — not a `label` prop.
- Show `error` after blur or on submit; `<form noValidate onSubmit>` + `<Button.Root type="submit" loading>` — not validation on every keystroke.
- Groups of fields: `<Fieldset label="Контакты" disabled={saving}>` with the submit `<Button.Root loading>` outside it — not a hand-reset `<fieldset>` with a `Typography` heading, not `disabled` on every field while saving. One choice with a heading (`Radio.Group label`) needs no Fieldset.
- Uploads: `const queue = useUploadQueue({ upload })` → `<FileUpload.Queue queue={queue} />` or `<ImageUpload queue={queue}>` — progress, «В очереди», the reason of a failure, retry and remove come with it (three at once by default, `concurrency`); not a hand-kept list of files with own progress bars. A photo appears at once from its local preview.
- A choice in a form (SegmentedControl, ButtonGroup) is a field too: `label`, `hint`, `error` on its root — not a `Label` wired by hand.
- A record card that saves each field: `<Input.Root onCommit={save}>` (save returns a Promise) — not hand-written blur / Enter / Escape handlers or a field disabled while saving.
- Copy or call next to a value: `Input.CopyButton`, `Input.Action` inside `Input.Wrapper` — not a Button beside the field; a password: `Input.RevealButton`.

## State

- Uncontrolled by default: `defaultValue`, `defaultChecked`, `defaultOpen`.
- Controlled triads, same names everywhere: `value` / `onValueChange`, `checked` / `onCheckedChange`, `open` / `onOpenChange` — not `onChange(event)` (except the native `Input.Field` / Textarea `onChange`), `isOpen`, `onToggle`.
- Selection count is `multiple` (`Select.Root multiple`) — not `type="multiple"`.
- A slow or risky action is an async event: return the request's Promise from `onConfirm`, `onCommit`, `onReorder`, `onBarChange`, `onSend`, a Switch's `onCheckedChange`, a Slider's `onCommit`, a DigitInput's `onComplete`, a Kanban or ImageUpload change, a Badge or queue row `onRemove`, TagSelect `onCreate`… — the component shows pending, keeps the change on resolve and rolls it back on reject; not `true` / `false`, not your own pending flag, no `onBeforeX`.
- A value that settles at the end of a gesture saves in its own event: Slider `onCommit` — not a request on every `onValueChange` step.

## Text: labels vs children

- Visible text goes in children or content props: `<Button.Root>Сохранить</Button.Root>`, `<Modal.Title>`.
- System strings (aria names, counters, default texts) go through `labels`: `<Modal.Root labels={{ close: "Закрыть окно" }}>` — not a `closeLabel` prop. Defaults are Russian; override only what differs.

## Icons

- Every glyph from the kit, in this order: a semantic `<Icon name="action.add" />` ([names](api-contract.md#icons)); else the full animated set `import { ArchiveIcon } from "prime-ui-kit/icons"` → `<ArchiveIcon />` (Lucide name + `Icon`); only a glyph neither has → `const IconTractor = createIcon(Tractor)` once, then `<IconTractor />` — not `import { Plus } from "lucide-react"` in JSX, another icon library or an inline `<svg>`.
- Kit icons animate by themselves: the gesture plays when their button, link, tab, menu item or row is hovered or pressed — not your own hover rotate or spin on an icon. `animated={false}` only for a glyph repeated in every row of a long list.
- Put icons into the part: `<Button.Icon>`, `<Input.Icon side="start">`, `<Sidebar.ItemIcon>`, `<Dropdown.ItemIcon>`, `<EmptyPage.Icon>` — not an `icon` prop (only data arrays such as `notify()` take `icon`).
- Icon-only button: `<Button.Root variant="ghost" tone="neutral" aria-label="Удалить">` with a `Tooltip` — not an unnamed icon.
- `lucide-react` only through `createIcon`, for a glyph missing from both `<Icon name>` and `prime-ui-kit/icons` — not for `Plus`, `Search`, `Bell`, `Settings`…

## Buttons and actions

- One primary per area (page header, card, dialog): the default `solid` accent, last in the row. Others `variant="soft" tone="neutral"`; dismiss `variant="ghost" tone="neutral"` (pages), `variant="outline" tone="neutral"` (Modal / Drawer footer).
- Destructive is `tone="danger"` — never `tone="error"`; which variant where and how it is confirmed: [api-contract.md](api-contract.md#destructive-actions) and [choosing.md](choosing.md).
- Going somewhere is a link: `<LinkButton href>` or `<Button.Root asChild><a href>…</a></Button.Root>` — not `onClick={() => location.assign(url)}`.
- Busy action: `<Button.Root loading>` — not a hand-made spinner or «Загрузка…» text.
- An action on a coloured host (a solid Banner, an accent strip): `<Button.Root variant="ghost" tone="inherit">` — it takes the host's text colour; never recolour a Button with a CSS override.

## Cards and surfaces

- `Card.Root` only for a bounded block with its own title: a KPI tile (`variant="stat-trend"`), a settings panel (`variant="panel"`), side facts — not around a whole section, a form field or a page.
- Never a card in a card, and never a `DataTable` inside a Card — the table is already a filled block.
- Section without a card: `<Typography as="h2" variant="title-m">` + the content.
- Depth from fill, not lines: no borders around blocks; `<Divider />` only inside a block.
- Tabs are a bar, not a container: `Tabs.Root` stands in the host's padding and the panel content goes straight into `Tabs.Panel` — never a Card or a padded `div` around the tabs or inside a panel. In a Modal / Drawer, `Tabs.Root` wraps `X.Header` + `X.Body` and `Tabs.List` goes last into the header — not a tab strip at the top of the body.

## Tables

- A list page is `<DataTable columns rows getRowKey toolbar={…}>` with `<SmartFilter.Root fields value onValueChange>` + `<SmartFilter.Toolbar />` + `<SmartFilter.Chips />` in `toolbar`; filter rows with `matchesSmartFilter` — not a search Input and a row of Selects above the table.
- Search over a table or a list page is always SmartFilter, even with no filter fields yet (`fields={[]}` is a plain search that grows into filters). A search `Input` only outside a filtered list: inside a picker, a settings section, a panel.
- Paging is built in: `paging="pages"` (default) with `pageSize`, `paging="infinite"` for feeds, `paging="none"` for short lists — not a separate `<Pagination>` under a DataTable.
- Data the server sorts and pages (thousands of records): `source="server"` + `rowCount`, controlled `sort` / `page` as the request, `page` back to 1 on a new search or filter, old rows kept with `loading` while the next page loads — not a server page passed to the default client mode, and not `rows={[]}` between pages.
- Categories (sources, platforms, regions) get `color` and the same order of `chartColors` in charts; statuses and meanings get `tone` — never paint categories with tones.
- A chart with axes or several series: `<ChartFrame.Root series state>` around the library (or your SVG) with `ChartFrame.Plot renderPlot`, `Legend`, `Table` — not a hand-made Card with a grey box while loading and a legend of colored dots.
- Amounts, counts and dates are `numeric` columns; statuses are `Badge.Root color` from one status → color map.
- Rows people order by hand: `onReorder(id, beforeId)` (apply it with `moveBefore`, return the save's Promise) — not a Dnd list rebuilt next to the table.
- Properties of one record: `<DescriptionList.Root>` of `DescriptionList.Item` — not a hand-made grid of label / value text, not a one-row DataTable.
- Who is busy when, a plan with dates: `Gantt` with `onBarChange` / `onBarCreate` — not bars drawn by hand or a DataTable of start and end dates. Statuses moved by hand: `Kanban`.

## Chat

- A conversation is `Message.Group` of `Message.Root` (positions and dates from `groupMessages`) in `<ScrollContainer anchor="end">`, with `Composer.Root` under it — not Cards or a Timeline styled as bubbles, not a Textarea with a send button.
- A voice message is `VoicePlayer` inside `Message.Root`; a round video is `Message.VideoNote`; photos, files, places and contacts are `Message` parts — not FileUpload rows or Cards.
- Send optimistically: `onSend` adds the message with `status="sending"` under a client id and returns; patch `status` to `sent` / `read` / `failed` as the server answers. Keep the row's `key` and `value` when the server id arrives — a re-keyed row enters a second time. Give `Message.Root` `onRetry` for `failed`.
- A reply or an edit: `<Composer.Context value={id}>` — `onSend` gets `replyTo` / `editOf` and the bar closes itself after the send; never read the replied message from a closure. ↑ in an empty field is `onEditLast`.
- «печатает…» on the other side: `Composer onActivityChange` (`typing` / `voice` / `video` / `null`, on a change only) → your socket; on the receiving side `<Message.Typing active={typing} />` at the end of the group. Never send it from `onValueChange`.
- Appearance: messages that are new at the end enter by themselves — mine rise from the composer while the list glides up, theirs slide in from their side; the first render and history loaded above never animate. Do not add your own enter animation or `scrollTop = scrollHeight`.
- `Message.Group` in `ScrollContainer anchor="end"` scrolls to my message, stays at the end for theirs while the reader is there, and otherwise shows the «N новых» button; `onNewMessage(value, { direction })` is for a sound or a counter, `onRead(values)` for read receipts (only what was really seen). The first unread is `Message.Unread`; older history is `onReachStart`.
- Jump to a message: `Message.Reply target={id}` (a click scrolls to it and flashes it); search: `Message.Group highlight={query}` marks the matches, `current={id}` brings the current one into view. A pinned message is `Message.Pinned` above the scroll region.
- One sound at a time is built in: a voice message, a video message and a chat video pause each other; `VoicePlayer playing` / `onPlayingChange` when the app needs to know. A recorded voice message without levels gets them from `getWaveform(blob)` once, stored with the message.

## Overlays

- Blocking decision or ≤ 4 fields → `Modal` (`<Modal.Content size="s">` for a confirm); long form, filters, details → `Drawer`; a short task that ends by itself (a date, an action, a note) → `Sheet`; small panel at a control → `Popover`; list of actions → `Dropdown`; a field value → `Select`; a name for an icon button → `Tooltip`; ⌘K → `CommandMenu`.
- Never a hand-made `div` backdrop, dialog, menu or tooltip.
- Every Modal and Drawer has all three zones: `Header` (title, ×) · `Body` (content, scrolls) · `Footer` (actions). Details: `<Drawer.Footer><Drawer.Close><Button.Root variant="outline" tone="neutral">Закрыть</Button.Root></Drawer.Close></Drawer.Footer>`, plus the main action last; a form: «Отмена» + submit. Not a drawer that ends with the body, not Save at the bottom of the body. A `Sheet` (from the bottom edge) is the opposite: no footer by default — a pick or a swipe ends it — and its header is optional: keep it when the content needs a title, drop it (× and hairline go too) when the content speaks for itself, with `aria-label` on `Sheet.Content`. Never `Drawer.Content side="bottom"`.
- Content inside a Drawer, a Sheet or a Card is the host's own: a calendar is `Datepicker.Panel` straight in the body, across its width — no card, no padded box around it.
- A destructive confirm is `<ConfirmDialog.Root title description confirmLabel onConfirm={remove}>` with a `ConfirmDialog.Trigger` — not a Modal assembled as a confirm with your own pending state; a reversible delete offers «Отменить» in the notification instead.
- Overlays close smoothly only if they stay mounted: render the `Root` always and drive visibility with `open` alone — never `{open && <Drawer.Root>}`, never a changing `key` on the Root. The kit keeps the last content on screen while the exit plays.
- `align` of a menu or popover: leave the default `start` — it flips at the screen edge by itself, a «⋯» at the end of a row included. `align="end"` only when the panel must line up with the end of a block whatever room there is.
- While a request runs: `closeOnEscape={false}`, `<Modal.Header showClose={false}>`, Cancel disabled.

## Motion — it comes with the components

- Changed button text is new children: `<Button.Root>{saved ? "Сохранено" : "Сохранить"}</Button.Root>` flows in by letters — not two buttons swapped with a condition.
- Saving a form, one rule: the form stays on screen after saving (a Drawer or card that stays open, a settings section) → the button says «Сохранено», no notification; the form goes away (a Drawer or Modal closes, the page navigates) → a notification. A failure is always a notification (or the field's `error`), never only the button.
- A long job from a button: `<Button.Root progress={0.42}>Экспорт 42%</Button.Root>` — not a ProgressBar next to it.
- A single destructive action that is easy to redo by hand (clear a draft, revoke a token), no list and no dialog: `<Button.Root tone="danger" variant="soft" holdToConfirm onConfirm={remove}>` — the action in `onConfirm`, not `onClick`. A row in a list: delete at once and offer «Отменить» in the notification.
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

- The page panel is `<PageToolbar.Root>` with, in this order, `Tools` (`SmartFilter.Toolbar`: search, then filter), `Sections` (a `fullWidth` SegmentedControl), `View`, `Actions`, `Chips` — the active filters always sit right under the search, never under the sections; not a hand-made flex row of tabs, search and buttons.
- Rearrange, never hide: every desktop function is on the phone, in another place or a menu — not `display: none` below a breakpoint.
- Breakpoints 640 · 768 · 1024 · 1280 only for the app frame; inside a page — intrinsic grids (`auto-fill, minmax`) and container queries.
- A wide table scrolls inside itself; offer `DataTable.ColumnsMenu` in its `toolbar` — never drop columns by breakpoint, never hand-build the chooser.
- A row that opens a record page is `getRowHref` (a real link: ⌘-click, new tab), a row that opens a drawer is `onRowClick` — never `navigate()` in `onRowClick`, never your own `event.target` checks for buttons in the row.
- A list + detail screen is `PageContent.Split` in a `PageContent.Root fill` page; a full-height table is `scrollHeight="fill"` — never a height computed from `100vh`.
- App sections on phones: `BottomNav` in `AppShell.Footer` — not in Main, not `position: fixed`, no own media query: the shell hides the footer while the Sidebar rail is on screen; a short task from the bottom edge: `Sheet` — Select, Dropdown, Popover and Modal become sheets below 640 by themselves.
- Your hover styles inside `@media (hover: hover)`; nothing hover-only. Do not wrap kit fields to raise their text for iOS — they keep 16px on touch already.
- A long form saves through the panel action with a count («Сохранить 3 изменения») — not a sticky bar at the bottom of a phone.
- Sticky comes from the kit (`AppHeader` with `AppHeader.Tools`, the DataTable head, `stickyFirstColumn`, the Gantt header) — not your own `position: sticky` bar.

## Spacing and values

- Gaps are `gap` on the parent with `--prime-space-N` (N × 4px): 8 in a row of buttons, 20 field → field, 32 group → group; `PageContent.Body` already spaces blocks 40 — not margins, not outer padding.
- Tokens only: `var(--prime-space-4)`, `var(--prime-color-text-secondary)`, `var(--prime-radius-m)` — never raw `px` / `rem` / hex, never `--prime-ref-*`, never inline `style`.
- Text through `Typography` roles (`title-m`, `title-s`, `body-m`, `caption`) and `tone="secondary" | "muted"` — not `font-size` or `color` in CSS.

## Anti-slop

The whole list, bad → good: [anti-slop.md](anti-slop.md). Before handing over: [checklist.md](checklist.md).

## Snippets to copy

App root, once — the styles and the theme:

```tsx
import "prime-ui-kit/bundle.css";
import { applyTheme } from "prime-ui-kit";

applyTheme("light");
```

The frame itself (providers, `AppShell` with `Sidebar` and the phone menu button) is built once too:
copy it from [layouts.md](layouts.md#app-frame-once-per-app).

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
