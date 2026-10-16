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
| Size | `size` | Default `m`, on the root only; parts read it from the root. Avatar adds `2xl`. An overlay's `Content` takes its own `size`: the width of a Modal or Drawer, the tier of a Popover, Dropdown or Tooltip. Without `size` a component takes [the host tier](#size-and-the-host-tier). |
| Treatment | `variant` | `solid · soft · outline · ghost`; Button also takes `shade` (the media shade with a blur, a button over media); structural variants are component-specific (Card templates, FileUpload `dashed \| solid`). Tabs has no variant. |
| Meaning | `tone` | Button: `accent \| neutral \| success \| danger` (`success` for a done action), plus `inherit` (with `ghost \| soft \| outline`) for an action on a colored host — it takes the host's text color; never recolor a Button with a CSS override. Destructive is `danger`, never `error`. |
| Decoration | `color` | Badge, Avatar, Thumbnail, Icon, `SegmentedControl.Item`, `Tabs.Count` / `SegmentedControl.Count`, `Sidebar.ItemCount` / `BottomNav.ItemCount`, `FileUpload.FormatBadge`, `Timeline.Item`, `Message.Author` / `Message.Reply` / `Message.Contact`; in data: TagSelect options, Kanban columns, Gantt bars. |
| Validation | `invalid`, `hint`, `error` | Props, never parts. A non-empty `error` implies `invalid`; sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Accordion, Chat.Pinned, ChatList, ColorField, ColorPicker, ColorPresets, ColorSwatches, Composer, Datepicker, Datepicker.Panel, DigitInput, FieldList, FileUpload, FileUpload.Queue, Kanban, NativeSelect, Pagination, Radio.Group, SegmentedControl, Select, Slider, SmartFilter, Stepper, Tabs, TagSelect. |
| Text value | native `value` / `onChange` + `onValueChange(string)` | Input (`Input.Field`), Textarea. |
| Other state | `x` / `defaultX` / `onXChange(x)` | Badge `pressed`; Button `pressed`; ChartFrame `hiddenSeries`; Chat `selected`, `search`; ChatList `search`; ColorPicker `format`; CommandMenu `search`; Composer `recordMode`; DataTable `hiddenColumns`, `columnOrder`, `page`, `sort`, `selected`, `expanded`, `collapsedGroups`; ExampleFrame `viewport`, `colorScheme`; Gallery `index`; Gantt `scale`; Kanban `columnOrder`; MediaViewer `index`; Message.Media `index`; Select `search`; SmartFilter `search`; VideoNote `playing`, `transcriptExpanded`; VoicePlayer `rate`, `playing`, `transcriptExpanded`; Sidebar `mode`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Dropdown.CheckboxItem, Switch, Thumbnail. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | ColorPresets, CommandMenu, Composer.Keyboard, ConfirmDialog, Datepicker, Drawer, Dropdown, Gallery, MediaViewer, Message.Media, Modal, Popover, Select, Sheet, TagSelect, Tooltip, Page.Split, Sidebar, Sidebar.Group, Sidebar.Sub. |
| Dismiss | `closeOnOutsideClick` (default `true`), `closeOnEscape` (default `true`) | Both on every overlay that opens a layer: the dialogs, the floating panels, the panels of Select, TagSelect, Datepicker and ColorPresets, the `suggestions` list of Input, the off-canvas Sidebar and the reaction bar of a message. `ConfirmDialog` takes both with `closeOnOutsideClick` default `false` (Escape is held while `onConfirm` runs). Tooltip and Notification take neither. A form holds closing with `Modal.Guard` / `Drawer.Guard` / `Sheet.Guard`. |
| Selection mode | `multiple` | One vs many (Select, Accordion) — never `type`. `mode` only for structurally different values (Datepicker `single \| range`). |
| Status words | `selected`, `current`, `pressed` | `current` marks a navigation location (`Sidebar.Item`, `Breadcrumb.Item`) and sets `aria-current`; `pressed` a toggle button. |
| Flags | `disabled`, `readOnly`, `required`, `optional`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing` (default `true`) | Fields only; `false` only where focus is obvious otherwise. |
| System strings | `labels?: Partial<XLabels>` | aria labels, counters, default texts; Russian defaults; values as `{token}` templates. Visible content goes in children or props. |
| Structure | `X.Root` + `X.Part` | Only for components with parts. Leaves are single exports: `Typography`, `Kbd`, `Divider`, `Spinner`, `Skeleton`, `Crossfade`, `LinkButton`, `NativeSelect`, `DigitInput`, `Slider`, `TagSelect`, `ColorSwatches`, `CodeBlock`, `ProgressBar`, `ProgressCircle`, `Sparkline`, `Pagination`, `DataTable`, `Gantt`, `Fieldset`, `VisuallyHidden`, `ColorField`, `ExampleFrame`, `VoicePlayer`, `VideoNote`, `ScrollContainer`, `Gallery`, `MediaViewer`, `RichText`. This is the one list; other files link here. A group of roots is `X.Group` (`Radio.Group`, `Avatar.Group`, `Badge.Group`). |
| Slots | `X.Trigger`, `X.Close`, `X.Confirm`, `X.Anchor` | Your own button inside, exactly one element child; the slot renders no element and takes no `className` — style the child. A trigger the kit draws itself (`Select.Trigger`, `Accordion.Trigger`) is a real part with `className`. |
| Icons in parts | `X.Icon`, `X.ItemIcon` | `Button.Icon`, `Input.Icon`, `Sidebar.ItemIcon`, `Dropdown.ItemIcon`… — never an `icon` prop on a component. Only data arrays (`notify()`, `options`) carry `icon: ReactNode`. |
| DOM state | `data-size`, `data-variant`, `data-tone`, `data-color`, `data-invalid`, `data-disabled`, `data-loading`, `data-state` | Style your wrappers from these, not from class names of kit internals. |

### Size and the host tier

A component without `size` takes the tier of the sized kit host around it — a `ControlSizeProvider`,
a Popover or Dropdown `Content`, a Banner, a LoginForm, the DataTable `toolbar`, an EmptyPage — else
`m`. Set the tier once on the region (`<ControlSizeProvider value="s">` around a dense toolbar), never
`size` on one control to make it fit. A control nested in another component's row is one tier down
by hand: buttons and menus in table cells `s`, a switch in a card header `s`.

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
  the native control: `Input.Field`, not `Input.Root`. A field root sends its `className`, `ref` and
  native attributes to its frame (the label, control and support row) and its `id` to the control —
  the one root whose attributes do not land on the control itself.
- There are no `onBeforeX` / `onAfterX` props. To refuse a change, control the value and do not apply
  it. A slow or destructive action is an async event — return a Promise from it: the component shows
  the pending state on the affected element and keeps the old state; resolve = applied, reject = not
  applied (the component restores what was there; you say why with `error` or a notification). Never
  return `true` / `false` (or `{ ok }`) from an event. A controlled owner applies the new value before
  resolving. The async events: Input / Textarea `onCommit`, ConfirmDialog `onConfirm`,
  `EmptyPage.RetryButton` and CommandMenu `onRetry`, Button `onConfirm` (`holdToConfirm`), Slider
  `onCommit`, DigitInput `onComplete`, Tabs `onRemove`, Switch `onCheckedChange`, Badge `onRemove`,
  FileUpload and FieldList `onValueChange`, TagSelect `onCreate` / `onOptionUpdate` / `onOptionDelete`, DataTable
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
  only), `onCancel` / `onRetry` / `onDownload` (VoicePlayer, VideoNote, `Message.File`; on `Message.Media` / `Gallery` the state sits on
  each item and the handlers on the root, called with the item's index); `useUploadQueue` items carry the same states in `status`.
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
- Checkbox, Switch and Radio: [choice controls](#choice-controls) below.
- `required` → red `*` after the label + native `required`. `optional` → muted «необязательно».
- Placeholder is an example (`name@company.ru`), never the label.
- `hintTone` (`success` · `warning` · `danger`) colors the `hint` of a field by the status of its
  value («Осталось 12 дней» in `warning`); a lone `Hint.Root` takes `tone`. The words carry the
  status and the color only repeats it; a validation problem is `error`, which replaces the hint.
- `Input.Affix` and `Input.InlineAffix` describe the input for screen readers (`aria-describedby`),
  so the label never repeats a unit or a prefix ([a unit lives in one place](ux.md#3-label-economy)).
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
loading and a toast: [the Drawer screen](../src/components/drawer/examples/screen.tsx).

### Field outcomes: a mark for success, words for a problem

A field answers a check in one of two ways. Success is quiet; a problem is said.

- **A confirmed value is a mark.** A repeat that matches, a code that passed, a free address: `valid`
  on the root draws a check at the field's end and says it to a screen reader — no words under the
  field. Never a `hint` with `hintTone="success"` that writes «Пароли совпадают»: the person reads a
  sentence to learn that nothing is wrong. `hintTone` stays for the status of a value that is not a
  check (a deadline that nears).
- **A problem is words.** `error` says what is wrong and how to fix it, under the field it concerns.
  Red rings and a shake alone leave the person guessing.
- **A policy is enforced, not shown.** A new password is `strength` with `minStrength`: below the
  level the form refuses to submit and says why, the `hint` names the requirement in words («От 10
  символов, буквы и цифры»), and the server checks the same rule. A meter alone lets the weak
  password through ([password-policy.tsx](../src/components/input/examples/password-policy.tsx)).
- **A refused sign-in** marks the e-mail `invalid` and puts the reason on the password as its `error`
  («Неверная почта или пароль») — one sentence that names neither field as the culprit, no Banner
  over the form ([LoginForm](../src/components/login-form/COMPONENT.md)).

```tsx partial
// bad — a meter that lets anything through and a green sentence for a match
<Input.Root label="Новый пароль" strength>…</Input.Root>
<Input.Root label="Повторите пароль" hint="Пароли совпадают" hintTone="success">…</Input.Root>
```

```tsx good
// good — the policy stops the submit, the match is a check, a mismatch is words
// declare: const matches: boolean
// declare: const mismatch: boolean
<>
  <Input.Root label="Новый пароль" strength minStrength={3} hint="От 10 символов, буквы и цифры">
    <Input.Wrapper>
      <Input.Field type="password" autoComplete="new-password" />
      <Input.RevealButton />
    </Input.Wrapper>
  </Input.Root>
  <Input.Root
    label="Повторите пароль"
    valid={matches}
    error={mismatch ? "Пароли не совпадают" : undefined}
  >
    <Input.Wrapper>
      <Input.Field type="password" autoComplete="new-password" />
    </Input.Wrapper>
  </Input.Root>
