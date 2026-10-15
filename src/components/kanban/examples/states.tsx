/** Loading draws skeleton cards in the card geometry, and placeholder columns before the columns arrive; an empty column keeps its drop area and a closed order stays in place while the rest move; a read-only board drags nothing — `loading`, `loadingColumns`, `disabled`. */
import { Badge, Kanban, Typography } from "prime-ui-kit";

type Order = { id: string; title: string; total: string; closed?: boolean };

const COLUMNS = [
  { id: "new", title: "Новые" },
  { id: "packing", title: "Сборка" },
  { id: "shipped", title: "Отгружены" },
];

/** A closed order has signed documents: its card stays where it is. */
const ORDERS: Order[] = [
  { id: "ORD-5531", title: "ООО «Север» · 12 позиций", total: "48 300 ₽" },
  { id: "ORD-5529", title: "ИП Лебедев · 3 позиции", total: "7 950 ₽" },
  { id: "ORD-5524", title: "АО «Гранит» · 40 позиций", total: "212 000 ₽", closed: true },
  { id: "ORD-5518", title: "ООО «Вектор» · 6 позиций", total: "31 400 ₽" },
];

const PLACEMENT = {
  new: ["ORD-5531", "ORD-5529"],
  packing: [],
  shipped: ["ORD-5524", "ORD-5518"],
};

const STATES = [
  { caption: "loading · columns=[]", columns: [], loading: true, disabled: false },
  { caption: "loading", columns: COLUMNS, loading: true, disabled: false },
  { caption: "Kanban.Item disabled", columns: COLUMNS, loading: false, disabled: false },
  { caption: "disabled", columns: COLUMNS, loading: false, disabled: true },
];

export default function KanbanStatesExample() {
  return STATES.map((state) => (
    <div key={state.caption}>
      <div>
        <Kanban.Root
          aria-label={`Заказы склада: ${state.caption}`}
          columns={state.columns}
          loadingColumns={COLUMNS.length}
          items={ORDERS}
          getId={(order) => order.id}
          getLabel={(order) => order.id}
          defaultValue={PLACEMENT}
          loading={state.loading}
          disabled={state.disabled}
          renderItem={(order) => (
            <Kanban.Item disabled={order.closed}>
              <Kanban.ItemTitle>{order.id}</Kanban.ItemTitle>
              <Kanban.ItemDescription>
                {order.title} · {order.total}
              </Kanban.ItemDescription>
              {order.closed ? (
                <Kanban.ItemBadges>
                  <Badge.Root color="gray">Закрыт</Badge.Root>
                </Kanban.ItemBadges>
              ) : null}
            </Kanban.Item>
          )}
        />
        <Typography as="span" variant="caption" tone="muted">
          {state.caption}
        </Typography>
      </div>
    </div>
  ));
}
