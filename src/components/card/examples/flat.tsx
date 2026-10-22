/** A flat tile without the raised shadow next to the default one, for dense grids — `flat`. */
import { Card } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardFlatExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Переезд склада</Card.Title>
          <Card.Description>С тенью, по умолчанию</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root flat>
        <Card.Header>
          <Card.Title>Переезд склада</Card.Title>
          <Card.Description>Плоская плитка</Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  );
}
