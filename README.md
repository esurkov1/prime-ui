# prime-ui-kit

React 19 component library: **CSS Modules**, **design tokens** as CSS variables (`--prime-sys-*`), and a **composable API** (`Modal.Root`, `Input.Field`, `Select.Trigger`, …). Works with **Vite**, **Next.js**, **Remix**, or any bundler that supports CSS Modules.

**[npm](https://www.npmjs.com/package/prime-ui-kit)** · **[Repository & issues](https://github.com/esurkov1/prime-ui)**

---

## Requirements

| | Version |
|---|--------|
| React / React DOM | ^19.0.0 |
| react-aria-components | ^1.16.0 |
| react-day-picker | ^9.14.0 |
| date-fns | ^4.0.0 |

The package also installs **lucide-react**, **framer-motion**, and **react-router-dom** for icons, notification motion, and **Sidebar** links. Use a router (e.g. `BrowserRouter`) if you render **Sidebar** with navigation items.

---

## Install

```bash
npm install prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
pnpm add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
bun add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

---

## Styles

Import **tokens**, a **theme**, and **global component styles** (this order):

```css
@import "prime-ui-kit/tokens.css";
@import "prime-ui-kit/theme-light.css";
/* or: theme-dark.css */
@import "prime-ui-kit/styles.css";
```

**Light / dark:** set `data-theme="light"` or `data-theme="dark"` on `<html>`, a layout root, or any wrapper. You can import both theme files and switch only the attribute.

---

## Usage

Importing from `prime-ui-kit` loads the kit’s global CSS (side effect). You still add **tokens**, **theme**, and **`styles.css`** in your own stylesheet as shown above.

```tsx
import { Button, Input, Modal } from "prime-ui-kit";

export function Example() {
  return (
    <>
      <Input.Root size="m" label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>

      <Button variant="primary" mode="filled" size="l">
        Submit
      </Button>
    </>
  );
}
```

**Heavy or tree-shaken imports** — use the components entry:

```tsx
import { DataTable } from "prime-ui-kit/components";
```

---

## Notifications

Wrap the app (or a subtree) with **`NotificationProvider`**, then use the **`useNotifications()`** hook for **`notify`**, **`dismiss`**, and **`dismissAll`**.

---

## Control size

Optional **`ControlSizeProvider`** sets a default **`s` | `m` | `l` | `xl`** for controls inside the subtree.

---

## Components

**Forms:** Input, Textarea, Checkbox, Radio, Switch, Select, Slider, DigitInput, FileUpload, ColorPicker, Label, Hint, Kbd.

**Overlays:** Modal, Drawer, Popover, Dropdown, Tooltip, CommandMenu.

**Layout & navigation:** PageShell, PageContent, Sidebar, Breadcrumb, Tabs, Accordion, Stepper, SegmentedControl, Pagination.

**Data:** DataTable.

**Actions & content:** Button, ButtonGroup, LinkButton, Badge, Banner, Notification, ProgressBar, ProgressCircle, Typography, Divider, Tag, Avatar, CodeBlock, Datepicker.

---

## TypeScript

Type definitions are published with the package (`dist/*.d.ts`).

---

## License

MIT — see the `LICENSE` file in the package.
