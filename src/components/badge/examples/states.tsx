/** Badge is static: the default look and `disabled` for every variant and with a dot. Use `disabled` for labels of inactive or unavailable items. */
import { Badge, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeStatesExample() {
  return (
    <div className={styles.matrix}>
      <Typography.Root as="span" variant="caption" tone="muted">
        обычный
      </Typography.Root>
      <div className={styles.badges}>
        <Badge.Root color="green">Оплачен</Badge.Root>
        <Badge.Root variant="solid" color="green">
          Оплачен
        </Badge.Root>
        <Badge.Root variant="outline" color="green">
          Оплачен
        </Badge.Root>
        <Badge.Root color="green">
          <Badge.Dot />
          Активен
        </Badge.Root>
      </div>
      <Typography.Root as="span" variant="caption" tone="muted">
        disabled
      </Typography.Root>
      <div className={styles.badges}>
        <Badge.Root color="green" disabled>
          Оплачен
        </Badge.Root>
        <Badge.Root variant="solid" color="green" disabled>
          Оплачен
        </Badge.Root>
        <Badge.Root variant="outline" color="green" disabled>
          Оплачен
        </Badge.Root>
        <Badge.Root color="green" disabled>
          <Badge.Dot />
          Активен
        </Badge.Root>
      </div>
    </div>
  );
}
