/** Rows as links to the invoice pages: a plain link, or your router link through the slot; the amount stands at the end — `href`, `asChild`, `List.ItemMeta`. */
import { Card, List, StatusDot } from "prime-ui-kit";

import styles from "./examples.module.css";

const INVOICES = [
  {
    id: "4830",
    client: "ООО «Гранит»",
    amount: "184 200 ₽",
    status: { tone: "success", label: "Оплачен" },
  },
  {
    id: "4829",
    client: "ООО «Лето»",
    amount: "56 900 ₽",
    status: { tone: "warning", label: "Ждёт оплаты" },
  },
  {
    id: "4828",
    client: "ИП Козлов",
    amount: "12 400 ₽",
    status: { tone: "danger", label: "Просрочен" },
  },
] as const;

export default function ListAsLinkExample() {
  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Счета">
          {INVOICES.map((invoice, index) => (
            <List.Item key={invoice.id} href={`#invoice-${invoice.id}`} current={index === 0}>
              <List.ItemText number={`№ ${invoice.id}`}>Счёт</List.ItemText>
              <List.ItemDescription>
                <StatusDot tone={invoice.status.tone}>{invoice.status.label}</StatusDot>
                {invoice.client}
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
