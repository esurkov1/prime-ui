import { Card } from "@/components/card/Card";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

export default function CardPanelContentChartSnippet() {
  return (
    <Card.Root variant="panel">
      <Card.SectionHeader>
        <Card.SectionTitle>Revenue</Card.SectionTitle>
        <Card.SectionTrailing>
          <Icon surface="none" name="nav.layoutGrid" />
        </Card.SectionTrailing>
      </Card.SectionHeader>
      <Card.Body>
        <Typography.Root variant="body-small" tone="muted">
          Краткая сводка по кварталам; область графика ниже без внутренних полей.
        </Typography.Root>
      </Card.Body>
      <Card.Chart>
        <div aria-hidden="true" />
      </Card.Chart>
    </Card.Root>
  );
}
