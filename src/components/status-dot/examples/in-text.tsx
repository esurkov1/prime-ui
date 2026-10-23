/** A state at the start of a card's description, in its type and color — `tone`. */
import { Card, StatusDot } from "prime-ui-kit";

export default function StatusDotInTextExample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Синхронизация с 1С</Card.Title>
        <Card.Description>
          <StatusDot tone="success">Работает</StatusDot>
          каждые 15 минут
        </Card.Description>
      </Card.Header>
    </Card.Root>
  );
}
