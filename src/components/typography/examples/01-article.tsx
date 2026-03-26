import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Long-form article: landmarks, heading levels, pull quote — all copy via Typography.Root.
 */
export default function TypographyExampleArticle() {
  return (
    <article className={styles.stack}>
      <header className={styles.stackTight}>
        <Typography.Root as="h1" variant="heading-page">
          Designing readable product surfaces
        </Typography.Root>
        <Typography.Root as="p" variant="body-default" tone="muted">
          Semantic reading roles map to theme tokens; avoid ad-hoc font sizes for page text.
        </Typography.Root>
      </header>
      <section aria-labelledby="article-section-roles">
        <Typography.Root id="article-section-roles" as="h2" variant="heading-section">
          Roles vs control sizes
        </Typography.Root>
        <Typography.Root as="p" variant="body-default">
          Page typography uses <code>variant</code>; buttons and fields use their own{" "}
          <code>size</code> axis — keep both visible on the same screen without fighting the same
          scale.
        </Typography.Root>
      </section>
      <section aria-labelledby="article-section-quote">
        <Typography.Root id="article-section-quote" as="h2" variant="heading-section">
          Pull quote
        </Typography.Root>
        <blockquote className={styles.stackTight}>
          <Typography.Root as="p" variant="body-large">
            When labels read as body and hints read as captions, users scan forms faster and make
            fewer mistakes.
          </Typography.Root>
          <Typography.Root as="footer" variant="caption" tone="muted">
            — Internal UX writing guide
          </Typography.Root>
        </blockquote>
      </section>
    </article>
  );
}
