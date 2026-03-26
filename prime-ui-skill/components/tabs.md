# Tabs

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compound set for tabs: a list of switches, content panels, and slots for icon and label, with one active tab at a time.

## What it’s for

- **Account and settings:** split profile, security, notifications, and billing without separate URLs.
- **Analytics and reports:** switch Overview, Trends, and Raw data on one dashboard screen.
- **Catalog and storefront:** Description, Specifications, and Reviews tabs on a product card.
- **Editors and documents:** a side column with vertical tabs for Structure, Properties, and History.
- **Onboarding and wizards:** controlled `value` from the wizard step so the step title and tab list stay in sync.
- **Marketing landings:** horizontal full-width tabs for audience segments or pricing tiers.

## Use cases

Each example is a separate task and markup; shared import: `import { Tabs } from "prime-ui-kit"` (or from `@/components/tabs/Tabs` in a monorepo).

### Basic

Horizontal tabs by default: the user picks a section; one panel shows below the list.

```tsx
export function ProductTabs() {
  return (
    <Tabs.Root defaultValue="desc">
      <Tabs.List>
        <Tabs.Tab value="desc">
          <Tabs.Label>Description</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="spec">
          <Tabs.Label>Specifications</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="reviews">
          <Tabs.Label>Reviews</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="desc">
        <p>Product description text.</p>
      </Tabs.Panel>
      <Tabs.Panel value="spec">
        <ul>
          <li>Weight: 420 g</li>
          <li>Material: aluminum</li>
        </ul>
      </Tabs.Panel>
      <Tabs.Panel value="reviews">
        <p>Customer reviews.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
```

### Variants / sizes

Tabs has no visual `variant`; density and type size are controlled by the `size` axis — e.g. compact tabs in a dense report table.

```tsx
export function ReportToolbarTabs() {
  return (
    <Tabs.Root defaultValue="day" size="s">
      <Tabs.List>
        <Tabs.Tab value="day">
          <Tabs.Label>Day</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="week">
          <Tabs.Label>Week</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="month">
          <Tabs.Label>Month</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="day">Snapshot for today.</Tabs.Panel>
      <Tabs.Panel value="week">Snapshot for 7 days.</Tabs.Panel>
      <Tabs.Panel value="month">Snapshot for 30 days.</Tabs.Panel>
    </Tabs.Root>
  );
}
```

### In context (form / modal / sidebar)

A vertical list to the left of the content area — a typical settings shell in a page sidebar (not a modal, a persistent column).

```tsx
export function SettingsColumn() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="profile">
          <Tabs.Label>Profile</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="team">
          <Tabs.Label>Team</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="api" disabled>
          <Tabs.Label>API (coming soon)</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <p>Name, avatar, contacts.</p>
      </Tabs.Panel>
      <Tabs.Panel value="team">
        <p>Member list and roles.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
```

### Controlled mode

External state: easy to tie to a search param, store, or flow step without duplicating the source of truth inside Tabs.

```tsx
import * as React from "react";

export function WizardStepTabs() {
  const [step, setStep] = React.useState<"basics" | "delivery" | "pay">("basics");

  return (
    <>
      <Tabs.Root value={step} onValueChange={(v) => setStep(v as typeof step)}>
        <Tabs.List>
          <Tabs.Tab value="basics">
            <Tabs.Label>Basics</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="delivery">
            <Tabs.Label>Delivery</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="pay">
            <Tabs.Label>Payment</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basics">Step 1: contact details.</Tabs.Panel>
        <Tabs.Panel value="delivery">Step 2: address and slot.</Tabs.Panel>
        <Tabs.Panel value="pay">Step 3: payment method.</Tabs.Panel>
      </Tabs.Root>
      <p>Current step in parent: {step}</p>
    </>
  );
}
```

## Anatomy

```
Tabs.Root
├── Tabs.List          (role="tablist", indicator, keyboard handling)
│   ├── Tabs.Tab[]     (role="tab", button)
│   │   ├── Tabs.Icon? (optional, aria-hidden)
│   │   └── Tabs.Label? / arbitrary nodes
│   └── (internal indicator)
└── Tabs.Panel[]       (role="tabpanel", render only for active value)
```

## API

### Tabs.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | No | Active tab (controlled mode). |
| defaultValue | string | "" | No | Initial value without `value`. |
| onValueChange | (value: string) => void | — | No | Tab change. |
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | No | List axis and arrow keys. |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | No | Trigger size and panel typography. |
| children | React.ReactNode | — | Yes | List, Tab, Panel. |
| className | string | — | No | Root wrapper class. |

### Tabs.List

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | `Tabs.Tab` triggers. |
| className | string | — | No | Tablist container class. |

### Tabs.Tab

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | Yes | Pairs with `Tabs.Panel` of the same `value`. |
| disabled | boolean | false | No | Not selectable; skipped in focus cycle. |
| children | React.ReactNode | — | Yes | Button content. |
| className | string | — | No | Button class. |

### Tabs.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | Icon. |
| className | string | — | No | Span class. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes. |

### Tabs.Label

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | Label text. |
| className | string | — | No | Span class. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes. |

### Tabs.Panel

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | Yes | Matches the active tab. |
| children | React.ReactNode | — | Yes | Panel content. |
| className | string | — | No | Panel class. |

## Variants

There is no separate `variant` prop. Appearance is determined by:

- **`size`** — four steps of control tokens (trigger height, type size, spacing, icon).
- **`orientation`** — horizontal strip with indicator below, or vertical with indicator on the right.

Extra styling uses `className` on the root, list, and individual tabs.

## States

- **Active tab** — `aria-selected`; indicator follows trigger geometry.
- **Inactive** — `tabIndex={-1}` on buttons; Tab focus lands on the active tab.
- **`disabled` on `Tabs.Tab`** — native `disabled`, `data-disabled`, excluded from arrow traversal.
- **Uncontrolled** — set `defaultValue` on `Tabs.Root`.
- **Controlled** — `value` + `onValueChange`; without `value`, internal state from `useControllableState`.

## Accessibility (a11y)

- Roles `tablist`, `tab`, `tabpanel` and `aria-controls` / `aria-labelledby` wiring.
- **`aria-orientation`** on the list matches the `orientation` prop.
- Keyboard when focus is inside `Tabs.List`: **arrows** along the axis (horizontal — left/right, vertical — up/down), **Home** — first enabled tab, **End** — last; disabled tabs are skipped.
- The first icon in the active tab is visually emphasized; tab meaning should be clear from text in `Tabs.Label` or an explicit label if the icon stands alone.

## Limitations and notes

- Only one panel is visible at a time; **inactive `Tabs.Panel` nodes are not rendered** (`return null`) — avoid mounting heavy content in hidden panels without app-level lazy loading.
- No built-in **URL sync** or **asChild**: a tab is always `<button type="button">`.
- Each `value` with a panel needs a Tab + Panel pair; a panel without a tab breaks the expected ARIA model.
- Full-width stretching is done with **CSS/className** on the root and flex layout on tabs; there is no dedicated prop.

## Related components

- **Icon** — glyphs inside `Tabs.Icon`.
- **Typography** — text inside panels inherits type size from root `size` (with caveats for links and code in panel markup).
- **SegmentedControl** — alternative for a short 2–4 option choice without heavy panels.
- **Breadcrumb** — hierarchy navigation across pages, not section switching within one page.
