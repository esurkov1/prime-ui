import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Icon } from "@/icons";

export default function DashboardCardSectionSnippet() {
  return (
    <DashboardCard.Root variant="section">
      <DashboardCard.SectionHeader>
        <DashboardCard.SectionTitle>Revenue trend</DashboardCard.SectionTitle>
        <DashboardCard.SectionTrailing>
          <Icon name="nav.layoutGrid" />
        </DashboardCard.SectionTrailing>
      </DashboardCard.SectionHeader>
      <DashboardCard.Chart>
        <div aria-hidden="true" />
      </DashboardCard.Chart>
    </DashboardCard.Root>
  );
}
