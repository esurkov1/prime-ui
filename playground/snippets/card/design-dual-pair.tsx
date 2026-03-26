import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

import styles from "./design-dual-pair.module.css";

export default function CardDesignDualPairSnippet() {
  return (
    <div className={styles.pair}>
      <Card.Root variant="mini" flat>
        <Card.IconBox>
          <Icon name="nav.home" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>North</Card.Label>
          <Card.Value>142</Card.Value>
        </Card.Stack>
      </Card.Root>
      <Card.Root variant="mini" flat>
        <Card.IconBox>
          <Icon name="nav.layoutGrid" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>South</Card.Label>
          <Card.Value>89</Card.Value>
        </Card.Stack>
      </Card.Root>
    </div>
  );
}
