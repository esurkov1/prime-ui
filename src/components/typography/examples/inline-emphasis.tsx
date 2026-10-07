/** Values emphasized inside running text by nested spans with another weight — `as`, `weight`. */
import { LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyInlineEmphasisExample() {
  return (
    <Typography.Root as="p" variant="body-m" className={styles.block}>
      Заказ № 4821 —{" "}
      <Typography.Root as="span" variant="body-m" weight="semibold">
        отправлен
      </Typography.Root>
      , сумма{" "}
      <Typography.Root as="span" variant="body-m" weight="medium">
        12 400 ₽
      </Typography.Root>
      . Доставка: <LinkButton href="#address">уточнить адрес</LinkButton>.
    </Typography.Root>
  );
}
