/** A block heading, its text and a meta line, each set by a text role and a semantic tag — `variant`, `as`, `tone`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyOverviewExample() {
  return (
    <div className={styles.block}>
      <Typography.Root as="h3" variant="title-m">
        Счёт № 4821 оплачен
      </Typography.Root>
      <Typography.Root as="p" variant="body-m" tone="secondary">
        Деньги поступили на расчётный счёт. Закрывающие документы придут на почту бухгалтерии.
      </Typography.Root>
      <Typography.Root as="span" variant="caption" tone="muted">
        12 марта, 14:20
      </Typography.Root>
    </div>
  );
}
