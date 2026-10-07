/** Order list with a status column: a soft badge with text, the color only repeats the meaning. Use for status columns in lists and tables. */
import { Badge, type PaletteColor, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const orders: { id: string; client: string; total: string; status: string; color: PaletteColor }[] =
  [
    {
      id: "№ 10482",
      client: "ООО «Северный ветер»",
      total: "48 200 ₽",
      status: "Оплачен",
      color: "green",
    },
    {
      id: "№ 10481",
      client: "ИП Кузнецова",
      total: "12 900 ₽",
      status: "Ожидает оплаты",
      color: "orange",
    },
    {
      id: "№ 10480",
      client: "АО «Техносфера»",
      total: "230 000 ₽",
      status: "В доставке",
      color: "blue",
    },
    { id: "№ 10479", client: "ООО «Лето»", total: "7 400 ₽", status: "Отменён", color: "gray" },
  ];

export default function BadgeOrderListExample() {
  return (
    <ul className={styles.list} aria-label="Последние заказы">
      {orders.map((order) => (
        <li key={order.id} className={styles.item}>
          <Typography.Root as="span" variant="body-m" truncate>
            {order.id} · {order.client}
          </Typography.Root>
          <Typography.Root as="span" variant="body-s" tone="muted" className={styles.tabular}>
            {order.total}
          </Typography.Root>
          <Badge.Root color={order.color}>{order.status}</Badge.Root>
        </li>
      ))}
    </ul>
  );
}
