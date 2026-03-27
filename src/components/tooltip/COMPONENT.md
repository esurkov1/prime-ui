# Tooltip

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite tooltip: optional delay provider, root with open state, trigger that wraps a single element, and content rendered in a portal and positioned relative to the trigger.

- **Use** to clarify icon-only controls, abbreviated labels, dense table cells, or non-obvious metrics on hover or keyboard focus.
- **Use** when the extra text is short and supplementary; keep the trigger’s visible label or `aria-label` as the primary affordance where possible.
- **Do not use** for long explanations or content that should stay visible without hover—prefer inline help, a hint, or a dedicated panel.
- **Do not use** for interactive content inside the layer (links, buttons, inputs); tooltip content is non-interactive and uses `pointer-events: none` in styles.
- **Do not use** one root for multiple anchors—each trigger needs its own `Tooltip.Root` (or separate instances).
- **Do not rely** on tooltips opening for natively `disabled` controls; disabled elements often do not receive hover/focus—wrap or use a different focusable pattern if a tooltip is required.

## Composition

- **`Tooltip.Provider`** (optional) — wraps a subtree to share **`delayDuration`** (default **400** ms) for nested **`Tooltip.Root`** instances. Omit it when the default delay is fine.
- **`Tooltip.Root`** — holds open state (controlled or uncontrolled). Children must include **`Tooltip.Trigger`** and **`Tooltip.Content`** (order in the tree is conventional; both participate via context).
- **`Tooltip.Trigger`** — accepts **exactly one** **`React.ReactElement`** child. The implementation **`cloneElement`s** it: merges **`ref`**, **`className`**, **`aria-describedby`**, and pointer/focus handlers. The child must forward refs and accept standard DOM props.
- **`Tooltip.Content`** — tooltip body; rendered through **`Portal`** as a **`div`** with **`role="tooltip"`** and **`id`** matching the trigger’s **`aria-describedby`**. Sets **`data-size`** and **`data-side`** for styling (including the arrow). Wraps children in **`ControlSizeProvider`** for the chosen **`size`**.

### Minimal example

```tsx
import { Tooltip } from "prime-ui-kit";

export function Example() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <button type="button">Hover</button>
      </Tooltip.Trigger>
      <Tooltip.Content>Help text</Tooltip.Content>
    </Tooltip.Root>
  );
}
```

### Canonical example (icon-only control)

Use this as the default copy-paste shell: **`aria-label`** (or another accessible name) on the **focusable** trigger, **`Button.Icon`** + **`Icon`**, and a short **`Tooltip.Content`** (often **`size="s"`** next to a **`size="m"`** control).

```tsx
import { Button, Icon, Tooltip } from "prime-ui-kit";

export function CopyLinkHint() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root
          type="button"
          variant="neutral"
          mode="ghost"
          size="m"
          aria-label="Copy link"
        >
          <Button.Icon>
            <Icon name="action.copy" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content size="s">Copy page link to clipboard</Tooltip.Content>
    </Tooltip.Root>
  );
}
```

Source of truth (stays in sync with the snippet above): `examples/canonical-icon-hint.tsx`.

The **playground** (`playground/sections/TooltipSection.tsx`) renders the same scenarios as **`playground/snippets/tooltip/*.tsx`** (internal `@/` imports). **`examples/`** below mirrors those snippets with **`"prime-ui-kit"`** imports; playground copy may differ (e.g. Russian labels) but structure and props match.

### Example files in `examples/`

| File | Scenario (aligned with `playground/snippets/tooltip/`) |
|------|----------|
| `sizes.tsx` | Four **`Tooltip.Content`** sizes **`s`–`xl`** on the same trigger pattern |
| `surfaces.tsx` | Same tooltip on **`surface-default`** vs **`surface-raised`** panels |
| `states.tsx` | Default trigger; native **`disabled`** (tooltip does not open); glossary-style **`button`** trigger |
| `side.tsx` | **`side`** **`top`** \| **`bottom`** \| **`left`** \| **`right`** |
| `controlled.tsx` | **`open`** / **`onOpenChange`** with **`Tooltip.Provider`** **`delayDuration={0}`** and **`Switch`** |
| `composition.tsx` | **`LinkButton`** + **`Typography`** in content; icon-only **`Button`** with **`aria-label`** |
| `delay.tsx` | **`Tooltip.Provider`** **`delayDuration={800}`** |
| `long-content.tsx` | Multi-line copy; **`size="m"`**; theme **`max-width`** / wrapping |

| File | Extra recipe |
|------|----------|
| `canonical-icon-hint.tsx` | Minimal icon-only shell: **`aria-label`**, **`size="s"`** hint |

### Extended usage

