# CommandMenu

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite “command palette” component: a modal with a search field and a list of actions, where items filter as you type and can be chosen with the keyboard or the mouse.

## What it’s for

- **Enterprise web app:** jump between sections (reports, settings, billing) without opening the full menu.
- **CRM or operator desktop:** one shortcut opens actions for the current deal or ticket.
- **Editor or content studio:** “create”, “export”, “preview” in one searchable list.
- **Support:** pull knowledge-base articles and canned replies from keywords in the search box.
- **E‑commerce or account area:** find orders and sections by number, status, or human-readable label.
- **Media library or catalog:** narrow filter tags under the search plus commands like “open playlist”, “share” without a separate filter page.

## Use cases

Each example targets a different product screen and a different set of props.

### Basic

Typical flow: a button opens the palette, the search field filters items by `value` and `keywords`, selecting an item closes the dialog.

```tsx
import { FileText, Search, Settings } from "lucide-react";
import * as React from "react";
import { Button, CommandMenu } from "prime-ui-kit";

export function CommandPaletteBasic() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Commands
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="cmd-basic-title">
        <CommandMenu.DialogTitle id="cmd-basic-title">Application commands</CommandMenu.DialogTitle>
        <CommandMenu.InputRow leading={<Search size={18} strokeWidth={2} aria-hidden />}>
          <CommandMenu.Input placeholder="Command or search…" aria-label="Search commands" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="File">
            <CommandMenu.Item
              value="new document"
              keywords="create new doc"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={FileText} strokeWidth={2} />
              New document
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Application">
            <CommandMenu.Item
              value="settings"
              keywords="settings preferences"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Settings} strokeWidth={2} />
              Settings
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
```

### Variants / density

Another context—tuning density for a directory UI: search row height and list row type size are independent of each other.

```tsx
import { Search } from "lucide-react";
import * as React from "react";
import { CommandMenu } from "prime-ui-kit";

export function CommandPaletteDensityAndItems() {
  const [open, setOpen] = React.useState(true);

  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
      <CommandMenu.InputRow
        density="comfortable"
        leading={<Search size={18} strokeWidth={2} aria-hidden />}
      >
        <CommandMenu.Input placeholder="Counterparty directory…" aria-label="Search" />
      </CommandMenu.InputRow>
      <CommandMenu.List>
        <CommandMenu.Group heading="Legal entities">
          <CommandMenu.Item value="Daisy LLC" size="m" onSelect={() => setOpen(false)}>
            Daisy LLC
          </CommandMenu.Item>
          <CommandMenu.Item value="Sole proprietor Ivanov" size="s" onSelect={() => setOpen(false)}>
            Sole proprietor Ivanov
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Dialog>
  );
}
```

### In context (form / modal / sidebar / …)

A workspace settings screen: title and description at the top, removable search-scope tags under the search field, footer with keyboard hints. Uses `Tag`, `Kbd`, and `Button` from the same kit.

```tsx
import { Search, X } from "lucide-react";
import * as React from "react";
import { Button, CommandMenu, Kbd, Tag, Typography } from "prime-ui-kit";

export function WorkspaceSettingsCommandPalette() {
  const [open, setOpen] = React.useState(true);
  const [scopes, setScopes] = React.useState(["Projects", "People"]);

  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="ws-cmd-title">
      <CommandMenu.DialogTitle id="ws-cmd-title">Workspace</CommandMenu.DialogTitle>
      <CommandMenu.DialogDescription>Search objects and quick actions</CommandMenu.DialogDescription>

      <CommandMenu.InputRow
        leading={<Search size={18} strokeWidth={2} aria-hidden />}
        trailing={
          <>
            <Kbd.Root aria-label="Open command palette">⌘K</Kbd.Root>
            <Button.Root size="m" variant="neutral" mode="ghost" aria-label="Close" onClick={() => setOpen(false)}>
              <Button.Icon>
                <X size={18} strokeWidth={2} aria-hidden />
              </Button.Icon>
            </Button.Root>
          </>
        }
      >
        <CommandMenu.Input placeholder="Where to go…" aria-label="Search" />
      </CommandMenu.InputRow>

      <CommandMenu.TagSection>
        <CommandMenu.TagSectionLabel>
          <Typography.Root size="xs" tone="muted">
            Scope
          </Typography.Root>
        </CommandMenu.TagSectionLabel>
        <CommandMenu.TagRow>
          {scopes.map((s) => (
            <Tag.Root key={s} size="m" onRemove={() => setScopes((p) => p.filter((x) => x !== s))}>
              {s}
            </Tag.Root>
          ))}
        </CommandMenu.TagRow>
      </CommandMenu.TagSection>

      <CommandMenu.List>
        <CommandMenu.Group heading="Actions">
          <CommandMenu.Item value="invite" onSelect={() => setOpen(false)}>
            Invite member
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>

      <CommandMenu.Footer>
        <Typography.Root size="xs" tone="muted">
          Arrow keys and Enter work from the search field.
        </Typography.Root>
      </CommandMenu.Footer>
    </CommandMenu.Dialog>
  );
}
```

### Controlled mode

Integration with a router or analytics: open state and search query live in the parent; the query resets when the dialog closes.

```tsx
import { Search } from "lucide-react";
import * as React from "react";
import { CommandMenu, Typography } from "prime-ui-kit";

export function ControlledCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Typography.Root size="s" tone="muted">
        Query: “{query || "—"}”
      </Typography.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setQuery("");
        }}
      >
        <CommandMenu.InputRow leading={<Search size={18} strokeWidth={2} aria-hidden />}>
          <CommandMenu.Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Synchronized input…"
            aria-label="Search"
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Reset">
            <CommandMenu.Item value="clear" onSelect={() => setQuery("")}>
              Clear search
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
```

