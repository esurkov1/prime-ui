# LinkButton

**Category:** actions (Действия)

> A real link styled as a text action, sized on the control tiers.

## When to use
- Navigation to another page or URL inside text, cards, forms and footers.
- Secondary navigation next to a Button of the same size (“Войти по паролю” beside “Продолжить”).
- Quiet service links in footers and metadata (`tone="neutral"`).
- External links (`target="_blank"` + `rel="noopener noreferrer"`).

## When not to use
- An action without a URL (save, open a dialog) → use [Button](../button/COMPONENT.md) with `variant="ghost"`.
- A navigation item that must look like a button → use [Button](../button/COMPONENT.md) with `asChild` and an `<a>`.
- The path to the current page → use [Breadcrumb](../breadcrumb/COMPONENT.md).
- Long-form text styling → use [Typography](../typography/COMPONENT.md).

## Import
```tsx
import { LinkButton } from "prime-ui-kit";
```

## API

### LinkButton.Root
`forwardRef` → `HTMLAnchorElement` (the `<span>` when `disabled`). + native `<a>` props (`href`, `target`, `rel`, `download`, `onClick`, `aria-*` …). No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text size, line height, icon size and gap; provided to nested `Icon`. |
| `tone` | `"accent" \| "neutral"` | `"accent"` | `accent` — a regular link; `neutral` — quiet link. |
| `disabled` | `boolean` | `false` | Renders `<span role="link" aria-disabled="true" tabIndex={-1}>` without `href`; native anchor props are not passed. |
| `children` | `ReactNode` | — | Text and optional `Icon`s. |
| `className` | `string` | — | Extra class on the root. |

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

Match the link size to the surrounding text or to the Button it sits next to.

**Combinations**
- Recommended: `accent` inside text and next to actions; `neutral` + `s` for service links.
- Avoid: `neutral` links inside body text (they read as plain text); making LinkButton the primary action of a form — use Button.

## States
| State | Driven by | DOM |
|---|---|---|
| hover | pointer | hover color + underline (`text-decoration-color: currentColor`) |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset`, radius `--prime-radius-xs` |
| disabled | `disabled` | `<span role="link">`, `aria-disabled="true"`, `tabIndex=-1`, `data-disabled="true"`, `text-disabled` color, no underline, `cursor: not-allowed` |

Root attributes: `data-size`, `data-tone`, `data-disabled` (only when disabled).

## Layout & spacing
- Inline in text: put a space before it (`{" "}`) and keep the text's size.
- Next to a Button: same `size`, `justify-content: space-between` or `gap: var(--prime-space-3)`.
- Footer link rows: `gap: var(--prime-space-2) var(--prime-space-4)`, wrap allowed.
- `max-width: 100%`; `display: inline-flex` with icon and text centered.

## Accessibility
- A native `<a>`: Enter follows the link; it is announced as a link.
- The disabled state is a non-focusable `span role="link"` with `aria-disabled`.
- Icons are decorative; the text is the accessible name.
- External links: say “новая вкладка” in the text or `aria-label`.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Five size tiers | matching surrounding text or controls |
| [tones.tsx](examples/tones.tsx) | `accent` vs `neutral` | regular vs quiet links |
| [states.tsx](examples/states.tsx) | Active link; disabled in both tones | unavailable destinations |
| [with-icon.tsx](examples/with-icon.tsx) | Leading and trailing `Icon` | hinting at the destination |
| [composition.tsx](examples/composition.tsx) | Link in text, beside a Button, neutral footer links | sign-in and form cards |
| [external-link.tsx](examples/external-link.tsx) | `target="_blank"` + `rel` | links leaving the app |

```tsx
import { LinkButton } from "prime-ui-kit";

export function DocsLink() {
  return <LinkButton.Root href="/docs">Документация</LinkButton.Root>;
}
```

## Mistakes
- `<LinkButton.Root onClick={save}>` without `href` → use `Button.Root variant="ghost"`.
- `disabled` link with `aria-label`/`title` expecting them to render → in the disabled state only children are rendered; put the meaning in the text.
- `target="_blank"` without `rel="noopener noreferrer"` → add `rel`.
- Wrapping a LinkButton in an `<a>` → pass `href` directly.

## Related
- [Button](../button/COMPONENT.md)
- [Breadcrumb](../breadcrumb/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
