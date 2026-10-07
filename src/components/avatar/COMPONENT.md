# Avatar

**Category:** data-display

> A round photo of a person or entity with an initials or icon fallback, presence dot and overlapping groups.

## When to use
- A person or organization next to its name: lists, comments, table cells, headers.
- The signed-in user in the app chrome.
- Participants of a project or chat as an overlapping group with "+N".
- Presence (online / away / busy / offline) on a person.

## When not to use
- A status or category of an item (not a person) → use [Badge](../badge/COMPONENT.md).
- A removable selected person in a field → use [Tag](../tag/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).
- A product image or cover → use `Card.Media` / `Card.Cover` from [Card](../card/COMPONENT.md) or a plain `<img>`.
- An icon-only action → use [Button](../button/COMPONENT.md).

## Import
```tsx
import { Avatar } from "prime-ui-kit";
```

## Anatomy
```
Avatar.Root                   circle, size and fallback hue
├── Avatar.Image              photo; hidden while loading / on error
├── Avatar.Fallback           initials or icon, visible until the photo loads
└── Avatar.Status             optional presence dot on the bottom-end edge

Avatar.Group.Root             overlapping row, passes size to children
├── Avatar.Root …
└── Avatar.Group.Overflow     "+N" cell of the same diameter
```

## API

### Avatar.Root
Forwards `ref` to the `<div>`. No `asChild`. Provides context for Image, Fallback and Status (they throw outside Root).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl"` (`AvatarSize`) | `"m"` | Diameter 20 · 24 · 32 · 40 · 48 · 64px. Inside `Avatar.Group.Root` the group size is used when `size` is not set. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` (`PaletteColor`) | `"gray"` | Hue of the fallback layer (soft fill + hue text). |
| `children` | `ReactNode` | — | `Avatar.Image`, `Avatar.Fallback`, `Avatar.Status`. |
| `className` | `string` | — | Extra class on the root. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`), e.g. `aria-label` when no name is written next to it.

### Avatar.Image
Forwards `ref` to the `<img>`. Remounts when `src` changes (loading restarts).

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Image URL. |
| `alt` | `string` | `""` | Empty when the name is written next to the avatar; otherwise the person's name. |
| `className` | `string` | — | Extra class on the image. |

+ native `<img>` props except `src` and `alt` (`onLoad` / `onError` are still called).

### Avatar.Fallback
No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Initials (1–2 letters) or an icon (fills about 50% of the circle). |
| `className` | `string` | — | Extra class. |

+ native `<span>` props.

### Avatar.Status
No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"online" \| "offline" \| "away" \| "busy"` (`AvatarPresence`) | — (required) | Presence state. |
| `labels` | `Partial<AvatarStatusLabels>` | see Accessibility | Accessible names of the states. |
| `className` | `string` | — | Extra class. |

+ native `<span>` props except `children`.

### Avatar.Group.Root
Forwards `ref` to the `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `AvatarSize` | `"m"` | Passed to every direct `Avatar.Root` / `Avatar.Group.Overflow` child (also inside fragments) that has no own `size`. |
| `role` | `string` | `"group"` | ARIA role; give the group an `aria-label` ("Участники: 6"). |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Avatars and an optional Overflow cell. |

+ native `<div>` props.

### Avatar.Group.Overflow
Forwards `ref` to the `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `AvatarSize` | `"m"` | Diameter; set by the group when omitted. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | "+N" text. |

+ native `<div>` props (give it `aria-label`, e.g. "Ещё 3 участника").

### CSS custom properties
| Property | Default | Description |
|---|---|---|
| `--avatar-ring` | `var(--prime-color-bg-canvas)` | Ring around group members and the status dot. Card, Modal, Drawer, Popover and Sidebar set it to their own fill; set it yourself on a custom filled block (e.g. `var(--prime-color-card-bg)`). |
| `--avatar-slot-size` | — | Set by a host slot to size the avatar to the slot; wins over `size`. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 20px circle | Dense table cells, inline mentions | |
| `s` | 24px | Menus, compact groups in a header | |
| `m` | 32px | Lists and rows | yes |
| `l` | 40px | Comments, people lists with two-line text | |
| `xl` | 48px | Cards, profile blocks | |
| `2xl` | 64px | Profile headers | |

Initials are 40% of the diameter, "+N" 36%, weight 500. The status dot is 30% of the diameter.

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Neutral gray wash, gray initials | Unknown user, guest, icon fallback | yes |
| `blue` | Blue wash and initials | Person hue | |
| `green` | Green | Person hue | |
| `orange` | Orange | Person hue | |
| `red` | Red | Person hue | |
| `yellow` | Yellow | Person hue | |
| `purple` | Purple | Person hue | |
| `sky` | Sky blue | Person hue | |
| `pink` | Pink | Person hue | |
| `teal` | Teal | Person hue | |

`color` affects only the fallback; a loaded photo covers it. Derive the hue from a stable user id so a person always has the same color.

