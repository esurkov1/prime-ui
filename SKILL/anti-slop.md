# Anti-slop

What makes a screen look generated. Each rule: bad → good. Screen-level mistakes (cards around
everything, one gap for the whole page, two primary buttons) are listed in
[composition.md](composition.md#13-screen-level-anti-slop).

## 1. Same-looking things built differently

Two status labels, one a Badge and one a styled `span`; three cards with three different paddings.

```tsx partial
// bad
<span className={styles.paid}>Оплачен</span>
<Badge.Root color="orange">Ожидает</Badge.Root>
```

```tsx good
// good — one component; a judgement wears a tone, the same one everywhere
<Badge.Root tone="success">Оплачен</Badge.Root>
<Badge.Root tone="warning">Ожидает</Badge.Root>
```

The label and colour of each status come from one map of the app:
[foundations.md → One status map](foundations.md#one-status-map).

## 2. Inline styles, raw values, primitive tokens

```tsx partial
// bad
<div style={{ display: "flex", gap: 12, padding: "18px", color: "#6b7280" }} />
```

```css
/* bad */
.row { gap: 12px; color: var(--prime-ref-color-gray-500); }

/* good */
.row { display: flex; gap: var(--prime-space-3); }
```

Text colour is not CSS: [foundations.md → Text colour](foundations.md#text-colour).

## 3. Borders instead of fill; card in a card

```css
/* bad */
.panel { border: 1px solid var(--prime-color-border-default); background: transparent; }
```

```tsx partial
// bad — a card around a card around a table
<Card.Root><Card.Root><DataTable columns={columns} rows={rows} /></Card.Root></Card.Root>
```

```tsx good
// good — DataTable already is a filled block; a titled section is enough
// declare: const payments: { id: string; client: string }[]
<Page.Section label="Последние оплаты">
  <DataTable
    columns={[{ id: "client", header: "Клиент", accessor: "client" }]}
    rows={payments}
    getRowKey={(row) => row.id}
  />
</Page.Section>
```

## 3a. Hover that merges with the neighbour

A 4% wash (`fill-subtle`) is exactly one step of the surface ladder. On an opaque card it turns the
card into the color of what it lies on — the page, a column, a zebra row — and the card vanishes
under the pointer. A fixed layer color (`--prime-color-layer-floating-bg`) on something that can lie
on different hosts does the same: on a white host the "white card" is already the host.

```css
/* bad — the clickable card washes one step: on hover it is the page's own gray */
.tile { background: var(--prime-color-layer-1-bg); }
.tile:hover { background: var(--prime-color-fill-subtle); }

/* good — a whole surface lifts; a part touching the edge goes two steps; colors come from context */
.tile { position: relative; transition: box-shadow var(--prime-motion-duration-fast) var(--prime-motion-easing-standard); }
@media (hover: hover) and (pointer: fine) {
  /* above its neighbours, or they cover the shadow */
  .tile:hover { z-index: var(--prime-z-raised); box-shadow: var(--prime-shadow-overlay); }
}
@media (hover: hover) {
  .row:hover { background: var(--prime-color-fill-muted-hover); }
}
```

Build the tile as a `Card` (it takes the right layer wherever it lands). Check every hover on the page
and inside a card, in both themes: rest, hover and the neighbour must be three different colors.

## 4. Mixed control sizes in one row

```tsx partial
// bad
<Input.Root size="s">…</Input.Root>
<Button.Root>Найти</Button.Root>
```

```tsx good
// good — one tier for the row
<ControlSizeProvider value="s">
  <Input.Root>
    <Input.Wrapper>
      <Input.Field type="search" aria-label="Поиск по счетам" />
    </Input.Wrapper>
  </Input.Root>
  <Button.Root>Найти</Button.Root>
</ControlSizeProvider>
```

## 5. Placeholder instead of label

```tsx partial
// bad
<Input.Root>
  <Input.Wrapper>
    <Input.Field placeholder="Email" />
  </Input.Wrapper>
</Input.Root>
```

```tsx good
// good
<Input.Root label="Почта">
  <Input.Wrapper>
    <Input.Field placeholder="name@company.ru" />
  </Input.Wrapper>
</Input.Root>
```

A search field in a toolbar may go without a visible label, but then it needs `aria-label`.

## 5a. A label in every row, a record split over lines

The most common shape bug of generated forms: rules for one field applied to a list of records.

```tsx partial
// bad — «Иконка · Параметр · Значение · Цвет» repeated in every record, a record on two lines,
// numbered labels, a hint that explains the lock
{specs.map((spec, index) => (
  <div key={spec.id} className={styles.grid}>
    <Select.Root label="Иконка">…</Select.Root>
    <Input.Root label={`Параметр ${index + 1}`}>…</Input.Root>
    <Input.Root label="Значение">…</Input.Root>
    <ColorField label="Цвет иконки" />
  </div>
))}
<Typography variant="body-s">Первые три всегда первыми. Остальные можно перетаскивать.</Typography>
```

```tsx good
// good — one row per record, the headings once, compact columns for the small attributes
// declare: const specs: { id: string; icon: string; name: string; value: string; color: string | null; pinned: boolean }[]
// declare: function setSpecs(next: typeof specs): void
// declare: function newSpec(): (typeof specs)[number]
// declare: function iconOf(key: string): Parameters<typeof Icon>[0]["name"]
<FieldList
  label="Характеристики"
  columns={[
    { label: "Иконка", width: "compact" },
    { label: "Параметр" },
    { label: "Значение" },
    { label: "Цвет", width: "compact" },
  ]}
  reorderable
  getLocked={(spec) => spec.pinned}
  value={specs}
  onValueChange={setSpecs}
  getId={(spec) => spec.id}
  getLabel={(spec) => spec.name}
  createItem={newSpec}
  addLabel="Характеристика"
  renderItem={(spec, row) => (
    <>
      <Select.Root value={spec.icon} onValueChange={(icon) => row.update({ icon })}>
        <Select.Trigger>
          <Select.TriggerIcon>
            <Icon name={iconOf(spec.icon)} />
          </Select.TriggerIcon>
        </Select.Trigger>
        <Select.Content>…</Select.Content>
      </Select.Root>
      <Input.Root>…</Input.Root>
      <Input.Root>…</Input.Root>
      <ColorPresets.Root value={spec.color} onValueChange={(color) => row.update({ color })}>
        …
      </ColorPresets.Root>
    </>
  )}
/>
```

The same for one value in several units — one heading, the fields in a row, the unit inside:

```tsx partial
// bad — three labels, the currency in the label and again in the field, one field on a line of its own
<Input.Root label="Депозит, $" optional>…<Input.InlineAffix side="end">$</Input.InlineAffix>…</Input.Root>
<Input.Root label="Депозит, ฿" optional>…</Input.Root>
<Input.Root label="Депозит, ₽" optional>…</Input.Root>
```

```tsx good
// good — a group heading, three fields in one row, each named for assistive tech
<Fieldset label="Депозит">
  <div className={styles.row}>
    <Input.Root>
      <Input.Wrapper>
        <Input.Field aria-label="Депозит в долларах" inputMode="decimal" />
        <Input.InlineAffix side="end">$</Input.InlineAffix>
      </Input.Wrapper>
    </Input.Root>
    {/* ฿ and ₽ the same */}
  </div>
</Fieldset>
```

## 6. Everything on one level of air

```css
/* bad — 16 between fields, groups and sections alike */
.page, .form, .group { display: grid; gap: var(--prime-space-4); }

/* good — proximity scale */
.form { display: grid; gap: var(--prime-space-8); }   /* group → group 32 */
.group { display: grid; gap: var(--prime-space-5); }  /* field → field 20 */
/* block → block 24 and section → section 40 come from Page.Body / Page.Section */
```

## 7. `div` instead of a ready component

| Instead of | Use |
|---|---|
| `<div className={styles.line} />` | `<Divider />` |
| `<span className={styles.key}>⌘</span>` | `<Kbd aria-label="Command">⌘</Kbd>` |
| `<h2 className={styles.title}>` with custom font size | `<Typography as="h2" variant="title-m">` |
| `<span className={styles.pill}>Новый</span>` | `<Badge.Root color="blue">Новый</Badge.Root>` |
| `<div className={styles.box}>` with bg + radius | `<Card.Root variant="panel">` |
| `<a className={styles.link}>` | `<LinkButton href="…">` |
| a list of `<button>`s for navigation | links: `Sidebar.Item href` for the app's sections, `BottomNav.Item` on a phone, `List.Item asChild` around a link for the records of a list |
| `<Button.Root onClick={() => location.assign(url)}>` | `<Button.Root asChild><a href={url}>…</a></Button.Root>` or `LinkButton` |
| a hand-built spinner, shimmer, grey placeholder box or «Loading…» text | `loading` on Button / Select / DataTable; a region: `Skeleton` of its content inside `Crossfade`; no shape to hold: `Spinner` |
| `{loading ? <Spinner /> : <List />}` — a state that flips | `<Crossfade state={status}>` around the region, `Skeleton` while loading |
| a search Input + a row of filter Selects above a table | `SmartFilter`: on a section page its toolbar in `Page.Tools` and chips in `Page.Chips`; on a table block among others in the table's `toolbar` / `toolbarChips` ([where the filters go](composition.md#where-the-filters-go)) |
| a section page whose table keeps its own search and filter row under the top bar | the section's search, «Фильтр» and «Вид» in `Page.Tools`, the chips in `Page.Chips`, the table without a `toolbar` — the same place on every section and in every view ([where the filters go](composition.md#where-the-filters-go)) |
| a grid of «label: value» text pairs for one record | `DescriptionList.Root` + `DescriptionList.Item` |
| a Modal hand-built as «Удалить?» with your own pending flag | `ConfirmDialog.Root` with an async `onConfirm` |
| a `<fieldset>` reset by hand, or `disabled` on every field while saving | `<Fieldset label disabled={saving}>` |
| your own list of files with progress bars and retry | `useUploadQueue` → FileUpload `queue` |
| chat bubbles from Cards or a Timeline, a Textarea with a send button, a chat header and scroller of your own | `Chat` (`Chat.Messages` of `Message.Root`, `Chat.Footer` with `Composer.Root`) |
| bars of dates drawn by hand, or a DataTable of start / end dates | `Gantt` |
| a hand-made `<span>` hidden with CSS for screen readers | `<VisuallyHidden>` |
| a `div` with `overflow: auto` | `ScrollContainer` (`edges`, `scrollbar="hidden"`, `snap`) |
| `scroll-snap-type` on a strip of cards | `ScrollContainer snap` (`"mandatory"` only where each child fills most of the view) |
| a flex row of Badges with its own gap | `Badge.Group` |
| a Switch or a ⋯ button inside a list row, or the row rebuilt as a `div` to hold them | `List.ItemActions` beside the row's element |
| a heading row (`Typography as="h3"` + buttons) over a group in a Drawer or a Modal | `Drawer.Section label` / `Modal.Section label` with `Drawer.Actions` / `Modal.Actions` |
| Markdown turned into HTML (`dangerouslySetInnerHTML`, a Markdown library) | `RichText` |
| an `<img>` with your own radius and loading box | `Thumbnail.Root` / `Avatar.Root` |
| a lightbox, or a Modal with an `<img>` | `Gallery` (opens `MediaViewer` itself) or `MediaViewer` |
| a `position: fixed` bottom tab bar | `BottomNav` in `AppShell.Footer` |
| a menu state and a menu button wired by hand to open the phone Sidebar | nothing: the page's `Page.TopBar` draws the menu button; another trigger reads `useAppShellNav()` ([the app frame](layouts.md#app-frame-once-per-app)) |
| a bottom panel built from a Drawer or a `div` | `Sheet` |

## 7a. Fighting the table

```css
/* bad — fixed rows squash two-line cells; restyled sort icons and dividers */
.table :global(td) { height: 44px; padding: 0; }
.table :global(th) svg { color: var(--prime-color-accent-default); }
```

```tsx good
// good — content drives the height, cell controls one tier down, kit draws dividers and sort icons
// declare: const projects: { id: string; name: string }[]
<DataTable
  columns={[
    { id: "name", header: "Проект", accessor: "name" },
    {
      id: "actions",
      header: "Действия",
      hideHeader: true,
      cell: () => (
        <Button.Root size="s" variant="ghost" tone="neutral">
          Настроить
        </Button.Root>
      ),
    },
  ]}
  rows={projects}
  getRowKey={(row) => row.id}
/>
```

A bar above the table for a single button — the column chooser, an export — wastes a row and splits
the page's actions ([controls of a table](composition.md#controls-of-a-table)):

```tsx partial
// bad — a toolbar that holds one control
<DataTable columns={columns} rows={orders} toolbar={<Button.Root>Колонки</Button.Root>} />
```

A chooser cell in the header of a table that has no row actions is a column of nothing — an empty
cell in every row:

```tsx partial
// bad — columnsMenu with no row-actions column to stand over
<DataTable columns={columns} rows={orders} columnsMenu />
```

```tsx good
// good — no row actions: the chooser stands beside the table's search, on the state the table reads
// declare: const FIELDS: Parameters<typeof SmartFilter.Root>[0]["fields"]
// declare: const orders: { id: string; client: string; total: number }[]
// declare: const hidden: string[]
// declare: const setHidden: (hidden: string[]) => void
<SmartFilter.Root fields={FIELDS}>
  <DataTable
    columns={[
      { id: "id", header: "Заказ", accessor: "id", hideable: false },
      { id: "client", header: "Клиент", accessor: "client" },
      { id: "total", header: "Сумма", accessor: "total", numeric: true },
    ]}
    hiddenColumns={hidden}
    rows={orders}
    getRowKey={(row) => row.id}
    toolbar={
      <>
        <SmartFilter.Toolbar />
        <DataTableColumnsMenu
          columns={[
            { id: "id", header: "Заказ", accessor: "id", hideable: false },
            { id: "client", header: "Клиент", accessor: "client" },
            { id: "total", header: "Сумма", accessor: "total", numeric: true },
          ]}
          hiddenColumns={hidden}
          onHiddenColumnsChange={setHidden}
        />
      </>
    }
    toolbarChips={<SmartFilter.Chips />}
  />
</SmartFilter.Root>
```

## 7b. A top bar out of its groups

The bar lays itself out only from its four groups ([the top bar](composition.md#the-top-bar)); a
bar assembled any other way cannot give way on a narrow panel.

The title as a row of its own under the path:

```tsx partial
// bad — the path, then the title on a second line; the path repeats the title
<Page.Heading>
  <Breadcrumb.Root>
    <Breadcrumb.Item href="/invoices">Счета</Breadcrumb.Item>
    <Breadcrumb.Item current>Счёт № 1042</Breadcrumb.Item>
  </Breadcrumb.Root>
</Page.Heading>
<Typography as="h1" variant="heading-m">Счёт № 1042</Typography>
```

```tsx good
// good — the path ends in the title: the levels above, then Page.Title, on one line
<Page.TopBar>
  <Page.Heading>
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/invoices">Счета</Breadcrumb.Item>
    </Breadcrumb.Root>
    <Page.Title>Счёт № 1042</Page.Title>
    <Page.Description>Отправлен · оплатить до 14 октября</Page.Description>
  </Page.Heading>
</Page.TopBar>
```

Buttons in two places, buttons with only text:

```tsx partial
// bad — export beside the title, the primary among the tools; no icons, so nothing can collapse
<Page.Heading>
  <Page.Title>Заказы</Page.Title>
  <Button.Root variant="soft" tone="neutral">Экспорт</Button.Root>
</Page.Heading>
<Page.Tools aria-label="Заказы">
  <SmartFilter.Toolbar />
  <Button.Root>Новый заказ</Button.Root>
</Page.Tools>
```

```tsx good
// good — every button in one Page.Actions, each with an icon, the primary last
<Page.Actions>
  <Button.Root variant="soft" tone="neutral">
    <Button.Icon>
      <Icon name="action.download" />
    </Button.Icon>
    Экспорт
  </Button.Root>
  <Button.Root>
    <Button.Icon>
      <Icon name="action.add" />
    </Button.Icon>
    Заказ
  </Button.Root>
</Page.Actions>
```

`SmartFilter.Root` inside the bar of a page whose filter narrows several views (a board and its list):

```tsx partial
// bad — the filter's state wraps one group, its chips land outside it
<Page.TopBar>
  <SmartFilter.Root fields={FIELDS}>
    <Page.Tools aria-label="Сделки">
      <SmartFilter.Toolbar />
    </Page.Tools>
  </SmartFilter.Root>
</Page.TopBar>
```

```tsx good
// good — SmartFilter.Root draws nothing and wraps the page; toolbar and chips sit in their groups
// declare: const FIELDS: Parameters<typeof SmartFilter.Root>[0]["fields"]
<SmartFilter.Root fields={FIELDS}>
  <Page.Root>
    <Page.TopBar>
      <Page.Heading>
        <Page.Title>Сделки</Page.Title>
      </Page.Heading>
      <Page.Tools aria-label="Сделки">
        <SmartFilter.Toolbar />
      </Page.Tools>
      <Page.Chips>
        <SmartFilter.Chips />
      </Page.Chips>
    </Page.TopBar>
  </Page.Root>
</SmartFilter.Root>
```

The switch of a section's sub-pages pushed onto a line of its own:

```tsx partial
// bad — the sub-page links in a row of their own under the bar, away from the heading row
<Page.TopBar>
  <Page.Heading>
    <Page.Title>AI</Page.Title>
  </Page.Heading>
</Page.TopBar>
<Page.Body>
  <SegmentedControl.Root value={pathname} aria-label="Подразделы">…</SegmentedControl.Root>
</Page.Body>
```

```tsx good
// good — the links in Page.Tools: the heading row at the end edge, before the page's buttons
// declare: const pathname: string
<Page.TopBar>
  <Page.Heading>
    <Page.Title>AI</Page.Title>
  </Page.Heading>
  <Page.Tools aria-label="AI">
    <SegmentedControl.Root value={pathname} aria-label="Подразделы">
      <SegmentedControl.Item value="/ai/chat" asChild>
        <a href="/ai/chat">Чат</a>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="/ai/lessons" asChild>
        <a href="/ai/lessons">Уроки</a>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="/ai/settings" asChild>
        <a href="/ai/settings">Настройки</a>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  </Page.Tools>
</Page.TopBar>
```

## 7c. A create button out of reach

A pane people pick from creates at its top, under its search
([where the create button goes](composition.md#where-the-create-button-goes)).

```tsx partial
// bad — the create button under the threads: with thirty threads it is off screen
<ChatList.Root
  items={threads}
  getKey={(thread) => thread.id}
  search={query}
  onSearchChange={setQuery}
  renderItem={renderThread}
/>
<Button.Root variant="soft" tone="neutral">Новый чат</Button.Root>
```

```tsx good
// good — search → create → list: the create button is part of the pane, under its search
// declare: const threads: { id: string; title: string }[]
// declare: const query: string
// declare: const setQuery: (query: string) => void
<ChatList.Root
  items={threads}
  getKey={(thread) => thread.id}
  search={query}
  onSearchChange={setQuery}
  labels={{ list: "Треды", search: "Поиск по тредам" }}
  renderItem={(thread) => (
    <ChatList.Item>
      <ChatList.ItemText>{thread.title}</ChatList.ItemText>
    </ChatList.Item>
  )}
>
  <ChatList.Actions>
    <Button.Root fullWidth variant="soft" tone="neutral">
      <Button.Icon>
        <Icon name="action.add" />
      </Button.Icon>
      Чат
    </Button.Root>
  </ChatList.Actions>
</ChatList.Root>
```

## 8. Decoration and filler

- No emoji in UI. No icon next to every label — an icon earns its place when it speeds recognition
  (navigation, file types, status) or is the only content (icon-only button with `aria-label`).
- No subtitle that repeats the title («Настройки — здесь вы можете изменить настройки»).
- No placeholder text in empty states like «Здесь пока ничего нет :(» — say what to do and give the action.
- No gradients, glows, extra shadows, colored section backgrounds. The kit's fill hierarchy is the style.
- One primary (solid accent) button per area. Five solid buttons in a row is noise.

## 8a. Icons from elsewhere, icons that do not move

Kit icons are animated: each glyph plays its gesture when its button, link, tab, menu item or row is
hovered or pressed. A glyph from another source sits dead next to them, and a hand-made hover spin
fights them.

```tsx partial
// bad — a raw lucide glyph, an inline svg, and a hover spin of your own
import { Archive } from "lucide-react";
<Button.Icon><Archive /></Button.Icon>
<svg viewBox="0 0 24 24"><path d="M3 6h18" /></svg>
.button:hover .icon { transform: rotate(90deg); }
```

The semantic name first, then the full animated set; only a glyph neither has goes through
`createIcon`, once at module level ([the order](api-contract.md#icons)):

```tsx
import { Button, Icon } from "prime-ui-kit";
import { ArchiveIcon } from "prime-ui-kit/icons";

export function FleetActions() {
  return (
    <>
      <Button.Root variant="soft" tone="neutral">
        <Button.Icon>
          <Icon name="action.settings" />
        </Button.Icon>
        Настройки
      </Button.Root>
      <Button.Root variant="soft" tone="neutral">
        <Button.Icon>
          <ArchiveIcon />
        </Button.Icon>
        В архив
      </Button.Root>
    </>
  );
}
```

## 9. Hand-made overlays

```tsx partial
// bad
{open && <div className={styles.backdrop}><div className={styles.dialog}>…</div></div>}
<div className={styles.tooltip} hidden={!hover}>Копировать</div>
```

```tsx good
// good — kept mounted, driven by `open`; the tooltip names the icon button
// declare: const open: boolean
// declare: function setOpen(open: boolean): void
<Modal.Root open={open} onOpenChange={setOpen}>
  …
</Modal.Root>
<Tooltip.Root>
  <Tooltip.Trigger>
    <Button.Root variant="ghost" tone="neutral" aria-label="Копировать ссылку">
      <Button.Icon>
        <Icon name="action.copy" />
      </Button.Icon>
    </Button.Root>
  </Tooltip.Trigger>
  <Tooltip.Content>Копировать</Tooltip.Content>
</Tooltip.Root>
```

Kit overlays handle focus trap, Escape, outside click, stacking and motion. A custom one gets all of
these wrong.

## 10. Overriding kit styles

```css
/* bad */
.myForm :global(button) { border-radius: 2px; height: 30px; }
```

Need a different look? Use the component's `variant`/`tone`/`size`. If none fits, the design is off-
system — ask instead of patching.
