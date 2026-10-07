/** Divider label at every size tier xs → xl. Match `size` to the tier of the surrounding content. */
import { Divider } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function DividerSizesExample() {
  return (
    <div className={styles.column}>
      {sizes.map((size) => (
        <Divider.Root align="start" key={size} size={size}>
          Раздел · {size}
        </Divider.Root>
      ))}
    </div>
  );
}
