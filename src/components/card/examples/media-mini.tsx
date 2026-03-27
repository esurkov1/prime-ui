import { Card, Icon, ProgressBar } from "prime-ui-kit";

import layoutStyles from "./layout.module.css";
import sparkStyles from "./sparkline.module.css";

function MiniSparkline() {
  return (
    <svg
      className={sparkStyles.spark}
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 28 L20 24 L40 26 L60 14 L80 18 L100 10 L120 6"
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Compact KPI rows with chart or progress in `Card.Media`. */
export function MediaMiniExample() {
  return (
    <div className={layoutStyles.grid}>
      <Card.Root variant="mini-media">
        <Card.IconBox aria-hidden>
          <Icon surface="none" name="field.email" aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Glucose</Card.Label>
          <Card.Value>5.4 mmol/L</Card.Value>
        </Card.Stack>
        <Card.Media>
          <MiniSparkline />
        </Card.Media>
      </Card.Root>

      <Card.Root variant="mini-media">
        <Card.IconBox aria-hidden>
          <Icon surface="none" name="nav.layoutGrid" aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>API usage</Card.Label>
          <Card.Value>72%</Card.Value>
        </Card.Stack>
        <Card.Media>
          <ProgressBar.Root value={72} size="s" />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
