import { Badge, Card, Icon } from "prime-ui-kit";

import layoutStyles from "./layout.module.css";
import sparkStyles from "./sparkline.module.css";

function SessionsSparkline() {
  return (
    <svg
      className={sparkStyles.spark}
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

/** KPI row: large trend tile, labeled metric, and compact mini-media. */
export function MetricDashboardExample() {
  return (
    <div className={layoutStyles.grid}>
      <Card.Root variant="stat-trend">
        <Card.Label>Net revenue (30d)</Card.Label>
        <Card.Value>$420k</Card.Value>
        <Card.Delta trend="up">+18% vs prior period</Card.Delta>
      </Card.Root>

      <Card.Root variant="metric">
        <Card.HeaderRow>
          <Card.Lead>
            <Badge.Root color="blue" variant="filled" size="s">
              SLA
            </Badge.Root>
          </Card.Lead>
          <Card.Value>99.2%</Card.Value>
        </Card.HeaderRow>
        <Card.Description>Successful deliveries this week</Card.Description>
      </Card.Root>

      <Card.Root variant="mini-media">
        <Card.IconBox aria-hidden>
          <Icon surface="none" name="nav.layoutGrid" aria-hidden />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Sessions</Card.Label>
          <Card.Value>12.4k</Card.Value>
        </Card.Stack>
        <Card.Media>
          <SessionsSparkline />
        </Card.Media>
      </Card.Root>
    </div>
  );
}
