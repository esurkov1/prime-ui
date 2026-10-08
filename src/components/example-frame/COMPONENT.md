# ExampleFrame

**Category:** infrastructure
**Kind:** layout

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
```
ExampleFrame               frame: toolbar + preview stage or code pane
├─ (toolbar)               SegmentedControl Preview / Code, theme Button, copy Button, device SegmentedControl
└─ (stage)                 children, laid out by previewLayout
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ExampleFrame
`ref` → `HTMLDivElement`. The documentation frame: a toolbar (pane switch, theme toggle, copy button, device switch) above the preview stage or the code pane.

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | — (required) | Source shown on the code pane (TS / TSX highlighting via CodeBlock) and copied by the copy button. |
| `previewLayout` | `"default" \| "stack" \| "stack-narrow" \| "full" \| "row" \| "matrix"` | `"default"` | How the preview lays out its children, so snippets need no wrapper divs (see Variants). |
| `viewport` | `"desktop" \| "tablet" \| "mobile"` | — | Preview width (controlled). |
| `defaultViewport` | `"desktop" \| "tablet" \| "mobile"` | `"desktop"` | Initial preview width (uncontrolled). |
| `onViewportChange` | `(viewport: "desktop" \| "tablet" \| "mobile") => void` | — | Called with the new width from the device switch. |
| `colorScheme` | `"light" \| "dark"` | — | Theme of the stage and code pane (controlled); the page theme is untouched. |
| `defaultColorScheme` | `"light" \| "dark"` | `"light"` | Initial theme (uncontrolled). |
| `onColorSchemeChange` | `(scheme: "light" \| "dark") => void` | — | Called with the new theme from the theme toggle. |
| `showThemeToggle` | `boolean` | `true` | Show the light / dark toggle in the toolbar. |
| `onCopy` | `() => void` | — | Called after `code` was copied to the clipboard. |
| `labels` | `Partial<ExampleFrameLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Preview content, laid out by `previewLayout`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "onCopy">` | — | `className` and the other attributes of the frame `<div>`. |

## Variants

### previewLayout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | single block centered in the stage | one component | yes |
| `stack` | centered column, gap 16, children capped at 640px (`10 × --prime-space-16`) so `width: 100%` blocks stay centered; a child with `fullWidth` or a table stretches | several blocks one under another | |
| `stack-narrow` | column, children capped at `7 × --prime-space-16` and centered | forms and narrow columns | |
| `full` | column, gap 16, every child takes the whole stage width | page structure: app shells, page regions | |
| `row` | centered wrapping row, gap 12, extra vertical padding | a few buttons or controls side by side | |
| `matrix` | centered grid of labelled cells: each direct child is a row, its children are cells (specimen above its caption); columns (up to 12) line up across rows, are never narrower than their content and grow to 320 / 160 / 128px for 1 / 2 / 3+ columns, so width-less specimens (Slider, `width: 100%` blocks) get a real cell; scrolls when wider than the stage | variant, size and state matrices | |

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
| pane | toolbar switch (internal, starts at Preview) | preview stage or code pane is rendered |
| viewport | `viewport` / `defaultViewport` | `data-viewport` on the preview viewport |
| theme | `colorScheme` / `defaultColorScheme` | `data-theme` on the stage and code pane |
| layout | `previewLayout` | `data-preview-layout` on the stage |
| copy | copy button | its `aria-label` switches to `labels.copied` / `labels.copyError` for 2 s; on success the copy glyph cross-fades to a check (`data-copy-state`) |

## Layout & spacing
- The frame is `max-width: 100%`; long code lines scroll inside the code pane instead of widening the page.
- The toolbar wraps below 40rem of frame width; below 25rem the visible device labels are hidden (icons stay, each option keeps a screen-reader name).
- The device width switches at once: `max-width` is layout, so it does not animate.
- Stack frames one per demo block; spacing between blocks comes from the page.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through the switches, the theme and copy buttons and the code pane. |
| `ArrowLeft` · `ArrowRight` | Choose the pane or the width inside a switch (SegmentedControl). |

### ARIA
- The pane and device switches are radio groups named by `labels.paneSwitch` and `labels.viewportSwitch`.
- The theme and copy buttons are icon-only Buttons with `aria-label`; after copying the label becomes `labels.copied`.
- The code pane is a focusable `section` with `aria-label` from `labels.codeRegion`, so keyboard users can scroll it.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `paneSwitch` | `"Вид примера"` | `aria-label` of the Preview / Code switch. |
| `preview` | `"Превью"` | Preview pane option. |
| `code` | `"Код"` | Code pane option. |
| `viewportSwitch` | `"Ширина превью"` | `aria-label` of the device switch. |
| `desktop` | `"Десктоп"` | Desktop width option. |
| `tablet` | `"Планшет"` | Tablet width option. |
| `mobile` | `"Телефон"` | Phone width option. |
| `copy` | `"Копировать код"` | Copy button `aria-label`. |
| `copied` | `"Скопировано"` | Copy button after success. |
| `copyError` | `"Не удалось скопировать"` | Copy button after a failure. |
| `themeDark` | `"Включить тёмную тему"` | Theme toggle in the light theme. |
| `themeLight` | `"Включить светлую тему"` | Theme toggle in the dark theme. |
| `codeRegion` | `"Код примера"` | `aria-label` of the code pane. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A live example next to its source, with the pane, width, theme and copy controls — `code`, `previewLayout`. |
| [controlled.tsx](examples/controlled.tsx) | Frames of one page share the preview width and theme: the parent owns both — `viewport`, `colorScheme`. |

## Mistakes
- Wrapping several preview items in an extra `div` with flex styles → use `previewLayout="row"` or `"stack"`.
- `code` that differs from the preview → import the example source (`?raw` in Vite) and render the same file.
- Expecting `colorScheme` to change the page theme → it only themes the frame's stage and code pane.

## Related
- **Built from:** [SegmentedControl](../segmented-control/COMPONENT.md), [Button](../button/COMPONENT.md), [CodeBlock](../code-block/COMPONENT.md), Icon (`view.*`, `viewport.*`, `theme.*`, `action.copy`, `action.check`)
- **See also:** [Card](../card/COMPONENT.md)
