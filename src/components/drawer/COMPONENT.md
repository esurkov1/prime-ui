# Drawer

**Category:** overlays (Оверлеи)

> A modal side panel that slides in from the edge: filters, forms and record details.

## When to use
- Editing settings or a record without leaving the page.
- Filters or navigation on narrow screens (`side="left"`).
- Read-only details of a list row (order, user, event).
- Long content (history, logs) that needs a tall scrolling area.

## When not to use
- Confirmations and short decisions → use [Modal](../modal/COMPONENT.md).
- A small panel anchored to a button, without blocking the page → use [Popover](../popover/COMPONENT.md).
- Persistent app navigation → use [Sidebar](../../layout/sidebar/COMPONENT.md).
- Collapsible content inside the page → use [Accordion](../accordion/COMPONENT.md).

## Import
```tsx
import { Drawer } from "prime-ui-kit";
```

## Anatomy
```
Drawer.Root                    state and dismiss policy (no DOM)
├── Drawer.Trigger             clones its child; opens on click
└── Drawer.Content             portal + scrim + role="dialog" panel at the edge
    ├── Drawer.Header          grid: [Icon] [Title + Description] [close button]
    │   ├── Drawer.Icon
    │   ├── Drawer.Title       <h2>
    │   └── Drawer.Description <p>
    ├── Drawer.Body            the only scrolling zone
    └── Drawer.Footer          actions, primary last
        └── Drawer.Close       clones its child; closes on click
```

## API

### Drawer.Root
No DOM, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on trigger, close button, Close, Escape and scrim click. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the drawer. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the drawer. |
| `labels` | `Partial<DrawerLabels>` | `{ close: "Закрыть" }` | Built-in strings. |
| `children` | `ReactNode` | — | Trigger and Content. |

### Drawer.Trigger
No DOM: clones the single child and chains `onClick`; opens unless the child's handler calls `preventDefault()`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

### Drawer.Content
No ref. Renders in a portal (`document.body`) while open and during its exit animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"left" \| "right"` | `"right"` | Edge the panel slides from. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | Width: 360 · 480 · 640 · 800. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `aria-label` | `string` | — | Dialog name when there is no Title. |
| `aria-labelledby` | `string` | — | Overrides the Title id. |
| `aria-describedby` | `string` | — | Overrides the Description id. |
| `className` | `string` | — | Class on the panel. |

+ native `<div>` props (on the panel).

### Drawer.Header · Icon · Title · Description · Body · Footer · Close
The same parts as Modal ([Modal API](../modal/COMPONENT.md#api)):

| Part | Props |
|---|---|
| `Drawer.Header` | `showClose?: boolean` (default `true`) + native `<header>` props |
| `Drawer.Icon` | `tone?: "neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` (default `"neutral"`), `children` (required), `className` |
| `Drawer.Title` / `Drawer.Description` | native `<h2>` / `<p>` props except `id` |
| `Drawer.Body` | native `<div>` props; a ScrollContainer |
| `Drawer.Footer` | `layout?: "fill" \| "end"` (default `"end"`) + native `<footer>` props |
| `Drawer.Close` | `children: ReactElement` (required) |

Drawer has no `Confirm` part and no Enter-confirm.

### DrawerLabels
| Key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть"` | `aria-label` of the header close button |

## Variants
The panel: `bg-raised`, `shadow-modal`, `--prime-modal-radius` only on the edge facing the page, full height, on a `bg-scrim`.

### side (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `right` | Slides from the right, rounded on its left edge | Details and forms | yes |
| `left` | Slides from the left, rounded on its right edge | Filters, mobile navigation | |

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `s` | 360 wide | Details, short help | |
| `m` | 480 wide | Settings forms | yes |
| `l` | 640 wide | Wide forms | |
| `xl` | 800 wide | Tables, previews | |

Below 640px of viewport every size is full width with square corners.

### layout (Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | Auto-width buttons at the end, gap 8 | Most drawers | yes |
| `fill` | Equal-width buttons in one row, gap 12 | One full-width action («Понятно») | |

### tone (Icon)
Same values as Modal.Icon: `neutral` (default) · `accent` · `success` · `warning` · `danger` · `info` — soft tile fill and icon color of the tone.

### Structure flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `showClose` | Close button in the header | Default | `true` |
| no Footer | No bottom zone | Read-only details | |

**Combinations** — forms: Footer with outline neutral «Отмена» in `Drawer.Close` and a solid primary with `loading`. Read-only details: no Footer, header close only.

**Hierarchy** — one primary action, last in the footer.

## States
- Closed / open: `open` / `defaultOpen` / `onOpenChange`. `data-state` on the scrim and the panel, `data-side`, `data-size` on the panel, `data-nested-in-modal="true"` when opened from a Modal (it then stacks above the Modal).
- While open: focus is trapped inside, page scroll is locked, siblings of the portal are `inert`.
- Header `data-has-description`, Footer `data-layout`, Icon `data-tone` as in Modal.

## Layout & spacing
- Zone padding `--prime-drawer-padding` (24); header 24 / 20, body 20 with a 16 gap, footer 20 / 24; hairlines between zones.
- Full viewport height; only the body scrolls.
- Fields inside get the surface field fill; cards inside become sunken tiles; group fields 20 apart.

## Accessibility
- `role="dialog"`, `aria-modal="true"`, named by Title (or `aria-label`), described by Description.
- Focus moves into the panel on open and returns to the opener on close, including after a scrim click.
- Escape closes (`closeOnEscape`); only the topmost layer reacts.
- `labels.close` — `"Закрыть"`: `aria-label` of the header close button.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `size` s · m · l · xl | Choosing the width |
| [composition.tsx](examples/composition.tsx) | Settings form with Select, SegmentedControl, Switches and a loading Save | Editing settings |
| [variants-sides.tsx](examples/variants-sides.tsx) | `side` left · right | Filters vs details |
| [states.tsx](examples/states.tsx) | Read-only details without Footer, success icon | Record details |
| [features.tsx](examples/features.tsx) | Long scrolling body between fixed header and footer | Histories, logs |
| [controlled.tsx](examples/controlled.tsx) | `open` from a LinkButton, custom `labels.close`, `layout="fill"` | Opening from any element |

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function Example() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Детали
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header>
          <Drawer.Title>Заказ № 1042</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>Собирается на складе.</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
```

## Mistakes
- A delete confirmation in a Drawer → use Modal.
- Expecting Enter to submit via `Drawer.Confirm` → Drawer has no Confirm; use a form `onSubmit` or the button.
- `side="top"` / `"bottom"` → only `left` and `right`.
- Padding on a wrapper inside Body → Body already pads and scrolls.

## Related
[Modal](../modal/COMPONENT.md) · [Sidebar](../../layout/sidebar/COMPONENT.md) · [Popover](../popover/COMPONENT.md)
