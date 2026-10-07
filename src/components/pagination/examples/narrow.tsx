/** A 320 px card footer: `compact` always shows «current / total», `compact="auto"` switches by the container width — `compact`. */
import { Pagination, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PaginationNarrowExample() {
  return (
    <div className={styles.narrow}>
      <div>
        <Pagination compact totalPages={12} defaultValue={3} />
        <Typography.Root as="span" variant="caption" tone="muted">
          compact
        </Typography.Root>
      </div>
      <div>
        <Pagination compact="auto" totalPages={12} defaultValue={3} />
        <Typography.Root as="span" variant="caption" tone="muted">
          compact="auto"
        </Typography.Root>
      </div>
    </div>
  );
}
