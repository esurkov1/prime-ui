import { Typography } from "@/components/typography/Typography";

/** Статья: landmarks + заголовки + цитата — только семантическая разметка и `Typography` с `variant`. */
export default function TypographyArticleLandmarksSnippet() {
  return (
    <article className="typographyArticleDemo">
      <header>
        <Typography.Root as="h1" variant="heading-page">
          Краткий гид по осям
        </Typography.Root>
        <Typography.Root as="p" variant="body-default" tone="muted">
          Иерархия текста страницы задаётся только <code>variant</code> и тегами.
        </Typography.Root>
      </header>
      <section aria-labelledby="section-roles">
        <Typography.Root id="section-roles" as="h2" variant="heading-section">
          Семантические роли
        </Typography.Root>
        <Typography.Root as="p" variant="body-default">
          Роль задаёт пару «кегль + межстрочный интервал» из темы; не смешивайте с произвольными{" "}
          <code>rem</code> для основного текста.
        </Typography.Root>
      </section>
      <section aria-labelledby="section-quote">
        <Typography.Root id="section-quote" as="h2" variant="heading-section">
          Цитата
        </Typography.Root>
        <blockquote>
          <Typography.Root as="p" variant="body-large">
            Две оси — меньше коллизий: заголовок страницы и подпись к полю больше не спорят об одном
            «размере».
          </Typography.Root>
          <Typography.Root as="footer" variant="caption" tone="muted">
            — Руководство по дизайн-системе
          </Typography.Root>
        </blockquote>
      </section>
    </article>
  );
}
