/** The same page column at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. */
import { Card, PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { value: "full", text: "Сделки: колонка занимает всю ширину main." },
  { value: "wide", text: "Дашборд продаж: не шире ширины контента, по центру." },
  { value: "readable", text: "Условия использования: не шире колонки для чтения, по центру." },
] as const;

export default function PageContentVariantsExample() {
  return (
    <div className={styles.main}>
      <div className={styles.stack}>
        {WIDTHS.map(({ value, text }) => (
          <PageContent.Root key={value} maxWidth={value}>
            <PageContent.Body>
              <Card.Root>
                <Card.Body>
                  <Typography variant="body-s" tone="secondary">
                    {value} — {text}
                  </Typography>
                </Card.Body>
              </Card.Root>
            </PageContent.Body>
          </PageContent.Root>
        ))}
      </div>
    </div>
  );
}
