import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Icon } from "@/icons";

export default function DashboardCardMiniSnippet() {
  return (
    <DashboardCard.Root variant="mini">
      <DashboardCard.IconBox>
        <Icon name="field.email" />
      </DashboardCard.IconBox>
      <DashboardCard.Stack>
        <DashboardCard.Label>Active sessions</DashboardCard.Label>
        <DashboardCard.Value>1,248</DashboardCard.Value>
      </DashboardCard.Stack>
    </DashboardCard.Root>
  );
}
