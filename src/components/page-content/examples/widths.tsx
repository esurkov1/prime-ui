/** `PageContent.Root maxWidth` full · wide · readable: the same page column at three caps. Use `wide` for dashboards on very wide screens, `readable` for text pages, `full` everywhere else. */
import { PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { value: "full", title: "На всю ширину", text: "maxWidth: full — колонка занимает весь main." },
  {
    value: "wide",
    title: "Широкая колонка",
    text: "maxWidth: wide — не шире --prime-layout-content-max-width, по центру.",
  },
  {
    value: "readable",
    title: "Колонка для чтения",
    text: "maxWidth: readable — около 65 знаков в строке, по центру.",
  },
] as const;

export default function PageContentWidthsExample() {
  return (
    <div className={styles.main}>
      <div className={styles.stack}>
        {WIDTHS.map(({ value, title, text }) => (
          <PageContent.Root key={value} maxWidth={value}>
            <PageContent.Header>
              <PageContent.Title>{title}</PageContent.Title>
            </PageContent.Header>
            <PageContent.Body>
              <Typography.Root as="div" variant="body-s" tone="secondary" className={styles.block}>
                {text}
              </Typography.Root>
            </PageContent.Body>
          </PageContent.Root>
        ))}
      </div>
    </div>
  );
}