- **Delay:** wrap a subtree in **`Tooltip.Provider`** and set **`delayDuration`** (ms). Default is **400**; use a longer value to reduce accidental flashes, or **`0`** for tests and controlled demos.
- **Long text:** rely on the built-in **`max-width`** and **`word-break`** on the content surface; prefer shorter copy when possible—if users must read a paragraph, use inline help, **Hint**, or **Popover** instead.
- **Placement:** set **`side`** on **`Tooltip.Content`** when **top** clips; coordinates are **viewport-clamped** (**8px** inset) but the kit does **not** auto-flip to the opposite side.
- **Controlled:** pass **`open`** and **`onOpenChange`** on **`Tooltip.Root`**; pointer/focus on the trigger still updates the same state. Pair with **`delayDuration={0}`** when an external control should show the tooltip immediately.
- **Disabled triggers:** native **`disabled`** elements often skip hover/focus—wrap with a focusable container or use **`aria-disabled`** + custom styling if a tooltip on a “disabled” control is required.

### Note for LLMs

When generating **Tooltip** markup for this library: (1) **`Tooltip.Trigger`** takes **exactly one** **`ReactElement`** child (the implementation uses **`cloneElement`**). (2) Put the **accessible name** on the trigger (**`aria-label`**, visible text, or **`aria-labelledby`**)—the tooltip supplements it; do not rely on the tooltip alone for the control’s name. (3) Do not put **links, buttons, or inputs** inside **`Tooltip.Content`** (non-interactive layer, **`pointer-events: none`**). (4) Use **one** **`Tooltip.Root`** per anchor; do not attach one root to multiple triggers. (5) For starting points, mirror **`examples/canonical-icon-hint.tsx`**, then adapt the named files in **`examples/`** (same scenarios as **`playground/snippets/tooltip/`**).

## Rules

- **Uncontrolled:** omit **`open`**; optional **`defaultOpen`** (defaults to **`false`**). **Controlled:** pass **`open`** and **`onOpenChange`**; the same open state drives visibility together with hover/focus on the trigger.
- Opening is **delayed** by **`Tooltip.Provider`**’s **`delayDuration`** after **`mouseenter`** or **`focus`**; leaving or **blur** clears the timer and closes. Cleanup runs on unmount.
- **Position:** **`side`** is **`top`** \| **`bottom`** \| **`left`** \| **`right`** (default **`top`**). Coordinates are **clamped** to the viewport (**8px** inset); there is **no automatic flip** to the opposite side when space is tight—choose **`side`** explicitly if needed.
- **Accessibility:** trigger gets **`aria-describedby`** pointing at the content **`id`**; content uses **`role="tooltip"`**. For inline glossary-style terms, prefer **`button type="button"`** as the trigger so keyboard focus is predictable.
- **Portal:** content does not sit in the trigger’s DOM subtree; it won’t inherit layout/CSS from ancestors of the trigger (only what you pass as children and classes on **`Tooltip.Content`**).
- **`Tooltip.Content`** defaults **`size`** to **`m`** and **`side`** to **`top`**; visual scale and arrow follow **`data-size`** / **`data-side`** and theme tokens—there is no separate **`variant`** prop.

## API

The package exports the **`Tooltip`** namespace object and types **`TooltipSize`**, **`TooltipSide`**, **`TooltipProviderProps`**, **`TooltipRootProps`**, **`TooltipTriggerProps`**, **`TooltipContentProps`**.

### Tooltip.Provider

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| delayDuration | `number` | `400` | No | Milliseconds to wait before opening after pointer enters or the trigger receives focus |
| children | `React.ReactNode` | — | Yes | Subtree whose tooltips use this delay |

### Tooltip.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Typically `Tooltip.Trigger` and `Tooltip.Content` |
| open | `boolean` | — | No | Controlled open state |
| defaultOpen | `boolean` | `false` | No | Initial open state when uncontrolled |
| onOpenChange | `(open: boolean) => void` | — | No | Called when open state changes |

### Tooltip.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactElement` | — | Yes | Single element; receives ref, `aria-describedby`, and open/close handlers |
| className | `string` | — | No | Merged with the child’s `className` via `cx()` |

### Tooltip.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Tooltip body; wrapped in `ControlSizeProvider` for nested controls that read control size |
| size | `TooltipSize` (`"s"` \| `"m"` \| `"l"` \| `"xl"`) | `"m"` | No | Padding, typography, and arrow scale |
| side | `TooltipSide` (`"top"` \| `"bottom"` \| `"left"` \| `"right"`) | `"top"` | No | Placement relative to the trigger before viewport clamping |
| className | `string` | — | No | Additional class on the portal root |

## Related

[Button](../button/COMPONENT.md) — typical focusable trigger; [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) — persistent field labeling and helper text; [Popover](../popover/COMPONENT.md) — focusable, interactive overlay content.
