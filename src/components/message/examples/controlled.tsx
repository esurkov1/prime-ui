/** Selection mode owned by the screen: the Select item of a message's menu starts it, a check stands beside every message, a press toggles one and marks the bubble itself, the bar counts and acts, Escape leaves — `selected`, `onSelectedChange`, `Message.SelectionBar`. */
import { Button, Dropdown, Icon, Message } from "prime-ui-kit";
import * as React from "react";

const MESSAGES = [
  { id: "m1", direction: "incoming", time: "10:02", text: "Отгрузка 1187 задерживается на день." },
  { id: "m2", direction: "incoming", time: "10:03", text: "Новая дата — 10 октября." },
  { id: "m3", direction: "outgoing", time: "10:05", text: "Понял, сообщу клиенту." },
] as const;

export default function MessageControlledExample() {
  const [messages, setMessages] = React.useState<readonly (typeof MESSAGES)[number][]>(MESSAGES);
  const [selected, setSelected] = React.useState<readonly string[] | null>(["m2"]);

  const remove = () => {
    setMessages((current) => current.filter((message) => !selected?.includes(message.id)));
    setSelected(null);
  };

  return (
    <Message.Group
      aria-label="Переписка по отгрузке 1187"
      selected={selected}
      onSelectedChange={setSelected}
    >
      {messages.map((message, index) => (
        <Message.Root
          key={message.id}
          value={message.id}
          direction={message.direction}
          position={
            messages[index - 1]?.direction === message.direction
              ? "last"
              : messages[index + 1]?.direction === message.direction
                ? "first"
                : "single"
          }
          time={message.time}
          status={message.direction === "outgoing" ? "read" : undefined}
        >
          <Message.Text>{message.text}</Message.Text>
          <Message.Menu>
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <Icon name="action.reply" />
              </Dropdown.ItemIcon>
              Ответить
            </Dropdown.Item>
          </Message.Menu>
        </Message.Root>
      ))}
      <Message.SelectionBar>
        <Button.Root variant="soft" tone="neutral" size="s" disabled={selected?.length === 0}>
          Переслать
        </Button.Root>
        <Button.Root
          variant="soft"
          tone="danger"
          size="s"
          disabled={selected?.length === 0}
          onClick={remove}
        >
          Удалить
        </Button.Root>
      </Message.SelectionBar>
    </Message.Group>
  );
}
