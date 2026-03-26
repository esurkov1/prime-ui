# LinkButton

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

Text-style **navigation** control: **`LinkButton.Root`** only — control typography, inline-flex, underline on hover / `:focus-visible`, sizes **`s`–`xl`**. Import **`LinkButton`** from **`prime-ui-kit`**.

```tsx
import { LinkButton } from "prime-ui-kit";

<LinkButton.Root href="/settings" size="m">
  Settings
</LinkButton.Root>
```

| Piece | Role |
|--------|------|
| `LinkButton.Root` | `<a>` with anchor props, or `<span role="link">` when `disabled` |

**Runnable scenarios** (source copies under `examples/`): [inline text in a paragraph](examples/inline-text-link.tsx), [external tab](examples/external.tsx), [footer legal row](examples/footer-legal.tsx), [nav cluster](examples/navigation-cluster.tsx), [disabled](examples/disabled.tsx).

## Extended

### About

- **Use** for in-app routes and sections when the UI should read as a **link**, not a filled button.
- **Use** inline in copy (help, legal, helper text) where a compact or scaled text link fits the layout; smaller tiers often use **`size="s"`** in footers and dense chrome.
- **Use** when nested icons should follow **control** size tokens — **`size`** sets **`ControlSizeProvider`** for children.
- **Do not use** for actions that do not navigate (submit, toggle, open dialogs); use **Button** or another control.
- **Do not use** expecting **`asChild`** or polymorphic roots; you cannot attach these styles to a child router **`Link`** via one prop.
- **Do not use** **`disabled`** to mean “still in tab order with full link semantics”; disabled mode removes focus and drops anchor attributes (see Rules).

### Composition

- **`LinkButton`** — namespace object with **`LinkButton.Root`** only.
- **`LinkButton.Root`** — when **`disabled`** is false (default), renders **`<a>`** with anchor attributes from props and wraps **`children`** in **`ControlSizeProvider`** for **`size`**.
- When **`disabled`** is true, renders **`<span role="link">`** with **`aria-disabled="true"`**, **`tabIndex={-1}`**, and the same size context — no **`href`** or other spread anchor props on the DOM node.

### Rules

- **`size`** defaults to **`m`**; valid values are **`"s"`**, **`"m"`**, **`"l"`**, **`"xl"`** (control token tier).
- With **`disabled={true}`**, **`...rest`** from **`React.AnchorHTMLAttributes`** is **not** applied — the root is a **`span`**, so **`href`**, **`target`**, **`onClick`**, and similar props have **no effect** on the output; do not rely on them for accessibility or behavior in that mode.
- Active link: native **`<a>`** with your **`href`**; keyboard **Enter** activates like a normal link.
- Disabled presentation: **`role="link"`**, **`aria-disabled="true"`**, **`tabIndex={-1}`** — not in tab order by default; avoid if the item should remain focusable as a link.
- For **icon-only** links, provide a name (**`aria-label`** or visible text).
- For **`target="_blank"`**, set **`rel="noopener noreferrer"`** (and warn in UI if policy requires it).
- There is no loading or error variant; for async work without navigation, prefer **Button** (or another pattern).
- One visual style only (no **`variant`**); hierarchy comes from **`size`** and surrounding layout. No built-in **`fullWidth`** — use layout or **`className`** on the root if you need block-level stretch.
- **`ref`** is forwarded to the DOM root (**`<a>`** or the disabled **`<span>`**); the public ref type is **`HTMLAnchorElement`** even though the disabled node is a **`span`**.

### API

#### LinkButton.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control height / type scale; size context for nested icons via `ControlSizeProvider`. |
| disabled | `boolean` | `false` | No | Renders `span` with `role="link"` instead of `a`; no navigation. |
| children | `React.ReactNode` | — | No | Link content (text, icons, etc.). |
| className | `string` | — | No | Additional class on the root element. |
| …rest | `React.AnchorHTMLAttributes<HTMLAnchorElement>` | — | No | Forwarded to `<a>` only when `disabled` is false (e.g. `href`, `target`, `rel`, `download`, `onClick`, `aria-*`, `tabIndex`). |

### Related

- [Button](../button/COMPONENT.md) — actions, forms, loading/disabled without link semantics.
- [Breadcrumb](../breadcrumb/COMPONENT.md) — trail navigation; items may use `LinkButton` internally.
- [Typography](../typography/COMPONENT.md) — body text and inline links without control padding; `LinkButton` matches control alignment and scale.

## LLM note

- **Import:** `import { LinkButton } from "prime-ui-kit"` — render **`LinkButton.Root`**; there is no flat **`LinkButton`** element export.
- **Semantics:** Prefer **`LinkButton`** over **`Button`** when the primary affordance is **navigation** (URL change), not a command.
- **`disabled`:** Forces **`span`** + **`aria-disabled`**; **`href` / `onClick` / `target`** from props are **ignored** — do not pass them expecting behavior.
- **External / new tab:** Always pair **`target="_blank"`** with **`rel="noopener noreferrer"`**.
- **Router:** No **`asChild`** — wrap router **`Link`** by styling it separately or use plain **`<a href>`** from the kit; do not invent a polymorphic API.
- **Density:** Footer and legal rows → often **`size="s"`**; primary in-sentence link in body copy → usually **`m`** unless the surrounding control tier dictates otherwise.
- **Icons:** Children can include **`Icon`**; size context flows from **`LinkButton.Root`** — keep icon tier consistent with **`size`** on the root.
- **Verification:** Cross-check behavior with `examples/*.tsx` and playground `playground/snippets/link-button/`.
