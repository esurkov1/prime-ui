import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Marketing hero stack: display → body → muted supporting line — Typography.Root only. */
export default function TypographyExampleMarketingHero() {
  return (
    <div className={styles.hero}>
      <Typography.Root as="p" variant="caption" tone="muted" tracking="wide">
        NEW — AUTOMATION SUITE
      </Typography.Root>
      <Typography.Root as="h1" variant="display">
        Ship workflows your team actually uses
      </Typography.Root>
      <Typography.Root as="p" variant="headline" weight="regular">
        Connect tools, approvals, and notifications in one place — without ripping out what already
        works.
      </Typography.Root>
      <Typography.Root as="p" variant="body-large" tone="muted">
        Free trial for 14 days. No card required. SOC 2 Type II and regional data residency
        available on request.
      </Typography.Root>
    </div>
  );
}
