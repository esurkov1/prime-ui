# Screen recipes

Every screen sits in one frame: `AppShell.Root` with Nav / Header / Main (nav rail + content panel) → `PageContent`
(header + body). `AppShell.Main` carries the page gutters and `PageContent.Body` spaces its blocks 40
apart, so your code adds **no outer padding and no margins**. Your CSS only lays out the inside of a
block (grids, rows) with `gap` on `--prime-space-*`.

## App frame (once per app)

Every `Sidebar.Item` gets an `icon` (in compact mode only icons remain) and is a link: `href`, or
`asChild` with the router's `NavLink`; `active` marks the current page (`aria-current="page"`). Below 768px the Sidebar becomes
an off-canvas panel — the app must render a menu button that opens it, otherwise navigation is
unreachable on phones. Put it into `AppShell.Header` and hide the whole header from 768px up (hiding
only its content would leave an empty sticky bar). That needs the compound form instead of
`AppShell.Template`; hiding a kit part with `display` is placement, which `className` may do.

```tsx
import { LayoutDashboard, Menu, Settings, ShoppingCart, Users } from "lucide-react";
import { AppShell, Button, NotificationProvider, Sidebar } from "prime-ui-kit";
import { type ReactNode, useState } from "react";
import styles from "./AppLayout.module.css";

export function AppLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <NotificationProvider>
      <AppShell.Root fillViewport>
        <AppShell.Nav>
          <Sidebar.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Sidebar.Header>Магазин</Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group label="Продажи">
                <Sidebar.Item icon={<LayoutDashboard />} href="/" active>
                  Обзор
                </Sidebar.Item>
                <Sidebar.Item icon={<ShoppingCart />} href="/orders" badge={12}>
                  Заказы
                </Sidebar.Item>
                <Sidebar.Item icon={<Users />} href="/clients">
                  Клиенты
                </Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Item icon={<Settings />} href="/settings">
              Настройки
            </Sidebar.Item>
              <Sidebar.Toggle />
            </Sidebar.Footer>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Header className={styles.mobileHeader}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Button.Icon>
              <Menu />
            </Button.Icon>
            Меню
          </Button.Root>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell.Root>
    </NotificationProvider>
  );
}
```

```css
/* AppLayout.module.css */
@media (min-width: 768px) {
  .mobileHeader {
    display: none;
  }
}
```

When the app needs a header on every width (breadcrumbs, global search), keep it visible and put the
menu button inside it with the same media query on the button's wrapper.

With React Router put `<Outlet />` as the child and pass `NavLink` through `Sidebar.Item asChild`
(see `src/layout/sidebar/examples/router.tsx`).

## Page wrapper

- App pages with actions (dashboard, list, detail): `PageContent.Section` — full width of the panel.
- Single-column forms and settings: `PageContent.Root maxWidth="readable"` — a form column wider than
  ~65ch is hard to scan.
- Long reading text: `PageContent.Root maxWidth="readable"`.

## Dashboard

Rhythm: header → KPI row (cards 16 apart) → panels grid (16 apart). Blocks 40 apart come from
`PageContent.Body`.

```tsx
import { Button, Card, PageContent } from "prime-ui-kit";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Обзор</PageContent.Title>
        <PageContent.Description>Продажи и заказы за октябрь.</PageContent.Description>
        <PageContent.Actions>
          <Button.Root variant="soft" tone="neutral">
            Экспорт
          </Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <div className={styles.kpis}>
          <Card.Root variant="stat-trend">
            <Card.Label>Выручка</Card.Label>
            <Card.Value>₽ 4,2 млн</Card.Value>
            <Card.Delta tone="success">+18%</Card.Delta>
          </Card.Root>
          <Card.Root variant="stat-trend">
            <Card.Label>Заказы</Card.Label>
            <Card.Value>1 248</Card.Value>
            <Card.Delta tone="neutral">0%</Card.Delta>
          </Card.Root>
        </div>
        <div className={styles.panels}>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle as="h2">Продажи по дням</Card.SectionTitle>
            </Card.SectionHeader>
            <Card.Chart>{/* chart */}</Card.Chart>
          </Card.Root>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
```

```css
/* Dashboard.module.css */
.kpis,
.panels {
  display: grid;
  gap: var(--prime-space-4);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--prime-space-16) * 4)), 1fr));
}

.panels {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--prime-space-16) * 6)), 1fr));
}
```

