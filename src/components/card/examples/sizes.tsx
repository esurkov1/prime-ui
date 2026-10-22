/** A record card at every tier: the padding steps 16 · 20 · 24 and the button inside takes the tier, the text keeps its roles — `size`. */
import { Button, Card, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function CardSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Card.Root size={size}>
            <Card.Header>
              <Card.Title>Ожидает выдачи</Card.Title>
              <Card.Description>10 окт, 08:00 · Аэропорт Пхукета</Card.Description>
              <Card.Actions>
                <Button.Root>Выдан</Button.Root>
              </Card.Actions>
            </Card.Header>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
