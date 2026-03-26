# Accordion

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A compound disclosure pattern: each item has a header trigger and expandable body content, with optional height animation. Use it to stack optional sections (FAQ, settings groups, legal blocks) without leaving the page.

**When to use**

- Long pages where users open only the sections they need: FAQs, delivery and return copy, grouped settings, order or project detail blocks, knowledge-base articles, sidebars and narrow columns.
- One-at-a-time expansion (`type="single"`) or several open panels (`type="multiple"`) when comparing sections side by side.
- Visual density control via `layout="grouped"` (single frame) vs `layout="separate"` (card-like items).

**When not to use**

- Switching one shared panel with a horizontal tab list — prefer [Tabs](../tabs/COMPONENT.md).
- When every section must stay visible without extra interaction.
- Deep hierarchical navigation — prefer a flat list, tree, or separate routes instead of nested accordions.
- Very heavy bodies inside animated panels (large lists, charts) if `ResizeObserver`-driven height updates become costly.

## Composition

- **`Accordion.Root`** wraps all items and supplies `size`, `type`, `layout`, and open-state (`value` / `defaultValue` / `onValueChange`).
- Per item the order is: **`Accordion.Item`** (required `value`) → **`Accordion.Header`** → **`Accordion.Trigger`** (native `button`) as a **direct** child of the header → **`Accordion.Content`** as a **sibling** of the header (same item), not nested inside the trigger.
- Put label text, optional **`Accordion.Icon`**, and optional **`Accordion.Arrow`** inside the trigger as needed.
- **`Accordion.Content`** renders an outer **`section`** (ARIA region) and an inner padded block; `className` applies to the inner block; `style` is merged onto the outer node with the animation height variable.

### Canonical example

