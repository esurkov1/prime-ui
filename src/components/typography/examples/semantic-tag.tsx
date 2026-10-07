/** The tag follows the page outline and the role sets the look, so a section title can be an `h2` at title size — `as`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographySemanticTagExample() {
  return (
    <section className={styles.block} aria-labelledby="billing-title">
      <Typography as="h2" id="billing-title" variant="title-s">
        Реквизиты для оплаты
      </Typography>
      <Typography as="p" variant="body-m" tone="secondary">
        ООО «Прайм», ИНН 7701234567, расчётный счёт в АО «Банк Север».
      </Typography>
    </section>
  );
}
