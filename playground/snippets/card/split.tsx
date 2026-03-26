import { Card } from "@/components/card/Card";

export default function CardSplitSnippet() {
  return (
    <Card.Root variant="split">
      <Card.Split>
        <Card.SplitCell>
          <Card.Label>Конверсия</Card.Label>
          <Card.Value>3.8%</Card.Value>
        </Card.SplitCell>
        <Card.SplitCell>
          <Card.Label>Средний чек</Card.Label>
          <Card.Value>₽ 2 450</Card.Value>
        </Card.SplitCell>
      </Card.Split>
    </Card.Root>
  );
}
