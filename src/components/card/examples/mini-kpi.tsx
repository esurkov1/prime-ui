import { Card, Icon } from "prime-ui-kit";

/** Compact KPI: icon + label/value (`variant="mini"`). */
export function MiniKpiExample() {
  return (
    <Card.Root variant="mini">
      <Card.IconBox aria-hidden>
        <Icon name="field.email" aria-hidden />
      </Card.IconBox>
      <Card.Stack>
        <Card.Label>Active sessions</Card.Label>
        <Card.Value>1,248</Card.Value>
      </Card.Stack>
    </Card.Root>
  );
}
