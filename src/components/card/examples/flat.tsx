/** A flat tile without the raised shadow next to the default one, for dense grids — `flat`. */
import { Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardFlatExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="mini">
        <Card.Icon>
          <Icon name="field.email" strokeWidth={2} />
        </Card.Icon>
        <Card.Label>С тенью (по умолчанию)</Card.Label>
        <Card.Value>42</Card.Value>
      </Card.Root>
      <Card.Root variant="mini" flat>
        <Card.Icon>
          <Icon name="field.email" strokeWidth={2} />
        </Card.Icon>
        <Card.Label>flat</Card.Label>
        <Card.Value>42</Card.Value>
      </Card.Root>
    </div>
  );
}
