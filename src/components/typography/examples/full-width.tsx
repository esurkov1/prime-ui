/** The same caption and body text in a narrow and a wide column: text takes the parent width and wraps naturally. Use to check text in multi-column layouts. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyFullWidthExample() {
  return (
    <div className={styles.columns}>
      <div className={styles.narrowColumn}>
        <Typography.Root variant="body-s" tone="secondary">
          Узкая колонка
        </Typography.Root>
        <Typography.Root variant="body-m">
          Длинное предложение в узком контейнере демонстрирует переносы и выравнивание без
          отдельного пропа ширины.
        </Typography.Root>
      </div>
      <div className={styles.wideColumn}>
        <Typography.Root variant="body-s" tone="secondary">
          Широкая колонка
        </Typography.Root>
        <Typography.Root variant="body-m">
          Тот же размер и стиль в более широком блоке: меньше переносов, читаемость остаётся за счёт
          связки кегля и межстрочного интервала из токенов роли body-m.
        </Typography.Root>
      </div>
    </div>
  );
}
