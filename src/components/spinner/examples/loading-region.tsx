/** A card that loads its content: the region says it is busy and the spinner stays hidden from screen readers — `aria-hidden`. */
import { Card, Spinner, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SpinnerLoadingRegionExample() {
  return (
    <Card.Root
      role="region"
      aria-busy="true"
      aria-label="Выручка за неделю"
      className={styles.region}
    >
      <Card.Body className={styles.loading}>
        <Spinner size="l" tone="muted" aria-hidden="true" />
        <Typography.Root as="p" variant="body-s" tone="secondary">
          Считаем выручку за неделю
        </Typography.Root>
      </Card.Body>
    </Card.Root>
  );
}
