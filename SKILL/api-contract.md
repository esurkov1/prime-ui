# API contract v1 — cheat sheet

One name per concept across the whole kit. If a prop name below does not appear in a component's
`COMPONENT.md` API table, the component does not have it — do not invent it.

## Shared vocabulary (exported types)

```ts
import type { ControlSize, PaletteColor, TextTone, Tone, Variant } from "prime-ui-kit";
// ControlSize  "xs" | "s" | "m" | "l" | "xl"                       default "m"
// Variant      "solid" | "soft" | "outline" | "ghost"               each component uses a subset
// Tone         "neutral" | "accent" | "success" | "warning" | "danger" | "info"
// PaletteColor "gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"
// TextTone     "default" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger"
```

| Concept | API | Notes |
|---|---|---|
| Size | `size` | Default `m`, on the root only; parts read it from the root. Avatar adds `2xl`; Modal/Drawer `Content` takes `size` for its width. `Button.Root`, `Input.Root`, `Icon` and `Checkbox.Indicator` without `size` take the tier of a sized host (Popover, Banner, LoginForm, DataTable toolbar, `ControlSizeProvider`). |
| Treatment | `variant` | `solid · soft · outline · ghost`; structural variants are component-specific (Card templates, FileUpload `dashed \| solid`). Tabs has no variant. |
| Meaning | `tone` | Button: `accent \| neutral \| danger`, plus `inherit` (with `ghost \| soft \| outline`) for an action on a colored host — it takes the host's text color; never recolor a Button with a CSS override. Destructive is `danger`, never `error`. |
| Decoration | `color` | Badge, Avatar, Thumbnail, `SegmentedControl.Item`, `Tabs.Count` / `SegmentedControl.Count`, `FileUpload.FormatBadge`, `Timeline.Item`, TagSelect options. |
| Validation | `invalid`, `hint`, `error` | Props, never parts. A non-empty `error` implies `invalid`; sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, NativeSelect, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, Radio.Group, DigitInput, Pagination, SmartFilter, ColorPicker, ColorSwatches. |
| Text value | native `value` / `onChange` + `onValueChange(string)` | Input (`Input.Field`), Textarea. |
| Other state | `x` / `defaultX` / `onXChange(x)` | DataTable `sort`, `page`, `selected`, `expanded`; SmartFilter `search`; Sidebar `mode`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure (Modal, Drawer, Popover, Dropdown, Tooltip, CommandMenu, Select, Sidebar off-canvas). |
| Dismiss | `closeOnOutsideClick` (default `true`), `closeOnEscape` (default `true`) | Both on every overlay: Modal, Drawer, CommandMenu, Popover, Dropdown. Turn outside click off for destructive confirms; turn Escape off while a request runs. |
| Selection mode | `multiple` | One vs many (Select, Accordion) — never `type`. `mode` only for structurally different values (Datepicker `single \| range`). |
| Status words | `selected`, `current`, `pressed` | `current` marks a navigation location (`Sidebar.Item`, `Breadcrumb.Item`, `Timeline.Item`) and sets `aria-current`; `pressed` a toggle button. |
| Flags | `disabled`, `readOnly`, `required`, `optional`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing` (default `true`) | Fields only; `false` only where focus is obvious otherwise. |
| System strings | `labels?: Partial<XLabels>` | aria labels, counters, default texts; Russian defaults; values as `{token}` templates. Visible content goes in children or props. |
| Structure | `X.Root` + `X.Part` | Only for components with parts. Leaves are single exports: `Typography`, `Kbd`, `Divider`, `Spinner`, `LinkButton`, `NativeSelect`, `DigitInput`, `Slider`, `TagSelect`, `ColorSwatches`, `CodeBlock`, `ProgressBar`, `ProgressCircle`, `Pagination`, `DataTable`, `ExampleFrame`. A group of roots is `X.Group` (`Radio.Group`, `Avatar.Group`). |
| Icons in parts | `X.Icon`, `X.ItemIcon` | `Button.Icon`, `Input.Icon`, `Sidebar.ItemIcon`, `Dropdown.ItemIcon`… — never an `icon` prop on a component. Only data arrays (`notify()`, `options`) carry `icon: ReactNode`. |
| DOM state | `data-size`, `data-variant`, `data-tone`, `data-color`, `data-invalid`, `data-disabled`, `data-loading`, `data-state` | Style your wrappers from these, not from class names of kit internals. |

## Controlled vs uncontrolled

Uncontrolled by default — pass `defaultValue`/`defaultChecked`/`defaultOpen`. Control only when another
part of the screen reacts to the value:

```tsx
import { SegmentedControl } from "prime-ui-kit";
import { useState } from "react";

