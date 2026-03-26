import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

import styles from "./design-accent-rail.module.css";

export default function CardDesignAccentRailSnippet() {
  return (
    <Card.Root variant="mini" flat className={styles.accentRail}>
      <Card.IconBox>
        <Icon name="nav.home" />
      </Card.IconBox>
      <Card.Stack>
        <Card.Label>Conversion</Card.Label>
        <Card.Value>4.2%</Card.Value>
      </Card.Stack>
    </Card.Root>
  );
}
