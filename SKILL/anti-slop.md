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

// good — one component, one hue per meaning everywhere
<Badge.Root color="green">Оплачен</Badge.Root>
<Badge.Root color="orange">Ожидает</Badge.Root>
```

Map statuses to colors once (`const STATUS_COLOR: Record<Status, PaletteColor>`) and reuse it.

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

Text color goes through `Typography tone="secondary"`, not CSS.

## 3. Borders instead of fill; card in a card

```css
/* bad */
.panel { border: 1px solid var(--prime-color-border-default); background: transparent; }
```

```tsx partial
// bad — a card around a card around a table
<Card.Root><Card.Root><DataTable columns={columns} rows={rows} /></Card.Root></Card.Root>

// good — DataTable already is a filled block; a section heading is enough
<Typography as="h2" variant="title-m">Последние оплаты</Typography>
<DataTable columns={columns} rows={rows} />
```

## 4. Mixed control sizes in one row

```tsx partial
// bad
<Input.Root size="s">…</Input.Root>
<Button.Root>Найти</Button.Root>

// good
<Input.Root size="s">…</Input.Root>
<Button.Root size="s">Найти</Button.Root>
```

## 5. Placeholder instead of label

```tsx partial
// bad
<Input.Root>
  <Input.Wrapper>
    <Input.Field placeholder="Email" />
  </Input.Wrapper>
</Input.Root>

// good
<Input.Root label="Email">
  <Input.Wrapper>
    <Input.Field placeholder="name@company.ru" />
  </Input.Wrapper>
</Input.Root>
```

A search field in a toolbar may go without a visible label, but then it needs `aria-label`.

## 6. Everything on one level of air

```css
/* bad — 16 between fields, groups and sections alike */
.page, .form, .group { display: grid; gap: var(--prime-space-4); }

/* good — proximity scale */
.form { display: grid; gap: var(--prime-space-8); }   /* group → group 32 */
.group { display: grid; gap: var(--prime-space-5); }  /* field → field 20 */
/* section → section 40 comes from PageContent.Body */
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
| a list of `<button>`s for navigation | `Sidebar.Item href`, `Tabs.Item` |
| `<Button.Root onClick={() => location.assign(url)}>` | `<Button.Root asChild><a href={url}>…</a></Button.Root>` or `LinkButton` |
| a hand-built spinner, shimmer, grey placeholder box or «Loading…» text | `loading` on Button / Select / DataTable; a region: `Skeleton` of its content inside `Crossfade`; no shape to hold: `Spinner` |
| `{loading ? <Spinner /> : <List />}` — a state that flips | `<Crossfade state={status}>` around the region, `Skeleton` while loading |
| a search Input + a row of filter Selects above a table | `SmartFilter` in the DataTable `toolbar` |

## 7a. Fighting the table

```css
/* bad — fixed rows squash two-line cells; restyled sort icons and dividers */
.table :global(td) { height: 44px; padding: 0; }
.table :global(th) svg { color: var(--prime-color-accent-default); }
```

```tsx partial
// good — content drives the height, cell controls one tier down, kit draws dividers and sort icons
<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
// in a column cell: <Button.Root size="s" variant="ghost" tone="neutral">Настроить</Button.Root>
```

## 8. Decoration and filler

- No emoji in UI. No icon next to every label — an icon earns its place when it speeds recognition
  (navigation, file types, status) or is the only content (icon-only button with `aria-label`).
- No subtitle that repeats the title («Настройки — здесь вы можете изменить настройки»).
- No placeholder text in empty states like «Здесь пока ничего нет :(» — say what to do and give the action.
- No gradients, glows, extra shadows, colored section backgrounds. The kit's fill hierarchy is the style.
- One primary (solid accent) button per area. Five solid buttons in a row is noise.

## 9. Hand-made overlays

```tsx partial
// bad
{open && <div className={styles.backdrop}><div className={styles.dialog}>…</div></div>}
<div className={styles.tooltip} hidden={!hover}>Копировать</div>

// good
<Modal.Root open={open} onOpenChange={setOpen}>…</Modal.Root>
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
