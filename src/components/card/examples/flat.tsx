/** Default `shadow-raised` versus `flat` (no shadow). Use `flat` for dense grids of tiles where shadows add noise. */

import { Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardFlatExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini">
        <Card.IconBox>
          <Icon name="field.email" strokeWidth={2} />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>С тенью (по умолчанию)</Card.Label>
          <Card.Value>42</Card.Value>
        </Card.Stack>
      </Card.Root>
      <Card.Root variant="mini" flat>
        <Card.IconBox>
          <Icon name="field.email" strokeWidth={2} />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>flat</Card.Label>
          <Card.Value>42</Card.Value>
        </Card.Stack>
      </Card.Root>
    </div>
  );
}
