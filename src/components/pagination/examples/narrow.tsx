/** A 320 px card footer: by default the numbers give way to «current / total» on a narrow width, `compact` always shows it — `compact`. */
import { Card, Pagination, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PaginationNarrowExample() {
  return (
    <Card.Root className={styles.narrow}>
      <Card.Body>
        <div>
          <Pagination totalPages={12} defaultValue={3} />
          <Typography as="span" variant="caption" tone="muted">
            по умолчанию
          </Typography>
        </div>
        <div>
          <Pagination compact totalPages={12} defaultValue={3} />
          <Typography as="span" variant="caption" tone="muted">
            compact
          </Typography>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
