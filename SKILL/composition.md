# When the kit has no ready component

Go down this ladder and stop at the first step that works.

1. **Find it in the kit.** Search [components.md](components.md), then the Variants and Anatomy of the
   closest component: Card has 9 templates, Input has affixes/badge/counter, Select has rich items,
   Dropdown has a profile header, DataTable has a toolbar slot, nested rows and a detail panel.
2. **Compose kit parts.** Put existing components together on a layout wrapper (CSS Module, `gap` on
   tokens). Most "missing components" are a Card + Typography + Button arrangement.
3. **Last resort: a new element on tokens.** Only when 1–2 cannot express it (a chart, a kanban column).

## Rules for your own component

- Lives in the consumer project (`shared/ui/<name>/` or the project's equivalent), not inside
  `node_modules`.
- Follows API v1 ([api-contract.md](api-contract.md)): `size` (default `m`), `tone`/`color`, `X.Root` +
  `X.Part` when it has parts, `labels` for system strings, `data-*` for state.
- Styled with a CSS Module on `--prime-*` tokens. Bounded block: `--prime-color-card-bg` +
  `--prime-card-radius`. Never override kit internals or reach into their class names.
- **Threshold:** a pattern used twice becomes a component. Two things that look the same are one component
  with a variant, never two components or two hand-written copies.

## Worked examples

### Metric card with a period switch

Kit has the metric templates; the switch is a composition: `Card.Root variant="panel"` + header with a
SegmentedControl in `Card.SectionTrailing`.

```tsx
import { Card, SegmentedControl, Typography } from "prime-ui-kit";

export function RevenuePanel() {
  return (
    <Card.Root variant="panel">
      <Card.SectionHeader>
        <Card.SectionTitle as="h2">Выручка</Card.SectionTitle>
        <Card.SectionTrailing>
          <SegmentedControl.Root size="s" defaultValue="month" aria-label="Период">
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Card.SectionTrailing>
      </Card.SectionHeader>
      <Card.Body>
        <Typography.Root as="p" variant="heading-m">
          ₽ 4,2 млн
        </Typography.Root>
        <Typography.Root as="p" variant="body-s" tone="secondary">
          +18% к прошлому месяцу
        </Typography.Root>
      </Card.Body>
    </Card.Root>
  );
}
```

For a plain KPI row use `Card.Root variant="stat-trend"` (Label · Value · Delta) in a grid — no custom code.

### Settings row with a Switch

Switch already renders label + hint + control in one row. A settings group is a panel Card with Switches
20 apart. Do not rebuild the row with `div`s and do not add lines between switches.

```tsx
import { Card, Switch } from "prime-ui-kit";
import styles from "./NotificationSettings.module.css";

export function NotificationSettings() {
  return (
    <Card.Root variant="panel">
      <Card.SectionHeader>
        <Card.SectionTitle as="h2">Уведомления</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <div className={styles.rows}>
          <Switch.Root defaultChecked>
            <Switch.Label>Письма о заказах</Switch.Label>
            <Switch.Hint>Статус оплаты и доставки.</Switch.Hint>
          </Switch.Root>
          <Switch.Root>
            <Switch.Label>Еженедельный отчёт</Switch.Label>
            <Switch.Hint>По понедельникам в 09:00.</Switch.Hint>
          </Switch.Root>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
```

```css
/* NotificationSettings.module.css */
.rows {
  display: grid;
  gap: var(--prime-space-5);
}
```

When the same row appears on three settings pages, extract `SettingsSwitchRow` into `shared/ui` — a thin
wrapper that renders exactly this Switch structure.

### Filter bar above a table

Use the `toolbar` slot of DataTable: search Input + Select + applied filter Badges (`onRemove`), all `size="s"`.

```tsx
import { Badge, DataTable, type DataTableColumn, Icon, Input, Select } from "prime-ui-kit";
import styles from "./OrdersTable.module.css";

type Order = { id: string; client: string; status: string };

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id" },
  { id: "client", header: "Клиент", accessor: "client", sortable: true },
  { id: "status", header: "Статус", accessor: "status" },
];

export function OrdersTable({ rows }: { rows: Order[] }) {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      toolbar={
        <div className={styles.toolbar}>
          <Input.Root size="s" className={styles.search}>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" />
              </Input.Icon>
              <Input.Field type="search" placeholder="Поиск заказов" aria-label="Поиск заказов" />
            </Input.Wrapper>
          </Input.Root>
          <Select.Root size="s" defaultValue="all">
            <Select.Trigger aria-label="Статус">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Все статусы</Select.Item>
              <Select.Item value="paid">Оплачен</Select.Item>
            </Select.Content>
          </Select.Root>
          <Badge.Root size="s" onRemove={() => {}}>
            Москва
          </Badge.Root>
        </div>
      }
    />
  );
}
```

```css
/* OrdersTable.module.css */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--prime-space-2);
}

.search {
  flex: 1 1 calc(var(--prime-space-16) * 4);
  min-width: 0;
}
```

### Page header with actions

`PageContent.Header` already lays out title, description and actions and wraps on narrow screens. One
primary action; secondary actions neutral; rare actions in a Dropdown.

```tsx
import { Button, Dropdown, PageContent } from "prime-ui-kit";

export function OrdersHeader() {
  return (
    <PageContent.Header>
      <PageContent.Title>Заказы</PageContent.Title>
      <PageContent.Description>Все заказы магазина за выбранный период.</PageContent.Description>
      <PageContent.Actions>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="ghost" tone="neutral">
              Ещё
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Экспорт в CSV</Dropdown.Item>
            <Dropdown.Item>Настроить колонки</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <Button.Root variant="soft" tone="neutral">
          Импорт
        </Button.Root>
        <Button.Root>Создать заказ</Button.Root>
      </PageContent.Actions>
    </PageContent.Header>
  );
}
```