</>
```

### Choice controls

Checkbox, Switch and Radio: the root renders the `<label>` with the input and the visible text is
the `X.Label` part. `hint` and `error` are props of `Checkbox.Root` / `Switch.Root`; a radio choice
carries its support row on `Radio.Group` (with the group's `label`), and a `Radio.Root` takes only a
`hint` of its own option.

```tsx
import { Checkbox, Radio } from "prime-ui-kit";

export function PaymentTerms({ termsError }: { termsError?: string }) {
  return (
    <>
      <Radio.Group label="Способ оплаты" defaultValue="invoice" hint="Можно сменить до подписания">
        <Radio.Root value="invoice">
          <Radio.Label>По счёту</Radio.Label>
        </Radio.Root>
        <Radio.Root value="card" hint="Комиссия банка 1,5%">
          <Radio.Label>Картой</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Checkbox.Root name="terms" required hint="Условия придут на почту" error={termsError}>
        <Checkbox.Label>Принимаю условия договора</Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
```

### Your own control without a frame

A control the kit has no field for (a calendar panel, a canvas) gets the frame from `Label` and
`Hint`: the label above with an `id` (`htmlFor` when the control is a native input), the hint below
with an `id`, the control pointing at both.

```tsx
import { Datepicker, Hint, Label } from "prime-ui-kit";
import { useId } from "react";
import styles from "./SigningDate.module.css";
// .field { display: grid; gap: var(--prime-control-m-label-gap); }
// .control { display: grid; gap: var(--prime-control-m-hint-gap); }

export function SigningDate({ error }: { error?: string }) {
  const labelId = useId();
  const hintId = useId();
  return (
    <div className={styles.field}>
      <Label.Root id={labelId} required>
        Дата подписания
      </Label.Root>
      <div className={styles.control}>
        <Datepicker.Panel
          mode="single"
          role="group"
          aria-labelledby={labelId}
          aria-describedby={hintId}
        />
        <Hint.Root id={hintId} invalid={Boolean(error)}>
          {error ?? "Не раньше завтрашнего дня"}
        </Hint.Root>
      </div>
    </div>
  );
}
```

## Loading without DataTable

DataTable (`loading`), Select (`loading`) and Button (`loading`, `progress`) have built-in states. For
any other card or region that loads: wrap its content in `Crossfade state={status}` with
`aria-busy={status === "loading"}`, and render a `Skeleton` in the geometry of the data while it loads
(same rows, gaps and heights). A `Spinner` only where there is no shape to hold. Show the error in
place (a `Banner` for the page; for a region `EmptyPage tone="danger"` — it announces itself — with
`EmptyPage.RetryButton`). Never draw your own spinners or shimmer blocks. See
[the screen states](../src/components/crossfade/examples/screen.tsx) and [motion.md](motion.md).

## Secondary actions

- Page and card forms: dismiss or revert with `variant="ghost" tone="neutral"`, before the primary.
- Modal / Drawer footers: cancel is `variant="outline" tone="neutral"` (as in Modal COMPONENT.md).
- One label per action per screen («Отмена» to leave, «Отменить изменения» to revert, «Сбросить
  фильтры»), and the same action keeps the same variant in the header, toolbars and menus. If «Отмена»
  would clash with the action itself («Отменить заказ»), use an unambiguous label («Не отменять»).
- A control that navigates is a link: `LinkButton href`, `Button.Root asChild` with `<a>` / router
  `Link`, `Sidebar.Item` / `Breadcrumb.Item` / `List.Item` / `ChatList.Item` `href` or `asChild`. Never
  `onClick={() => location.assign(…)}`.

## Destructive actions

Which step an action deserves — undo, a held press, a confirm — is
[ux.md → friction](ux.md#5-friction-matches-the-cost-of-a-mistake); this is how each is built.
A standalone destructive action that is easy to redo by hand is `Button.Root holdToConfirm` with the
action in `onConfirm` ([the recipe](motion.md#5-recipes)).

`tone="danger"`. A standalone trigger that opens a confirm (danger zone) is `variant="outline"`; inside
a bar of other actions (card actions) it is `soft`; in a Dropdown it is the last item
with `tone="danger"`; an inline remove in a media or file row is `ghost`. The confirm itself is
[ConfirmDialog](../src/components/confirm-dialog/COMPONENT.md) — never a hand-built Modal: it is a
Modal `s` with a solid danger confirm (`tone="accent"` for an outward action that destroys nothing, like
sending an invoice), no dismiss by a
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
it saves); while either holds, the browser also asks before the tab closes or reloads. A form that is the whole page takes `Page.Guard` (`dirty`, `busy`) inside the page: it
holds a press on `Sidebar.Item`, `BottomNav.Item` and `Breadcrumb.Item` links — router links
included — and the browser's own close or reload; never a `beforeunload` or a ConfirmDialog on a
crumb of your own.

## Providers and helpers

| Export | Use |
|---|---|
| `applyTheme(scheme, element?)` | switch `data-theme` without a transition flash |
| `NotificationProvider`, `useNotifications()` | toasts; provider once at the app root, `notify({ tone, title, description, action })` |
| `Tooltip.Provider` | shared delay for many tooltips |
| `ControlSizeProvider` | one `size` for a region (dense toolbar, compact form): [the host tier](#size-and-the-host-tier) |
| `celebrate({ origin })` | a short confetti burst for a rare milestone; nothing under reduced motion — see [motion.md](motion.md) |
| `getPasswordStrength(value)` | the 0–4 estimate behind `Input.Root strength`; to replace it, pass your own `getStrength` to `Input.Root` |
| `COLOR_PRESETS` | the kit's 16 palette colors for `ColorSwatches` / `ColorPresets` `presets` |
| `datepickerPresets`, `DEFAULT_DATEPICKER_PRESETS`, `formatDatepickerValue` | quick ranges and value display for `Datepicker` |
| `formatDateValue(date, { withTime })` | a date as the local `yyyy-MM-dd` (`THH:mm`) value — whenever a date goes to a form or a query; never `toISOString().slice(…)`, which shifts it to UTC |
| `moveBefore(items, id, beforeId, getId)` | apply a `Dnd` reorder to your array in `onReorder`; `canDrop` returns `true` or the reason it refuses (a string, announced and shown at the carried copy) |
| `useUploadQueue({ upload, concurrency })` | the upload queue behind FileUpload `queue`: `upload(file, { signal, onProgress })` is yours, the queue runs it a few at a time, aborts on remove, retries |
| `groupMessages(messages, options)`, `formatMessageDate`, `formatMessageTime`, `hueOf(id)` | turn chat data into dated runs of one author (positions, the date separators — `Chat.Messages items` does it for you), format their dates and times, and give a person a palette hue stable per id |
| `useSidebar()` | Sidebar state for custom parts inside `Sidebar.Root` |
| `useAppShellNav()` | the shell's navigation for a trigger outside the rail (a BottomNav «Ещё», your own menu button): `open`, `setOpen`, `navId` for `aria-controls`; `null` outside a shell |
| `matchesSmartFilter`, `resolveSmartFilterValues` | apply a SmartFilter value to your rows |
| `Icon`, `createIcon` | kit icon set and domain glyphs — see Icons below |
| `chartColors` | the chart palette as CSS values for a chart library: `series` 1…8 in order, `other`, `grid`, `axis`, `scale` — follows the theme |
| `useTokenValue("--prime-space-7")` | a length token in px for geometry CSS cannot take (SVG coordinates, canvas, virtual rows); follows a theme switch |
| `VisuallyHidden` | text for screen readers only (an icon-only part's name, a spoken count); `live="polite"` on it for an announcement (`"assertive"` only for an error that blocks) |

## Icons

<!-- icons:start -->
`<Icon name="…" />` names:
- `nav.*`: `chevronDown`, `chevronLeft`, `arrowRight`, `chevronRight`, `chevronUp`, `chevronsLeft`, `chevronsUpDown`, `dashboard`, `home`, `itemDot`, `layoutGrid`, `menu`, `sidebarCollapse`, `sidebarExpand`;
- `action.*`: `add`, `addContact`, `attach`, `check`, `close`, `copy`, `delete`, `download`, `drag`, `edit`, `externalLink`, `eyedropper`, `filter`, `forward`, `login`, `logout`, `more`, `openApp`, `pause`, `pin`, `play`, `react`, `refresh`, `report`, `remove`, `reply`, `search`, `send`, `settings`, `transcribe`, `upload`, `video`, `voice`, `zoomIn`, `zoomOut`;
- `field.*`: `calendar`, `email`, `password.show`, `password.hide`;
- `format.*`: `bold`, `code`, `italic`, `link`, `list`, `quote`, `spoiler`, `strikethrough`, `underline`;
- `object.*`: `activity`, `bell`, `bike`, `book`, `cart`, `chart`, `crown`, `disc`, `document`, `file`, `fuel`, `funnel`, `globe`, `bot`, `headset`, `image`, `inbox`, `key`, `mapPin`, `megaphone`, `message`, `motorbike`, `package`, `phone`, `receipt`, `rocket`, `scale`, `storage`, `tasks`, `trophy`, `truck`, `user`, `users`, `wallet`;
- `sort.*`: `ascending`, `descending`, `none`;
- `status.*`: `danger`, `emailSent`, `failed`, `favorite`, `info`, `locked`, `muted`, `sound`, `offline`, `pending`, `read`, `sent`, `success`, `trendUp`, `warning`;
- `theme.*`: `dark`, `light`;
- `view.*`: `code`, `columns`, `preview`;
- `viewport.*`: `desktop`, `mobile`, `tablet`;
- `brand.*`: `telegram`, `vk`, `whatsapp`.
<!-- icons:end -->

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

Never a raw `lucide-react` component, another icon library, an inline `<svg>` or an icon font. An
icon-only button is square (`shape="circle"` only for media and transfer actions) and needs
`aria-label`;
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
row of a long list, where a gesture on each row hover would be noise ([motion.md](motion.md)). A mark
that follows a state instead takes `drawn`: `drawn={done}` draws the stroke in when it turns `true`
and out when it turns `false` (a check on a finished step) and plays no hover gesture.

## Styling your own wrappers

CSS Modules + tokens. Never override kit internals (`.root button { … }`), never pass `style`.
`className` on a kit part is for placement only (grid area, width, flex, `align-self`, order) — not for
color, padding, radius or the gap inside a kit container. Never hide a part at a breakpoint: rearrange
it ([responsive.md](responsive.md)). The only
exceptions are the ones a component's `COMPONENT.md` documents (e.g. the round avatar drop zone of
FileUpload).
