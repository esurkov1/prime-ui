# LinkButton

**Category:** actions
**Kind:** primitive

> A real link styled as a text action, sized on the control tiers.

## When to use
- Navigation to another page or URL inside text, cards, forms and footers.
- Secondary navigation next to a Button of the same size («Войти по паролю» beside «Продолжить»).
- Quiet service links in footers and metadata (`tone="neutral"`).
- External links (`target="_blank"` + `rel="noopener noreferrer"`).
- A router link with the link look (`asChild` around the router's `<Link>`).
- An inline action inside running text that must read as a link («Отправить ещё раз», «выберите файл») — `asChild` around a `<button type="button">`.

## When not to use
- An action without a URL outside running text (save, open a dialog) → use [Button](../button/COMPONENT.md) with `variant="ghost"`.
- A navigation item that must look like a button → use [Button](../button/COMPONENT.md) with `asChild` and an `<a>`.
- The path to the current page → use [Breadcrumb](../breadcrumb/COMPONENT.md).
- Long-form text styling → use [Typography](../typography/COMPONENT.md).

## Import
```tsx
import { LinkButton } from "prime-ui-kit";
```

## Anatomy
```
LinkButton   <a> (or <span role="link"> when disabled, or the child with asChild); tone, size; size tier for nested icons
└─ children  text and optional Icon before or after it
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### LinkButton
`forwardRef` → `HTMLAnchorElement` (the `<span>` when `disabled`, the child with `asChild`). A native `<a>` styled as a text action; passes its tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"accent" \| "neutral"` | `"accent"` | `accent` — a regular link; `neutral` — secondary text, primary on hover, for footers and metadata. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: text 12 · 13 · 14 · 16 · 18, line height and icon size. |
| `disabled` | `boolean` | `false` | Renders `<span role="link" aria-disabled="true" tabIndex={-1}>` without `href`; the native anchor props are not passed. |
| `asChild` | `boolean` | `false` | Merges the link look onto its single child instead of rendering `<a>`: a router link, or a `<button type="button">` for an inline action that is not navigation. `disabled` becomes `aria-disabled` and swallows the click. |
| `children` | `ReactNode` | — | Text and optional `Icon`s before or after it; the text is the accessible name. |
| `…rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | `href`, `target`, `rel`, `download`, `onClick`, `className`, `aria-*` and the other anchor attributes. |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent text, medium weight; on hover `accent-hover` and an underline appears | regular links in text, forms and cards | yes |
| `neutral` | secondary text; on hover primary text + underline | footers, metadata, dense service navigation | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16 text, icon 14, gap 4 | captions, table meta | |
| `s` | 13/20 text, icon 16, gap 4 | footers, secondary text | |
| `m` | 14/20 text, icon 16, gap 4 | default UI text, next to `m` controls | yes |
| `l` | 16/24 text, icon 20, gap 8 | reading text (`body-l`), next to `l` controls | |
| `xl` | 18/24 text (title-l), icon 20, gap 8 | prominent links in hero blocks | |

Match the link size to the surrounding text or to the Button it sits next to. Avoid `neutral` links inside body text (they read as plain text) and a LinkButton as the primary action of a form.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` | `text-disabled`, no underline, `cursor: not-allowed` | a destination is temporarily unavailable | off |
| `asChild` | the link look on the child (router link, `<button>`; button chrome removed) | router links; inline actions in text | off |

## States
| State | Driven by | DOM |
|---|---|---|
| hover | pointer | hover color + underline (`text-decoration-color: currentColor`) |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset`, radius `--prime-radius-xs` |
| disabled | `disabled` | `<span role="link">`, `aria-disabled="true"`, `tabIndex=-1`, `data-disabled="true"` |

Root attributes: `data-size`, `data-tone`, `data-disabled` (only when disabled).

## Layout & spacing
- Inline in text: put a space before it (`{" "}`) and keep the text's size.
- Next to a Button: same `size`, `justify-content: space-between` or `gap: var(--prime-space-3)`.
- Footer link rows: `gap: var(--prime-space-2) var(--prime-space-4)`, wrap allowed.
- `max-width: 100%`; `display: inline-flex` with icon and text centered.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` | Follows the link (native `<a>`). |
| `Tab` | Moves focus; a disabled link is skipped. |

### ARIA
- A native `<a>`: announced as a link, named by its text.
- The disabled state is a non-focusable `<span role="link" aria-disabled="true">`.
- With `asChild` the child gives the role and name: a router link, or a `<button>` for an action.
- Icons are decorative; say «новая вкладка» in the text or `aria-label` for external links.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A link inside running text that keeps the text's size — `href`. |
| [variants.tsx](examples/variants.tsx) | A regular link and a quiet one for footers and metadata — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; text and icon follow the control tier, xs 12 to xl 18 — `size`. |
| [states.tsx](examples/states.tsx) | A disabled link drops `href` and leaves the Tab order, in both tones — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before or after the text; `Icon` without a size takes the link tier — `Icon`. |
| [external-link.tsx](examples/external-link.tsx) | A link that leaves the app opens a new tab and says so in its text — `target`, `rel`. |
| [as-child.tsx](examples/as-child.tsx) | The link look on a button for an inline action that is not navigation — `asChild`. |

## Mistakes
- `<LinkButton onClick={save}>` without `href` → an `<a>` without a URL is not a button: use `<Button.Root variant="ghost">`, or `<LinkButton asChild><button type="button">` inside running text.
- A disabled link with `aria-label` / `title` → in the disabled state only children render; put the meaning in the text.
- `target="_blank"` without `rel="noopener noreferrer"` → add `rel`.
- Wrapping a LinkButton in an `<a>` → pass `href` directly.

## Related
- **Built from:** —
- **See also:** [Button](../button/COMPONENT.md), [Breadcrumb](../breadcrumb/COMPONENT.md), [Typography](../typography/COMPONENT.md)
