import { Typography } from "@/components/typography/Typography";

import styles from "./snippets.module.css";

/** Вложенная разметка внутри одного `Typography.Root`: выделения и ссылка с тем же `variant="body-default"`. */
export default function TypographyCompositionSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
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
        <a href="#playground-typography-composition" className={styles.inlineLinkInherit}>
          уточнить адрес
        </a>
        . Подробности — в разделе «История покупок».
      </Typography.Root>
    </div>
  );
}
