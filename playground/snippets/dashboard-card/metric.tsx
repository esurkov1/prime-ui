import { Badge } from "@/components/badge/Badge";
import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Icon } from "@/icons";

import styles from "./variants-stack.module.css";

export default function DashboardCardMetricSnippet() {
  return (
    <div className={styles.stack}>
      <DashboardCard.Root variant="metric">
        <DashboardCard.HeaderRow>
          <DashboardCard.Lead>
            <Badge.Root color="blue" variant="filled" size="s">
              CRP
            </Badge.Root>
          </DashboardCard.Lead>
          <DashboardCard.Value>1.8 mg/L</DashboardCard.Value>
        </DashboardCard.HeaderRow>
        <DashboardCard.Description>Slightly elevated</DashboardCard.Description>
      </DashboardCard.Root>

      <DashboardCard.Root variant="metric">
        <DashboardCard.HeaderRow>
          <DashboardCard.Lead>
            <Icon name="field.email" />
          </DashboardCard.Lead>
          <DashboardCard.Value>98.2%</DashboardCard.Value>
        </DashboardCard.HeaderRow>
        <DashboardCard.Description>Delivery rate this week</DashboardCard.Description>
      </DashboardCard.Root>
    </div>
  );
}
