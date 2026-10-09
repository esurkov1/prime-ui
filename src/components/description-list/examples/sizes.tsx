/** Every tier changes the label and value type and the gap between pairs — `size`. */
import { DescriptionList, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DescriptionListSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.size}>
          <DescriptionList.Root size={size}>
            <DescriptionList.Item label="Счёт">№ 4821 от 3 октября</DescriptionList.Item>
            <DescriptionList.Item label="Сумма">94 750 ₽</DescriptionList.Item>
          </DescriptionList.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
