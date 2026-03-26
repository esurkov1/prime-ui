import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

export default function DashboardCardSectionContentAndChartSnippet() {
  return (
    <DashboardCard.Root variant="section">
      <DashboardCard.SectionHeader>
        <DashboardCard.SectionTitle>Revenue</DashboardCard.SectionTitle>
        <DashboardCard.SectionTrailing>
          <Icon name="nav.layoutGrid" />
        </DashboardCard.SectionTrailing>
      </DashboardCard.SectionHeader>
      <DashboardCard.Body>
        <Typography.Root variant="body-small" tone="muted">
          Краткая сводка по кварталам; область графика ниже без внутренних полей.
        </Typography.Root>
      </DashboardCard.Body>
      <DashboardCard.Chart>
        <div aria-hidden="true" />
      </DashboardCard.Chart>
    </DashboardCard.Root>
  );
}
