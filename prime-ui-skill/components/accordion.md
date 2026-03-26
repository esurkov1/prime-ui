# Accordion

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A set of nested parts (`Root`, `Item`, `Header`, `Trigger`, `Content`, plus `Icon` and `Arrow` slots) that shows a list of sections: clicking the trigger expands the associated content with a height animation.

## What it’s for

- **Marketing and landing pages** — FAQ-style blocks without a separate page per item: compact on mobile, without overwhelming the scroll with long text.
- **Product settings and account areas** — groups of options (notifications, security, billing) in one column, so you don’t need deep navigation for every subsection.
- **Catalogs and orders** — composition, delivery, and terms inside an order card: the buyer expands only the sections they care about.
- **Knowledge bases and internal portals** — articles with nested instructions: editors keep a consistent expand/collapse style and text size.
- **Admin and roles** — some items are unavailable (`disabled` on `Item`), the rest stay in the same list without a separate “placeholder” screen.
- **Side panels and narrow columns** — the root can stretch to the sidebar width; `layout="separate"` visually separates heavier blocks.

## Use cases

Import from the `prime-ui-kit` package. Each snippet is a different screen and meaning, not just different props.

### Basic

E‑commerce delivery page: three typical questions, one open by default, “only one open” mode.

```tsx
import { Accordion } from "prime-ui-kit";

export function DeliveryFaqBlock() {
  return (
    <Accordion.Root type="single" size="m" defaultValue="time" layout="grouped">
      <Accordion.Item value="time">
        <Accordion.Header>
          <Accordion.Trigger>
            City delivery times
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>The courier delivers the same day or the next business day by 10:00 PM.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pickup">
        <Accordion.Header>
          <Accordion.Trigger>
            Pickup points
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Choose a location on the map at checkout; order storage — up to 5 days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="return">
        <Accordion.Header>
          <Accordion.Trigger>
            Hassle-free returns
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>14 days to return goods in proper condition with packaging intact.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### Variants / sizes

Reference showcase for clinicians: larger size for touch panels in the clinic, separate “cards” per specialization section.

```tsx
import { Accordion } from "prime-ui-kit";

