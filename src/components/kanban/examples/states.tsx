/** Loading draws skeleton cards in the card geometry and cross-fades the cards in; an empty column keeps its drop area; a read-only board drags nothing — `loading`, `disabled`. */
import { Button, Icon, Kanban, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Order = { id: string; title: string; total: string };

const COLUMNS = [
  { id: "new", title: "Новые" },
  { id: "packing", title: "Сборка" },
  { id: "shipped", title: "Отгружены" },
];

const ORDERS: Order[] = [
  { id: "ORD-5531", title: "ООО «Север» · 12 позиций", total: "48 300 ₽" },
  { id: "ORD-5529", title: "ИП Лебедев · 3 позиции", total: "7 950 ₽" },
  { id: "ORD-5524", title: "АО «Гранит» · 40 позиций", total: "212 000 ₽" },
];

const PLACEMENT = { new: ["ORD-5531", "ORD-5529"], packing: [], shipped: ["ORD-5524"] };

const LOAD_MS = 1200;

export default function KanbanStatesExample() {
  const [loading, setLoading] = React.useState(true);
  const [readOnly, setReadOnly] = React.useState(false);

  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <Switch.Root checked={readOnly} onCheckedChange={setReadOnly}>
          <Switch.Label>Только просмотр</Switch.Label>
        </Switch.Root>
        <div className={styles.spacer} />
        <Button.Root
          variant="soft"
          tone="neutral"
          loading={loading}
          onClick={() => setLoading(true)}
        >
          <Button.Icon>
            <Icon name="action.refresh" />
          </Button.Icon>
          Обновить
        </Button.Root>
      </div>
      <Kanban.Root
        aria-label="Заказы склада"
        className={styles.board}
        columns={COLUMNS}
        items={ORDERS}
        getId={(order) => order.id}
        getLabel={(order) => order.id}
        defaultValue={PLACEMENT}
        loading={loading}
        disabled={readOnly}
        renderItem={(order) => (
          <Kanban.Item>
            <Kanban.ItemTitle>{order.id}</Kanban.ItemTitle>
            <Kanban.ItemDescription>
              {order.title} · {order.total}
            </Kanban.ItemDescription>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
