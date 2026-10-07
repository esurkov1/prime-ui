/** The same page column at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. */
import { PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { value: "full", title: "Сделки", text: "Колонка занимает всю ширину main." },
  { value: "wide", title: "Дашборд продаж", text: "Не шире ширины контента, по центру." },
  {
    value: "readable",
    title: "Условия использования",
    text: "Около 65 знаков в строке, по центру.",
  },
] as const;

export default function PageContentVariantsExample() {
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
                {value} — {text}
              </Typography.Root>
            </PageContent.Body>
          </PageContent.Root>
        ))}
      </div>
    </div>
  );
}
