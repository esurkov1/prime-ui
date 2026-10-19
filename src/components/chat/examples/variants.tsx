/** The same conversation as a card's whole content, inset from its own edges, and as the content of a padded card body, flush with its edges — `variant`. */
import { Card, Chat, Message, Typography } from "prime-ui-kit";

const VARIANTS = ["pane", "inline"] as const;

const MESSAGES = [
  { id: "1", direction: "incoming", text: "Счёт INV-4120 получили, оплатим сегодня." },
  { id: "2", direction: "outgoing", text: "Спасибо! Отгрузим, как придёт оплата." },
] as const;

const conversation = (variant: (typeof VARIANTS)[number]) => (
  <Chat.Root variant={variant}>
    <Chat.Header>
      <Chat.Title>Ольга Ветрова</Chat.Title>
      <Chat.Description>ООО «Северный ветер»</Chat.Description>
    </Chat.Header>
    <Chat.Messages>
      {MESSAGES.map((message) => (
        <Message.Root
          key={message.id}
          value={message.id}
          direction={message.direction}
          time="11:05"
        >
          <Message.Text>{message.text}</Message.Text>
        </Message.Root>
      ))}
    </Chat.Messages>
  </Chat.Root>
);

export default function ChatVariantsExample() {
  return (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <div>
            <Card.Root>
              {variant === "inline" ? <Card.Body>{conversation(variant)}</Card.Body> : null}
              {variant === "pane" ? conversation(variant) : null}
            </Card.Root>
            <Typography as="span" variant="caption" tone="muted">
              {variant}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
