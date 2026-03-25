# FileUpload

## What it is

A compositional set for file selection: a zone built on a `label` with a hidden `input type="file"`, drag-and-drop support, and separate markup blocks for lists of uploaded files with a format badge and progress.

## What it’s for

- **Hiring and applicants** — uploading résumés and portfolios as PDFs/images with a clear “drag or choose” zone.
- **E-commerce and marketplaces** — product photos, certificates, and video reviews: `accept` filter, multi-select, and a list of names before sending to the server.
- **Medical and lab portals** — uploading scans and reports with status cards (in progress / done / error) and a retry button.
- **User profile** — a round or compact zone for an avatar plus an external button that opens the same `input` via `inputRef`.
- **B2B and tenders** — attachments to applications in a controlled list: multiple files, clearing, and app-side size validation.
- **Education and LMS** — student submissions: file type limits and a disabled zone after the deadline via `disabled`.

## Use cases

Import from the `prime-ui-kit` package. Examples cover different products and screens.

### Basic

Job application page: one zone; the selected file is shown as text below the zone.

```tsx
import * as React from "react";
import { FileUpload } from "prime-ui-kit";

export function JobApplyUpload() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div style={{ maxWidth: 480 }}>
      <FileUpload.Root
        accept=".pdf,application/pdf"
        onFilesChange={(next) => {
          setFiles(next);
        }}
      />
      {files[0] ? (
        <p style={{ marginTop: 12, fontSize: 14 }}>Attached: {files[0].name}</p>
      ) : null}
    </div>
  );
}
```

### Variants and sizes

Supplier dashboard: a zone in a card with a solid border and larger size; next to it, a file card in an error state.

```tsx
import { FileUpload } from "prime-ui-kit";

export function SupplierInvoiceUpload() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 520 }}>
      <FileUpload.Root size="l" appearance="solid" multiple />
      <FileUpload.Item variant="error" size="l">
        <FileUpload.ItemRow>
          <FileUpload.FormatBadge format="XLSX" color="green" />
          <FileUpload.ItemMain>
            <FileUpload.ItemName>invoice_wrong_currency.xlsx</FileUpload.ItemName>
            <FileUpload.ItemMeta>
              <span>Invalid format for the “Amount” column</span>
            </FileUpload.ItemMeta>
          </FileUpload.ItemMain>
        </FileUpload.ItemRow>
      </FileUpload.Item>
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Import modal: a `DropBody` column, muted title, a “browse” link, and source chips sharing one `inputRef`.

```tsx
import * as React from "react";
import { FileUpload } from "prime-ui-kit";

export function ImportModalDropzone() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <section style={{ padding: 24, borderRadius: 12, background: "var(--prime-sys-color-surface-elevated, #fff)", maxWidth: 400 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Import spreadsheet</h2>
      <FileUpload.Root inputRef={inputRef} appearance="solid" size="m" multiple>
        <FileUpload.DropBody>
          <FileUpload.Title tone="muted">
            Drag a file here or{" "}
            <FileUpload.BrowseLink type="button" onClick={() => inputRef.current?.click()}>
              choose from disk
            </FileUpload.BrowseLink>
          </FileUpload.Title>
          <FileUpload.ActionsRow>
            <FileUpload.Chip type="button" onClick={() => inputRef.current?.click()}>
              <FileUpload.ChipLabel>Local disk</FileUpload.ChipLabel>
            </FileUpload.Chip>
            <FileUpload.Chip type="button">
              <FileUpload.ChipLabel>Network folder</FileUpload.ChipLabel>
            </FileUpload.Chip>
          </FileUpload.ActionsRow>
        </FileUpload.DropBody>
      </FileUpload.Root>
    </section>
  );
}
```

### Controlled mode

Support ticket attachments panel: multiple files, a list of names, and a clear button.

```tsx
import * as React from "react";
import { Button, FileUpload } from "prime-ui-kit";

export function SupportTicketAttachments() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
      <FileUpload.Root
        multiple
        accept="image/*,.pdf,application/pdf"
        onFilesChange={(next) => {
          setFiles((prev) => [...prev, ...next]);
        }}
      />
      {files.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          {files.map((f) => (
            <li key={`${f.name}-${f.lastModified}`}>{f.name}</li>
          ))}
        </ul>
      ) : null}
      {files.length > 0 ? (
        <Button.Root type="button" size="s" variant="neutral" mode="stroke" onClick={() => setFiles([])}>
          Remove attachments
        </Button.Root>
      ) : null}
    </div>
  );
}
```

## Anatomy

**Selection zone:** `FileUpload.Root` (renders `label` + hidden `input`) → by default, inside `ControlSizeProvider`, built-in `Icon`, `Title`, `Hint`, `BrowseLabel`, or custom `children` (`DropBody`, `Title`, `BrowseLink`, `ActionsRow`, `Chip`, …).

**File card:** `FileUpload.Item` → `ItemRow` → `FormatBadge` + `ItemMain` (often `ItemTextGroup` with `ItemName` and `ItemMeta`, or `ItemStack` with an error and `ItemTryAgain`) + optionally `ItemActions`; below the row — `ItemProgress` or `ItemFooter`.

## API

### FileUpload.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Tokens for the zone, text, Browse chip, and Hint context. |
| appearance | `"dashed" \| "solid"` | `"dashed"` | No | Dashed or solid border and a field-like background. |
| inputRef | `React.Ref<HTMLInputElement>` | — | No | Access to the hidden input for programmatic `click()`. |
| accept | `string` | — | No | Native `accept`. |
| multiple | `boolean` | — | No | Multi-select in the file dialog. |
| disabled | `boolean` | — | No | Disables selection and drop; sets `aria-disabled` on the input. |
| onFilesChange | `(files: File[]) => void` | — | No | After change or drop; the input value is reset. |
| children | `React.ReactNode` | — | No | Custom zone markup. |
| className | `string` | — | No | Class on the `label`. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">` | — | No | `htmlFor`, `id`, ARIA, etc. |

