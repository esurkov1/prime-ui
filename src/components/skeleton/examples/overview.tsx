/** A project card while it loads: the cover, the author and two lines of text take the room of the real content — `shape`, `lines`. */
import { Card, Skeleton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SkeletonOverviewExample() {
  return (
    <Card.Root variant="panel" className={styles.card} aria-busy="true">
      <Card.Body>
        <div className={styles.content}>
          <Skeleton shape="block" className={styles.cover} />
          <div className={styles.author}>
            <Skeleton shape="circle" />
            <Skeleton />
          </div>
          <Skeleton lines={2} />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
