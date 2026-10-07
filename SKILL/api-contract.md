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
| Size | `size` | Default `m`. Avatar adds `2xl`; Modal/Drawer use a width subset. |
| Treatment | `variant` | `solid · soft · outline · ghost`; structural variants are component-specific (Card templates, FileUpload `dashed \| solid`). Tabs has no variant. |
| Meaning | `tone` | Button: `accent \| neutral \| danger`. Destructive is `danger`, never `error`. |
| Decoration | `color` | Badge, Tag, Avatar, field badges, `Select.ItemMedia`, `SegmentedControl.Item`. |
| Validation | `invalid`, `hint`, `error` | A non-empty `error` implies `invalid`; sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, Radio.Group, DigitInput, Pagination. |
| Text value | native `value` / `onChange` + `onValueChange(string)` | Input, Textarea. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure. |
| Dismiss | `closeOnOutsideClick` (default `true`), `closeOnEscape` (default `true`) | Modal, Drawer, CommandMenu.Dialog, Popover, Dropdown. Turn off for destructive confirms. |
| Flags | `disabled`, `readOnly`, `required`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing` (default `true`) | Fields only; `false` only where focus is obvious otherwise. |
| System strings | `labels?: Partial<XLabels>` | aria labels, counters, default texts; Russian defaults. Visible content goes in children. |
| Structure | `X.Root` + `X.Part` | Single export for leaf components. |
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

- Input, Textarea, Select, TagSelect, Datepicker take `label`, `hint`, `error`, `required`, `optional`
  the same way. The label row, hint row and spacing are built in — never put a `Label` or `Hint` next to
  an `Input.Root` that has `label`. Checkbox, Switch, Radio carry their own `Label`/`Hint`/`Error`
  parts; fields without a frame are listed below.
- `required` → red `*` after the label + native `required`. `optional` → muted «необязательно».
- Placeholder is an example (`name@company.ru`), never the label.
- Units and prefixes in affixes are hidden from screen readers — put the meaning into the label or hint
  too («Бюджет, ₽», «Адрес: prime.app/p/…»).
- Mark the minority: when most fields are required, mark only the optional ones (`optional`); when most
  are optional, mark the required ones; on a tie mark the required ones. Validate in code either way.
- Show `error` after the user leaves the field or on submit, not while typing the first character.
- Submit flow: `<form noValidate onSubmit>` → validate all fields → set each field's `error` → focus the
  first invalid field → keep the submit Button `loading` while the request runs and disable the fields
  → map server field errors (e.g. «уже занят») to that field's `error`, other failures to a
  Notification → on success a Notification and navigate/reset.
- Fields stack with `gap: var(--prime-space-5)`; actions sit at the end, primary last, gap 8.
- Use a real `<form>` with `onSubmit`; the submit button is `<Button.Root type="submit">`.
- A form inside a Card: wrap the whole `Card.Root` in the `<form>` (Card parts are styled as direct
  children of Root — never put a wrapper between `Card.Root` and `Card.Body` / `Card.Actions`).
- Fields side by side in a grid row: `align-items: start`. Input and Textarea have `reserveSupportRow`
  to keep bottoms aligned when only one shows an error; other fields do not.
- Fields without a built-in frame (DigitInput, FileUpload, ColorPicker, Radio.Group, your own control):
  put `Label.Root` (with `id`; `htmlFor` when the control is a native input) above, the control, then
  `Hint.Root` (`invalid` for the error) below, in a grid with `--prime-control-m-label-gap` /
  `--prime-control-m-hint-gap`. The control must reference the label: `aria-labelledby={labelId}`
  (Radio.Group, FileUpload.Root, DigitInput) — a `Label.Root` nothing points at is decoration. When the
  card holds only that group, `aria-labelledby` may point at the `Card.SectionTitle`.
  FileUpload.Root is itself a `<label>` — keep `Label.Root` as a sibling above it, never around it.

```tsx
import { Button, Input, Select } from "prime-ui-kit";

export function InviteForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
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

(Lay the form out with a local CSS class: `display: grid; gap: var(--prime-space-5)`.)

## Loading without DataTable

The kit has no skeleton component. DataTable (`loading`), Select (`loading`) and Button (`loading`) have
built-in states. For a form or page that is loading its data: render the real layout, disable the
fields, set `aria-busy="true"` on the Card or region, and show `EmptyPage` with a retry action if the
load fails. Never invent spinners or shimmer blocks.

## Secondary actions

- Page and card forms: dismiss or revert with `variant="ghost" tone="neutral"`, before the primary.
- Modal / Drawer footers: cancel is `variant="outline" tone="neutral"` (as in Modal COMPONENT.md).
- One label per action per screen («Отмена» to leave, «Отменить изменения» to revert, «Сбросить
  фильтры»), and the same action keeps the same variant in the header, toolbars and menus. If «Отмена»
  would clash with the action itself («Отменить заказ»), use an unambiguous label («Не отменять»).
- A control that navigates is a link: `LinkButton.Root href`, `Button.Root asChild` with `<a>` /
  router `Link`, `Sidebar.Item href` or `asChild`. Never `onClick={() => location.assign(…)}`.

## Destructive actions

`tone="danger"`. A standalone trigger that opens a confirm (danger zone) is `variant="outline"`; inside
a bar of other actions (DataTable bulk bar, card actions) it is `soft`; an inline remove in a media or
file row is `ghost`; the confirming button in the Modal is `solid`. The confirm Modal always sets `closeOnOutsideClick={false}`; while the request runs it also
sets `closeOnEscape={false}` and disables Cancel.

## Providers and helpers

| Export | Use |
|---|---|
| `applyTheme(scheme, element?)` | switch `data-theme` without a transition flash |
| `NotificationProvider`, `useNotifications()` | toasts; provider once at the app root |
| `Tooltip.Provider` | shared delay for many tooltips |
| `ControlSizeProvider` | set one `size` for a whole region (dense toolbar, compact form) |
| `OverlayPortalLayerProvider` | portal target for overlays inside a custom layer |
| `Icon`, `Icon*` | kit icon set — see Icons below |

## Icons

`<Icon name="…" />` names: `action.close`, `action.copy`, `action.eyedropper`, `action.search`,
`action.upload`, `field.email`, `field.password.hide`, `field.password.show`, `nav.chevronRight`,
`nav.home`, `nav.itemDot`, `nav.layoutGrid`, `status.locked`, `theme.dark`, `theme.light`. Named
components: `IconCheck`, `IconChevronRight`, `IconCircleDot`, `IconClose`, `IconCloudUpload`,
`IconCopy`, `IconDownload`, `IconEye`, `IconEyeOff`, `IconHouse`, `IconLayoutGrid`, `IconLock`,
`IconMail`, `IconMoon`, `IconNavItemDot`, `IconPipette`, `IconSearch`, `IconSun`. Everything else:
`lucide-react` (add it to the app's dependencies). Icon-only buttons need `aria-label`; decorative
icons inside kit slots (`Button.Icon`, `Input.Icon`, `Sidebar.Item icon`) are hidden automatically.

## Styling your own wrappers

CSS Modules + tokens. Never override kit internals (`.root button { … }`), never pass `style`.
`className` on a kit part is for placement only (grid area, width, flex, `align-self`, `display` to hide
a part at a breakpoint) — not for color,
padding, radius or the gap inside a kit container. The only exceptions are the ones a component's
`COMPONENT.md` documents (e.g. the round avatar drop zone of FileUpload).