```tsx
import { Accordion, LinkButton, Typography } from "prime-ui-kit";
import { Package, ShieldCheck, Truck } from "lucide-react";

export function Example() {
  return (
    <Accordion.Root type="single" size="m" layout="grouped" defaultValue="delivery" collapsible>
      <Accordion.Item value="delivery">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Truck} />
            <span>Delivery &amp; tracking</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" tone="muted">
            Orders ship within one business day. Tracking links are sent by email when the carrier
            scans the package.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={Package} />
            <span>Returns</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" tone="muted">
            Unopened items in original packaging are returnable within 30 days. Opened goods may
            qualify for store credit—see the policy for exceptions.
          </Typography.Root>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="compliance">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={ShieldCheck} />
            <span>Compliance</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Typography.Root as="p" variant="body-default" tone="muted">
            We process card data in line with PCI DSS. For regional privacy questions, read the
            notices linked below.
          </Typography.Root>
          <LinkButton.Root href="#" size="s">
            Privacy &amp; data processing
          </LinkButton.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### Extended examples

- [`./examples/01-faq-marketing.tsx`](./examples/01-faq-marketing.tsx) — Marketing FAQ: single panel, grouped layout, icons and chevron on each trigger.
- [`./examples/02-settings-panels.tsx`](./examples/02-settings-panels.tsx) — Account settings: `type="multiple"` and `layout="separate"` so several sections stay open as cards.
- [`./examples/03-checkout-order-summary.tsx`](./examples/03-checkout-order-summary.tsx) — Checkout: custom `Accordion.Arrow` icons plus policy links in the panel body.
- [`./examples/04-api-docs-sections.tsx`](./examples/04-api-docs-sections.tsx) — API docs: controlled `value` / `onValueChange` for syncing open section with routing or in-page navigation.
- [`./examples/05-knowledge-base-categories.tsx`](./examples/05-knowledge-base-categories.tsx) — Support hub: `collapsible={false}` and a disabled item for plan-gated content.

**LLM note:** Prefer reading the runnable files under `./examples/*.tsx` for full scenarios, prop combinations, and composition patterns; this page keeps the contract (rules + API tables) authoritative.

## Rules

- Use **`type="single"`** for at most one open item, **`type="multiple"`** for any subset open; `defaultValue` is a string or string array matching the type.
- **Controlled:** pass **`value`** (`string` or `string[]`); updates go through **`onValueChange`**. In `single`, the callback receives a string; closing the open item yields **`""`**. In `multiple`, the callback receives the open id array.
- **Uncontrolled:** omit `value` and optionally set **`defaultValue`**.
- **`collapsible`** applies only to **`type="single"`**; set **`collapsible={false}`** to keep at least one item open once opened (cannot collapse to none).
- **`disabled`** on **`Accordion.Item`** disables the trigger and blocks toggling for that item.
- **`Accordion.Trigger`:** custom **`onClick`** runs first; call **`preventDefault()`** on the event if you need to cancel the built-in toggle. Prefer **`type="button"`** (default) inside forms.
- **`Accordion.Arrow`** icons use **`aria-hidden`**; the accessible name must come from trigger text (or an explicit label pattern you add).
- Keyboard: trigger is a button — **Enter** / **Space** activate; focus ring follows **`focus-visible`** from the theme.
- **`data-state`** is **`open` | `closed`** on item, trigger, and content wrapper; **`data-disabled`** when the item is disabled.
- **`AccordionContentProps`** is typed from **`HTMLDivElement`** attributes even though the outer DOM node is **`section`** — target the real **`section`** in tests and CSS when needed.

## API

### Accordion.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"single" \| "multiple"` | `"single"` | No | One open item vs many. |
| value | `string \| string[]` | — | No | Controlled open value(s). |
| defaultValue | `string \| string[]` | — | No | Initial open value(s) when uncontrolled. |
| onValueChange | `(value: string \| string[]) => void` | — | No | `single`: string (empty string if none open). `multiple`: string array. |
| collapsible | `boolean` | `true` | No | `single` only: if `false`, the open item cannot be closed to leave none open. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Trigger, icons, and content spacing. |
| layout | `"grouped" \| "separate"` | `"grouped"` | No | Shared frame vs card-like items. |
| className | `string` | — | No | Root wrapper class. |
| children | `React.ReactNode` | — | No | `Accordion.Item` nodes. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Passed to the root `div`. |

### Accordion.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Unique id among siblings under one root. |
| disabled | `boolean` | `false` | No | Item cannot open; trigger disabled. |
| className | `string` | — | No | Item wrapper class. |
| children | `React.ReactNode` | — | No | Header + content. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Passed to the item `div`. |

### Accordion.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Header class. |
| children | `React.ReactNode` | — | No | Typically one `Accordion.Trigger`. |
| …rest | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Rendered as `h3`. |

### Accordion.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Prefer `button` in forms. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | No | Label and optional icon/arrow slots. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | `onClick` invoked before internal toggle. |

### Accordion.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `"div"` | No | Polymorphic element for the icon wrapper. |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Icon content when using a text-only element. |
| …rest | Depends on `as` | — | No | Props for the chosen element (except `as` / `className`). |

### Accordion.Arrow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| openIcon | `React.ElementType` | `ChevronDown` | No | Default chevron rotates when closed vs open; or paired with `closeIcon`. |
| closeIcon | `React.ElementType` | — | No | If set and differs from `openIcon`, shows two icons without rotation. |
| className | `string` | — | No | `span` wrapper class. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Icons are `aria-hidden`. |

### Accordion.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the inner padded block. |
| style | `React.CSSProperties` | — | No | Merged on the outer `section` with the animated height CSS variable. |
| children | `React.ReactNode` | — | No | Panel body. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Spread on the outer `section`; `aria-labelledby` / `aria-hidden` come from context. |

## Related

- [Typography](../typography/COMPONENT.md) — body copy inside `Accordion.Content`.
- [Button](../button/COMPONENT.md) — external actions coordinated with controlled `value` on the root.
- [Tabs](../tabs/COMPONENT.md) — alternative when one panel switches without a vertical stack of headers.
- [Modal](../modal/COMPONENT.md) and [Drawer](../drawer/COMPONENT.md) — often host accordions in limited vertical space.
