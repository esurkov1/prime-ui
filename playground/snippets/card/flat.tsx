import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

import styles from "./flat.module.css";

export default function CardFlatSnippet() {
  return (
    <div className={styles.row}>
      <Card.Root variant="mini">
        <Card.IconBox>
          <Icon surface="none" name="field.email" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>Default (shadow)</Card.Label>
          <Card.Value>42</Card.Value>
        </Card.Stack>
      </Card.Root>
      <Card.Root variant="mini" flat>
        <Card.IconBox>
          <Icon surface="none" name="field.email" />
        </Card.IconBox>
        <Card.Stack>
          <Card.Label>flat</Card.Label>
          <Card.Value>42</Card.Value>
        </Card.Stack>
      </Card.Root>
    </div>
  );
}
