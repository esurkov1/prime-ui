/** Open order cards as browser tabs: each closes by its button, Delete or a middle click; tabs stay between two widths, and the list scrolls when they do not fit — `onRemove`, `minItemWidth`, `maxItemWidth`. */
import { Button, Tabs, Typography } from "prime-ui-kit";
import * as React from "react";

const ORDERS = [
  { id: "10482", client: "Северный ветер", total: "184 200 ₽" },
  { id: "10479", client: "ИП Корнеева", total: "36 900 ₽" },
  { id: "10471", client: "Техноплан", total: "512 040 ₽" },
  { id: "10466", client: "Балтийская логистическая компания", total: "97 300 ₽" },
  { id: "10458", client: "ИП Гусев", total: "12 400 ₽" },
];

export default function TabsClosableExample() {
  const [openOrders, setOpenOrders] = React.useState(ORDERS);

  if (openOrders.length === 0) {
    return (
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpenOrders(ORDERS)}>
        Открыть заказы снова
      </Button.Root>
    );
  }

  return (
    <Tabs.Root defaultValue="10479" minItemWidth={160} maxItemWidth={224}>
      <Tabs.List aria-label="Открытые заказы">
        {openOrders.map((order) => (
          <Tabs.Item
            key={order.id}
            value={order.id}
            onRemove={() =>
              setOpenOrders((orders) => orders.filter((item) => item.id !== order.id))
            }
          >
            {order.client}
          </Tabs.Item>
        ))}
      </Tabs.List>
      {openOrders.map((order) => (
        <Tabs.Panel key={order.id} value={order.id}>
          <Typography variant="body-m" tone="secondary">
            Заказ № {order.id}, {order.client}, сумма {order.total}.
          </Typography>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
