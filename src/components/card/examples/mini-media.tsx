/** `mini-media`: the `mini` row plus a bottom `Card.Media` slot with a sparkline or a ProgressBar. Use when a KPI needs a small trend or a fill level. */

import { Activity, HardDrive } from "lucide-react";
import { Card, ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

/** The SVG stretches to the card width; CSS sets its height, not the viewBox. */
function Sparkline() {
  return (
    <svg
      className={styles.spark}
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 32 L15 28 L30 30 L45 18 L60 22 L75 12 L90 16 L105 8 L120 4"
        className={styles.chartLine}
      />
    </svg>
  );
}

export default function CardMiniMediaExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini-media">
        <Card.IconBox>
          <Activity aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Запросы в минуту</Card.Label>
          <Card.Value>12 840</Card.Value>
        </Card.Stack>
        <Card.Media>
          <Sparkline />
        </Card.Media>
      </Card.Root>

      <Card.Root variant="mini-media">
        <Card.IconBox>
          <HardDrive aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Хранилище</Card.Label>
          <Card.Value>72 из 100 ГБ</Card.Value>
        </Card.Stack>
        <Card.Media>
          <ProgressBar.Root value={72} size="s" label="Занято" showValue />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
