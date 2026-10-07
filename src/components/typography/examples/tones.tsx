/** Every `tone` on the same `body-m` line: default, secondary, muted and the semantic accent / success / warning / danger text colors. Use to pick a text color by meaning. */
import { Divider, type TextTone, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const TONES: { tone: TextTone; use: string }[] = [
  { tone: "default", use: "основной текст" },
  { tone: "secondary", use: "пояснения, вторичный текст" },
  { tone: "muted", use: "мета, подписи" },
  { tone: "accent", use: "выделенное значение" },
  { tone: "success", use: "успешный результат" },
  { tone: "warning", use: "предупреждение" },
  { tone: "danger", use: "ошибка, опасное действие" },
];

export default function TypographyTonesExample() {
  return (
    <div className={styles.scaleList}>
      {TONES.map(({ tone, use }) => (
        <div key={tone} className={styles.scaleRow}>
          <Typography.Root variant="body-m" tone={tone}>
            Оплата по счёту № 4821 получена 12 марта.
          </Typography.Root>
          <Divider.Root align="start">
            <Typography.Root as="span" variant="code" tone="muted">
              tone="{tone}"
            </Typography.Root>{" "}
            — {use}
          </Divider.Root>
        </div>
      ))}
    </div>
  );
}
