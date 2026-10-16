# Avatar

**Category:** data-display
**Kind:** primitive

> A round photo of a person or organization with an initials or icon fallback, a presence dot and overlapping groups.

## When to use
- A person or organization next to its name: lists, comments, table cells, headers.
- The signed-in user in the app chrome.
- Participants of a project or chat as an overlapping group with «+N».
- Presence (online / away / busy / offline) on a person.

## When not to use
- A status or category of an item → use [Badge](../badge/COMPONENT.md).
- A product, file or cover preview → use [Thumbnail](../thumbnail/COMPONENT.md).
- A removable selected person in a field → [TagSelect](../tag-select/COMPONENT.md).

## Import
```tsx
import { Avatar } from "prime-ui-kit";
```

## Anatomy
```
Avatar.Root            <div> circle; size, color, image load state
├─ Avatar.Image        <img>, fades in over the fallback once loaded
├─ Avatar.Fallback     initials or Icon under the image
└─ Avatar.Status       presence dot on the bottom-end edge

Avatar.Group           overlapping row, gives its size to members
├─ Avatar.Root …
└─ Avatar.Overflow     «+N» cell of the same diameter
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Avatar.Root
`ref` → `HTMLDivElement`. The circle: diameter tier and fallback hue; tracks the image load for the Fallback. Named by `aria-label`, it is one `role="img"`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl"` | `"m"` | Diameter 20 · 24 · 32 · 40 · 48 · 64 px. Inside `Avatar.Group` the group size is used when it is not set. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue of the fallback; derive it from a stable user id. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `aria-label` (when no name is shown: the avatar becomes `role="img"` of that name) and the other div attributes. |

### Avatar.Image
`ref` → `HTMLImageElement`. The photo; hidden while it loads and after an error, so the Fallback shows through. A new `src` fades in over the last one. Loads lazily and decodes off the main thread (`loading="lazy"`, `decoding="async"`; pass either to override).

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Photo URL. |
| `alt` | `string` | `""` | Empty: the name is written next to the avatar or set once with `aria-label` on `Avatar.Root`. |
| `…rest` | `Omit<ImgHTMLAttributes<HTMLImageElement>, "src" \| "alt">` | — | `className`, `onLoad`, `onError` and the other img attributes. |

### Avatar.Fallback
`ref` → `HTMLSpanElement`. A `<span>` with initials or an `Icon` under the photo; `aria-hidden` once the photo has loaded.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Avatar.Status
`ref` → `HTMLSpanElement`. A presence dot on the bottom-end edge, `role="img"` named by the state, cut out by a ring in `--avatar-ring`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"online" \| "offline" \| "away" \| "busy"` | — (required) | Presence state, told by shape and color: `online` a full green dot, `away` a warning crescent, `busy` a danger dot with a bar, `offline` a hollow gray ring. |
| `labels` | `Partial<AvatarStatusLabels>` | — | Accessible names of the states, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Avatar.Group
`ref` → `HTMLDivElement`. An overlapping row (`role="group"`); members overlap by an eighth of the diameter with a ring in `--avatar-ring`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl"` | — | Size of every `Avatar.Root` / `Avatar.Overflow` inside without its own `size`; unset, they stay `m`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label`, `className` and the other div attributes. |

### Avatar.Overflow
`ref` → `HTMLDivElement`. The «+N» cell at the end of a group, the same diameter as its avatars; named by `aria-label`, it is `role="img"`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl"` | `"m"` | Diameter; inside `Avatar.Group` the group size when not set. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` («+3»), `aria-label` («Ещё 3 участника») and the other div attributes. |

## Variants

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft fill, gray initials | unknown or system users | yes |
| `blue` · `sky` · `teal` · `green` · `yellow` · `orange` · `red` · `pink` · `purple` | soft hue fill, hue initials | people: the hue comes from a stable user id | |

The soft fill is opaque: the soft hue is composited over the ground the avatar stands on (the current layer, which every surface sets; `--avatar-ring` from a host whose ground is not a layer), so it looks like the soft hue there and an overlapped neighbour in a group never shows through. `Avatar.Overflow` is composited the same way.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 20px | dense tables, inline mentions | |
| `s` | 24px | compact lists, groups in headers | |
| `m` | 32px | lists, comments | yes |
| `l` | 40px | cards, member lists | |
| `xl` | 48px | profile cards | |
| `2xl` | 64px | profile headers | |

## States
| State | Driven by | DOM |
|---|---|---|
| loading | `Avatar.Image` mounted | image `data-status="loading"` (transparent), Fallback visible |
| loaded | image `load` | `data-status="loaded"`, the image fades in over `base`; Fallback `aria-hidden` |
| error | image `error` | `data-status="error"`, image hidden, Fallback visible |
| presence | `Avatar.Status` `status` | `data-status` on the dot |
| size / hue | `size`, `color` | `data-size`, `data-color` |

## Layout & spacing
- Inline-flex, never shrinks, `vertical-align: middle`.
- Avatar → name: space step 3 (12px) in lists and cards, step 2 (8px) in table cells.
- Group: members overlap by an eighth of the diameter (initials are never cut) with a 2px ring in the ground they stand on: the current layer of the surface around them (no surface sets anything), or `--avatar-ring` from a host whose ground is not a layer (a reaction chip sets its own fill); the fills of initials and «+N» are composited over the same ground.
- An icon fallback is half the diameter: a kit `Icon` reads `--prime-icon-size`, a raw svg too.
- In a leading media slot (`Drawer.Icon`, `Modal.Icon`, `Sheet.Icon`, `Card.Icon`) the avatar takes the slot's size (`l`, 40px) whatever `size` it was given, also through a wrapper component of yours; the slot then draws no tile.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `Avatar.Image` `alt` stays empty. Without the name written nearby, name the avatar once with `aria-label` on `Avatar.Root`: it becomes `role="img"` of that name, whether the photo, the initials or an icon shows.
- `Avatar.Status` is `role="img"` with `aria-label` from `labels`. Every state has its own shape (full dot, crescent, dot with a bar, hollow ring), so presence never rests on color alone.
- `Avatar.Group` is `role="group"`; give it `aria-label`. Give `Avatar.Overflow` an `aria-label` («Ещё 3 участника»): it becomes `role="img"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Avatar.Status

