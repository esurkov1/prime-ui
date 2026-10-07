/** Hairlines between the rows of a settings list. */
import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ROWS = [
  { label: "Пароль", value: "Изменён 12 дней назад" },
  { label: "Двухфакторный вход", value: "Включён" },
  { label: "Активные сессии", value: "3 устройства" },
];

export default function DividerOverviewExample() {
  return (
    <div className={styles.list}>
      {ROWS.map((row, index) => (
        <div key={row.label}>
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
    </div>
  );
}
