import { Card } from "@/components/card/Card";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Icon } from "@/icons";

import mediaStyles from "./mini-media.module.css";
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

export default function CardMiniMediaSnippet() {
  return (
    <div className={stackStyles.stack}>
      <Card.Root variant="mini-media">
        <Card.IconBox>
          <Icon name="field.email" />
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
        <Card.IconBox>
          <Icon name="nav.layoutGrid" />
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