export function ClinicReferenceAccordion() {
  return (
    <Accordion.Root type="single" size="xl" layout="separate" defaultValue="cardio">
      <Accordion.Item value="cardio">
        <Accordion.Header>
          <Accordion.Trigger>
            Cardiology — quick prescribing
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Prescription templates and follow-up visits after hospital discharge.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="ped">
        <Accordion.Header>
          <Accordion.Trigger>
            Pediatrics — vaccination
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Immunization calendar and reminders for parents in the account area.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### In context (form / modal / sidebar / …)

Nested block on a project card: several legal and financial sections open at once for contract review.

```tsx
import { Accordion } from "prime-ui-kit";

export function ProjectLegalAccordion() {
  return (
    <section style={{ maxWidth: 560, padding: 16, borderRadius: 12, border: "1px solid var(--prime-sys-color-border-subtle, #e4e4e7)" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Project “Northern warehouse”</h2>
      <Accordion.Root type="multiple" size="m" defaultValue={["scope", "budget"]} layout="grouped">
        <Accordion.Item value="scope">
          <Accordion.Header>
            <Accordion.Trigger>
              Scope of work
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Equipment supply, line installation, commissioning — 90 calendar days.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="budget">
          <Accordion.Header>
            <Accordion.Trigger>
              Budget and payment milestones
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>40% advance, 40% after installation, 20% after acceptance per act.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="risk">
          <Accordion.Header>
            <Accordion.Trigger>
              Penalties and liability
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Delivery delay — 0.1% per day, capped at 10% of the contract.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  );
}
```

### Controlled mode

Dispatcher panel: scenario buttons reset or switch the open track area without clicking the header.

```tsx
import * as React from "react";
import { Accordion, Button } from "prime-ui-kit";

export function DispatchControlledAccordion() {
  const [panel, setPanel] = React.useState<string>("fleet");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("fleet")}>
          Fleet
        </Button.Root>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("routes")}>
          Routes
        </Button.Root>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setPanel("")}>
          Collapse all
        </Button.Root>
      </div>
      <Accordion.Root type="single" size="m" value={panel} onValueChange={(v) => typeof v === "string" && setPanel(v)}>
        <Accordion.Item value="fleet">
          <Accordion.Header>
            <Accordion.Trigger>
              Vehicle status
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>12 on route, 3 in maintenance, 1 in reserve.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="routes">
          <Accordion.Header>
            <Accordion.Trigger>
              Route delays
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>North: +18 min due to bridge repair; south: on schedule.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
```

## Anatomy

`Accordion.Root` — container with context for size and open `value` state.

For each item:

`Accordion.Item` → `Accordion.Header` → `Accordion.Trigger` (button; often `Accordion.Icon`, text, `Accordion.Arrow` inside) → sibling in the tree `Accordion.Content` (outer DOM node is `section`, inner block with padding for text).

## API

### Accordion.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| type | `"single" \| "multiple"` | `"single"` | No | One open item or several. |
| value | `string \| string[]` | — | No | Controlled state: string or array of open item ids. |
| defaultValue | `string \| string[]` | — | No | Initial expansion without `value`. |
| onValueChange | `(value: string \| string[]) => void` | — | No | In `single` the callback receives a string; in `multiple` — an array. |
| collapsible | `boolean` | `true` | No | `single` only: `false` prevents closing the only open item. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Tokens for text, icons, and spacing. |
| layout | `"grouped" \| "separate"` | `"grouped"` | No | Shared frame or separate cards. |
| className | `string` | — | No | Class on the root `div`. |
| children | `React.ReactNode` | — | No | Set of `Accordion.Item`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other root attributes. |

### Accordion.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | `string` | — | Yes | Unique id within one Root. |
| disabled | `boolean` | `false` | No | Item does not expand; trigger is disabled. |
| className | `string` | — | No | Class on the item wrapper. |
| children | `React.ReactNode` | — | No | Header and content. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the item `div`. |

### Accordion.Header

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class on the header. |
| children | `React.ReactNode` | — | No | Usually one `Accordion.Trigger`. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Rendered as `h3`. |

### Accordion.Trigger

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Prefer `button` so forms are not submitted accidentally. |
| className | `string` | — | No | Class on the button. |
| children | `React.ReactNode` | — | No | Label, icons, arrow. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | `onClick` runs first; `preventDefault` cancels toggling. |

### Accordion.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `React.ElementType` | `"div"` | No | Polymorphic wrapper (e.g. icon component or `span`). |
| className | `string` | — | No | Class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when `as="span"` or similar. |
| …rest | Depends on `as` | — | No | Props for the chosen element, except `as` and `className`. |

### Accordion.Arrow

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| openIcon | `React.ElementType` | `ChevronDown` | No | “Closed” icon, or the only one if rotation is used. |
| closeIcon | `React.ElementType` | — | No | If set and differs from `openIcon` — two icons without rotation. |
| className | `string` | — | No | Class on the `span` wrapper. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Icons marked with `aria-hidden`. |

### Accordion.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class on the **inner** block with padding and typography. |
| style | `React.CSSProperties` | — | No | Merged with the outer node style (incl. animation height variable). |
| children | `React.ReactNode` | — | No | Text and nested markup. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Applied to the outer node (`section` in DOM); `aria-labelledby` and `aria-hidden` come from context. |

## Variants

There is no separate `variant` prop; visual differences come from:

- **`layout`**: `grouped` — single border and shared background; `separate` — each `Item` as a card with gap.
- **`size`**: discrete steps `s`–`xl` for trigger text, icons, and content padding.
- **`type`**: does not change palette, but changes behavior: in `multiple` several open `value`s are allowed and `defaultValue` can be an array.

## States

- **Open / closed** — stored on the root; `Item`, `Trigger`, and the content wrapper get `data-state="open" | "closed"`.
- **Disabled item** — `disabled` on `Item`: `data-disabled`, trigger `disabled`, clicks ignored.
- **Uncontrolled** — only `defaultValue` / internal state.
- **Controlled** — `value` is passed; updates via `onValueChange`.
- **`collapsible={false}`** in `single` — the list cannot be fully collapsed after the first open.

## Accessibility (a11y)

- Trigger is a native button: keyboard activation with Enter/Space.
- The button has `aria-expanded` and `aria-controls`; the content region has `aria-labelledby` and `aria-hidden` depending on open state.
- Icons in `Accordion.Arrow` are hidden from assistive tech via `aria-hidden`; meaning should be in trigger text or a separate label.
- Visible focus on the trigger uses `:focus-visible` from the kit theme.

## Limitations and notes

- This is not tabs: it does not drive “tab” panels with a shared panel area without repeating headers — for switching without a vertical list of headers, see `Tabs`.
- Animation height uses `ResizeObserver` and content measurement; heavy inner content (large lists, charts) can affect performance when size changes often.
- The exported type `AccordionContentProps` is based on `HTMLAttributes<HTMLDivElement>` even though the outer markup node is `section`; for selectors and tests, rely on the actual DOM.
- A nested accordion inside content is possible in markup, but keyboard navigation and readability suffer — for deep hierarchy prefer a flat list or a tree.

## Related components

- **Typography** — consistent spacing and type scale inside `Accordion.Content`.
- **Button** — external actions synchronized with the controlled `value` on the root.
- **Tabs** — alternative when you need to switch panels without a repeating vertical list of headers.
- **Modal / Drawer** — often host a compact accordion for long forms in limited height.
