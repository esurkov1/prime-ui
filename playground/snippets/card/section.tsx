import { Card } from "@/components/card/Card";
import { Icon } from "@/icons";

export default function CardSectionSnippet() {
  return (
    <Card.Root variant="section">
      <Card.SectionHeader>
        <Card.SectionTitle>Revenue trend</Card.SectionTitle>
        <Card.SectionTrailing>
          <Icon name="nav.layoutGrid" />
        </Card.SectionTrailing>
      </Card.SectionHeader>
      <Card.Chart>
        <div aria-hidden="true" />
      </Card.Chart>
    </Card.Root>
  );
}
