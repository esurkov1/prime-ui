# CommandMenu

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A modal command palette: search field plus a filterable list of actions. Typing narrows visible options; users pick with pointer or keyboard while focus stays on the combobox input.

**When to use**

- **Dense navigation** — jump to sections, records, or actions without opening full menus (dashboards, CRM, admin).
- **Power-user flows** — one surface for “go to…” and “do…” when labels map cleanly to filter strings and `keywords`.
- **Keyboard-first desktops** — pair with your own global shortcut; arrow keys, Home, End, and Enter are handled from the search field.
- **Grouped actions** — optional section headings and optional tag row under the search for scope chips.

**When not to use**

- **Multi-select or bulk pick** — only one active option; no built-in multi-value selection.
- **Server-only search without a client list** — filtering is synchronous over registered items; huge lists need virtualization or a different pattern.
- **Non-modal pickers** — use [Dropdown](../dropdown/COMPONENT.md) or [Select](../select/COMPONENT.md) for inline single choice.
- **Built-in “no results” UX** — empty matches hide groups/items; you supply messaging or empty state markup yourself.

## Composition

- **`CommandMenu.Dialog`** wraps content in [Modal](../modal/COMPONENT.md) (`role="dialog"`) and mounts **`CommandMenuRootProvider`**: search string, active option, and item registry live here. Open state is controlled (`open` / `onOpenChange`) or uncontrolled (`defaultOpen`).
- **Recommended top order:** optional **`DialogTitle`** / **`DialogDescription`** (same typography shell as modal headings) → **`InputRow`** (optional slots **`leading`** / **`trailing`**) → **`Input`** → optional **`TagSection`** → **`TagSectionLabel`** / **`TagRow`** → **`List`** → optional **`Footer`** (optional **`FooterKeyBox`** for key hints).
- **`List`** is the **`listbox`** (`id` wired to the input’s **`aria-controls`**). **`Group`** wraps **`Item`** nodes; groups with no visible items get **`hidden`**. **`Item`** registers for filtering and keyboard activation; put **`ItemIcon`** and label text inside **`Item`**.
- **`Input`** may sit directly under **`Dialog`** without **`InputRow`** (valid markup); **`InputRow`** is the styled search row when you need leading/trailing slots or density.

### Minimal example

```tsx
import * as React from "react";
import { CommandMenu } from "prime-ui-kit";

export function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
      <CommandMenu.InputRow>
        <CommandMenu.Input placeholder="Search" aria-label="Search commands" />
      </CommandMenu.InputRow>
      <CommandMenu.List>
        <CommandMenu.Item value="action" onSelect={() => setOpen(false)}>
          Action
        </CommandMenu.Item>
      </CommandMenu.List>
    </CommandMenu.Dialog>
  );
}
```

## Rules

- **Open state:** **`open`** + **`onOpenChange`** for controlled mode; **`defaultOpen`** (defaults to `false` via `Modal.Root`) for uncontrolled. Escape and overlay click close according to **`closeOnEscape`** and **`closeOnOverlayClick`** (both default `true`).
- **Search state:** **`Input`** is uncontrolled by default (internal `search` drives filtering). Pass **`value`** / **`onChange`** for controlled input; when **`value`** is set, internal state tracks it via an effect. **`type`** is always **`search`**; **`size`** is not a valid prop on **`Input`**.
- **Remount reset:** when the dialog content tree mounts, search and active item reset and the input is focused on the next animation frame—do not assume text persists across unmount.
- **Filtering:** matches run against normalized **`value`** and **`keywords`** together; **`disabled`** items are excluded from matches and keyboard order. **`Item`** **`value`** is required.
- **Selection:** Enter activates the active option; click and pointer move on an enabled, visible item updates the active option and can fire **`onSelect`**. **`Item`** renders **`type="button"`**; do not rely on **`type`** override.
- **Panel styling:** **`className`** and **`contentClassName`** merge onto the dialog panel; width/height helpers (e.g. `dialogContentWide`, `dialogContentNarrow`, `dialogContentTight`) live in the component CSS module—import those classes in your app if you need them.
- **Accessibility:** set **`aria-labelledby`** (and **`DialogTitle`** with a matching **`id`**) or an appropriate **`aria-label`** on the dialog surface; **`Input`** exposes **`role="combobox"`**, **`aria-controls`**, and **`aria-activedescendant`**; **`List`** is **`listbox`**, **`Item`** is **`option`** with **`aria-selected`**. Modal focus trap and scroll lock follow [Modal](../modal/COMPONENT.md) behavior.
- **FooterKeyBox** wraps [Badge](../badge/COMPONENT.md) (`size="s"`, `color="gray"`); **`tone="muted"`** maps to badge variant **`lighter`**, default maps to **`stroke`**.

