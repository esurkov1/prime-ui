import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
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

export default function DashboardCardMetricMediaSnippet() {
  return (
    <div className={stackStyles.stack}>
      <DashboardCard.Root variant="metric-media">
        <DashboardCard.HeaderRow>
          <DashboardCard.Lead>
            <span className={mediaStyles.leadText}>Glucose</span>
          </DashboardCard.Lead>
          <DashboardCard.Value>5.4 mmol/L</DashboardCard.Value>
        </DashboardCard.HeaderRow>
        <DashboardCard.Description>In range</DashboardCard.Description>
        <DashboardCard.Media>
          <MiniSparkline />
        </DashboardCard.Media>
      </DashboardCard.Root>

      <DashboardCard.Root variant="metric-media">
        <DashboardCard.HeaderRow>
          <DashboardCard.Lead>
            <span className={mediaStyles.leadText}>Quota</span>
          </DashboardCard.Lead>
          <DashboardCard.Value>72%</DashboardCard.Value>
        </DashboardCard.HeaderRow>
        <DashboardCard.Description>API usage</DashboardCard.Description>
        <DashboardCard.Media>
          <ProgressBar.Root value={72} size="s" />
        </DashboardCard.Media>
      </DashboardCard.Root>
    </div>
  );
}
