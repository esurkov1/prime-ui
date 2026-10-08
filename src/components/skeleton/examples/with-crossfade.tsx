/** A list that reloads: placeholder rows of the same geometry cross-fade into the data, nothing jumps — `Crossfade`, `state`. */
import { Button, Card, Crossfade, Icon, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PAYMENTS = [
  { id: "p1", payer: "ООО «Гранит»", amount: "94 750 ₽" },
  { id: "p2", payer: "ИП Орлов Д. С.", amount: "18 000 ₽" },
  { id: "p3", payer: "АО «Альфа Медиа»", amount: "380 000 ₽" },
];

const LOAD_MS = 1500;

export default function SkeletonWithCrossfadeExample() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(id);
  }, [loading]);

  return (
    <div className={styles.stack}>
      <Button.Root
        variant="soft"
        tone="neutral"
        disabled={loading}
        onClick={() => setLoading(true)}
      >
        <Button.Icon>
          <Icon name="action.refresh" />
        </Button.Icon>
        Обновить
      </Button.Root>

      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title as="h3">Поступления за сегодня</Card.Title>
        </Card.Header>
        <Card.Body>
          <Crossfade state={loading ? "loading" : "ready"} aria-busy={loading}>
            <ul className={styles.list}>
              {PAYMENTS.map((payment) =>
                loading ? (
                  <li key={payment.id} className={styles.row}>
                    <Skeleton className={styles.payer} />
                    <Skeleton className={styles.amount} />
                  </li>
                ) : (
                  <li key={payment.id} className={styles.row}>
                    <Typography as="span" variant="body-m">
                      {payment.payer}
                    </Typography>
                    <Typography as="span" variant="body-m" className={styles.sum}>
                      {payment.amount}
                    </Typography>
                  </li>
                ),
              )}
            </ul>
          </Crossfade>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
