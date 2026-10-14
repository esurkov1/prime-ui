# LinkButton

**Category:** actions
**Kind:** primitive

> A real link styled as a text action, sized on the control tiers.

## When to use
- Navigation to another page or URL inside text, cards, forms and footers.
- Secondary navigation next to a Button of the same size («Войти по паролю» beside «Продолжить»).
- Quiet service links in footers and metadata (`tone="neutral"`).
- A trail of links, such as the path to the current page (`tone="muted"`).
- A link inside running text (`inline`): it takes the text's type and keeps its underline.
- External links (`target="_blank"` + `rel="noopener noreferrer"`).
- A router link with the link look (`asChild` around the router's `<Link>`).
- An inline action inside running text that must read as a link («Отправить ещё раз», «выберите файл») — `asChild inline` around a `<button type="button">`.

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
LinkButton   <a href> (without href when disabled, or the child with asChild); tone, size, inline; size tier for nested icons
└─ children  text and optional Icon before or after it
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### LinkButton
`ref` → `HTMLAnchorElement` (the child with `asChild`). A native `<a>` styled as a text action; passes its tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | The destination. Required without `asChild`; with `asChild` the child carries its own target. |
| `tone` | `"accent" \| "neutral" \| "muted"` | `"accent"` | `accent` — a regular link; `neutral` — secondary text for footers and metadata; `muted` — muted text with no underline, for trails such as a breadcrumb. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier: text 12 · 13 · 14 · 16 · 18, line height and icon size. Without it the tier of its host (a form, a panel, a hint), else `m`. |
| `inline` | `boolean` | `false` | A link inside running text: it takes the text's type, wraps with it and keeps its underline drawn. |
| `disabled` | `boolean` | `false` | Renders `<a role="link" aria-disabled="true">` without `href`, out of the Tab order, and swallows the click; `id`, `aria-*` and the other native props stay. |
| `asChild` | `boolean` | `false` | Merges the link look onto its single child instead of rendering `<a>`: a router link, or a `<button type="button">` for an inline action that is not navigation. |
| `children` | `ReactNode` | — | Text and optional `Icon`s before or after it; the text is the accessible name. With `asChild`, the one child element. |
| `…rest` | `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">` | — | `target`, `rel`, `download`, `onClick`, `className`, `aria-*` and the other anchor attributes. |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent text, medium weight; on hover `accent-hover` and an underline appears | regular links in text, forms and cards | yes |
| `neutral` | secondary text; on hover primary text + underline | footers, metadata, dense service navigation | |
| `muted` | muted text; on hover primary text, never underlined | trails: the path to the current page | |

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
| `inline` | the running text's size, line height and weight; wraps with the text; underline always drawn | a link inside a sentence | off |
| `disabled` | `text-disabled`, no underline, `cursor: not-allowed` | a destination is temporarily unavailable | off |
| `asChild` | the link look on the child (router link, `<button>`; button chrome removed) | router links; inline actions in text | off |

## States
| State | Driven by | DOM |
|---|---|---|
| hover | pointer | hover color + underline (`text-decoration-color: currentColor`) |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset`, radius `--prime-radius-xs` |
| disabled | `disabled` | `<a role="link">` without `href` (so out of the Tab order), `aria-disabled="true"`, `data-disabled="true"`; with `asChild` the child gets `aria-disabled="true"`, `data-disabled="true"` and `tabIndex=-1`, a link child loses its `href`, and its click is swallowed |

Root attributes: `data-size`, `data-tone`, `data-inline` (only when inline), `data-disabled` (only when disabled).

Motion: the color and the underline fade in over `fast` (the underline is always drawn, transparent at rest, 1px thick and 3px below the text).

## Layout & spacing
- Inline in text: `inline`, with a space before it (`{" "}`); the link takes the text's type.
- Next to a Button: same `size`, 12px apart or pushed to the far edge.
- Footer link rows: 8px between rows, 16px between links, wrap allowed.
- `max-width: 100%`; `display: inline-flex` with icon and text centered (`inline`: `display: inline`).
- Text, line height and icon come from the shared tier table (`internal/fieldTier`).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` | Follows the link (native `<a>`). With `asChild` on a `<button>`, `Enter` and `Space` run its action. |
| `Tab` | Moves focus; a disabled link is skipped, the `asChild` child too (`tabIndex=-1`). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A native `<a>`: announced as a link, named by its text.
- The disabled state is a non-focusable `<a role="link" aria-disabled="true">` without `href`; it keeps `id` and `aria-*`.
- With `asChild` the child gives the role and name: a router link, or a `<button>` for an action.
- Icons are decorative; say «новая вкладка» in the text or `aria-label` for external links.
- `inline` keeps the underline drawn, so a link in text never rests on color alone.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A link inside running text takes the text's type and keeps its underline — `href`, `inline`. |
| [variants.tsx](examples/variants.tsx) | A regular link, a quiet one for footers and metadata, a muted one for trails — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; text and icon follow the control tier, xs 12 to xl 18 — `size`. |
| [states.tsx](examples/states.tsx) | A disabled link drops `href` and leaves the Tab order, in both tones — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before or after the text; `Icon` without a size takes the link tier — `Icon`. |
| [external-link.tsx](examples/external-link.tsx) | A link that leaves the app opens a new tab and says so in its text — `target`, `rel`. |
| [as-child.tsx](examples/as-child.tsx) | The link look on a button for an inline action that is not navigation — `asChild`. |

## Mistakes
- `<LinkButton onClick={save}>` without `href` → an `<a>` without a URL is not a button (the type requires `href`): use `<Button.Root variant="ghost">`, or `<LinkButton asChild inline><button type="button">` inside running text.
- A link in a sentence without `inline` → it keeps the control tier and hides its underline at rest; add `inline`.
- `target="_blank"` without `rel="noopener noreferrer"` → add `rel`.
- Wrapping a LinkButton in an `<a>` → pass `href` directly.

## Related
- **Built from:** `internal/interactiveElement`, `internal/fieldClasses` (the tier table)
- **See also:** [Button](../button/COMPONENT.md), [Breadcrumb](../breadcrumb/COMPONENT.md), [Typography](../typography/COMPONENT.md)
