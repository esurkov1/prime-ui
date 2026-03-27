import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Вложенные `Typography.Root` и ссылка внутри блока.
 * Зеркало `playground/snippets/typography/composition.tsx`.
 */
export default function TypographyExampleComposition() {
  return (
    <div className={styles.typographyScaleList}>
      <Typography.Root variant="body-default" as="div">
        Сводка по заказу № 4821: статус{" "}
        <Typography.Root as="span" variant="body-default" weight="semibold">
          отправлен
        </Typography.Root>
        . Сумма{" "}
        <Typography.Root as="span" variant="body-default" weight="medium" tracking="tight">
          12 400 ₽
        </Typography.Root>
        , доставка до{" "}
        <a href="#typography-example-composition" className={styles.inlineLinkInherit}>
          уточнить адрес
        </a>
        . Подробности — в разделе «История покупок».
      </Typography.Root>
    </div>
  );
}
