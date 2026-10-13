/** Rows as links to the invoice pages: a plain link, or your router link through the slot — `href`, `asChild`. */
import { Card, List } from "prime-ui-kit";

import styles from "./examples.module.css";

const INVOICES = [
  { id: "4830", client: "ООО «Гранит»", amount: "184 200 ₽", status: "Оплачен" },
  { id: "4829", client: "ООО «Лето»", amount: "56 900 ₽", status: "Ждёт оплаты" },
  { id: "4828", client: "ИП Козлов", amount: "12 400 ₽", status: "Просрочен" },
];

export default function ListAsLinkExample() {
  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Счета">
          {INVOICES.map((invoice, index) => (
            <List.Item key={invoice.id} href={`#invoice-${invoice.id}`} current={index === 0}>
              <List.ItemText>Счёт № {invoice.id}</List.ItemText>
              <List.ItemDescription>
                {invoice.client} · {invoice.status}
              </List.ItemDescription>
              <List.ItemMeta>{invoice.amount}</List.ItemMeta>
            </List.Item>
          ))}
          {/* A router link (`<Link to>`) goes in the same way; the row keeps its `href`. */}
          <List.Item asChild>
            <a href="#invoices-archive">
              <List.ItemText>Архив счетов</List.ItemText>
              <List.ItemDescription>Все счета за 2025 год</List.ItemDescription>
            </a>
          </List.Item>
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
