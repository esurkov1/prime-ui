import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

export default function CardSplitSnippet() {
  return (
    <Card.Root variant="split">
      <Card.Split>
        <Card.SplitCell>
          <Card.IconBox>
            <Icon surface="none" name="nav.layoutGrid" />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Конверсия</Card.Label>
            <Card.Value>3.8%</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
        <Card.SplitCell>
          <Card.IconBox>
            <Icon surface="none" name="field.email" />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Средний чек</Card.Label>
            <Card.Value>₽ 2 450</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
      </Card.Split>
    </Card.Root>
  );
}
