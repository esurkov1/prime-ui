# FileUpload

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

- **Назначение:** зона выбора файла — внешний **`label`**, скрытый **`input type="file"`**, клик по зоне открывает системный диалог; поддерживаются **drag-and-drop** и **`data-dragover`** на корне.
- **Импорт:** `import { FileUpload } from "prime-ui-kit"`.
- **Минимальный сценарий:** `<FileUpload.Root />` — встроенные `Icon`, `Title`, `Hint`, `BrowseLabel`.
- **Ключевые пропы корня:** `accept`, `multiple`, `disabled`, `onFilesChange(files: File[])`, `appearance` (`"dashed"` \| `"solid"`), `size` (`"s"` \| `"m"` \| `"l"` \| `"xl"`), `inputRef` для программного `click()`.
- **Контракт:** после каждого выбора или drop значение input **сбрасывается**, чтобы повторный выбор того же файла снова вызвал `onFilesChange`. Список файлов и загрузка на сервер — **на стороне приложения**.

## Extended

### About

Composable UI for choosing files: a `label` wrapping a hidden `input type="file"`, optional drag-and-drop styling, and building blocks for per-file rows (badge, name/meta, progress, actions).

**When to use**

- A visible drop zone plus native picker, with `accept`, `multiple`, and optional `disabled`.
- Drag-and-drop and click on the same target, with `onFilesChange` to feed app or server logic.
- Lists of uploads styled as cards with `FormatBadge`, typography slots, and optional `ItemProgress`.
- Dense modal layouts using `DropBody`, `Title`, `BrowseLink`, `ActionsRow`, and `Chip`, often with `inputRef` to open the dialog from nested controls.

**When not to use**

- A headless file field with no shared drop-zone affordance (use a plain `input` or minimal markup).
- Built-in upload, scanning, or storage integration (only UI and `File[]` callbacks).
- Automatic list state or remove/retry semantics inside the kit (`Item` is presentational).
- Scenarios where a non-`label` activation pattern is required without rethinking focus and hit targets.

### Composition

- **`FileUpload.Root`** — outer `label`, hidden file `input`, `ControlSizeProvider` for descendants. Omit `children` to get the default inner layout (`Icon`, `Title`, `Hint`, `BrowseLabel`). Replace `children` with `DropBody` / `Title` / `BrowseLink` / `ActionsRow` / `Chip` / `ChipLabel` for custom copy; use `inputRef` + `click()` from `BrowseLink` or `Chip` handlers because those elements stop propagation to the `label`.
- **File row** — `FileUpload.Item` (optional `variant`, `size`) → `ItemRow` → `FormatBadge` and `ItemMain`. Inside `ItemMain`, use `ItemTextGroup` with `ItemName` / `ItemMeta` / `ItemMetaSep`, or `ItemStack` with `ItemTryAgain` for error layouts; optional `ItemActions`. Below the row, optional `ItemProgress` (bar when `value` is set and `children` omitted) or `ItemFooter`.

### Playground snippets

Демо совпадают по порядку и смыслу с **`playground/sections/FileUploadSection.tsx`**. Исходники с импортами **`@/`** лежат в **`playground/snippets/file-upload/`**:

| Блок | Файл | Содержание |
|------|------|------------|
| **Размеры** | [`sizes.tsx`](../../../playground/snippets/file-upload/sizes.tsx) (+ [`sizes.module.css`](../../../playground/snippets/file-upload/sizes.module.css)) | Сетка **`FileUpload.Root`** с **`size`** `s`–`xl` и такие же **`FileUpload.Item`** с **`FormatBadge`**, индикатором в **`ItemName`**, **`ItemProgress`** с **`value`**. |
| **Варианты** | [`variants.tsx`](../../../playground/snippets/file-upload/variants.tsx) (+ [`variants.module.css`](../../../playground/snippets/file-upload/variants.module.css)) | У корня **`appearance`** **`dashed`** / **`solid`**; у карточки **`variant`** **`default`** / **`error`**. |
| **Состояния** | [`states.tsx`](../../../playground/snippets/file-upload/states.tsx) (+ [`states.module.css`](../../../playground/snippets/file-upload/states.module.css)) | Обычная и **`disabled`** зона; карточки с прогрессом, успехом и ошибкой (**`ItemStack`** + **`ItemTryAgain`**). Подсветка при перетаскивании — **`data-dragover`** на **`Root`**. |
| **Контролируемый режим** | [`controlled.tsx`](../../../playground/snippets/file-upload/controlled.tsx) | **`onFilesChange`**, **`multiple`**, **`accept`**; список имён и сброс через [Button](../button/COMPONENT.md). |
| **Композиция** | [`composition.tsx`](../../../playground/snippets/file-upload/composition.tsx) (+ [`composition.module.css`](../../../playground/snippets/file-upload/composition.module.css)) | **`DropBody`**, **`Title tone="muted"`**, **`BrowseLink`**, **`ActionsRow`** / **`Chip`** / **`ChipLabel`**, общий **`inputRef`** для программного **`click()`**. |
| **Full width** | [`full-width.tsx`](../../../playground/snippets/file-upload/full-width.tsx) (+ [`full-width.module.css`](../../../playground/snippets/file-upload/full-width.module.css)) | **`Root`** на всю ширину родителя (колонка формы). |
| **Свой контент и accept** | [`custom-children.tsx`](../../../playground/snippets/file-upload/custom-children.tsx) (+ [`custom-children.module.css`](../../../playground/snippets/file-upload/custom-children.module.css)) | Замена тела зоны через **`children`**, **`accept="image/*"`**. |
| **Круглая зона** | [`circle-modal.tsx`](../../../playground/snippets/file-upload/circle-modal.tsx) (+ [`circle-modal.module.css`](../../../playground/snippets/file-upload/circle-modal.module.css)) | Круглый контейнер (CSS), **`DropBody`**, внешняя кнопка загрузки с тем же **`inputRef`**. |
| **Список с аватаром** | [`avatar-rows.tsx`](../../../playground/snippets/file-upload/avatar-rows.tsx) | Макет строки профиля (**`Avatar`**, кнопки). **`FileUpload` в сниппете не рендерится** — в приложении при необходимости свяжите кнопки с общим **`inputRef`**. |