export function PeriodFilter() {
  const [period, setPeriod] = useState("week");
  return (
    <SegmentedControl.Root value={period} onValueChange={setPeriod} aria-label="Период">
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

## Forms

- Every field has its frame built in: `label`, `hint`, `error`, `required`, `optional` on Input,
  Textarea, Select, NativeSelect, TagSelect, Datepicker, DigitInput, FileUpload, ColorSwatches and
  `Radio.Group` (ColorPicker: `label`, `hint`, `error`; Slider: `label`). The label row, hint row and
  spacing come with it — never put a `Label` or `Hint` next to a field that has `label`.
- Checkbox, Switch and Radio: the root renders the `<label>` with the input; the visible text is the
  `X.Label` part; `hint` and `error` are props of `X.Root` (`Radio.Root` takes `hint`).
- `required` → red `*` after the label + native `required`. `optional` → muted «необязательно».
- Placeholder is an example (`name@company.ru`), never the label.
- Units and prefixes in affixes are hidden from screen readers — put the meaning into the label or hint
  too («Бюджет, ₽», «Адрес: prime.app/p/…»).
- Mark the minority: when most fields are required, mark only the optional ones (`optional`); when most
  are optional, mark the required ones; on a tie mark the required ones. Validate in code either way.
- Show `error` after the user leaves the field or on submit, not while typing the first character.
- Submit flow: `<form noValidate onSubmit>` → validate all fields → set each field's `error` → focus the
  first invalid field → keep the submit Button `loading` while the request runs and disable the fields
  (a `<fieldset disabled>` does it for a group) → map server field errors (e.g. «уже занят») to that
  field's `error`, other failures to a Notification → on success a Notification and navigate/reset.
- Fields stack with `gap: var(--prime-space-5)`; actions sit at the end, primary last, gap 8.
- Use a real `<form>` with `onSubmit`; the submit button is `<Button.Root type="submit">`. A submit
  button outside the form (Modal / Drawer footer) points at it with `form={formId}`.
- A form inside a Card: wrap the whole `Card.Root` in the `<form>` (Card parts are styled as direct
  children of Root — never put a wrapper between `Card.Root` and `Card.Body` / `Card.Actions`).
- Fields side by side in a grid row: `align-items: start`. Input and Textarea have `reserveSupportRow`
  to keep bottoms aligned when only one shows an error; other fields do not.
- Your own control without a frame: `Label` (with `id`; `htmlFor` when the control is a native input)
  above, the control, then `Hint` (`invalid` for the error) below, in a grid with
  `--prime-control-m-label-gap` / `--prime-control-m-hint-gap`; the control references the label with
  `aria-labelledby`.

```tsx
import { Button, Input, Select } from "prime-ui-kit";
import styles from "./InviteForm.module.css";

export function InviteForm() {
  return (
    <form className={styles.form} noValidate onSubmit={(event) => event.preventDefault()}>
      <Input.Root label="Email" required error="Введите email в формате name@company.ru">
        <Input.Wrapper>
          <Input.Field type="email" name="email" placeholder="name@company.ru" />
        </Input.Wrapper>
      </Input.Root>
      <Select.Root label="Роль" defaultValue="editor">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="viewer">Наблюдатель</Select.Item>
          <Select.Item value="editor">Редактор</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button.Root type="submit">Пригласить</Button.Root>
    </form>
  );
}
```

(`.form { display: grid; gap: var(--prime-space-5); }`.) A full create form with groups, validation,
loading and a toast: [patterns/form-drawer.tsx](patterns/form-drawer.tsx).

## Loading without DataTable

The kit has no skeleton component. DataTable (`loading`), Select (`loading`) and Button (`loading`) have
built-in states. For a card or region that is loading its data: keep the real layout, set
`aria-busy="true"` on the Card or region, put a `Spinner` (with `aria-hidden="true"`, since the region
already says it is busy) where the content will appear, and show the error in place (DataTable `error`,
a `Banner` for the page, `EmptyPage` with `EmptyPage.Icon tone="danger"` and a retry for a region).
Wrap the region's content in `Crossfade state={status}` so loading → data → empty → error cross-fade
and the height glides instead of jumping; DataTable's body already does this.
Never draw your own spinners or shimmer blocks. See [patterns/screen-states.tsx](patterns/screen-states.tsx).

## Secondary actions

- Page and card forms: dismiss or revert with `variant="ghost" tone="neutral"`, before the primary.
- Modal / Drawer footers: cancel is `variant="outline" tone="neutral"` (as in Modal COMPONENT.md).
- One label per action per screen («Отмена» to leave, «Отменить изменения» to revert, «Сбросить
  фильтры»), and the same action keeps the same variant in the header, toolbars and menus. If «Отмена»
  would clash with the action itself («Отменить заказ»), use an unambiguous label («Не отменять»).
- A control that navigates is a link: `LinkButton href`, `Button.Root asChild` with `<a>` / router
  `Link`, `Sidebar.Item href` or `asChild`. Never `onClick={() => location.assign(…)}`.

## Destructive actions

`tone="danger"`. A standalone trigger that opens a confirm (danger zone) is `variant="outline"`; inside
a bar of other actions (DataTable bulk bar, card actions) it is `soft`; in a Dropdown it is the last item
with `tone="danger"`; an inline remove in a media or file row is `ghost`; the confirming button in the
Modal is `solid`. The confirm Modal always sets `closeOnOutsideClick={false}`; while the request runs it
also sets `closeOnEscape={false}`, hides the close button (`Modal.Header showClose={false}`) and disables
Cancel.

## Providers and helpers

| Export | Use |
|---|---|
| `applyTheme(scheme, element?)` | switch `data-theme` without a transition flash |
| `NotificationProvider`, `useNotifications()` | toasts; provider once at the app root, `notify({ tone, title, description, action })` |
| `Tooltip.Provider` | shared delay for many tooltips |
| `ControlSizeProvider` | set one `size` for a whole region (dense toolbar, compact form) |
| `OverlayPortalLayerProvider` | portal target for overlays inside a custom layer |
| `useSidebar()` | Sidebar state for custom parts inside `Sidebar.Root` |
| `matchesSmartFilter`, `resolveSmartFilterValues` | apply a SmartFilter value to your rows |
| `Icon`, `Icon*` | kit icon set — see Icons below |

## Icons

`<Icon name="…" />` names:
- `nav.*`: `chevronDown`, `chevronLeft`, `chevronRight`, `chevronUp`, `chevronsLeft`, `chevronsUpDown`,
  `dashboard`, `home`, `itemDot`, `layoutGrid`, `menu`, `sidebarCollapse`, `sidebarExpand`;
- `action.*`: `add`, `check`, `close`, `copy`, `delete`, `download`, `drag`, `externalLink`,
  `eyedropper`, `filter`, `login`, `logout`, `more`, `remove`, `search`, `send`, `settings`, `upload`;
- `field.*`: `calendar`, `email`, `password.hide`, `password.show`;
- `format.*`: `bold`, `italic`, `link`, `list`, `underline`;
- `object.*`: `activity`, `bell`, `book`, `cart`, `chart`, `document`, `image`, `inbox`, `key`,
  `message`, `package`, `receipt`, `rocket`, `storage`, `tasks`, `truck`, `user`, `users`, `wallet`;
- `sort.*`: `ascending`, `descending`, `none`;
- `status.*`: `danger`, `emailSent`, `info`, `locked`, `offline`, `success`, `warning`;
- `theme.*`: `dark`, `light`; `view.*`: `code`, `preview`; `viewport.*`: `desktop`, `mobile`, `tablet`.

Each glyph is also a named component (`IconAdd`, `IconBell`, `IconCalendar`, `IconCart`,
`IconChevronDown`, `IconDocument`, `IconMenu`, `IconPackage`, `IconSearch`, `IconUser`,
`IconWarning`, …). Take a glyph from the kit first; only a domain glyph the kit lacks (a bike, a
tooth) comes from `lucide-react` (add it to the app's dependencies). Icon-only buttons need `aria-label`;
decorative icons inside kit slots (`Button.Icon`, `Input.Icon`, `Sidebar.ItemIcon`) are hidden
automatically.

## Styling your own wrappers

CSS Modules + tokens. Never override kit internals (`.root button { … }`), never pass `style`.
`className` on a kit part is for placement only (grid area, width, flex, `align-self`, `display` to hide
a part at a breakpoint) — not for color, padding, radius or the gap inside a kit container. The only
exceptions are the ones a component's `COMPONENT.md` documents (e.g. the round avatar drop zone of
FileUpload).
