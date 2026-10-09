# API contract v1

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
| Size | `size` | Default `m`, on the root only; parts read it from the root. Avatar adds `2xl`; an overlay `Content` (Modal, Drawer, Popover, Dropdown, Tooltip) takes `size` for its width. Without `size` these take the tier of a sized host (Popover, Banner, LoginForm, DataTable toolbar, `ControlSizeProvider`), else `m`: Input, Textarea, DigitInput, Checkbox, Radio, Switch, Slider, FileUpload, ColorSwatches, ColorPresets, SegmentedControl, Button, ButtonGroup, LinkButton, Label, Badge, Spinner, Skeleton, DescriptionList, Composer, `Icon`, `Checkbox.Indicator`. Select, NativeSelect, TagSelect, Datepicker, Tabs and SmartFilter do **not** read the host — give them `size` yourself. |
| Treatment | `variant` | `solid · soft · outline · ghost`; Button also takes `shade` (the media shade with a blur, a button over media); structural variants are component-specific (Card templates, FileUpload `dashed \| solid`). Tabs has no variant. |
| Meaning | `tone` | Button: `accent \| neutral \| danger`, plus `inherit` (with `ghost \| soft \| outline`) for an action on a colored host — it takes the host's text color; never recolor a Button with a CSS override. Destructive is `danger`, never `error`. |
| Decoration | `color` | Badge, Avatar, Thumbnail, Icon, `SegmentedControl.Item`, `Tabs.Count` / `SegmentedControl.Count`, `Sidebar.ItemCount` / `BottomNav.ItemCount`, `FileUpload.FormatBadge`, `Timeline.Item`, `Message.Author` / `Message.Reply` / `Message.Contact`; in data: TagSelect options, Kanban columns, Gantt bars. |
| Validation | `invalid`, `hint`, `error` | Props, never parts. A non-empty `error` implies `invalid`; sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, NativeSelect, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, Radio.Group, DigitInput, Pagination, SmartFilter, ColorPicker, ColorField, ColorSwatches, Kanban, FileUpload (its files), Composer (its text). |
| Text value | native `value` / `onChange` + `onValueChange(string)` | Input (`Input.Field`), Textarea. |
| Other state | `x` / `defaultX` / `onXChange(x)` | DataTable `sort`, `page`, `selected`, `expanded`, `hiddenColumns`; SmartFilter, Select and CommandMenu `search`; Sidebar `mode`; Kanban `columnOrder`; Gantt `scale`; `Chat.Root` `selected` and `search`; Composer `recordMode`; VoicePlayer `rate`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure (Modal, Drawer, Popover, Dropdown, Tooltip, CommandMenu, Select, Sidebar off-canvas). |
| Dismiss | `closeOnOutsideClick` (default `true`), `closeOnEscape` (default `true`) | Both on every overlay: Modal, Drawer, CommandMenu, Popover, Dropdown. A destructive confirm is `ConfirmDialog` (it turns both off itself); a form holds closing with `Modal.Guard` / `Drawer.Guard`. |
| Selection mode | `multiple` | One vs many (Select, Accordion) — never `type`. `mode` only for structurally different values (Datepicker `single \| range`). |
| Status words | `selected`, `current`, `pressed` | `current` marks a navigation location (`Sidebar.Item`, `Breadcrumb.Item`) and sets `aria-current`; `pressed` a toggle button. |
| Flags | `disabled`, `readOnly`, `required`, `optional`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing` (default `true`) | Fields only; `false` only where focus is obvious otherwise. |
| System strings | `labels?: Partial<XLabels>` | aria labels, counters, default texts; Russian defaults; values as `{token}` templates. Visible content goes in children or props. |
| Structure | `X.Root` + `X.Part` | Only for components with parts. Leaves are single exports: `Typography`, `Kbd`, `Divider`, `Spinner`, `Skeleton`, `Crossfade`, `LinkButton`, `NativeSelect`, `DigitInput`, `Slider`, `TagSelect`, `ColorSwatches`, `CodeBlock`, `ProgressBar`, `ProgressCircle`, `Sparkline`, `Pagination`, `DataTable`, `Gantt`, `Fieldset`, `VisuallyHidden`, `ColorField`, `ExampleFrame`, `VoicePlayer`, `VideoNote`. This is the one list; other files link here. A group of roots is `X.Group` (`Radio.Group`, `Avatar.Group`). |
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

## Events

- State changes come through the triad: `value` / `defaultValue` / `onValueChange`, and the same shape
  for every other stateful aspect (`open`, `sort`, `page`, `hiddenColumns`…). The new value is the first
  argument.
- A triad can be a request: with DataTable `source="server"` the table never sorts or slices `rows`;
  `onSortChange` / `onPageChange` start the fetch, `rowCount` is the server total, and the owner keeps
  the old rows with `loading` until the answer replaces them.
- Native events (`onChange`, `onBlur`, `onFocus`, `onKeyDown`, `onPaste`…) go on the part that renders
  the native control: `Input.Field`, not `Input.Root` (a field root's attributes go to its frame).
- There are no `onBeforeX` / `onAfterX` props. To refuse a change, control the value and do not apply
  it. A slow or destructive action is an async event — return a Promise from it: the component shows
  the pending state on the affected element and keeps the old state; resolve = applied, reject = not
  applied (the component restores what was there; you say why with `error` or a notification). Never
  return `true` / `false` (or `{ ok }`) from an event. A controlled owner applies the new value before
  resolving. The async events: Input / Textarea `onCommit`, ConfirmDialog `onConfirm`,
  `EmptyPage.RetryButton` and CommandMenu `onRetry`, Button `onConfirm` (`holdToConfirm`), Slider
  `onCommit`, DigitInput `onComplete`, Tabs `onRemove`, Switch `onCheckedChange`, Badge `onRemove`,
  FileUpload `onValueChange`, TagSelect `onCreate` / `onOptionUpdate` / `onOptionDelete`, DataTable
  and Dnd `onReorder`, Kanban `onValueChange` / `onColumnOrderChange`, Gantt `onBarChange` /
  `onBarCreate`, Composer `onSend` / `onSendVoice` / `onSendVideoNote`, `Message.Root`
  `onReactionToggle` and `onRetry`, the `onRetry` / `onCancel` of `Message.File`, the
  `onLoadMore` / `onReachStart` / `onReachEnd` of lists that load more.
- A notification of what happened, with no state to control, is a plain event with the subject
  first: `Chat.Messages` `onNewMessage(value, { direction })` (a message added at the end after
  mount, decided from the data — never the first render, a history load or a row scrolled into view) and `onRead(values)` (incoming messages the
  reader has seen, batched); Composer `onActivityChange(activity)` fires on a change only (`typing`,
  `voice`, `video`, `null`) — the «печатает…» signal, never a per-keystroke event.
- Media playback is the `playing` / `defaultPlaying` / `onPlayingChange` triad (VoicePlayer,
  VideoNote — the two players share every prop they have in common). One sound plays at a time on
  the page: starting one pauses the other, which reports `onPlayingChange(false)`. Where the owner
  tracks the request itself, the flag is `loading` (Button, Switch, Badge).
- A transfer of content, either way, is one set: `transfer` (`remote` · `queued` · `loading` ·
  `failed` · `done`), `transferProgress`, `transferDirection` (`upload` / `download`, the words
  only), `onCancel` / `onRetry` / `onDownload` (VoicePlayer, VideoNote, `Message.File`, the items of
  `Message.Media`); `useUploadQueue` items carry the same states in `status`.
- A value that settles at the end of a gesture has its own event beside the triad: Slider
  `onValueChange` follows the drag, `onCommit` fires once on release (or after a key moves it) —
  save there.
- Verbs: `onSelect` activates a menu or command item, `onRemove` takes a value out of a selection,
  `onDelete` destroys an entity, `onDismiss` closes a message.

## Forms

- Every field has its frame built in: `label`, `hint`, `error`, `required`, `optional` on Input,
  Textarea, Select, NativeSelect, TagSelect, Datepicker, DigitInput, FileUpload,
  ColorField, ColorSwatches, SegmentedControl, ButtonGroup and `Radio.Group`, and Slider (ColorPicker: `label`, `hint`, `error` on `ColorPicker.HexInput`). The label row, hint row and
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
  (`Fieldset disabled` does it for a group) → map server field errors (e.g. «уже занят») to that
  field's `error`, other failures to a Notification → on success a Notification and navigate/reset.
- Fields stack with `gap: var(--prime-space-5)`; actions sit at the end, primary last, gap 8.
- Use a real `<form>` with `onSubmit`; the submit button is `<Button.Root type="submit">`. A submit
  button outside the form (Modal / Drawer footer) points at it with `form={formId}`.
- A form inside a Card: wrap the whole `Card.Root` in the `<form>` (Card parts are styled as direct
  children of Root — never put a wrapper between `Card.Root` and `Card.Body` / `Card.Footer`).
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
      <Input.Root label="Почта" required error="Введите почту в формате name@company.ru">
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

DataTable (`loading`), Select (`loading`) and Button (`loading`, `progress`) have built-in states. For
any other card or region that loads: wrap its content in `Crossfade state={status}` with
`aria-busy={status === "loading"}`, and render a `Skeleton` in the geometry of the data while it loads
(same rows, gaps and heights). A `Spinner` only where there is no shape to hold. Show the error in
place (a `Banner` for the page, `EmptyPage` with `EmptyPage.Icon tone="danger"` and a retry for a
region). Never draw your own spinners or shimmer blocks. See
[patterns/screen-states.tsx](patterns/screen-states.tsx) and [motion.md](motion.md).

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
with `tone="danger"`; an inline remove in a media or file row is `ghost`. The confirm itself is
[ConfirmDialog](../src/components/confirm-dialog/COMPONENT.md) — never a hand-built Modal: it is a
Modal `s` with a solid danger confirm (`tone="accent"` for a weighty but safe action), no dismiss by a
press outside, Cancel focused first. `onConfirm` returns the request's Promise: while it runs the confirm
shows `loading` and Cancel, the close button and Escape are off; resolve closes the dialog (say «Удалено»
with a Notification), reject keeps it open with `error` (the owner's reason) or `labels.error`.

```tsx
import { Button, ConfirmDialog } from "prime-ui-kit";