## List with a table and filters

Rhythm: header with one primary action → DataTable (toolbar inside it, 8 between filters). Loading,
empty and error go through DataTable props. Full toolbar code: [composition.md](composition.md#filter-bar-above-a-table).

```tsx
import { Button, DataTable, type DataTableColumn, PageContent } from "prime-ui-kit";

type Client = { id: string; name: string; city: string };

const columns: DataTableColumn<Client>[] = [
  { id: "name", header: "Клиент", accessor: "name", sortable: true },
  { id: "city", header: "Город", accessor: "city" },
];

export function ClientsPage({ rows, loading }: { rows: Client[]; loading: boolean }) {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Клиенты</PageContent.Title>
        <PageContent.Actions>
          <Button.Root>Добавить клиента</Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <DataTable.Root
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          loading={loading}
          selectable
          empty="Клиентов по этим фильтрам нет"
        />
      </PageContent.Body>
    </PageContent.Section>
  );
}
```

## Settings

Rhythm: header → one panel Card per group (40 apart — `PageContent.Body` does it) → inside a card
fields 20 apart, switches 20 apart → card actions at the bottom (primary last). Readable width. A form
in a card wraps the whole `Card.Root` in `<form>`. A danger zone is the last card; its trigger is
`variant="outline" tone="danger"` and opens a confirm Modal.

```tsx
import { Button, Card, Input, PageContent, Switch } from "prime-ui-kit";
import styles from "./Settings.module.css";

export function SettingsPage() {
  return (
    <PageContent.Root maxWidth="readable">
      <PageContent.Header>
        <PageContent.Title>Настройки</PageContent.Title>
      </PageContent.Header>
      <PageContent.Body>
        <Card.Root variant="panel">
          <Card.SectionHeader>
            <Card.SectionTitle as="h2">Профиль компании</Card.SectionTitle>
          </Card.SectionHeader>
          <Card.Body>
            <div className={styles.fields}>
              <Input.Root label="Название">
                <Input.Wrapper>
                  <Input.Field defaultValue="ООО «Ромашка»" />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root label="Сайт" optional>
                <Input.Wrapper>
                  <Input.InlineAffix side="start">https://</Input.InlineAffix>
                  <Input.Field placeholder="romashka.ru" />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </Card.Body>
          <Card.Actions>
            <Button.Root>Сохранить</Button.Root>
          </Card.Actions>
        </Card.Root>
        <Card.Root variant="panel">
          <Card.SectionHeader>
            <Card.SectionTitle as="h2">Уведомления</Card.SectionTitle>
          </Card.SectionHeader>
          <Card.Body>
            <Switch.Root defaultChecked>
              <Switch.Label>Письма о заказах</Switch.Label>
            </Switch.Root>
          </Card.Body>
        </Card.Root>
      </PageContent.Body>
    </PageContent.Root>
  );
}
```

```css
/* Settings.module.css */
.fields {
  display: grid;
  gap: var(--prime-space-5);
}
```

## Create form

Rhythm: fields 20 apart, related fields in a 2-column grid on wide screens, group → group 32, actions
row at the end (8 apart, primary last — also when the row stacks on a phone). Optional group headings on
a bare page: `Typography.Root as="h2" variant="title-m"` (inside a Card: `title-s`), 16 above their
fields. A short form (≤ 4 fields)
belongs in a Modal; a long one on a page (`PageContent.Root maxWidth="readable"`) or in a Drawer.

```tsx
import { Button, Datepicker, Input, Select, Textarea } from "prime-ui-kit";
import styles from "./CreateProject.module.css";

export function CreateProjectForm() {
  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <div className={styles.group}>
        <Input.Root label="Название проекта" required>
          <Input.Wrapper>
            <Input.Field name="name" />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.columns}>
          <Select.Root label="Ответственный" placeholder="Выберите сотрудника">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="anna">Анна Климова</Select.Item>
            </Select.Content>
          </Select.Root>
          <Datepicker.Root mode="single" label="Срок" />
        </div>
        <Textarea.Root label="Описание" optional />
      </div>
      <div className={styles.actions}>
        <Button.Root variant="ghost" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root type="submit">Создать проект</Button.Root>
      </div>
    </form>
  );
}
```

```css
/* CreateProject.module.css */
.form {
  display: grid;
  gap: var(--prime-space-8);
}

.group {
  display: grid;
  gap: var(--prime-space-5);
}

.columns {
  display: grid;
  gap: var(--prime-space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--prime-space-16) * 4)), 1fr));
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--prime-space-2);
}
```

### Multi-step form

`Stepper.Root` (controlled `value`) above one Card that shows the current step's fields; actions
«Назад» (`variant="soft" tone="neutral"`) and «Далее» / «Готово» at the bottom of the card. Mark a step
with errors via the step `status`. See `src/components/stepper/examples/wizard.tsx`.

## Detail page

Rhythm: Breadcrumb above the header → header with status Badge and actions → main column of panel Cards
plus a side column (Timeline of events). Two columns from 1024px, one below.

```tsx
import { Badge, Breadcrumb, Button, Card, PageContent, Timeline } from "prime-ui-kit";
import styles from "./OrderPage.module.css";

export function OrderPage() {
  return (
    <PageContent.Section>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/orders">Заказы</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>№ 48 213</Breadcrumb.Item>
      </Breadcrumb.Root>
      <PageContent.Header>
        <PageContent.Title>Заказ № 48 213</PageContent.Title>
        <PageContent.Description>
          <Badge.Root color="green">Оплачен</Badge.Root>
        </PageContent.Description>
        <PageContent.Actions>
          <Button.Root variant="soft" tone="danger">
            Отменить
          </Button.Root>
          <Button.Root>Отправить</Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <div className={styles.columns}>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle as="h2">Состав заказа</Card.SectionTitle>
            </Card.SectionHeader>
            <Card.Body>…</Card.Body>
          </Card.Root>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle as="h2">История</Card.SectionTitle>
            </Card.SectionHeader>
            <Card.Body>
              <Timeline.Root>
                <Timeline.Item tone="success">
                  <Timeline.Title>Оплата получена</Timeline.Title>
                  <Timeline.Meta>07.10.26</Timeline.Meta>
                </Timeline.Item>
              </Timeline.Root>
            </Card.Body>
          </Card.Root>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
```

```css
/* OrderPage.module.css */
.columns {
  display: grid;
  gap: var(--prime-space-4);
}

@media (min-width: 1024px) {
  .columns {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}
```

## Empty state (first run)

The whole region has no data yet: EmptyPage with one action. Filtered tables use DataTable `empty`
instead. (`layout="fill"` only centers inside a flex column with a height — not inside `PageContent.Body`.)

```tsx
import { Button, EmptyPage, PageContent } from "prime-ui-kit";

export function NoProjects() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Проекты</PageContent.Title>
      </PageContent.Header>
      <PageContent.Body>
        <EmptyPage.Root aria-labelledby="no-projects">
          <EmptyPage.Title id="no-projects">Проектов пока нет</EmptyPage.Title>
          <EmptyPage.Description>Создайте первый проект, чтобы пригласить команду.</EmptyPage.Description>
          <EmptyPage.Actions>
            <Button.Root>Создать проект</Button.Root>
          </EmptyPage.Actions>
        </EmptyPage.Root>
      </PageContent.Body>
    </PageContent.Section>
  );
}
```

## Auth (sign in, code)

No AppShell. A single Card centered on the canvas, width ≈ 400 (`calc(var(--prime-space-10) * 10)`), fields 20
apart, one full-width primary button, secondary links as LinkButton. Code step: `DigitInput.Root`.

```tsx
import { Button, Card, Input, LinkButton, Typography } from "prime-ui-kit";
import styles from "./SignIn.module.css";

export function SignIn() {
  return (
    <main className={styles.page}>
      <Card.Root variant="panel" className={styles.card}>
        <Card.Body>
          <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
            <Typography.Root as="h1" variant="heading-s">
              Вход
            </Typography.Root>
            <Input.Root label="Email" required>
              <Input.Wrapper>
                <Input.Field type="email" autoComplete="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
            <Button.Root type="submit" fullWidth>
              Получить код
            </Button.Root>
            <LinkButton.Root href="/signup">Создать аккаунт</LinkButton.Root>
          </form>
        </Card.Body>
      </Card.Root>
    </main>
  );
}
```

```css
/* SignIn.module.css */
.page {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--prime-space-4);
  background: var(--prime-color-bg-canvas);
}

.card {
  width: min(100%, calc(var(--prime-space-10) * 10));
}

.form {
  display: grid;
  gap: var(--prime-space-5);
}
```