### Scenarios (recipes)

Готовые рецепты с импортом **`prime-ui-kit`** — **`examples/*.tsx`**. Лестницы размеров/состояний и разметка модалок — в **Playground snippets** выше.

| Файл | Идея | Связь со сниппетами |
|------|------|---------------------|
| [`examples/controlled-list.tsx`](examples/controlled-list.tsx) | Контролируемый список с **`Item`**, удаление по строке, очистка всего. | Расширяет [`controlled.tsx`](../../../playground/snippets/file-upload/controlled.tsx) карточками и действиями. |
| [`examples/drag-area.tsx`](examples/drag-area.tsx) | **`DropBody`**, **`BrowseLink`**, **`inputRef`**, счётчик последнего выбора. | Упрощённая композиция рядом с [`composition.tsx`](../../../playground/snippets/file-upload/composition.tsx) (без **`ActionsRow`** / **`Chip`**). |
| [`examples/document-attach.tsx`](examples/document-attach.tsx) | Вложения: **`multiple`**, фильтр типов, список **`Item`**. | Тематически близко к композиции и контролируемому режиму; визуальные паттерны карточек см. **Размеры** / **Состояния** в плейграунде. |
| [`examples/avatar-upload.tsx`](examples/avatar-upload.tsx) | Одно изображение, превью [Avatar](../avatar/COMPONENT.md), **`URL.createObjectURL`**. | См. [`circle-modal.tsx`](../../../playground/snippets/file-upload/circle-modal.tsx) для круглой зоны и внешней кнопки. |
| [`examples/full-width.tsx`](examples/full-width.tsx) | Колонка формы: зона на всю ширину родителя. | Зеркало [`full-width.tsx`](../../../playground/snippets/file-upload/full-width.tsx) для потребителей пакета. |
| [`examples/custom-children.tsx`](examples/custom-children.tsx) | **`children`** вместо дефолтного тела, **`accept`** для изображений. | Зеркало [`custom-children.tsx`](../../../playground/snippets/file-upload/custom-children.tsx) для потребителей пакета. |

### Minimal example

```tsx
import { FileUpload } from "prime-ui-kit";

export function Example() {
  return <FileUpload.Root />;
}
```

### Rules

- After each change or drop, `onFilesChange` receives a `File[]`; the input’s value is cleared so selecting the same file again still fires the callback.
- When `disabled` is set, the input is disabled, drops are ignored, and `data-disabled` is set on the `label` (`aria-disabled` is mirrored on the input).
- While a drag hovers the zone, the root `label` has `data-dragover` for styling.
- `BrowseLink` and `Chip` call `preventDefault` and `stopPropagation` on click — they do not open the picker unless you call `inputRef.current?.click()`.
- `FileUpload.Icon` and `FileUpload.FormatBadge` set `aria-hidden`; expose file meaning in visible text (e.g. `ItemName` / `ItemMeta`).
- `ItemProgress` renders `ProgressBar.Root` when `value` is defined and `children` are omitted; with no `value` and no `children`, only the empty wrapper is present.
- `DropBody` uses `pointer-events: none` on the wrapper so nested controls must remain interactive via nested `pointer-events` (as in the module styles).

## API

### FileUpload.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `FileUploadSize` (`"s" \| "m" \| "l" \| "xl"`) | `"m"` | No | Tokens for the zone, built-in icon, and hint context. |
| appearance | `FileUploadAppearance` (`"dashed" \| "solid"`) | `"dashed"` | No | Dashed vs solid border and field-like background. |
| inputRef | `React.Ref<HTMLInputElement>` | — | No | Ref to the hidden input (e.g. programmatic `click()`). |
| accept | `string` | — | No | Native `accept`. |
| multiple | `boolean` | — | No | Multi-select in the file dialog. |
| disabled | `boolean` | — | No | Disables input and drops. |
| onFilesChange | `(files: File[]) => void` | — | No | Called after picker change or drop. |
| children | `React.ReactNode` | — | No | Replaces the default drop-zone body. |
| className | `string` | — | No | Class on the `label`. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">` | — | No | `id`, `htmlFor`, ARIA, and other label attributes. |

