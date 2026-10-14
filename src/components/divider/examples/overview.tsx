/** Hairlines between the rows of a settings card — `Divider`. */
import { Card, Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ROWS = [
  { label: "Пароль", value: "Изменён 12 дней назад" },
  { label: "Двухфакторный вход", value: "Включён" },
  { label: "Активные сессии", value: "3 устройства" },
];

export default function DividerOverviewExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        {ROWS.map((row, index) => (
          <div key={row.label} className={styles.entry}>
            {index > 0 ? <Divider /> : null}
            <div className={styles.listRow}>
              <Typography as="span" variant="body-m">
                {row.label}
              </Typography>
              <Typography as="span" variant="body-m" tone="secondary">
                {row.value}
              </Typography>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card.Root>
  );
}