### FileUpload.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Usually an icon from the kit. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Root with `aria-hidden`. |

### FileUpload.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| tone | `"default" \| "muted"` | `"default"` | No | Title text color. |
| className | `string` | — | No | Paragraph class. |
| children | `React.ReactNode` | — | No | Text. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Other `p` attributes. |

### FileUpload.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class. |
| children | `React.ReactNode` | — | No | Hint (rendered via `Hint.Root`). |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Size comes from the root zone context. |

### FileUpload.BrowseLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | `span` class. |
| children | `React.ReactNode` | — | No | Browse chip label. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### FileUpload.BrowseLink

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Click does not bubble to the `label`. |
| className | `string` | — | No | Button class. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | No | Often opens the dialog via `inputRef`. |
| children | `React.ReactNode` | — | No | Link text. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other button attributes. |

### FileUpload.DropBody

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Column class. |
| children | `React.ReactNode` | — | No | Text and chips. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.ActionsRow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Row class. |
| children | `React.ReactNode` | — | No | `Chip` and others. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.Chip

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Does not open the dialog without a handler. |
| className | `string` | — | No | Button class. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | No | Stops bubbling to the `label`. |
| children | `React.ReactNode` | — | No | Icon and `ChipLabel`. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other attributes. |

### FileUpload.ChipLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class. |
| children | `React.ReactNode` | — | No | Chip text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### FileUpload.FormatBadge

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| format | `string` | — | Yes | Extension string; shortened and uppercased in the UI. |
| color | `FileUploadFormatBadgeColor` | `"gray"` | No | Badge palette. |
| className | `string` | — | No | Extra class. |

### FileUpload.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | No | Default or error card. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Card and typography sizing. |
| className | `string` | — | No | Container class. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### Card and row slots (`ItemRow`, `ItemMain`, `ItemStack`, `ItemTextGroup`, `ItemName`, `ItemMeta`, `ItemActions`, `ItemFooter`)

For each listed component, the contract is the same:

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Nested markup. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.ItemMetaSep

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | `span` class. |
| children | `React.ReactNode` | — | No | Ignored in markup; shows “·”. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Node with `aria-hidden`. |

### FileUpload.ItemTryAgain

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button type. |
| className | `string` | — | No | Class. |
| children | `React.ReactNode` | — | No | Label. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other attributes. |

### FileUpload.ItemProgress

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `number` | — | No | If set without `children` — renders `ProgressBar.Root`. |
| max | `number` | — | No | Progress maximum. |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Custom indicator instead of the bar. |

## Variants

- **`appearance` on Root:** `dashed` — typical dashed zone; `solid` — solid border and background closer to an input field, handy inside cards and modals.
- **`variant` on Item:** `default` — neutral card; `error` — emphasized border and background for upload failure or rejected file.
- **`size`:** shared `s`–`xl` scale for the zone and the card; buttons next to the card should match the same size.
- **`FormatBadge.color`:** `gray`, `red`, `blue`, `green`, `orange`, `purple`, `sky`, `yellow` — visual grouping of file types.
- **`Title.tone`:** `muted` for secondary text in dense layouts.

## States

- **Default zone** — clicking empty area opens the dialog; hover and focus change outline and shadow.
- **Dragging** — while a file is over the zone, `data-dragover` is set on the `label` (highlighted border and background).
- **`disabled`** — `not-allowed` cursor, reduced opacity; drop is ignored.
- **Card** — loading / success / error in markup and icons is up to the app; `ItemProgress` is optional; for errors use `variant="error"` and `ItemTryAgain`.

## Accessibility (a11y)

- The zone is clickable via `label` + hidden `input`; keyboard focus shows a visible ring on the zone (`focus-within`).
- The hidden field gets `aria-disabled` when `disabled`.
- `BrowseLink` and `Chip` stop propagation so the dialog does not open twice without an explicit `onClick`.
- Mark `FormatBadge` and decorative icons in examples with `aria-hidden` if status is duplicated in text in `ItemName`.
- Icons in `FileUpload.Icon` are wrapped with `aria-hidden` by default — meaning must come from adjacent text.

## Limitations and notes

- No built-in server upload, virus scanning, or cloud connectors — only UI and `onFilesChange` / native file picking.
- Picking the same file again still fires `onFilesChange` because the input value is cleared after selection.
- “Cloud” chips in demos are visual placeholders; real storage integration must be wired separately.
- File list and removing items are the app’s responsibility; `Item` cards do not hold file state.
- For a settings row without a visible zone, a hidden `input` and buttons are enough — the `FileUpload` block may be unnecessary; the docs show a nearby pattern with `Avatar` for context.

## Related components

- **Button** — external `inputRef.click()`, clearing the list, actions in `ItemActions`.
- **Hint** — used inside `FileUpload.Hint` with size from context.
- **ProgressBar** — rendered inside `ItemProgress` when `value` is passed without custom `children`.
- **Avatar** — image preview in settings lists next to upload actions.
- **Divider** — separators between list rows in profile layouts.
