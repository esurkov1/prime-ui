/** Every size tier; text and chevrons follow the control tier — `size`. */
import { Breadcrumb, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function BreadcrumbSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.wide}>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
          <Breadcrumb.Root size={size}>
            <Breadcrumb.Item href="#orders">Заказы</Breadcrumb.Item>
            <Breadcrumb.Item current>№ 48 213</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
      ))}
    </>
  );
}
