/** All five size tiers; text and chevron follow the control tier. Use to match the trail to the page header or the panel it sits in. */
import { Breadcrumb, type ControlSize, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function BreadcrumbSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeRow}>
          <Typography.Root as="span" variant="code" tone="muted" className={styles.caption}>
            {size}
          </Typography.Root>
          <Breadcrumb.Root size={size} className={styles.trail}>
            <Breadcrumb.Item href="#">Главная</Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item href="#">Заказы</Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item current>№ 48 213</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
      ))}
    </div>
  );
}
