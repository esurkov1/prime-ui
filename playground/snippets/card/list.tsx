import { Card } from "@/components/card/Card";
import { LinkButton } from "@/components/link-button/LinkButton";

export default function CardListSnippet() {
  return (
    <Card.Root variant="list">
      <Card.ListHeader>
        <Card.Title>Последние события</Card.Title>
        <LinkButton.Root href="#" size="s">
          Все
        </LinkButton.Root>
      </Card.ListHeader>
      <Card.List>
        <Card.ListItem>Оплата заказа #4821 — 12:04</Card.ListItem>
        <Card.ListItem>Новый отзыв на товар «Планшет Pro»</Card.ListItem>
        <Card.ListItem>Синхронизация складов завершена</Card.ListItem>
      </Card.List>
    </Card.Root>
  );
}
