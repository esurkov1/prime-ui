import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

import styles from "./section.module.css";

export default function DashboardCardSectionSnippet() {
  return (
    <DashboardCard.Root variant="section">
      <DashboardCard.SectionHeader>
        <DashboardCard.SectionTitle>Revenue trend</DashboardCard.SectionTitle>
        <DashboardCard.SectionTrailing>
          <Icon name="nav.layoutGrid" />
        </DashboardCard.SectionTrailing>
      </DashboardCard.SectionHeader>
      <DashboardCard.Body>
        <div className={styles.chartPlaceholder} aria-hidden="true" />
        <Typography.Root variant="body-small" tone="muted">
          Placeholder for a chart component — use your charting library inside Body.
        </Typography.Root>
      </DashboardCard.Body>
    </DashboardCard.Root>
  );
}