| Key | Default | Used for |
|---|---|---|
| `online` | `"В сети"` | Name of the `online` dot. |
| `offline` | `"Не в сети"` | Name of the `offline` dot. |
| `away` | `"Отошёл"` | Name of the `away` dot. |
| `busy` | `"Занят"` | Name of the `busy` dot. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A photo with initials underneath while it loads, and initials alone; the name is on the avatar itself — `Avatar.Image`, `Avatar.Fallback`, `aria-label`. |
| [variants.tsx](examples/variants.tsx) | Every palette hue of the fallback; derive it from a stable user id — `color`. |
| [sizes.tsx](examples/sizes.tsx) | Every diameter, 20 to 64 px; initials take 40% of it — `size`. |
| [states.tsx](examples/states.tsx) | A loaded photo, a broken URL that falls back to initials, and an icon fallback for a guest — `Avatar.Image`, `Avatar.Fallback`. |
| [presence.tsx](examples/presence.tsx) | A presence dot on the avatar edge: each state has its own shape and color and is announced by its name — `Avatar.Status`, `labels`. |
| [team-group.tsx](examples/team-group.tsx) | Project members as an overlapping row with a «+N» cell; the group size goes to every member — `Avatar.Group`, `Avatar.Overflow`, `size`. |
| [src-from-state.tsx](examples/src-from-state.tsx) | A new photo source loads over the last photo and cross-fades in; initials show only until a first photo arrives — `src`. |

## Mistakes
- `Avatar.Image` without `Avatar.Fallback` → a failed photo leaves an empty circle; add initials.
- `alt="Анна Климова"` while the name is printed next to it → `alt=""`.
- A random `color` on every render → derive it from the user id.
- A custom presence dot → use `Avatar.Status`.
- A group on a custom filled block with a ring in the wrong color → set `--avatar-ring` to that fill (by default the ring is the current layer, `--prime-color-layer-current`); a kit surface needs nothing.
- The name in both the image `alt` and the root `aria-label`, or only in `alt` (it vanishes when the photo fails) → `aria-label` on `Avatar.Root` once.
- `size` on every avatar in a group → set it once on `Avatar.Group`.

## Related
- **Built from:** `internal/imageSlot` (the photo and its fallback), `internal/namedRole` (a named avatar is an image)
- **See also:** [Thumbnail](../thumbnail/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Card](../card/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md) (a round upload zone around an avatar)
