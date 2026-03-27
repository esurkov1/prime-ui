# Banner

## Canonical

In-flow announcement strip: `Banner.Root` (grid + optional dismiss) wraps `Banner.Content` (icon, title, optional description, optional actions). Control visibility by mounting the root or parent state—there is no `open` prop.

**Defaults:** `variant="filled"`, `status="information"`, `size="m"`.

```tsx
import { Banner } from "prime-ui-kit";

export function Example() {
  return (
    <Banner.Root>
      <Banner.Content>
        <Banner.Title>Title</Banner.Title>
      </Banner.Content>
    </Banner.Root>
  );
}
```

| Piece | Role |
|--------|------|
| `Banner.Root` | `variant`, `status`, `size`, `onDismiss`, passes control size to `Banner.CloseButton` |
| `Banner.Content` | Center column: slots below |
| `Banner.Icon` | Optional; use `as={Icon}` and `aria-hidden` when decorative |
| `Banner.Title` / `Banner.Description` | Primary and supporting copy (`span`) |
| `Banner.Actions` | Buttons / `LinkButton` |
| `Banner.CloseButton` | **Direct child of `Banner.Root`** (sibling of `Banner.Content`), not nested inside `Content` |

### Playground snippets

Order matches [`playground/sections/BannerSection.tsx`](../../../playground/sections/BannerSection.tsx). Snippets import from `@/components/banner/Banner`; consumers use **`import { … } from "prime-ui-kit"`**.

| File | Scenario |
|------|----------|
| `playground/snippets/banner/sizes.tsx` | `size` `s`–`xl` with `variant="light"` and `status="information"`. |
| `playground/snippets/banner/variants.tsx` | `variant` `filled`, `light`, `lighter`, `stroke` at `status="information"`. |
| `playground/snippets/banner/statuses.tsx` | `status` `information`, `warning`, `error`, `success`, `feature` at `variant="light"`. |
| `playground/snippets/banner/controlled.tsx` | Visibility from React state: hide removes the root; external button shows again (no root `onDismiss` required). |
| `playground/snippets/banner/composition.tsx` | Slots: `Banner.Icon` with `as`, title, description, `Banner.Actions` (`LinkButton`, `Button`); `size="l"`, `variant="stroke"`. |
| `playground/snippets/banner/full-width.tsx` | Root fills parent width; narrow wrapper illustrates a card column or sidebar. |
| `playground/snippets/banner/dismiss-patterns.tsx` | `onDismiss` only (auto close) · `Banner.CloseButton` only · both without duplicate injected control. |

### Scenario examples (English)

| File | Scenario |
|------|----------|
| [`examples/billing-alert.tsx`](examples/billing-alert.tsx) | Billing failure: `error` + `filled`, `onDismiss`, actions, `role="region"`. |
| [`examples/maintenance.tsx`](examples/maintenance.tsx) | Downtime: `warning` + `stroke`, actions, region label. |
| [`examples/cookie-consent-row.tsx`](examples/cookie-consent-row.tsx) | Consent: `information` + `lighter`, `onDismiss`, actions. |
| [`examples/feature-promo.tsx`](examples/feature-promo.tsx) | Promo: `feature` + `lighter`, `onDismiss`, actions. |
| [`examples/controlled-visibility.tsx`](examples/controlled-visibility.tsx) | Controlled show/hide by conditional render (mirrors `controlled.tsx` snippet). |
| [`examples/dismiss-close-button.tsx`](examples/dismiss-close-button.tsx) | `Banner.CloseButton` as direct root child without `onDismiss` (mirrors manual-dismiss branch of `dismiss-patterns.tsx`). |

---

## Extended

### About

An in-flow announcement strip: a root grid with a central content column and an optional dismiss control on the right. Use `status` and `variant` for semantic color and density; optional slots cover icon, title, description, and actions.

- **Use** for persistent page- or section-level messages (policy, incident, feature, validation summary) where the user should read the text in context.
- **Use** when you need optional actions (`Banner.Actions`) or dismiss without leaving the page.
- **Use** `size` to align spacing and typography with surrounding controls (`ControlSizeProvider` context applies to `Banner.CloseButton`).
- **Do not use** for transient overlay feedback; prefer [Notification](../notification/COMPONENT.md) or similar patterns.
- **Do not use** as a substitute for [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md) when the user must complete a blocking task.
- **Do not use** decorative icons without `aria-hidden` (or an accessible name) when the icon is not redundant with the title.

### Composition

