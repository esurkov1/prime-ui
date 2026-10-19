/** The dialog tab of a deal card: the chat stands flush with the edges of the panel's body, with no insets of its own, and takes its whole height under the panel's own record header — `variant`, `Chat.Root`, `Drawer.Body`, `Tabs.Panel`. */
import {
  Badge,
  Button,
  Chat,
  Composer,
  DescriptionList,
  Drawer,
  Message,
  Tabs,
} from "prime-ui-kit";
import * as React from "react";

type DealMessage = {
  id: string;
  direction: "incoming" | "outgoing";
  text: string;
  sentAt: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);

const DEAL = {
  name: "Поставка стеллажей",
  number: "D-4120",
  summary: "ООО «Северный ветер» · 1 240 000 ₽",
  contact: "Ольга Ветрова",
  phone: "+7 495 120-44-18",
};

const MESSAGES: DealMessage[] = [
  {
    id: "1",
    direction: "incoming",
    text: "Добрый день! Подтвердите, пожалуйста, дату поставки по сделке.",
    sentAt: new Date(2026, 9, 8, 10, 12),
  },
  {
    id: "2",
    direction: "outgoing",
    text: "Здравствуйте! Отгрузка в пятницу, доставка в субботу до 14:00.",
    sentAt: new Date(2026, 9, 8, 10, 30),
  },
  {
    id: "3",
    direction: "incoming",
    text: "Отлично. Счёт оплатим сегодня.",
    sentAt: new Date(2026, 9, 8, 11, 2),
  },
];

export default function ChatInlineExample() {
  const [tab, setTab] = React.useState("dialog");
  const [messages, setMessages] = React.useState(MESSAGES);

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть сделку
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Drawer.Header>
            <Drawer.Title number={DEAL.number}>{DEAL.name}</Drawer.Title>
            <Drawer.Badges>
              <Badge.Root tone="warning">В работе</Badge.Root>
            </Drawer.Badges>
            <Drawer.Description>{DEAL.summary}</Drawer.Description>
            <Tabs.List aria-label={DEAL.name}>
              <Tabs.Item value="details">Детали</Tabs.Item>
              <Tabs.Item value="dialog">Диалог</Tabs.Item>
            </Tabs.List>
          </Drawer.Header>
          <Drawer.Body>
            <Tabs.Panel value="details">
              <DescriptionList.Root>
                <DescriptionList.Item label="Контакт">{DEAL.contact}</DescriptionList.Item>
                <DescriptionList.Item label="Телефон">{DEAL.phone}</DescriptionList.Item>
              </DescriptionList.Root>
            </Tabs.Panel>
            <Tabs.Panel value="dialog">
              <Chat.Root variant="inline">
                <Chat.Messages
                  aria-label={`Диалог по сделке ${DEAL.number}`}
                  items={messages}
                  getKey={(message) => message.id}
                  getAuthor={(message) => message.direction}
                  getDate={(message) => message.sentAt}
                  renderMessage={(message) => (
                    <Message.Root
                      direction={message.direction}
                      time={message.sentAt}
                      status={message.direction === "outgoing" ? "read" : undefined}
                    >
                      <Message.Text>{message.text}</Message.Text>
                    </Message.Root>
                  )}
                  now={NOW}
                />
                <Chat.Footer>
                  <Composer.Root
                    onSend={({ text }) =>
                      setMessages((current) => [
                        ...current,
                        {
                          id: String(current.length + 1),
                          direction: "outgoing",
                          text,
                          sentAt: new Date(),
                        },
                      ])
                    }
                  />
                </Chat.Footer>
              </Chat.Root>
            </Tabs.Panel>
          </Drawer.Body>
        </Tabs.Root>
      </Drawer.Content>
    </Drawer.Root>
  );
}
