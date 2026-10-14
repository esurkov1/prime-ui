/** Orders searched on the server: the parent loads results for the query and the next page at the end of the list; one persistent item at the end creates an order from the query, found or not — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`, `persistent`. */
import { Button, CommandMenu, Icon } from "prime-ui-kit";
import * as React from "react";

type Order = { id: string; client: string; total: string };

const CLIENTS = ["Вектор", "Гранит", "Ладога", "Меридиан", "Кедр", "Звезда", "Енисей-Агро"];
const PAGE_SIZE = 12;
const LATENCY_MS = 500;

const ORDERS: Order[] = Array.from({ length: 84 }, (_, i) => ({
  id: `ЗК-${String(10240 + i * 13)}`,
  client: `ООО «${CLIENTS[i % CLIENTS.length]}»`,
  total: `${(12 + ((i * 37) % 180)) * 1000} ₽`,
}));

/** What the server answers: orders whose number or client contain the query. */
function findOrders(query: string): Order[] {
  const text = query.trim().toLocaleLowerCase();
  return ORDERS.filter((order) => `${order.id} ${order.client}`.toLocaleLowerCase().includes(text));
}

export default function CommandMenuServerSearchExample() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const close = () => setOpen(false);

  // A new query asks the server after a pause; the results on screen stay until the answer.
  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    const timer = window.setTimeout(() => {
      const found = findOrders(search);
      setOrders(found.slice(0, PAGE_SIZE));
      setTotal(found.length);
      setLoading(false);
    }, LATENCY_MS);
    return () => window.clearTimeout(timer);
  }, [open, search]);

  const loadMore = () => {
    setLoadingMore(true);
    window.setTimeout(() => {
      setOrders((shown) => findOrders(search).slice(0, shown.length + PAGE_SIZE));
      setLoadingMore(false);
    }, LATENCY_MS);
  };

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Найти заказ
      </Button.Root>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        search={search}
        onSearchChange={setSearch}
        filter={false}
        loading={loading}
        hasMore={orders.length < total}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        aria-label="Поиск заказов"
      >
        <CommandMenu.Input placeholder="Номер заказа или клиент" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          {orders.map((order) => (
            <CommandMenu.Item key={order.id} value={order.id} onSelect={close}>
              <CommandMenu.ItemText description={`${order.client} · ${order.total}`}>
                {order.id}
              </CommandMenu.ItemText>
            </CommandMenu.Item>
          ))}
          {/* One create item at the end: it stays when an order of the same name is found. */}
          {search.trim() ? (
            <CommandMenu.Item persistent value={`создать заказ ${search}`} onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="action.add" />
              </CommandMenu.ItemIcon>
              Создать заказ для «{search.trim()}»
            </CommandMenu.Item>
          ) : null}
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