export function DeleteProject({ onDelete }: { onDelete: () => Promise<void> }) {
  return (
    <ConfirmDialog.Root
      title="Удалить проект?"
      description="Проект и его задачи удалятся без возможности восстановления."
      confirmLabel="Удалить"
      onConfirm={onDelete}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="outline" tone="danger">
          Удалить проект
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}
```

Leaving a form with unsaved changes is the same contract: `Modal.Guard` / `Drawer.Guard` inside the
content with `dirty` (any dismiss asks «Не сохранять изменения?») and `busy` (nothing closes it while
it saves).

## Providers and helpers

| Export | Use |
|---|---|
| `applyTheme(scheme, element?)` | switch `data-theme` without a transition flash |
| `NotificationProvider`, `useNotifications()` | toasts; provider once at the app root, `notify({ tone, title, description, action })` |
| `Tooltip.Provider` | shared delay for many tooltips |
| `ControlSizeProvider` | one `size` for a region (dense toolbar, compact form) — for the components that read the host tier (see Size above); pass `size` to the others |
| `celebrate({ origin })` | a short confetti burst for a rare milestone; nothing under reduced motion — see [motion.md](motion.md) |
| `getPasswordStrength(value)` | the 0–4 estimate behind `Input.Root strength`; replace it with `getStrength` |
| `COLOR_PRESETS` | the kit's 16 palette colors for `ColorSwatches` / `ColorPresets` `presets` |
| `datepickerPresets`, `DEFAULT_DATEPICKER_PRESETS`, `formatDatepickerValue` | quick ranges and value display for `Datepicker` |
| `moveBefore(items, id, beforeId, getId)` | apply a `Dnd` reorder to your array in `onReorder`; `canDrop` returns `true` or the reason it refuses (a string, announced and shown at the carried copy) |
| `useUploadQueue({ upload, concurrency })` | the upload queue behind FileUpload `queue`: `upload(file, { signal, onProgress })` is yours, the queue runs it a few at a time, aborts on remove, retries |
| `groupMessages(messages, options)`, `formatMessageDate`, `formatMessageTime`, `hueOf(id)` | turn chat data into dated runs of one author (positions, the date separators — `Chat.Messages items` does it for you), format their dates and times, and give a person a palette hue stable per id |
| `useSidebar()` | Sidebar state for custom parts inside `Sidebar.Root` |
| `matchesSmartFilter`, `resolveSmartFilterValues` | apply a SmartFilter value to your rows |
| `Icon`, `createIcon` | kit icon set and domain glyphs — see Icons below |
| `chartColors` | the chart palette as CSS values for a chart library: `series` 1…8 in order, `other`, `grid`, `axis`, `scale` — follows the theme |
| `useTokenValue("--prime-space-7")` | a length token in px for geometry CSS cannot take (SVG coordinates, canvas, virtual rows); follows a theme switch |
| `VisuallyHidden` | text for screen readers only (an icon-only part's name, a spoken count); `role="status"` on it for a polite announcement |

## Icons

`<Icon name="…" />` names:
- `nav.*`: `chevronDown`, `chevronLeft`, `chevronRight`, `chevronUp`, `chevronsLeft`, `chevronsUpDown`,
  `dashboard`, `home`, `itemDot`, `layoutGrid`, `menu`, `sidebarCollapse`, `sidebarExpand`;
- `action.*`: `add`, `addContact`, `attach`, `check`, `close`, `copy`, `delete`, `download`, `drag`,
  `edit`, `externalLink`, `eyedropper`, `filter`, `forward`, `login`, `logout`, `more`, `pause`,
  `pin`, `play`, `react`, `refresh`, `remove`, `reply`, `report`, `search`, `send`, `settings`,
  `upload`, `video`, `voice`;
- `field.*`: `calendar`, `email`, `password.hide`, `password.show`;
- `format.*`: `bold`, `code`, `italic`, `link`, `list`, `quote`, `strikethrough`, `underline`;
- `object.*`: `activity`, `bell`, `bike`, `book`, `cart`, `chart`, `crown`, `disc`, `document`, `fuel`,
  `funnel`, `globe`, `headset`, `image`, `inbox`, `key`, `mapPin`, `megaphone`, `message`,
  `motorbike`, `package`, `phone`, `receipt`, `rocket`, `scale`, `storage`, `tasks`, `trophy`,
  `truck`, `user`, `users`, `wallet`;
- `sort.*`: `ascending`, `descending`, `none`;
- `status.*`: `danger`, `emailSent`, `failed`, `favorite`, `info`, `locked`, `muted`, `offline`,
  `pending`, `read`, `sent`, `success`, `trendUp`, `warning`;
- `theme.*`: `dark`, `light`; `view.*`: `code`, `columns`, `preview`; `viewport.*`: `desktop`, `mobile`, `tablet`.

Every glyph comes from the kit, in this order:

1. **A semantic name above** — `<Icon name="object.bell" />`. The meaning is in the name, so the same
   action has the same glyph across the app.
2. **The full animated set** — `prime-ui-kit/icons`: about 500 named components, each a Lucide drawing
   with its own gesture, with the same `size`, `tone`, `strokeWidth`, `animated` props.
   `import { BellIcon } from "prime-ui-kit/icons"` → `<BellIcon />`; only what you import is bundled.
   The name is the Lucide name + `Icon` (`ArrowBigDown` → `ArrowBigDownIcon`); the full list is
   [icon-set.ts](../src/icon-set.ts) — search it before reaching further.
3. **Only a glyph neither has** comes from `lucide-react` (add it to the app's dependencies — the kit does not ship it) or any SVG
   component (SVGR), wrapped
   once at module level with `createIcon` so it sizes, tones and plays like a kit icon:
   `const IconTractor = createIcon(Tractor);` → `<IconTractor />`.

Never a raw `lucide-react` component, another icon library, an inline `<svg>` or an icon font. Icon-only buttons need `aria-label`;
decorative icons inside kit slots (`Button.Icon`, `Input.Icon`, `Sidebar.ItemIcon`) are hidden
automatically. An icon that carries information alone (a «system» or «pinned» mark) takes `label`:
it becomes `role="img"` with that name, and inside `Tooltip.Trigger` it is focusable. A category
colour from data is `color` (a `PaletteColor`, never a hex); `tone` stays for meaning.

Every kit icon is animated: its gesture plays once when the host it sits in (button, link, tab,
label, menu item, option, table row) is hovered or pressed on touch — nothing to wire. The nearest
host owns the icon (hovering a card does not play the icons of its buttons); outside any host the
icon plays when it is hovered itself. Keyboard focus, disabled and loading hosts and reduced motion
stay still. A `createIcon` glyph gets a soft pop. Never animate an icon yourself (no hover rotate,
spin or bounce in your CSS). `animated={false}` keeps one icon still — for a glyph repeated in every
row of a long list, where a gesture on each row hover would be noise ([motion.md](motion.md)).

## Styling your own wrappers

CSS Modules + tokens. Never override kit internals (`.root button { … }`), never pass `style`.
`className` on a kit part is for placement only (grid area, width, flex, `align-self`, order) — not for
color, padding, radius or the gap inside a kit container. Never hide a part at a breakpoint: rearrange
it ([responsive.md](responsive.md)). The only
exceptions are the ones a component's `COMPONENT.md` documents (e.g. the round avatar drop zone of
FileUpload).
