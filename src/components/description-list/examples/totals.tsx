/** The totals of an invoice: every amount at the end of its row in tabular figures, a payment in the success tone, the amount due a step larger in the warning tone — `align`, `tone`. */
import { Card, DescriptionList, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const TOTALS = [
  { label: "Без НДС", value: "400 000 ₽" },
  { label: "Скидка 5%", value: "−20 000 ₽" },
  { label: "НДС 20%", value: "76 000 ₽" },
];
const PAID = "−200 000 ₽";

export default function DescriptionListTotalsExample() {
  return (
    <Card.Root variant="panel" className={styles.column}>
      <Card.Header>
        <Card.Title>Итого по счёту № 2026-0418</Card.Title>
      </Card.Header>
      <Card.Body>
        <DescriptionList.Root align="end">
          {TOTALS.map((row) => (
            <DescriptionList.Item key={row.label} label={row.label}>
              {row.value}
            </DescriptionList.Item>
          ))}
          <DescriptionList.Item label="Оплачено" tone="success">
            {PAID}
          </DescriptionList.Item>
          <DescriptionList.Item
            tone="warning"
            label={
              <Typography as="span" variant="title-m">
                К оплате
              </Typography>
            }
          >
            <Typography as="span" variant="title-m" numeric="tabular">
              256 000 ₽
            </Typography>
          </DescriptionList.Item>
        </DescriptionList.Root>
      </Card.Body>
    </Card.Root>
  );
}
