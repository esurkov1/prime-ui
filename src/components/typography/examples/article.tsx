/** A help article from landmarks, headings and a quote at the reading width — `as`, `variant`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyArticleExample() {
  return (
    <article className={styles.article}>
      <header>
        <Typography as="h1" variant="heading-m">
          Как выставить счёт
        </Typography>
        <Typography as="p" variant="body-m" tone="secondary">
          Счёт создаётся из заказа или вручную в разделе «Финансы».
        </Typography>
      </header>
      <section aria-labelledby="article-steps">
        <Typography id="article-steps" as="h2" variant="heading-s">
          Из заказа
        </Typography>
        <Typography as="p" variant="body-m">
          Откройте заказ, нажмите «Выставить счёт» и проверьте реквизиты покупателя. Счёт уйдёт на
          почту из карточки клиента.
        </Typography>
      </section>
      <blockquote>
        <Typography as="p" variant="body-l">
          Счёт без реквизитов покупателя бухгалтерия не примет.
        </Typography>
        <Typography as="footer" variant="caption" tone="secondary">
          — Регламент финансового отдела
        </Typography>
      </blockquote>
    </article>
  );
}
