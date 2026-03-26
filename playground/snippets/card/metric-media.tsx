import { Card } from "@/components/card/Card";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";

import mediaStyles from "./metric-media.module.css";
import stackStyles from "./variants-stack.module.css";

function MiniSparkline() {
  return (
    <svg
      className={mediaStyles.spark}
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 32 L15 28 L30 30 L45 18 L60 22 L75 12 L90 16 L105 8 L120 4"
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function CardMetricMediaSnippet() {
  return (
    <div className={stackStyles.stack}>
      <Card.Root variant="metric-media">
        <Card.HeaderRow>
          <Card.Lead>
            <span className={mediaStyles.leadText}>Glucose</span>
          </Card.Lead>
          <Card.Value>5.4 mmol/L</Card.Value>
        </Card.HeaderRow>
        <Card.Description>In range</Card.Description>
        <Card.Media>
          <MiniSparkline />
        </Card.Media>
      </Card.Root>

      <Card.Root variant="metric-media">
        <Card.HeaderRow>
          <Card.Lead>
            <span className={mediaStyles.leadText}>Quota</span>
          </Card.Lead>
          <Card.Value>72%</Card.Value>
        </Card.HeaderRow>
        <Card.Description>API usage</Card.Description>
        <Card.Media>
          <ProgressBar.Root value={72} size="s" />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
