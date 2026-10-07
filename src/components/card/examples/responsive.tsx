/** The card is a size container: `split` stacks its cells below 22rem, the `stat-trend` value shrinks below 20rem and grows to display-s above 36rem. Use `split` for two related metrics in one card. */

import { ShoppingCart, Wallet } from "lucide-react";
import { Card, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function SplitCard() {
  return (
    <Card.Root variant="split">
      <Card.Split>
        <Card.SplitCell>
          <Card.IconBox>
            <ShoppingCart aria-hidden />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Конверсия</Card.Label>
            <Card.Value>3,8%</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
        <Card.SplitCell>
          <Card.IconBox>
            <Wallet aria-hidden />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Средний чек</Card.Label>
            <Card.Value>₽ 2 450</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
      </Card.Split>
    </Card.Root>
  );
}

function TrendCard() {
  return (
    <Card.Root variant="stat-trend">
      <Card.Label>Выручка</Card.Label>
      <Card.Value>₽ 4,2 млн</Card.Value>
      <Card.Delta tone="success">+18% к прошлому месяцу</Card.Delta>
    </Card.Root>
  );
}

export default function CardResponsiveExample() {
  return (
    <div className={styles.stack}>
      <Typography.Root variant="caption" tone="muted">
        Ширина 18rem
      </Typography.Root>
      <div className={styles.gridWide}>
        <div className={styles.w18}>
          <SplitCard />
        </div>
        <div className={styles.w18}>
          <TrendCard />
        </div>
      </div>
      <Typography.Root variant="caption" tone="muted">
        Ширина 40rem
      </Typography.Root>
      <div className={styles.stack}>
        <div className={styles.w40}>
          <SplitCard />
        </div>
        <div className={styles.w40}>
          <TrendCard />
        </div>
      </div>
    </div>
  );
}
