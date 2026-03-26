# Avatar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite circular avatar component: photo (`Avatar.Image`), fallback layer (`Avatar.Fallback`), and optional overlapping group (`Avatar.Group`).

## What it’s for

- **Profiles and collaboration** — a recognizable face in a chat header, colleague card, or call participant list when you need to quickly match a person to an action.
- **Commerce and service flows** — visual tie-in of an order, delivery, or ticket to a specific manager or courier without long captions.
- **Admin and catalogs** — compact account representation in tables, filters, and audit logs where name, role, and status sit side by side.

## Use cases

Each example targets a different screen type and prop set.

### Basic

Portrait with initials fallback: while the photo loads, the fallback shows; after a successful load it is hidden from screen readers via `aria-hidden`.

```tsx
import { Avatar } from "prime-ui-kit";

export function UserAvatar({ photoUrl, initials }: { photoUrl: string; initials: string }) {
  return (
    <Avatar.Root size="l" aria-label="User avatar">
      <Avatar.Image src={photoUrl} alt="" />
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>
  );
}
```

### Variants / sizes

Team landing: same structure, different `size` for emphasis (large lead, smaller others).

```tsx
import { Avatar, type AvatarSize } from "prime-ui-kit";

const team: { name: string; src: string; size: AvatarSize }[] = [
  { name: "Lead", src: "/photos/lead.jpg", size: "3xl" },
  { name: "Analyst", src: "/photos/analyst.jpg", size: "xl" },
  { name: "Designer", src: "/photos/designer.jpg", size: "l" },
];

export function TeamRow() {
  return (
    <div className="previewRowWrap rowAlignCenter">
      {team.map((m) => (
        <Avatar.Root key={m.name} size={m.size} aria-label={m.name}>
          <Avatar.Image src={m.src} alt="" />
          <Avatar.Fallback>{m.name.slice(0, 2)}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
```

### In context (participant bar)

A horizontal “stack” with overlap and a counter for hidden people — typical for a call panel or co-editing UI.

```tsx
import { Avatar } from "prime-ui-kit";

export function CallParticipantsBar(props: {
  visible: { id: string; src?: string; initials: string }[];
  extraCount: number;
}) {
  return (
    <Avatar.Group.Root size="m" aria-label={`Participants, ${props.extraCount} more`}>
      {props.visible.map((p) => (
        <Avatar.Root key={p.id}>
          {p.src ? <Avatar.Image src={p.src} alt="" /> : null}
          <Avatar.Fallback>{p.initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      {props.extraCount > 0 ? (
        <Avatar.Group.Overflow aria-label={`Additional participants: ${props.extraCount}`}>
          +{props.extraCount}
        </Avatar.Group.Overflow>
      ) : null}
    </Avatar.Group.Root>
  );
}
```

### Image swap from parent state

List with row selection: portrait URL comes from state. The component resets its internal load cycle when `src` changes (implementation uses a key derived from `src`).

```tsx
import * as React from "react";
import { Avatar } from "prime-ui-kit";

export function InspectorAvatar(props: { candidates: { id: string; photo: string }[] }) {
  const [activeId, setActiveId] = React.useState(props.candidates[0]?.id);
  const active = props.candidates.find((c) => c.id === activeId);

  if (!active) return null;

  return (
    <aside>
      <label>
        Record
        <select value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          {props.candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
      </label>
      <Avatar.Root size="xl">
        <Avatar.Image src={active.photo} alt="" />
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar.Root>
    </aside>
  );
}
```

## Anatomy

- **`Avatar.Root`** — `div` with `data-size`, context with image status (`idle` | `loading` | `loaded` | `error`).
- **`Avatar.Image`** — `img` with `data-status` (`loading` | `loaded` | `error`), positioned above the fallback.
- **`Avatar.Fallback`** — `span` under the image; when `imageStatus === "loaded"` it gets `aria-hidden`.
- **`Avatar.Group.Root`** — `div` with a flex row; child `Avatar.Root` and `Avatar.Group.Overflow` without their own `size` inherit the group `size`.
- **`Avatar.Group.Overflow`** — `div` with the same visual size as an avatar of the chosen `size`.

## API

### Avatar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl"` | `"m"` | No | Diameter, radius, and fallback type size |
| children | `React.ReactNode` | — | No | Usually `Avatar.Image` and `Avatar.Fallback` |
| className | `string` | — | No | Extra class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other root attributes |

### Avatar.Image

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| src | `string` | — | Yes | URL; remounts when changed |
| alt | `string` | `""` | No | Alternative text |
| className | `string` | — | No | Class on `img` |
| …rest | `Omit<ImgHTMLAttributes, "src" \| "alt">` | — | No | `loading`, `decoding`, handlers, etc. |

### Avatar.Fallback

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Text, icon, or placeholder |
| className | `string` | — | No | Class on `span` |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other attributes |

### Avatar.Group.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | see Avatar.Root | `"m"` | No | Size for children without their own `size` |
| children | `React.ReactNode` | — | No | Avatars and optional `Overflow` |
| className | `string` | — | No | Container class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes |

### Avatar.Group.Overflow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | see Avatar.Root | `"m"` | No | Local size if not set by the group |
| children | `React.ReactNode` | — | No | e.g. `+3` |
| className | `string` | — | No | Cell class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes |

## Variants

There is no separate `variant` prop. Visual difference comes only from **`size`** (nine steps from `s` to `6xl`) and **`Fallback`** content (text, icon, symbol).

## States

Image status in root context:

| Status | When | Behavior |
|--------|------|----------|
| `idle` | No `Avatar.Image` or before effect | Fallback visible, no `aria-hidden` on fallback |
| `loading` | After `Image` mounts, until `onLoad` / `onError` | Image with `data-status="loading"` hidden by styles (opacity 0) |
| `loaded` | Successful `onLoad` | Image visible; `Avatar.Fallback` with `aria-hidden` |
| `error` | `onError` | Image hidden (`display: none` in styles); fallback visible again |

There is no user-facing `disabled` prop on the avatar — disable styling is handled at the parent level (button, link, opacity) when needed.

## Accessibility (a11y)

- Provide meaningful context on **`Avatar.Root`** or a wrapper: `aria-label`, `aria-labelledby`, or adjacent visible text.
- For **`Avatar.Image`**, set a meaningful **`alt`** when the avatar carries meaning; decorative duplicates of a name can use an empty `alt`.
- After the photo loads, **`Avatar.Fallback`** is marked **`aria-hidden`** so duplicates are not announced.
- For **`Avatar.Group.Root`** and **`Avatar.Group.Overflow`**, summary labels (`aria-label`) help, especially with a “+N” counter.

## Limitations and notes

- Load status is **not exposed** externally: you cannot plug in a “controlled” status without workarounds; changing **`src`** is the main way to reset state.
- **`Avatar.Fallback`** does not accept `src`: images only via **`Avatar.Image`**.
- The group is built for a **horizontal** row; there is no vertical layout in the API.
- Nesting **`Avatar.Root`** inside another **`Avatar.Root`** is not part of the intended pattern.

## Related components

- **Button** — clickable wrapper when the avatar opens a profile or menu.
- **Dropdown** — trigger with avatar and action list.
- **Typography** — caption next to the avatar (name, role).
- **Tooltip** — short info on avatar hover.
