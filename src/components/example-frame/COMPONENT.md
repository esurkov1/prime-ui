# ExampleFrame

**Category:** infrastructure (Инфраструктура)

> A documentation frame: live preview, source code and device width in one block.

## When to use
- Documentation and design-system pages that show a live example next to its source.
- Checking an example in light and dark themes and at desktop / tablet / phone widths.

## When not to use
- Showing code without a live preview → use [CodeBlock](../code-block/COMPONENT.md).
- Grouping app content in a box → use [Card](../card/COMPONENT.md).
- Switching app sections → use [Tabs](../tabs/COMPONENT.md).

## Import
```tsx
import { ExampleFrame } from "prime-ui-kit";
```

## Anatomy
- `ExampleFrame.Root` — the frame: toolbar (pane switch Preview / Code, theme toggle, copy button, device switch) and either the preview stage or the code pane.
  - `ExampleFrame.Stage` — marks the content shown in the preview. Without a Stage all `children` are previewed.

## API

### ExampleFrame.Root
Does not forward a ref; no native props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | — (required) | Source shown on the code pane (TS/TSX highlighting via CodeBlock) and copied by the copy button. |
| `children` | `ReactNode` | — | Preview content; if an `ExampleFrame.Stage` is among the children, only its children are previewed. |
| `className` | `string` | — | Extra class on the frame. |
| `colorScheme` | `"light" \| "dark"` | — | Preview theme, controlled. |
| `defaultColorScheme` | `"light" \| "dark"` | `"light"` | Initial preview theme, uncontrolled. |
| `onColorSchemeChange` | `(scheme: "light" \| "dark") => void` | — | Called when the theme toggle is pressed. |
| `viewport` | `"desktop" \| "tablet" \| "mobile"` | — | Preview width, controlled. |
| `defaultViewport` | `"desktop" \| "tablet" \| "mobile"` | `"desktop"` | Initial preview width, uncontrolled. |
| `onViewportChange` | `(v: "desktop" \| "tablet" \| "mobile") => void` | — | Called when the device switch changes. |
| `showThemeToggle` | `boolean` | `true` | Show the light/dark toggle in the toolbar. |
| `onCopy` | `() => void` | — | Called after `code` was copied to the clipboard. |
| `previewLayout` | `ExampleFramePreviewLayout` | `"default"` | How preview children are laid out (see Variants). |
| `labels` | `Partial<ExampleFrameLabels>` | see Accessibility | Toolbar and region strings. |

### ExampleFrame.Stage
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Content rendered only in the preview. |

## Variants

### previewLayout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | single block centered in the stage | one component | yes |
| `stack` | centered column, gap 16; a child with `fullWidth` or a table stretches | several blocks one under another | |
| `stack-center` | centered column, gap 12 | short centered items | |
| `stack-narrow` | column, children capped at `7 × --prime-space-16` and centered | forms and narrow columns | |
| `dense-stack` | column from the top, gap 4, scrolls past a max height | long lists | |
| `row` | centered wrapping row, gap 12, extra vertical padding | a few buttons or controls side by side | |
| `row-start` | wrapping row aligned to the start, gap 12 | toolbars, start-aligned controls | |
| `row-wrap` | centered wrapping row, items aligned to the top, gap 8 | many small items (badges, tags) | |

### viewport
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `desktop` | stage takes the full frame width | default view | yes |
| `tablet` | stage capped at 768px (`8 × --prime-space-24`), centered | checking tablet layout | |
| `mobile` | stage capped at 384px (`4 × --prime-space-24`), centered | checking phone layout | |

### colorScheme
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `light` | stage and code pane in the light theme | default | yes |
| `dark` | stage and code pane in the dark theme (`data-theme="dark"`), switched without color transitions | checking dark mode | |

Frame look: `bg-sunken` chrome with a `border-subtle` hairline and `radius-xl`; the stage and code pane are `bg-canvas` wells with `radius-l` (16 − 4 padding = 12). The stage resets the card context (`--prime-color-card-bg: bg-surface`).

## States
| State | Driven by | DOM |
|---|---|---|
| pane | toolbar switch (internal state, starts at Preview) | preview stage or code pane is rendered |
| viewport | `viewport` / `defaultViewport` | `data-viewport` on the preview viewport |
| theme | `colorScheme` / `defaultColorScheme` | `data-theme` on the stage and code pane |
| layout | `previewLayout` | `data-preview-layout` on the stage |
| copy | copy button | its `aria-label` switches to `labels.copied` / `labels.copyError` for 2 s |

Controlled: pass `colorScheme` / `viewport` with their change handlers (e.g. to sync all frames on a page); uncontrolled: `default*` props.

## Layout & spacing
- The frame is `max-width: 100%`; long code lines scroll inside the code pane instead of widening the page.
- The toolbar wraps below 640px of frame width; below 400px the device labels are visually hidden (icons stay).
- Stack frames one per demo block; spacing between blocks comes from the page (`var(--prime-space-10)`–`var(--prime-space-12)` between sections).

## Accessibility
- Pane and device switches are SegmentedControls (radio groups); the theme and copy buttons are icon-only Buttons with `aria-label`.
- The code pane is a focusable `section` (`tabIndex=0`) with `aria-label` from `labels.codeRegion`, so keyboard users can scroll it.

| `labels` key | Default | Used for |
|---|---|---|
| `preview` | `"Превью"` | Preview pane option |
| `code` | `"Код"` | Code pane option |
| `desktop` | `"Десктоп"` | desktop width option |
| `tablet` | `"Планшет"` | tablet width option |
| `mobile` | `"Телефон"` | phone width option |
| `copy` | `"Копировать код"` | copy button `aria-label` |
| `copied` | `"Скопировано"` | copy button after success |
| `copyError` | `"Не удалось скопировать"` | copy button after failure |
| `themeDark` | `"Включить тёмную тему"` | theme toggle in light mode |
| `themeLight` | `"Включить светлую тему"` | theme toggle in dark mode |
| `codeRegion` | `"Код примера"` | `aria-label` of the code pane |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [basic.tsx](examples/basic.tsx) | Preview + code with the full toolbar and a `row` layout | documentation pages |

```tsx
import { Button, ExampleFrame } from "prime-ui-kit";

export function SaveButtonDemo() {
  return (
    <ExampleFrame.Root code="<Button.Root>Сохранить</Button.Root>">
      <ExampleFrame.Stage>
        <Button.Root>Сохранить</Button.Root>
      </ExampleFrame.Stage>
    </ExampleFrame.Root>
  );
}
```

## Mistakes
- Wrapping several preview items in an extra `div` with flex styles → use `previewLayout="row"` or `"stack"`.
- `code` that differs from the preview → import the example source (`?raw` in Vite) and render the same file.
- Expecting `colorScheme` to change the page theme → it only themes the frame's stage and code pane.

## Related
- [CodeBlock](../code-block/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
- [Card](../card/COMPONENT.md)
