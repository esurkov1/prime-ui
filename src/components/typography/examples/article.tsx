/** A help article from landmarks, headings and a quote at the reading width — `as`, `variant`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyArticleExample() {
  return (
    <article className={styles.article}>
      <header>
        <Typography.Root as="h1" variant="heading-m">
          Как выставить счёт
        </Typography.Root>
        <Typography.Root as="p" variant="body-m" tone="secondary">
          Счёт создаётся из заказа или вручную в разделе «Финансы».
        </Typography.Root>
      </header>
      <section aria-labelledby="article-steps">
        <Typography.Root id="article-steps" as="h2" variant="heading-s">
          Из заказа
        </Typography.Root>
        <Typography.Root as="p" variant="body-m">
          Откройте заказ, нажмите «Выставить счёт» и проверьте реквизиты покупателя. Счёт уйдёт на
          почту из карточки клиента.
        </Typography.Root>
      </section>
      <blockquote>
        <Typography.Root as="p" variant="body-l">
          Счёт без реквизитов покупателя бухгалтерия не примет.
        </Typography.Root>
        <Typography.Root as="footer" variant="caption" tone="secondary">
          — Регламент финансового отдела
        </Typography.Root>
      </blockquote>
    </article>
  );
}
