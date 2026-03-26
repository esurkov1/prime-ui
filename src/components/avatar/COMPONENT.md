# Avatar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Circular avatar with an optional photo (`Avatar.Image`), a fallback layer (`Avatar.Fallback`), and an optional horizontal stack (`Avatar.Group`) with an overflow cell.

- **Use** for profile pictures, participant lists, assignees in tables, and compact identity in headers or comments when a face or initials aid recognition.
- **Use** `Avatar.Group` when several avatars should overlap in one row and you may show a “+N” overflow.
- **Do not use** as the only focusable control without a wrapping `button` or `link` when the avatar itself must be actionable.
- **Do not use** for non-circular crops or rich media cards; keep this primitive for round avatars and short fallback content.
- **Do not use** expecting an external “controlled” image load state; status lives inside `Avatar.Root` and resets when `src` changes (see Rules).

## Composition

- **`Avatar.Root`** — outer `div` with `data-size`, provides context (`size`, internal image status). Place **`Avatar.Image`** (optional) and **`Avatar.Fallback`** inside; image is painted above the fallback in the layout.
- **`Avatar.Image`** — `img` with `data-status` (`loading` \| `loaded` \| `error`). Requires **`src`**; the implementation remounts when **`src`** changes, which restarts loading and context status.
- **`Avatar.Fallback`** — `span` shown when the image is absent, loading, or in error; when the image has loaded successfully, the fallback gets **`aria-hidden`**.
- **`Avatar.Group.Root`** — horizontal flex row; passes its **`size`** into child **`Avatar.Root`** and **`Avatar.Group.Overflow`** that omit their own **`size`** (including through **`React.Fragment`** children).
- **`Avatar.Group.Overflow`** — cell matching avatar dimensions for text such as `+3`.

### Minimal example

```tsx
import { Avatar } from "prime-ui-kit";

export function Example() {
  return (
    <Avatar.Root>
      <Avatar.Image src="/avatar.png" alt="" />
      <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar.Root>
  );
}
```

## Rules

- Image lifecycle is **internal**: context status is `idle` \| `loading` \| `loaded` \| `error`; there is no prop to control it from outside—change **`src`** (or remove **`Avatar.Image`**) to reset behavior.
- Put **`Avatar.Image`** and **`Avatar.Fallback`** only under **`Avatar.Root`**; **`Avatar.Fallback`** does not accept a **`src`**—photos go through **`Avatar.Image`** only.
- Give **`Avatar.Root`** or a wrapper a clear name for assistive tech (**`aria-label`**, **`aria-labelledby`**, or nearby visible text). On **`Avatar.Image`**, use a non-empty **`alt`** when the photo conveys meaning; use **`alt=""`** when it duplicates a visible name.
- After a successful load, **`Avatar.Fallback`** is **`aria-hidden`** so screen readers do not double-announce initials and alt text.
- For **`Avatar.Group.Root`** and **`Avatar.Group.Overflow`**, prefer summary labels (**`aria-label`**) when the stack or “+N” needs context.
- There is no **`disabled`** prop; mute or disable via the parent (e.g. button **`disabled`**, link **`aria-disabled`**, reduced opacity).
- **`Avatar.Group`** is laid out as a **horizontal** row only; nesting **`Avatar.Root`** inside another **`Avatar.Root`** is not a supported pattern.

## API

### Avatar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl"` | `"m"` | No | Diameter, radius, and fallback typography scale |
| children | `React.ReactNode` | — | No | Typically `Avatar.Image` and `Avatar.Fallback` |
| className | `string` | — | No | Additional class on the root |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other root attributes |

### Avatar.Image

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| src | `string` | — | Yes | Image URL; changing `src` remounts the image and resets status |
| alt | `string` | `""` | No | Alternative text for the image |
| className | `string` | — | No | Class on the `img` |
| …rest | `Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" \| "alt">` | — | No | e.g. `loading`, `decoding`, event handlers |

### Avatar.Fallback

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Initials, icon, or placeholder |
| className | `string` | — | No | Class on the `span` |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other attributes |

### Avatar.Group.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | same as `Avatar.Root` | `"m"` | No | Size applied to child `Avatar.Root` and `Avatar.Group.Overflow` without their own `size` |
| children | `React.ReactNode` | — | No | `Avatar.Root` nodes and optional `Avatar.Group.Overflow` |
| className | `string` | — | No | Class on the group container |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes |

### Avatar.Group.Overflow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | same as `Avatar.Root` | `"m"` | No | Local size when not inherited from the group |
| children | `React.ReactNode` | — | No | e.g. `+3` |
| className | `string` | — | No | Class on the overflow cell |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes |

## Related

- [Button](../button/COMPONENT.md)
- [Dropdown](../dropdown/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [Tooltip](../tooltip/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
