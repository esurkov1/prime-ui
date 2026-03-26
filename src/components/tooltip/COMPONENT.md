# Tooltip

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite tooltip layer: delay provider, root with open state, trigger with a single child, and content in a portal positioned relative to the anchor.

## What it’s for

- **Edit panels and forms** — clarify the purpose of a non-obvious button, an icon without a label, or an abbreviated field without bloating the markup.
- **Tables and dashboards** — reveal the meaning of a metric, status, or column header on hover or keyboard focus.
- **Showcases and marketing blocks** — briefly explain promo terms or limits behind a “Learn more” link without sending users to another page immediately.
- **Internal catalogs and directories** — expand an abbreviation, internal code, or row status in a list.
- **Onboarding and empty states** — gently hint the next step next to a single call to action without permanent helper text under every control.

## Use cases

Each example is a different screen type and prop set; import from the `prime-ui-kit` package.

### Basic

Notification settings card: “Save” button with a note about what is actually sent to the server.

```tsx
import { Button, Tooltip } from "prime-ui-kit";

export function NotificationSaveRow() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root type="submit" variant="primary" mode="filled" size="m">
            Save
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Write selected channels and email frequency to the profile</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

### With size / side options

Product card grid: each card has a textless “favorite” icon; compact tooltip so it does not cover neighboring cards.

```tsx
import { Button, Icon, Tooltip } from "prime-ui-kit";

export function WishlistIconCell() {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root
            type="button"
            variant="neutral"
            mode="ghost"
            size="m"
            aria-label="Add to wishlist"
          >
            <Button.Icon>
              <Icon name="nav.itemDot" size="s" tone="subtle" />
            </Button.Icon>
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content size="s" side="top">
          Save product to wishlist
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

### In context (form / modal / sidebar / …)

Report sidebar: a term in the summary text with keyboard focus and a tooltip below so it does not hit the panel edge.

```tsx
import { Tooltip } from "prime-ui-kit";

export function ReportSidebarGlossary() {
  return (
    <aside style={{ maxWidth: 280, padding: 16 }}>
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        Total for{" "}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button
                type="button"
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  background: "none",
                  font: "inherit",
                  cursor: "help",
                  textDecoration: "underline dotted",
                }}
              >
                MRR
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content size="m" side="bottom">
              Monthly recurring revenue — recurring monthly income from subscriptions
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>{" "}
        for the quarter.
      </p>
    </aside>
  );
}
```

### Controlled mode

Help screen: “Show tooltips” toggle stays in sync with a demo tooltip opening and with hover on the same trigger.

```tsx
import * as React from "react";
import { Button, Switch, Tooltip } from "prime-ui-kit";

export function HelpOverlayDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <Switch.Root size="m" checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Show tooltip</Switch.Label>
      </Switch.Root>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Example trigger
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip text is controlled externally and by hover</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
```

## Anatomy

`Tooltip.Provider` (optional, higher in the tree) → `Tooltip.Root` → `Tooltip.Trigger` (exactly one `ReactElement`) + `Tooltip.Content` (portal: `div` with `role="tooltip"` and `id` matching `aria-describedby` on the trigger).

## API

Exports the `Tooltip` object, size and side types `TooltipSize`, `TooltipSide`, and subcomponent props: `TooltipProviderProps`, `TooltipRootProps`, `TooltipTriggerProps`, `TooltipContentProps`.

### Tooltip.Provider

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| delayDuration | number | 400 | No | Milliseconds to wait before opening after pointer enters or trigger receives focus. |
| children | React.ReactNode | — | Yes | Region where `Tooltip.Root` instances live. |

### Tooltip.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | `Tooltip.Trigger` and `Tooltip.Content`. |
| open | boolean | — | No | Controlled open state. |
| defaultOpen | boolean | false | No | Initial value without external `open`. |
| onOpenChange | (open: boolean) => void | — | No | Visibility change callback. |

### Tooltip.Trigger

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactElement | — | Yes | Single element; receives ref, `aria-describedby`, mouse/focus handlers. |
| className | string | — | No | Extra class (merged with the child’s class). |

### Tooltip.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | Tooltip body; wrapped in `ControlSizeProvider` for the chosen `size`. |
| size | TooltipSize | m | No | Visual scale of padding, typography, and arrow. |
| side | TooltipSide | top | No | Side relative to the trigger; position is clamped to the viewport. |
| className | string | — | No | Custom class on the portal content root. |

## Variants

There is no separate `variant` prop: background, border, and shadow come from semantic tooltip tokens for the active theme. Only `size` scales (`s`, `m`, `l`, `xl`) and `side` placement differ visually (affects arrow and `data-side` for styling).

## States

- **Closed** — content is not mounted; delay timer resets on pointer leave or blur.
- **Open** — after the provider delay, content shows in the portal; position updates on `resize` and `scroll`.
- **Uncontrolled / controlled** — via `defaultOpen` or `open` + `onOpenChange`.
- **Disabled trigger** — native disabled buttons usually do not receive hover; the tooltip will not open without a workaround (wrapper, different element).

## Accessibility (a11y)

The trigger gets `aria-describedby` pointing to the content `id` with `role="tooltip"`. Opens on `mouseenter` / `focus`, closes on `mouseleave` / `blur`. For inline terms, prefer an unstyled `button type="button"` so keyboard focus is predictable. Tooltip content is non-interactive (`pointer-events: none` in styles) — do not put buttons or links inside.

## Limitations and notes

One trigger per root; multiple anchors need separate `Tooltip.Root` instances. Content renders in a portal and does not inherit DOM context from the trigger (except passed markup). Position is clamped to the window; there is no automatic flip to another side when space is tight — set `side` yourself if needed. For a richer interactive layer, consider `Popover`.

## Related components

`Button`, `LinkButton` — typical triggers; `Switch` or another control — for controlled `open` demos. For a persistent field label use `Label` and `Hint`; for a layer that can hold focus inside, use `Popover`.