### FileUpload.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Icon or other content. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Passed to `span` (`aria-hidden` is set on the component). |

### FileUpload.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| tone | `"default" \| "muted"` | `"default"` | No | Text emphasis. |
| className | `string` | — | No | Class on the `p`. |
| children | `React.ReactNode` | — | No | Title text. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Other paragraph attributes. |

### FileUpload.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class passed to `Hint.Root`. |
| children | `React.ReactNode` | — | No | Hint content. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Forwarded into `Hint.Root`; size follows `Root` context. |

### FileUpload.BrowseLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | `span` class. |
| children | `React.ReactNode` | — | No | Browse chip label. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes. |

### FileUpload.BrowseLink

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button `type`. |
| className | `string` | — | No | Class on the `button`. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | No | Invoked after `preventDefault` / `stopPropagation`. |
| children | `React.ReactNode` | — | No | Link text. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other button attributes. |

### FileUpload.DropBody

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Column wrapper class. |
| children | `React.ReactNode` | — | No | Custom layout. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.ActionsRow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Row class. |
| children | `React.ReactNode` | — | No | Chips or other actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.Chip

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button `type`. |
| className | `string` | — | No | Class on the `button`. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | No | Invoked after `preventDefault` / `stopPropagation`. |
| children | `React.ReactNode` | — | No | Chip contents (e.g. icon + `ChipLabel`). |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other button attributes. |

### FileUpload.ChipLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the `span`. |
| children | `React.ReactNode` | — | No | Chip text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### FileUpload.FormatBadge

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| format | `string` | — | Yes | Source string; trimmed, truncated, and uppercased for display. |
| color | `FileUploadFormatBadgeColor` | `"gray"` | No | Badge palette (`gray`, `red`, `blue`, `green`, `orange`, `purple`, `sky`, `yellow`). |
| className | `string` | — | No | Extra class on the `span`. |

### FileUpload.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `FileUploadItemVariant` (`"default" \| "error"`) | `"default"` | No | Card emphasis. |
| size | `FileUploadSize` | `"m"` | No | Card and inline scale. |
| className | `string` | — | No | Container class. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.ItemRow, ItemMain, ItemStack, ItemTextGroup, ItemName, ItemMeta, ItemActions, ItemFooter

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Nested markup. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### FileUpload.ItemMetaSep

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | `span` class. |
| children | `React.ReactNode` | — | No | Avoid relying on `children`; the glyph is fixed. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Passed to `span` (`aria-hidden`). |

### FileUpload.ItemTryAgain

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button `type`. |
| className | `string` | — | No | Class on the `button`. |
| children | `React.ReactNode` | — | No | Label. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | Other button attributes. |

### FileUpload.ItemProgress

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `number` | — | No | When set and `children` omitted, renders `ProgressBar.Root`. |
| max | `number` | — | No | Progress maximum (passed to `ProgressBar.Root`). |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Custom indicator instead of the bar. |

## Related

- [Button](../button/COMPONENT.md) — actions that call `inputRef.current?.click()`, clear lists, or sit in `ItemActions`.
- [Hint](../hint/COMPONENT.md) — underlying primitive for `FileUpload.Hint`.
- [ProgressBar](../progress-bar/COMPONENT.md) — used inside `ItemProgress` when `value` is provided without custom `children`.
- [Label](../label/COMPONENT.md) — pairing copy with the zone in forms.
- [Avatar](../avatar/COMPONENT.md) — image preview next to upload actions on profile-style screens.
- [Divider](../divider/COMPONENT.md) — separating rows in attachment lists.

## LLM note

- **Namespace:** `FileUpload` object; entry point for picking files is **`FileUpload.Root`** (`<label>` + hidden `<input type="file">`).
- **Callbacks:** `onFilesChange(File[])` after native change or drop; input value reset after each emit.
- **Drag state:** `data-dragover` on root while over; `data-disabled` when `disabled`.
- **Nested buttons:** `BrowseLink` / `Chip` do not bubble to label — use **`inputRef`** and `inputRef.current?.click()` to open the file dialog.
- **Presentation rows:** `FileUpload.Item` subtree (`ItemRow`, `FormatBadge`, `ItemMain`, `ItemProgress`, …) does not manage data; bind to app state yourself.
- **Appearances:** `appearance` on Root: `dashed` (default) vs `solid` (embedded / modal-style).
- **A11y:** `FormatBadge` and default icon wrapper are `aria-hidden`; file identity belongs in `ItemName` / visible text.
- **Playground vs recipes:** полная сетка демо и порядок блоков — **`playground/snippets/file-upload/*.tsx`** и **`FileUploadSection.tsx`**; копипаст под продукт — **`examples/*.tsx`** (см. таблицы **Playground snippets** и **Scenarios (recipes)**).
