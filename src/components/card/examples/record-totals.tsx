/** A rental unit of a deal: its term ring leads the header beside the arrow, its state and deposit badges stand under the title, the line items with their amounts sit under a full-width line, and the footer on its own fill holds the action, the next task and the total with its state at the end — `Card.Icon`, `Card.Link`, `divider`, `Card.Description`, `Card.Total`, `Card.Meta`. */
import { Badge, Button, Card, DescriptionList, ProgressCircle, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const UNIT = {
  model: "Honda PCX 160",
  plate: "ภก 5678",
  href: "#rental-5678",
  daysToPickUp: 17,
  deposit: "150 $",
  total: "26 400 ฿",
  due: "к оплате 6 400 ฿",
  task: "Выдать 6 нояб · Банг Тао",
};

const LINES = [
  { key: "rent", label: "Аренда: 6 нояб → 21 нояб · 15 дн.", amount: "26 400 ฿" },
  { key: "delivery", label: "Доставка: Банг Тао", amount: "0 ฿" },
];

export default function CardRecordTotalsExample() {
  return (
    <div className={styles.panel}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <ProgressCircle
              value={0}
              color="yellow"
              track="tinted"
              aria-label={`Бронь: до выдачи ${UNIT.daysToPickUp} д`}
            >
              {`${UNIT.daysToPickUp} д`}
            </ProgressCircle>
          </Card.Icon>
          <Card.Title>
            <Card.Link href={UNIT.href}>
              {UNIT.model}
              <Typography as="span" variant="title-s" tone="secondary">
                {` · ${UNIT.plate}`}
              </Typography>
            </Card.Link>
          </Card.Title>
          <Card.Description>
            <Badge.Root color="yellow">Бронь</Badge.Root>
            <Badge.Root color="green">{`Депозит ${UNIT.deposit}`}</Badge.Root>
          </Card.Description>
        </Card.Header>
        <Card.Body divider="full">
          <DescriptionList.Root align="end">
            {LINES.map((line) => (
              <DescriptionList.Item key={line.key} label={line.label}>
                <Typography as="span" variant="body-m" weight="medium" numeric="tabular">
                  {line.amount}
                </Typography>
              </DescriptionList.Item>
            ))}
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer divider="fill">
          <Button.Root size="s">Выдан</Button.Root>
          <Card.Description>
            <Badge.Dot color="yellow" />
            {UNIT.task}
          </Card.Description>
          <Card.Total>
            <Card.Meta tone="warning">{UNIT.due}</Card.Meta>
            <Card.Value>{UNIT.total}</Card.Value>
          </Card.Total>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
