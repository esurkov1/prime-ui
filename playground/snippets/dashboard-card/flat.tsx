import { DashboardCard } from "@/components/dashboard-card/DashboardCard";
import { Icon } from "@/icons";

import styles from "./flat.module.css";

export default function DashboardCardFlatSnippet() {
  return (
    <div className={styles.row}>
      <DashboardCard.Root variant="mini">
        <DashboardCard.IconBox>
          <Icon name="field.email" />
        </DashboardCard.IconBox>
        <DashboardCard.Stack>
          <DashboardCard.Label>Default (shadow)</DashboardCard.Label>
          <DashboardCard.Value>42</DashboardCard.Value>
        </DashboardCard.Stack>
      </DashboardCard.Root>
      <DashboardCard.Root variant="mini" flat>
        <DashboardCard.IconBox>
          <Icon name="field.email" />
        </DashboardCard.IconBox>
        <DashboardCard.Stack>
          <DashboardCard.Label>flat</DashboardCard.Label>
          <DashboardCard.Value>42</DashboardCard.Value>
        </DashboardCard.Stack>
      </DashboardCard.Root>
    </div>
  );
}
