# StatusDot

**Category:** data-display
**Kind:** primitive

> A state in a line of text: a dot of a tone and the word that names it.

## When to use
- A state at the start of a line of text: a card's description («● Работает · каждые 15 минут»), a table cell, a list row.
- A state that should read as part of the sentence, in the type and color of the text around it.

## When not to use
- A status as a chip, with a fill, a count or a removable value → use [Badge](../badge/COMPONENT.md).
- A busy indicator with no word → use [Spinner](../spinner/COMPONENT.md).
- A state shown by the dot alone → add the word; the dot never carries the meaning.

## Import
```tsx
import { StatusDot } from "prime-ui-kit";
```

## Anatomy
```
StatusDot        <span>, inline; an aria-hidden dot, then children (the word)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### StatusDot
`ref` → `HTMLSpanElement`. An inline `<span>`: a dot of the tone, then the word that names the state; it takes the type and the color of the text around it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger"` | `"neutral"` | Tone of the dot. The word carries the meaning, the dot only repeats it. |
| `children` | `ReactNode` | — | The word that names the state («Работает», «Ошибка»). |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `title` and the other `<span>` attributes. |

## Variants
StatusDot has one look: a dot half the height of the text (`0.5em`) before the word, which keeps the type and the color of its surroundings. Only the dot takes the tone.

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted dot | a state with no judgement: paused, not started | yes |
| `accent` | accent dot | something in progress | |
| `success` | success dot | working, done, paid | |
| `warning` | warning dot | delayed, needs attention | |
| `danger` | danger dot | failed, overdue | |

## States
| State | Driven by | DOM |
|---|---|---|
| tone | `tone` | `data-tone` |
| marker | always | `data-status-dot` on the root: a description line finds the dot by it |

## Layout & spacing
- Inline-flex on one line, never wraps or shrinks below its text; the dot is centred on the line and scales with the type, 6px from the word.
- In a [Card](../card/COMPONENT.md) description put it first; the card inserts a «·» after it. Your own component that renders the `StatusDot` first works the same; the dot is found by its `data-status-dot`.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The dot is `aria-hidden="true"`; the state is read from the word, never from the color.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A state in a line of text: the dot repeats the word — `tone`. |
| [variants.tsx](examples/variants.tsx) | Every tone of the dot; the word names the state without the color — `tone`. |
| [in-text.tsx](examples/in-text.tsx) | A state at the start of a card's description, in its type and color — `tone`. |

## Mistakes
- A dot with no word → the color alone says nothing to a screen reader; write the word.
- `<Badge.Root><Badge.Dot />…` for a state inside a sentence → use `StatusDot`.
- A hand-drawn `<span>` with a colored circle → use `StatusDot`.

## Related
- **Built from:** —
- **See also:** [Badge](../badge/COMPONENT.md), [Card](../card/COMPONENT.md), [Spinner](../spinner/COMPONENT.md)
