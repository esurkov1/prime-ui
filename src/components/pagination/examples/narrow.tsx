/** A 320 px card footer: `compact` always shows «current / total», `compact="auto"` switches by the container width — `compact`. */
import { Card, Pagination, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PaginationNarrowExample() {
  return (
    <Card.Root className={styles.narrow}>
      <Card.Body>
        <div>
          <Pagination compact totalPages={12} defaultValue={3} />
          <Typography as="span" variant="caption" tone="muted">
            compact
          </Typography>
        </div>
        <div>
          <Pagination compact="auto" totalPages={12} defaultValue={3} />
          <Typography as="span" variant="caption" tone="muted">
            compact="auto"
          </Typography>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
