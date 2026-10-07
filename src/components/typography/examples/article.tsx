/** An article built from landmarks (`article`, `section`, `header`), `h1`–`h2` headings and a `blockquote`, all styled by `variant`. Use for long-form reading content. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyArticleExample() {
  return (
    <article className={styles.article}>
      <header>
        <Typography.Root as="h1" variant="heading-m">
          Краткий гид по осям
        </Typography.Root>
        <Typography.Root as="p" variant="body-m" tone="secondary">
          Иерархия текста страницы задаётся только{" "}
          <Typography.Root as="span" variant="code" tone="secondary">
            variant
          </Typography.Root>{" "}
          и тегами.
        </Typography.Root>
      </header>
      <section aria-labelledby="section-roles">
        <Typography.Root id="section-roles" as="h2" variant="heading-s">
          Семантические роли
        </Typography.Root>
        <Typography.Root as="p" variant="body-m">
          Роль задаёт пару «кегль + межстрочный интервал» из темы; не смешивайте с произвольными{" "}
          <Typography.Root as="span" variant="code">
            rem
          </Typography.Root>{" "}
          для основного текста.
        </Typography.Root>
      </section>
      <section aria-labelledby="section-quote">
        <Typography.Root id="section-quote" as="h2" variant="heading-s">
          Цитата
        </Typography.Root>
        <blockquote>
          <Typography.Root as="p" variant="body-l">
            Две оси — меньше коллизий: заголовок страницы и подпись к полю больше не спорят об одном
            «размере».
          </Typography.Root>
          <Typography.Root as="footer" variant="caption" tone="secondary">
            — Руководство по дизайн-системе
          </Typography.Root>
        </blockquote>
      </section>
    </article>
  );
}
