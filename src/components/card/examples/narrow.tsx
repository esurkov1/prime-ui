/** The card is a size container: the split template stacks its cells below 22rem and the trend value shrinks below 20rem. */
import { Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { id: "narrow", className: styles.w18 },
  { id: "wide", className: styles.w40 },
];

export default function CardNarrowExample() {
  return (
    <div className={styles.stack}>
      {WIDTHS.map((width) => (
        <div key={width.id} className={styles.stack}>
          <div className={width.className}>
            <Card.Root variant="split">
              <Card.Split>
                <div>
                  <Card.IconBox>
                    <Icon name="object.cart" />
                  </Card.IconBox>
                  <Card.Stack>
                    <Card.Label>Конверсия</Card.Label>
                    <Card.Value>3,8%</Card.Value>
                  </Card.Stack>
                </div>
                <div>
                  <Card.IconBox>
                    <Icon name="object.wallet" />
                  </Card.IconBox>
                  <Card.Stack>
                    <Card.Label>Средний чек</Card.Label>
                    <Card.Value>₽ 2 450</Card.Value>
                  </Card.Stack>
                </div>
              </Card.Split>
            </Card.Root>
          </div>
          <div className={width.className}>
            <Card.Root variant="stat-trend">
              <Card.Label>Выручка</Card.Label>
              <Card.Value>₽ 4,2 млн</Card.Value>
              <Card.Delta tone="success">+18% к прошлому месяцу</Card.Delta>
            </Card.Root>
          </div>
        </div>
      ))}
    </div>
  );
}
