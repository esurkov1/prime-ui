import { Card, LinkButton } from "prime-ui-kit";

/** Activity feed with header action. */
export function ListCardExample() {
  return (
    <Card.Root variant="list">
      <Card.ListHeader>
        <Card.Title>Recent activity</Card.Title>
        <LinkButton.Root href="#" size="s">
          View all
        </LinkButton.Root>
      </Card.ListHeader>
      <Card.List>
        <Card.ListItem>Payment received — order #4821 · 12:04</Card.ListItem>
        <Card.ListItem>New review on “Tablet Pro”</Card.ListItem>
        <Card.ListItem>Warehouse sync completed</Card.ListItem>
      </Card.List>
    </Card.Root>
  );
}
