/** The same page at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. */
import { Card, Page, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { value: "full", text: "Сделки: колонка занимает всю ширину main." },
  { value: "wide", text: "Дашборд продаж: не шире ширины контента, по центру." },
  { value: "readable", text: "Условия использования: не шире колонки для чтения, по центру." },
] as const;

export default function PageVariantsExample() {
  return (
    <>
      {WIDTHS.map(({ value, text }) => (
        <div key={value} className={styles.main}>
          <Page.Root maxWidth={value}>
            <Page.Body>
              <Card.Root>
                <Card.Body>
                  <Typography variant="body-s" tone="secondary">
                    {value} — {text}
                  </Typography>
                </Card.Body>
              </Card.Root>
            </Page.Body>
          </Page.Root>
        </div>
      ))}
    </>
  );
}
