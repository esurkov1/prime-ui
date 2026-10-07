/** Nested `Typography.Root` spans with other `weight` / `tracking` and a LinkButton inside one paragraph. Use to emphasize values inside running text. */
import { LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyCompositionExample() {
  return (
    <div className={styles.scaleList}>
      <Typography.Root variant="body-m" as="div">
        Сводка по заказу № 4821: статус{" "}
        <Typography.Root as="span" variant="body-m" weight="semibold">
          отправлен
        </Typography.Root>
        . Сумма{" "}
        <Typography.Root as="span" variant="body-m" weight="medium" tracking="tight">
          12 400 ₽
        </Typography.Root>
        , доставка до <LinkButton href="#address">уточнить адрес</LinkButton>. Подробности — в
        разделе «История покупок».
      </Typography.Root>
    </div>
  );
}