## Anatomy

Subcomponent tree:

`CommandMenu.Dialog` → internal state provider → child nodes:

- optional `DialogTitle` / `DialogDescription` (exports align with `Modal`);
- `InputRow` → `Input`;
- optional `TagSection` → `TagSectionLabel`, `TagRow`;
- `List` → `Group` → `Item` (with `ItemIcon` and text inside);
- optional `Footer` → `FooterKeyBox` and text.

## API

### CommandMenu.Dialog

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| open | boolean | — | No | Controlled open state |
| defaultOpen | boolean | false | No | Initial open state |
| onOpenChange | (open: boolean) => void | — | No | Open state change |
| closeOnEscape | boolean | true | No | Close on Escape |
| closeOnOverlayClick | boolean | true | No | Close on overlay click |
| overlayClassName | string | — | No | Overlay class |
| className | string | — | No | Content panel class (width modifiers from the CSS module) |
| contentClassName | string | — | No | Extra panel class |
| aria-labelledby | string | — | No | Reference to title |
| aria-describedby | string | — | No | Reference to description |
| children | React.ReactNode | — | No | Palette markup |

### CommandMenu.DialogTitle / DialogDescription

Heading and paragraph with the same typography classes as the title area in `Modal.Panel` (`h2` / description): standard HTML attributes plus `children`, `className`.

### CommandMenu.InputRow

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| leading | React.ReactNode | — | No | Left slot |
| trailing | React.ReactNode | — | No | Right slot |
| density | "compact" \| "comfortable" | "compact" | No | Input row height |
| children | React.ReactNode | — | No | Usually `Input` |
| className | string | — | No | Wrapper class |
| …rest | HTMLAttributes\<div\> | — | No | Other div attributes |

### CommandMenu.Input

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string, etc. | — | No | Controlled search string |
| onChange | ChangeEventHandler | — | No | Text input |
| …rest | InputHTMLAttributes (without size, type) | — | No | `type` is fixed to `search`; arrow keys, Home, End, and Enter are handled internally |

### CommandMenu.List

Container with `role="listbox"`: `children`, `className`, standard `div` attributes.

### CommandMenu.Group

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| heading | React.ReactNode | — | No | Section heading |
| children | React.ReactNode | — | No | Items |
| …rest | HTMLAttributes\<div\> | — | No | Hidden when there are no visible items |

### CommandMenu.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | Yes | String used for filtering; `""` is always visible |
| keywords | string | "" | No | Extra search terms |
| size | "s" \| "m" | "s" | No | Row size |
| onSelect | () => void | — | No | Selection callback |
| disabled | boolean | — | No | Excluded from filtering and keyboard nav |
| …rest | ButtonHTMLAttributes (without type) | — | No | `type` is always `button` |

### CommandMenu.ItemIcon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | ElementType | "span" | No | Root element or icon component |
| className | string | — | No | Class |
| …rest | props for `as` | — | No | Forwarded to the chosen element |

### CommandMenu.TagSection / TagSectionLabel / TagRow

Semantic wrappers for the block under the search field: `div` attributes and `children`.

### CommandMenu.Footer

Bottom bar: `div` attributes, including the `footerMuted` class from the CSS module for a subdued background.

### CommandMenu.FooterKeyBox

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| tone | "default" \| "muted" | "default" | No | Badge variant (outline / lighter) |
| children | React.ReactNode | — | No | Icon or key label |
| …rest | HTMLAttributes\<div\> (without color) | — | No | Everything else on the Badge root |

## Variants

- **Search row density** `InputRow density`: `compact` or `comfortable`.
- **Item size** `Item size`: `s` or `m`.
- **Key hint tone** `FooterKeyBox tone`: `default` (outlined badge) or `muted` (light fill on a dark footer).
- **Panel width:** classes from `CommandMenu.module.css` (e.g. `dialogContentWide`) via `className` on `Dialog`.

## States

- **Modal open:** controlled (`open` / `onOpenChange`) or uncontrolled (`defaultOpen`).
- **Filtering:** typing in `Input` shrinks the list; items with `disabled` are skipped; `value=""` is never filtered out by the query.
- **Active item:** highlight and `aria-activedescendant` on the search field; groups with no visible items are hidden (`hidden`).
- **Selection:** click or Enter calls `onSelect` on the active item.

## Accessibility (a11y)

- Search field: `role="combobox"`, `aria-controls` points at `List`, `aria-activedescendant` at the option id.
- List: `role="listbox"`.
- Item: `role="option"`, `aria-selected`.
- Provide a visible or visually hidden `DialogTitle` and, if needed, `aria-labelledby` on `Dialog`.
- Keyboard navigation from the input: Up/Down, Home, End, Enter (Escape is handled by the modal).

## Limitations and notes

- No built-in “no results” screen—when there are no matches, groups hide; add your own empty state below the list.
- Single active item; multi-select is not supported.
- Filtering is synchronous and client-side; large lists may need virtualization or external server-side search.
- Global shortcuts (e.g. ⌘K) are not built in—attach a listener on `document` in your app.

## Related components

- **Modal** — dialog foundation.
- **Badge** — used inside `FooterKeyBox`.
- **Button**, **LinkButton** — triggers and footer links.
- **Tag** — often paired with `TagSection` / `TagRow`.
- **Kbd** — shortcut display next to the search field.
- **Typography** — titles and captions around the palette.
