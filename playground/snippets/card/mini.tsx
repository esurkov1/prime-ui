import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

export default function CardMiniSnippet() {
  return (
    <Card.Root variant="mini">
      <Card.IconBox>
        <Icon surface="none" name="field.email" />
      </Card.IconBox>
      <Card.Stack>
        <Card.Label>Active sessions</Card.Label>
        <Card.Value>1,248</Card.Value>
      </Card.Stack>
    </Card.Root>
  );
}
