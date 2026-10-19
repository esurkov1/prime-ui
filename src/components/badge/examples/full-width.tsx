/** The next step of a record as a plate across its card, the text centred — `fullWidth`, `tone`. */
import { Badge, Card } from "prime-ui-kit";

export default function BadgeFullWidthExample() {
  return (
    <Card.Root>
      <Card.Body>
        <Badge.Root fullWidth tone="warning">
          Выдать Honda PCX 160 завтра в 06:00
        </Badge.Root>
      </Card.Body>
    </Card.Root>
  );
}
