import { Badge } from "@/components/badge/Badge";
import { Card } from "@/components/card/Card";

import styles from "./design-hero-metric.module.css";

export default function CardDesignHeroMetricSnippet() {
  return (
    <Card.Root variant="metric">
      <Card.HeaderRow>
        <Card.Lead>
          <Badge.Root color="gray" variant="lighter" size="s">
            MTD
          </Badge.Root>
        </Card.Lead>
        <Card.Value className={styles.heroValue}>€24.8k</Card.Value>
      </Card.HeaderRow>
      <Card.Description>Europe · vs €21.2k last month</Card.Description>
    </Card.Root>
  );
}