## API

### CommandMenu.Dialog

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Palette markup (provider runs inside the panel) |
| open | `boolean` | — | no | Controlled open state |
| defaultOpen | `boolean` | `false` | no | Initial open when uncontrolled |
| onOpenChange | `(open: boolean) => void` | — | no | Open state change callback |
| closeOnEscape | `boolean` | `true` | no | Close when Escape is pressed |
| closeOnOverlayClick | `boolean` | `true` | no | Close when the overlay is clicked |
| overlayClassName | `string` | — | no | Overlay wrapper class |
| className | `string` | — | no | Panel class (merged with internal dialog layout) |
| contentClassName | `string` | — | no | Additional panel class merged before `className` |
| aria-labelledby | `string` | — | no | IDs of labelling element(s) |
| aria-describedby | `string` | — | no | IDs of description element(s) |

### CommandMenu.DialogTitle / CommandMenu.DialogDescription

| Part | Element | Notes |
|------|---------|--------|
| DialogTitle | `h2` | `React.HTMLAttributes<HTMLHeadingElement>` and `className`; same title class stack as modal shell |
| DialogDescription | `p` | `React.HTMLAttributes<HTMLParagraphElement>` and `className`; same description class stack as modal shell |

### CommandMenu.InputRow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Typically **`Input`** |
| leading | `React.ReactNode` | — | no | Start slot |
| trailing | `React.ReactNode` | — | no | End slot |
| density | `"compact" \| "comfortable"` | `"compact"` | no | Search row vertical padding |
| className | `string` | — | no | Wrapper class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | no | Forwarded to the row `div` |

### CommandMenu.Input

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` (and other input value types) | — | no | Controlled value; when set, filters sync from this value |
| onChange | `React.ChangeEventHandler<HTMLInputElement>` | — | no | Standard change handler; internal state updates when uncontrolled |
| className | `string` | — | no | Input class |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" \| "type">` | — | no | Other attributes except `size` and `type` (`type` is fixed to `search`) |

### CommandMenu.List

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Groups and/or items |
| className | `string` | — | no | List surface class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | no | Passed through to the scroll container root (`role="listbox"`, stable `id` for `aria-controls`) |

### CommandMenu.Group

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| heading | `React.ReactNode` | — | no | Section label (string vs node pick different heading wrappers) |
| children | `React.ReactNode` | — | no | **`Item`** elements |
| className | `string` | — | no | Group container class |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | no | Forwarded to the group `div`; container is **`hidden`** when no visible items belong to the group |

### CommandMenu.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | yes | Text participating in filter matching |
| keywords | `string` | `""` | no | Extra space for matching (not shown as the label) |
| size | `CommandMenuItemSize` (`"s"` \| `"m"`) | `"s"` | no | Row density / type scale |
| onSelect | `() => void` | — | no | Called when the item is chosen (click or keyboard activate) |
| disabled | `boolean` | — | no | Excluded from filtering, visibility, and activation |
| className | `string` | — | no | Button class |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "onSelect">` | — | no | Other button props; `type` is always `button` |

### CommandMenu.ItemIcon

Polymorphic icon slot: `as` (element type, default `"span"`), `className`, and remaining props forwarded to the chosen component (see `CommandMenuItemIconProps`).

### CommandMenu.TagSection / TagSectionLabel / TagRow

`React.HTMLAttributes<HTMLDivElement>` with `className` and `children` for the optional block between search and list.

### CommandMenu.Footer

`React.HTMLAttributes<HTMLDivElement>` with `className` and `children`; base styles from the module (e.g. footer layout tokens). Optional module classes such as `footerMuted` apply via `className` when you import the stylesheet.

### CommandMenu.FooterKeyBox

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Key cap or icon (rendered inside `Badge.Icon`) |
| tone | `"default" \| "muted"` | `"default"` | no | Badge visual variant (`stroke` vs `lighter`) |
| className | `string` | — | no | Extra class on the badge root |
| …rest | `Omit<React.HTMLAttributes<HTMLDivElement>, "color">` | — | no | Additional attributes except `color` |

## Related

- [Modal](../modal/COMPONENT.md) — dialog shell, focus trap, portal
- [Badge](../badge/COMPONENT.md) — used inside **`FooterKeyBox`**
- [Button](../button/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md) — triggers and links outside the palette
- [Tag](../tag/COMPONENT.md) — common companion for **`TagRow`**
- [Kbd](../kbd/COMPONENT.md) — shortcut hints in **`InputRow`** trailing slot
- [Typography](../typography/COMPONENT.md) — titles, hints, footer copy
- [Dropdown](../dropdown/COMPONENT.md), [Select](../select/COMPONENT.md) — non-modal single-choice lists
