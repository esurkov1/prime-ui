# RichText

**Category:** data-display
**Kind:** primitive

> Text in the chat's Markdown subset outside a message — a bot's welcome text, a template, a comment — rendered as elements, never as HTML.

## When to use
- A text written with the formatting toolbar of `Composer` or `Textarea formatting` is shown somewhere other than a chat: a bot's settings, a template list, a card.
- Text from users or bots that may carry `**bold**`, links or a `||spoiler||` and must be rendered safely.

## When not to use
- The text of a chat message → [Message](../message/COMPONENT.md) `Message.Text` (it marks search matches and holds the meta's room).
- A whole message shown outside a chat (a bot's welcome message with its keyboard) → `Message.Root preview`.
- Plain text with a role → [Typography](../typography/COMPONENT.md).
- Source code → [CodeBlock](../code-block/COMPONENT.md).

## Import
```tsx
import { RichText } from "prime-ui-kit";
```

## Anatomy
```
RichText         <div>; the source as children
├─ <p>           a run of text, line breaks kept
├─ <blockquote>  lines starting with "> "
└─ <pre>         fenced code
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### RichText
`ref` → `HTMLDivElement`. Text in the chat's Markdown subset outside a message, rendered as elements in the type of its host.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `string` | — (required) | The source: `**bold**`, `_italic_`, `~~strike~~`, `\|\|spoiler\|\|`, inline and fenced code, `[label](url)`, bare URLs, `> ` quotes; line breaks are kept. |
| `labels` | `Partial<RichTextLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `id`, `data-*` and the other div attributes. |

## Variants
One look: the type of its host. Wrap it in `Typography as="div"` to pick a text role.

## States
| State | Driven by | DOM |
|---|---|---|
| masked spoiler | `\|\|text\|\|` in `children` | `role="button"`, `data-state="masked"`: a wash over transparent words |
| revealed spoiler | a press, `Enter` or `Space` | `data-state="revealed"`: the wash and the words cross-fade on the fade clock; one way, like a chat |

## Layout & spacing
- Paragraphs, quotes and code blocks keep their line breaks and wrap anywhere, so a long address never widens the host; blocks stand 4px apart.
- A quote is a wash with an accent bar on its start edge; code is the mono face on a wash.
- No size of its own: the root takes the font and color of its host.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the links and the masked spoilers. |
| `Enter` · `Space` | On a masked spoiler: reveals it and moves the focus onto its text. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A masked spoiler is a `role="button"` named `labels.spoiler`; its words are out of the accessibility tree until it is revealed.
- Links take only http(s), `mailto:` and `tel:` addresses and open in a new tab (`rel="noopener noreferrer"`); markup is never parsed as HTML.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `spoiler` | `"Скрытый текст"` | The name of a masked spoiler until it is revealed. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The welcome text of a support bot shown outside the chat: bold, a link, a quote, code and a spoiler from the chat's Markdown — `children`. |

## Mistakes
- `dangerouslySetInnerHTML` with a Markdown library for a chat text → `RichText`: the same subset as the chat, never HTML.
- A `Message.Root` with no time and no author only to render formatted text → `RichText`.
- Sizing the text with a class on `RichText` → put it inside the host that sets the type.

## Related
- **Built from:** `internal/richText` (the parser and the elements, shared with `Message.Text`)
- **See also:** [Message](../message/COMPONENT.md), [Composer](../composer/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Typography](../typography/COMPONENT.md)
