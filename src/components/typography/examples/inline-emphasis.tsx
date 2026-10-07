/** Values emphasized inside running text by nested spans with another weight — `as`, `weight`. */
import { LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyInlineEmphasisExample() {
  return (
    <Typography as="p" variant="body-m" className={styles.block}>
      Заказ № 4821 —{" "}
      <Typography as="span" variant="body-m" weight="semibold">
        отправлен
      </Typography>
      , сумма{" "}
      <Typography as="span" variant="body-m" weight="medium">
        12 400 ₽
      </Typography>
      . Доставка: <LinkButton href="#address">уточнить адрес</LinkButton>.
    </Typography>
  );
}