### Avatar.Status `status`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `online` | Success-colored dot with a ring | The person is active | — (required) |
| `away` | Warning-colored dot | Idle | |
| `busy` | Danger-colored dot | Do not disturb | |
| `offline` | Gray solid dot | Not connected | |

### Fallback content (structural)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| initials | 1–2 letters in the hue text | A known person without a photo | |
| icon | Icon at 50% of the circle | Guest, system account, unknown entity | |

**Combinations**
- Recommended: `Avatar.Image` + `Avatar.Fallback` always together; `m` in lists, `s` in groups in headers.
- Allowed: `Avatar.Status` on any size from `m` up (smaller dots become hard to see).
- Avoid: a colored fallback that changes between renders; presence on `xs`; a group mixing explicit sizes.

**Sizes**
Avatar has its own scale (adds `2xl`). In a row next to an `m` control (36px) use `m` (32px); next to a two-line list item use `l`.

**Hierarchy**
The avatar supports the name, it does not replace it: keep the name as text next to it whenever there is room.

## States
| State / attribute | Element | Driven by | Notes |
|---|---|---|---|
| `data-size` | Root, Group.Root, Group.Overflow | `size` / group size | |
| `data-color` | Root | `color` | Always set (default `gray`). |
| `data-status="loading" \| "loaded" \| "error"` | Image | image load events | `loading`: transparent, fades in on `loaded`; `error`: hidden, the fallback stays. |
| `aria-hidden="true"` | Fallback | image status `loaded` | The fallback is hidden from screen readers once the photo is shown. |
| `data-status="online" \| "offline" \| "away" \| "busy"` | Status | `status` | Dot color. |

Loading state is internal (uncontrolled); changing `src` restarts it.

## Layout & spacing
- Inline-flex, never shrinks; vertical-align middle.
- Avatar → name: `gap: var(--prime-space-3)` in lists and cards; `gap: var(--prime-space-2)` inside DataTable cells (DataTable indents sub-rows by avatar + `--prime-space-2`, so child text lines up under the parent's text). Name and secondary line stacked without gap.
- Group: members overlap by 25% of the diameter with a 2px ring in `--avatar-ring`.
- In a list item use a grid `auto minmax(0, 1fr) auto` so long names truncate.

## Accessibility
- `Avatar.Image` `alt`: empty when the name is written next to it, otherwise the name. Without a photo, put `aria-label` on `Avatar.Root` when no name is shown.
- `Avatar.Status` is `role="img"` with `aria-label` from `labels`.
- `Avatar.Group.Root` is `role="group"`; give it `aria-label`. Give `Avatar.Group.Overflow` an `aria-label` ("Ещё 3 участника").
- `labels` (`AvatarStatusLabels`) on `Avatar.Status`:
  - `online` — `"В сети"`
  - `offline` — `"Не в сети"`
  - `away` — `"Отошёл"`
  - `busy` — `"Занят"`

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Six diameters xs–2xl | Picking a size for the context |
| [colors.tsx](examples/colors.tsx) | Ten fallback hues | Coloring initials per user |
| [states.tsx](examples/states.tsx) | Photo, initials, broken URL, icon fallback | Handling missing or failing photos |
| [src-from-state.tsx](examples/src-from-state.tsx) | Switching `src` from state | Photo upload or profile switch |
| [presence.tsx](examples/presence.tsx) | `Avatar.Status` online / away / busy / offline | People lists and chats |
| [group.tsx](examples/group.tsx) | Groups `s` and `l` with "+N" | Participants of a project or chat |
| [team-card.tsx](examples/team-card.tsx) | Card with a group and a member list with presence | Team overviews; `--avatar-ring` on a custom fill |

```tsx
import { Avatar } from "prime-ui-kit";

export function UserAvatar() {
  return (
    <Avatar.Root color="blue">
      <Avatar.Image src="/avatars/anna.jpg" alt="Анна Климова" />
      <Avatar.Fallback>АК</Avatar.Fallback>
    </Avatar.Root>
  );
}
```

## Mistakes
- `Avatar.Image` without `Avatar.Fallback` → add initials; a failed photo otherwise leaves an empty circle.
- `alt="Анна Климова"` while the name is printed next to it → `alt=""` (avoid double announcement).
- A random `color` on every render → derive it from the user id.
- A custom presence dot → use `Avatar.Status`.
- A group on a custom filled block with a canvas-colored ring → set `--avatar-ring` to that fill.
- `size` on every avatar in a group → set `size` once on `Avatar.Group.Root`.

## Related
- [Badge](../badge/COMPONENT.md) — status labels for items.
- [Card](../card/COMPONENT.md) — profile and team cards.
- [DataTable](../data-table/COMPONENT.md) — avatars in table cells.
- [Sidebar](../../layout/sidebar/COMPONENT.md) — the signed-in user in the app chrome.
