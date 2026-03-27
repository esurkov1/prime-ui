import { Badge } from "@/components/badge/Badge";
import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

import styles from "./variants-stack.module.css";

export default function CardMetricSnippet() {
  return (
    <div className={styles.stack}>
      <Card.Root variant="metric">
        <Card.HeaderRow>
          <Card.Lead>
            <Badge.Root color="blue" variant="filled" size="s">
              CRP
            </Badge.Root>
          </Card.Lead>
          <Card.Value>1.8 mg/L</Card.Value>
        </Card.HeaderRow>
        <Card.Description>Slightly elevated</Card.Description>
      </Card.Root>

      <Card.Root variant="metric">
        <Card.HeaderRow>
          <Card.Lead>
            <Icon name="field.email" />
          </Card.Lead>
          <Card.Value>98.2%</Card.Value>
        </Card.HeaderRow>
        <Card.Description>Delivery rate this week</Card.Description>
      </Card.Root>
    </div>
  );
}
