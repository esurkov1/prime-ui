/** A settings form while its values load: labels are short text lines, fields and the button are controls of the same tier — `shape`. */
import { Skeleton } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS = ["company", "inn", "email"];

export default function SkeletonFormExample() {
  return (
    <div className={styles.form} aria-busy="true">
      {FIELDS.map((field) => (
        <div key={field} className={styles.field}>
          <Skeleton size="s" className={styles.label} />
          <Skeleton shape="control" />
        </div>
      ))}
      <Skeleton shape="control" className={styles.button} />
    </div>
  );
}
