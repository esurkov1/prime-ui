# Banner

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite announcement strip: a root grid with a central text block and an optional close button; inside — slots for an icon, title, description, and a row of actions.

## What it’s for

- **Logistics and order status** — one prominent row above tracking: delivery delayed, order picked, or awaiting payment, with a “Learn more” action without opening a modal.
- **Approvals and internal panels** — warning about a document approval deadline or a blocked stage, with `warning` or `error` semantics and the ability to hide the strip after reading.
- **Onboarding and releases** — short message about a new feature (`feature`) or UI change, with a lighter background variant and a link in the actions.
- **Forms and checkout** — unobtrusive hint before submit (policy, shipping, regional limits) with `stroke` or `lighter`, not competing with inputs.
- **Technical incidents** — global strip about an API outage or maintenance (`information` / `error`), full width of the content area and explicit dismiss for repeat visits.

## Use cases

Each example is a different screen type and prop set; import from the `prime-ui-kit` package.

### Basic

Profile settings page: neutral reminder to save changes before leaving, without actions and without dismiss.

```tsx
import { User } from "lucide-react";
import { Banner } from "prime-ui-kit";

export function ProfileSettingsHint() {
  return (
    <Banner.Root status="information" variant="lighter" size="m">
      <Banner.Content>
        <Banner.Icon as={User} aria-hidden />
        <Banner.Title>Draft not saved</Banner.Title>
        <Banner.Description>Unsaved fields will be lost if you switch to another tab.</Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
```

### Variants / sizes

Pricing page: the same promo copy in four sizes to align with the plan card grid.

```tsx
import { Sparkles } from "lucide-react";
import { Banner } from "prime-ui-kit";

export function PricingPromoStripes() {
  return (
    <div className="previewBannerColumn">
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <Banner.Root key={size} status="feature" variant="light" size={size}>
          <Banner.Content>
            <Banner.Icon as={Sparkles} aria-hidden />
            <Banner.Title>40% off your first month</Banner.Title>
            <Banner.Description>Valid for new workspaces until the end of the quarter.</Banner.Description>
          </Banner.Content>
        </Banner.Root>
      ))}
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Table import modal: parse error at the top of the dialog, with “Download template” and dismissing the strip after fixing.

```tsx
import { AlertCircle } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";

export function ImportModalErrorBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Banner.Root status="error" variant="filled" size="m" onDismiss={onDismiss}>
      <Banner.Content>
        <Banner.Icon as={AlertCircle} aria-hidden />
        <Banner.Title>Could not read the file</Banner.Title>
        <Banner.Description>Check UTF-8 encoding and that columns “Code” and “Quantity” are present.</Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="neutral" mode="ghost">
            Download template
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
```

### Controlled mode

Monitoring dashboard: strip about degraded metric accuracy only until the operator clicks “Got it”; visibility is held in the parent.

```tsx
import * as React from "react";
import { Activity } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";

export function MetricsDegradedBanner() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) {
    return (
      <Button.Root size="s" type="button" variant="neutral" onClick={() => setVisible(true)}>
        Show metrics notice
      </Button.Root>
    );
  }

  return (
    <Banner.Root status="warning" variant="stroke" size="m">
      <Banner.Content>
        <Banner.Icon as={Activity} aria-hidden />
        <Banner.Title>Aggregation delay 5–10 minutes</Banner.Title>
        <Banner.Description>Data for the latest interval may still be loading; alerts operate normally.</Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="primary" onClick={() => setVisible(false)}>
            Got it
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
```

## Anatomy

`Banner.Root` → size provider for nested controls.

Inside the root, typically:

- `Banner.Content` → `Banner.Icon` + `Banner.Title` + `Banner.Description` + optional `Banner.Actions`
- optional `Banner.CloseButton` as a sibling of `Banner.Content` (right-hand grid column)

If `onDismiss` is passed and there is no `Banner.CloseButton` in the tree, a close button is added automatically.

## API

### Banner.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| variant | `"filled" \| "light" \| "lighter" \| "stroke"` | `"filled"` | No | Background density and accent style (`stroke` adds a colored bottom bar). |
| status | `"information" \| "warning" \| "error" \| "success" \| "feature"` | `"information"` | No | Palette semantics and typical message meaning. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Scale for spacing, text, and icon; provides context for `Banner.CloseButton`. |
| onDismiss | `() => void` | — | No | When set and no child `Banner.CloseButton`, renders a close button with `aria-label` “Dismiss”. |
| className | `string` | — | No | Extra class on the root. |
| children | `React.ReactNode` | — | No | Content and, if needed, an explicit close button. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes on the root `div`. |

### Banner.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class for the central column flex container. |
| children | `React.ReactNode` | — | No | Icon, title, description, actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Attributes on the inner `div`. |

### Banner.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `React.ElementType` | `"div"` | No | Element or icon component (often an SVG component with `aria-hidden`). |
| className | `string` | — | No | Extra class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when `as="div"` or with a custom wrapper. |
| …rest | props of `T` without `as` and `className` | — | No | Forwarded to the chosen element. |

### Banner.Title

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class for the title `span`. |
| children | `React.ReactNode` | — | No | Title text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### Banner.Description

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class for the description `span`. |
| children | `React.ReactNode` | — | No | Secondary text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### Banner.Actions

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class for the button row container. |
| children | `React.ReactNode` | — | No | `Button`, `LinkButton`, etc. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### Banner.CloseButton

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Native button `type`. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Defaults to a cross icon in `Button.Icon`. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | No | Including `onClick`, `aria-label`, `disabled`; button size comes from banner context. |

## Variants

- **filled** — saturated status background and high-contrast text; maximum prominence.
- **light** — soft background from the status palette and status-colored text; balanced default.
- **lighter** — status background blended with the page surface; calm reminder.
- **stroke** — neutral surface, accent is a colored bottom line and status-colored icon.

## States

Semantics are driven by the **`status`** prop: tokens for background, text, and accent are chosen per type. The root has no separate `disabled` or `loading` props.

**Dismissal:** either **`onDismiss`** (and if there is no custom `Banner.CloseButton`, the default one is added), or only **`Banner.CloseButton`** with its own `onClick`, or both — then the automatic button is **not** duplicated if `Banner.CloseButton` already exists among descendants.

## Accessibility (a11y)

- Root is a `div`; set **`role="region"`** and **`aria-label` / `aria-labelledby`** when the strip is a meaningful landmark.
- Icons in `Banner.Icon` are usually decorative: **`aria-hidden`** on the icon component.
- The auto-inserted close button uses **`aria-label="Dismiss"`**; for a custom button, set a clear **`aria-label`** in the UI language.
- `Banner.Title` and `Banner.Description` are `span`s; long text wraps via the content flex layout.

## Limitations and notes

- No built-in **`open` / `visible`**: show/hide via conditional render or parent state.
- **`Banner.Icon`** uses the **`as`** prop, not `asChild` on the root.
- The grid expects **one** central content group and **one** dismiss zone on the right; multi-column layouts are better composed outside.
- Title and description are inline `span`s; for rich formatting, nest allowed markup deliberately.

## Related components

- **Button** — actions in `Banner.Actions`; `Banner.CloseButton` is built on `Button.Root` (ghost neutral).
- **LinkButton** — secondary navigation in the strip without faking a `button`.
- **Typography** — captions and hints next to the banner outside the slot (e.g. after dismissal).
- **Notification** — for a toast or transient overlay instead of an in-flow strip.
