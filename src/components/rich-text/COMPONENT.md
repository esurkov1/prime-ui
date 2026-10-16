# RichText

**Category:** data-display
**Kind:** primitive

> Text in the chat's Markdown subset — or a messenger's plain text with its entities — outside a message (a bot's welcome text, a template, a comment), rendered as elements, never as HTML.

## When to use
- A text written with the formatting toolbar of `Composer` or `Textarea formatting` is shown somewhere other than a chat: a bot's settings, a template list, a card.
- Text from users or bots that may carry `**bold**`, links or a `||spoiler||` and must be rendered safely.
- A text stored as a messenger sends it — plain text and formatted ranges (Telegram `entities`, VK `format_data`) → `entities`: the text is never read as Markdown, so `**` in it stays text and a range may start inside a word.
- Moving between the two forms: `getTextEntities(source)` turns a Composer message into `{ text, entities }` for the messenger's API; `getRichTextSource({ text, entities })` turns a stored text back into Markdown for the editor, escaping what would read as markup (`\*`).

## When not to use
- The text of a chat message → [Message](../message/COMPONENT.md) `Message.Text` (it marks search matches and holds the meta's room).
- A whole message shown outside a chat (a bot's welcome message with its keyboard) → `Message.Root preview`.
- Plain text with a role → [Typography](../typography/COMPONENT.md).
- Source code → [CodeBlock](../code-block/COMPONENT.md).

## Import
```tsx
import { getRichTextSource, getTextEntities, RichText, type TextEntity } from "prime-ui-kit";
```

## Anatomy
```
RichText         <div>; the source (or the plain text of `entities`) as children
├─ <p>           a run of text, line breaks kept; <strong> <em> <u> <s> <code> <a> inside
├─ <blockquote>  lines starting with "> "
└─ <pre>         fenced code
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### RichText
`ref` → `HTMLDivElement`. Text in the chat's Markdown subset outside a message, rendered as elements in the type of its host.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `string` | — (required) | The Markdown subset (`**`, `_`, `__`, `~~`, `\|\|`, code, links, `> ` quotes; `\*` escapes a mark), or with `entities` the plain text they format. |
| `entities` | `readonly TextEntity[]` | — | The formatted ranges of a messenger's text (Telegram, VK): `children` is then plain text, never read as Markdown, and a range may start inside a word. Bare URLs in it still link. |
| `labels` | `Partial<RichTextLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `id`, `data-*` and the other div attributes. |

### Types

#### `TextEntity`
One formatted range of a plain text, as messengers send it (Telegram `MessageEntity`, VK `format_data`): map their type names onto these.

| Field | Type | Default | Description |
|---|---|---|---|
| `type` | `"bold" \| "italic" \| "underline" \| "strikethrough" \| "spoiler" \| "code" \| "pre" \| "link" \| "quote"` | — (required) | The format; `pre` and `quote` are blocks (the line breaks at their edges are theirs). A type the kit does not know shows its text. |
| `offset` | `number` | — (required) | Start in UTF-16 code units (a JS string index, as in Telegram). |
| `length` | `number` | — (required) | Length in UTF-16 code units; ranges nest and may cross (a crossing one is cut). |
| `url` | `string` | — | The address of a `link`; without it the range itself is the address. Only http(s), `mailto:` and `tel:` link. |
| `language` | `string` | — | The language of a `pre` block, kept through the conversions. |

#### `FormattedText`
A plain text with its formatted ranges: what a messenger sends and takes.

| Field | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | — (required) | The plain text. |
| `entities` | `TextEntity[]` | — (required) | Its formatted ranges. |

### Functions

#### `getTextEntities(source)`
`(source: string) => FormattedText`

The plain `text` and `entities` of a Markdown source — what a messenger's API takes from a Composer message. Bare URLs make no entity (the messenger links them).

#### `getRichTextSource(value)`
`(value: FormattedText) => string`

The Markdown source of `{ text, entities }` — to edit a received or stored text in Composer or `Textarea formatting`. Text that would read as markup is escaped (`\*`); an italic or underline inside a word, which the subset cannot hold, is dropped and its text kept.

## Variants
One look: the type of its host. Wrap it in `Typography as="div"` to pick a text role.

## States
| State | Driven by | DOM |
|---|---|---|
| masked spoiler | `\|\|text\|\|` in `children`, or a `spoiler` entity | `role="button"`, `data-state="masked"`: a wash over transparent words |
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
| [entities.tsx](examples/entities.tsx) | A bot's greeting stored as a messenger sends it — plain text with formatted ranges — shown with its stars kept as text — `entities`. |

## Mistakes
- `dangerouslySetInnerHTML` with a Markdown library for a chat text → `RichText`: the same subset as the chat, never HTML.
- A `Message.Root` with no time and no author only to render formatted text → `RichText`.
- Sizing the text with a class on `RichText` → put it inside the host that sets the type.
- Converting a messenger's entities to Markdown by hand, or showing a text `plain` because it may hold `**` → `entities`; for the editor, `getRichTextSource`.

## Related
- **Built from:** `internal/richText` (the Markdown parser, the entities, the conversions and the elements, shared with `Message.Text`)
- **See also:** [Message](../message/COMPONENT.md), [Composer](../composer/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Typography](../typography/COMPONENT.md)
