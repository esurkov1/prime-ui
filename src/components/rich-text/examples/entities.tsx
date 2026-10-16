/** A bot's greeting stored as a messenger sends it — plain text with formatted ranges — shown with its stars kept as text — `entities`. */
import { Card, RichText, type TextEntity } from "prime-ui-kit";

const GREETING = "Здравствуйте! Счета — в личном кабинете. Поле *ИНН* обязательно.";

const GREETING_ENTITIES: TextEntity[] = [
  { type: "bold", offset: 0, length: 13 },
  { type: "link", offset: 24, length: 15, url: "https://prime.app/billing" },
  { type: "underline", offset: 52, length: 11 },
];

export default function RichTextEntitiesExample() {
  return (
    <Card.Root>
      <Card.Body>
        <RichText entities={GREETING_ENTITIES}>{GREETING}</RichText>
      </Card.Body>
    </Card.Root>
  );
}
