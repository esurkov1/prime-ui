# SegmentedControl

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite control made of several segments with a single selected value: a `radiogroup` container, each option is a button with `role="radio"`, with a floating indicator under the active segment.

## What it’s for

- **Analytics and reports** — switch aggregation period (day / week / month) above a chart without a dropdown.
- **Catalog and storefront** — pick list layout or a quick “all / mine” filter in the list header when there are few options and they should be visible at once.
- **App settings** — toggle theme or UI density next to other form fields.
- **Tasks and workflows** — filter cards by stage or priority with one row of segments in the board toolbar.
- **Editors and viewers** — choose document view mode (e.g. draft / edits / clean view) near the title.
- **Mobile panels** — compactly switch sub-modes on narrow widths when full tabs take too much space.

## Use cases

Each example is a different screen and meaning; prop combinations reflect typical API usage.

### Basic

Sales dashboard: change period for a revenue widget.

```tsx
import { SegmentedControl } from "prime-ui-kit";

export function RevenuePeriodToggle() {
  return (
    <SegmentedControl.Root defaultValue="week" size="m">
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

### Sizes

Internal portal: the same quarter switch at four sizes to match table and filter density.

```tsx
import { SegmentedControl } from "prime-ui-kit";
import styles from "../../../playground/snippets/segmented/segmented-docs.module.css";

export function QuarterPickersByDensity() {
  return (
    <div className={styles.sizesStack}>
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <SegmentedControl.Root key={size} defaultValue="q2" size={size}>
          <SegmentedControl.Item value="q1">Q1</SegmentedControl.Item>
          <SegmentedControl.Item value="q2">Q2</SegmentedControl.Item>
          <SegmentedControl.Item value="q3">Q3</SegmentedControl.Item>
          <SegmentedControl.Item value="q4">Q4</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Notifications side panel: digest time as an input field and channel choice via segments; one channel is temporarily unavailable.

```tsx
import { Input, SegmentedControl } from "prime-ui-kit";
import styles from "../../../playground/snippets/segmented/segmented-docs.module.css";

export function NotificationChannelPanel() {
  return (
    <aside className={styles.notificationAside}>
      <Input.Root id="digest-time" label="Digest time" size="m">
        <Input.Wrapper>
          <Input.Field type="time" defaultValue="09:00" />
        </Input.Wrapper>
      </Input.Root>
      <p className={styles.channelHeading}>Channel</p>
      <SegmentedControl.Root defaultValue="email" size="m">
        <SegmentedControl.Item value="email">Email</SegmentedControl.Item>
        <SegmentedControl.Item value="push">Push</SegmentedControl.Item>
        <SegmentedControl.Item value="sms" disabled>
          SMS
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </aside>
  );
}
```

### Controlled mode

Media library page: parent holds selected content type and syncs it with the API request when the segment changes.

```tsx
import * as React from "react";
import { SegmentedControl } from "prime-ui-kit";
import styles from "../../../playground/snippets/segmented/segmented-docs.module.css";

export function MediaLibraryFilterBar() {
  const [kind, setKind] = React.useState<"photo" | "video" | "audio">("photo");

  return (
    <header className={styles.filterToolbar}>
      <span className={styles.fileTypeCaption}>File type: {kind}</span>
      <SegmentedControl.Root value={kind} onValueChange={(v) => setKind(v as typeof kind)} size="m">
        <SegmentedControl.Item value="photo">Photo</SegmentedControl.Item>
        <SegmentedControl.Item value="video">Video</SegmentedControl.Item>
        <SegmentedControl.Item value="audio">Audio</SegmentedControl.Item>
      </SegmentedControl.Root>
    </header>
  );
}
```

## Anatomy

`SegmentedControl.Root` — a `div` wrapper with `role="radiogroup"`, control size provider, and floating indicator layer.

- `SegmentedControl.Item` — segment (`button`, `role="radio"`).
- `SegmentedControl.Icon` — `span` with `aria-hidden` for a decorative icon inside a segment.

## API

### SegmentedControl.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | No | Selected value in controlled mode. |
| defaultValue | string | "" | No | Initial value in uncontrolled mode; empty string means no segment selected. |
| onValueChange | (value: string) => void | — | No | Selected value change (click or keyboard). |
| disabled | boolean | false | No | Disables the entire group. |
| size | "s" \| "m" \| "l" \| "xl" | "m" | No | Segment size and typography. |
| children | React.ReactNode | — | Yes | Segments and nested markup. |
| className | string | — | No | Extra class on the container (e.g. width 100%). |

### SegmentedControl.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | string | — | Yes | Segment identifier. |
| disabled | boolean | false | No | Disables one segment; skipped when navigating with arrow keys. |
| children | React.ReactNode | — | Yes | Label and/or `SegmentedControl.Icon`. |
| className | string | — | No | Extra class on the button. |

### SegmentedControl.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | React.ReactNode | — | Yes | Icon. |
| className | string | — | No | Extra class. |
| …rest | Omit<HTMLAttributes<HTMLSpanElement>, "children"> | — | No | Other `span` attributes. |

## Variants

There is no separate `variant` prop: appearance is the same for all segments. Visual hierarchy is set with the `size` prop on the root (`s` | `m` | `l` | `xl`).

## States

- **Selected segment** — `aria-checked="true"`, selected item has `tabIndex={0}`, others `-1` (except when nothing is selected).
- **No selection** — with `defaultValue=""` and no `value`, no segment is checked; root has `tabIndex={0}` so the group can receive focus.
- **`disabled` item** — `disabled` on the button, `data-disabled`, does not respond to click or arrow traversal.
- **Root `disabled`** — `aria-disabled` on the group, all segments inactive.
- **Indicator animation** — when the root value changes, `data-animate="true"` is set briefly for smooth pill movement.

## Accessibility (a11y)

- **Radiogroup / radio** semantics and shared selection state.
- **Roving tabindex**: Tab focuses the group or the selected segment; **Left/Right** arrows move selection and focus across enabled segments.
- **Focus** — visible `:focus-visible` ring on segments.
- Icon in `SegmentedControl.Icon` is hidden from assistive tech (`aria-hidden`); the segment must still have an accessible name via visible text or visually hidden text in `children`.

## Limitations and notes

- No built-in **vertical** layout or orientation prop — column grid is horizontal only.
- No **`asChild`** or merging with an arbitrary root element.
- Root does **not** forward arbitrary HTML attributes (`aria-label`, `style`, etc.) — wrap the group in an outer element when you need extra semantics.
- Segment values are **strings**; binding to app-side enums is the consumer’s responsibility.
- The floating indicator measures the active segment’s geometry in layout; avoid changing segment sizes without a recalc (e.g. heavy conditional nesting) unless you understand that position updates via `ResizeObserver` and `MutationObserver`.

## Related components

- **Tabs** — when you need full content panels and the tabs keyboard model.
- **ButtonGroup** — independent or toggle action buttons, not a single choice from a set.
- **Radio** — standalone radio fields with custom field markup; for a row of mutually exclusive options, SegmentedControl is visually more compact.
- **Select** — when there are many options or a long list.
