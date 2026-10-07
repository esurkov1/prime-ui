/** A KPI with a sparkline or a fill level in the bottom slot — `Card.Media`. */
import { Card, Icon, ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

const SPARKLINE = "M0 32 L15 28 L30 30 L45 18 L60 22 L75 12 L90 16 L105 8 L120 4";

export default function CardMiniMediaExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini-media">
        <Card.IconBox>
          <Icon name="object.activity" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Запросы в минуту</Card.Label>
          <Card.Value>12 840</Card.Value>
        </Card.Stack>
        <Card.Media>
          {/* The SVG stretches to the card width; CSS sets its height, not the viewBox. */}
          <svg
            className={styles.spark}
            viewBox="0 0 120 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={SPARKLINE} className={styles.chartLine} />
          </svg>
        </Card.Media>
      </Card.Root>

      <Card.Root variant="mini-media">
        <Card.IconBox>
          <Icon name="object.storage" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Хранилище</Card.Label>
          <Card.Value>72 из 100 ГБ</Card.Value>
        </Card.Stack>
        <Card.Media>
          <ProgressBar value={72} size="s" label="Занято" showValue />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