- `Banner.Root` is the outer `div` and size provider; pass `variant`, `status`, `size`, and optionally `onDismiss`.
- Put primary copy inside `Banner.Content`. Typical order: `Banner.Icon` (optional), `Banner.Title`, `Banner.Description` (optional), `Banner.Actions` (optional).
- `Banner.CloseButton` must be a **direct child** of `Banner.Root` (a sibling of `Banner.Content`, not nested inside `Content`). The implementation only scans **direct** children to decide whether to inject a default close button when `onDismiss` is set; a close control placed only inside `Banner.Content` does not suppress injection.
- If `onDismiss` is provided and no direct child is `Banner.CloseButton`, the root appends a default close button that calls `onDismiss`.

### Rules

- There is no `open` / `visible` prop: mount or unmount the root (or hide it with parent state) to show or hide the strip.
- `variant` defaults to `filled`; `status` to `information`; `size` to `m`. `stroke` uses a neutral surface with a status-colored bottom accent bar.
- Decorative icons: pass `aria-hidden` on the underlying SVG/component when the title already conveys the message.
- For a meaningful page-level region, set `role="region"` and `aria-label` or `aria-labelledby` on `Banner.Root` via standard HTML attributes.
- The auto-injected dismiss control uses `aria-label="Dismiss"`; set an explicit `aria-label` (or equivalent) on a custom `Banner.CloseButton` in the product language.
- `Banner.Title` and `Banner.Description` render as `span` elements; keep markup intentional if you nest interactive elements.
- `Banner.Icon` is driven by the `as` prop (not `asChild` on the root).

### API

#### Banner.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"filled" \| "light" \| "lighter" \| "stroke"` | `"filled"` | No | Background density and accent treatment (`stroke` adds a status-colored bottom bar). |
| status | `"information" \| "warning" \| "error" \| "success" \| "feature"` | `"information"` | No | Semantic palette for the strip. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Spacing and type scale; feeds `Banner.CloseButton` via control-size context. |
| onDismiss | `() => void` | — | No | When set and no direct `Banner.CloseButton` child exists, renders a default close button that invokes this callback. |
| className | `string` | — | No | Additional class on the root `div`. |
| children | `React.ReactNode` | — | No | Typically `Banner.Content` and optionally `Banner.CloseButton`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the root `div` (e.g. `id`, `role`, ARIA). |

#### Banner.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the content column `div`. |
| children | `React.ReactNode` | — | No | Icon, title, description, and/or actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the inner `div`. |

#### Banner.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `"div"` | No | Element or component to render (often an icon component). |
| className | `string` | — | No | Additional class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when using the default element or a custom wrapper. |
| …rest | props of `T` without `as` and `className` | — | No | Forwarded to the element chosen by `as`. |

#### Banner.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the `span`. |
| children | `React.ReactNode` | — | No | Primary heading text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Native `span` attributes. |

#### Banner.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the `span`. |
| children | `React.ReactNode` | — | No | Supporting text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Native `span` attributes. |

#### Banner.Actions

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the actions row `div`. |
| children | `React.ReactNode` | — | No | Action controls (e.g. `Button`, `LinkButton`). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the row `div`. |

#### Banner.CloseButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Native `button` type. |
| className | `string` | — | No | Additional class on the button. |
| children | `React.ReactNode` | — | No | Button content; defaults to a cross icon when omitted. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | No | Other button props; `size` is derived from banner context. |

### Playground alignment

Matrix demos (`sizes`, `variants`, `statuses`, `controlled`, `composition`, `full-width`, `dismiss-patterns`) are maintained next to [`BannerSection.tsx`](../../../playground/sections/BannerSection.tsx); keep this doc table and snippet filenames in sync when the playground order or scenarios change.

### Related

- [Button](../button/COMPONENT.md) — actions inside `Banner.Actions`; `Banner.CloseButton` wraps `Button.Root` (ghost neutral).
- [LinkButton](../link-button/COMPONENT.md) — text-style navigation actions in the strip.
- [Typography](../typography/COMPONENT.md) — surrounding captions or body copy outside the banner slots.
- [Notification](../notification/COMPONENT.md) — transient or stacked overlay messages instead of an in-flow strip.

---

## LLM note

- **Dismiss:** `onDismiss` on `Banner.Root` injects a default close control only when there is **no** `Banner.CloseButton` among **direct** children of `Banner.Root`. Nesting `CloseButton` only under `Banner.Content` does **not** count—root may still inject a second close.
- **Visibility:** no `open` prop; toggle with conditional render or parent state.
- **Semantics:** map product tone to `status` (`error` billing failures, `warning` maintenance, `information` policy/cookies, `feature` promos). Pair `variant` with chrome: `filled` for urgent billing, `stroke` for calm operational notices, `lighter` / `light` for promos and consent rows.
- **A11y:** prefer `role="region"` + `aria-labelledby` pointing at `Banner.Title`’s `id` (or `aria-label` when no visible title).
- **Sizing:** default `size` is `m`; use `Banner`’s `size` for density—do not fake scale with ad-hoc CSS on kit nodes.
