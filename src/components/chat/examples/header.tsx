/** A conversation with a client as a record header of two lines: the avatar, the name with its number and a badge on one line, the AI's state and the owner under it, and at the end the stage picker, the AI switch, search and ⋯ — `Chat.Title`, `number`, `Chat.Badges`, `Chat.Description`, `Chat.Actions`. */
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chat,
  Dropdown,
  Icon,
  Message,
  type PaletteColor,
  Select,
  StatusDot,
  Tooltip,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Stage = { id: string; title: string };
type Manager = { id: string; name: string; initials: string; color: PaletteColor };

const STAGES: Stage[] = [
  { id: "new", title: "Новая" },
  { id: "progress", title: "В работе" },
  { id: "paid", title: "Оплачено" },
  { id: "closed", title: "Закрыта" },
];

const MANAGERS: Manager[] = [
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
];

const CLIENT = { name: "Ольга Ветрова", number: "#4120" };

export default function ChatHeaderExample() {
  const [stageId, setStageId] = React.useState("progress");
  const [managerId, setManagerId] = React.useState<string | null>("kotova");
  const [ai, setAi] = React.useState(true);
  const manager = MANAGERS.find((item) => item.id === managerId);

  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Header>
          <Avatar.Root color="blue">
            <Avatar.Fallback>ОВ</Avatar.Fallback>
          </Avatar.Root>
          <Chat.Title number={CLIENT.number}>{CLIENT.name}</Chat.Title>
          <Chat.Badges>
            <Badge.Root tone="warning">Счёт просрочен</Badge.Root>
          </Chat.Badges>
          <Chat.Description>
            <StatusDot tone={ai ? "accent" : "neutral"}>
              {ai ? "AI отвечает" : "AI выключен"}
            </StatusDot>
            {manager ? `Отвечает ${manager.name}` : "Не назначен"}
          </Chat.Description>
          <Chat.Actions>
            <Select.Root value={stageId} onValueChange={setStageId}>
              <Select.Trigger aria-label="Этап">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {STAGES.map((item) => (
                  <Select.Item key={item.id} value={item.id}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button.Root
                  variant="ghost"
                  tone="neutral"
                  aria-label="AI-ассистент"
                  pressed={ai}
                  onClick={() => setAi(!ai)}
                >
                  <Button.Icon>
                    <Icon name="object.bot" />
                  </Button.Icon>
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>{ai ? "Выключить AI" : "Включить AI"}</Tooltip.Content>
            </Tooltip.Root>
            <Chat.SearchButton />
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия с диалогом">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {MANAGERS.map((item) => (
                  <Dropdown.Item key={item.id} onSelect={() => setManagerId(item.id)}>
                    Передать: {item.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Separator />
                <Dropdown.Item>Открыть сделку</Dropdown.Item>
                <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger">Закрыть диалог</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Chat.Actions>
        </Chat.Header>
        <Chat.Search />
        <Chat.Messages>
          <Message.Root value="m1" direction="incoming" time="14:21">
            <Message.Text>
              Здравствуйте! Можно перенести поставку по заказу №4120 на субботу?
            </Message.Text>
          </Message.Root>
          <Message.Root value="m2" direction="outgoing" time="14:22" status="read">
            <Message.Text>Здравствуйте! На субботу свободны 10:00 и 14:30.</Message.Text>
          </Message.Root>
          <Message.Root value="m3" direction="incoming" time="14:25">
            <Message.Text>Давайте 14:30.</Message.Text>
          </Message.Root>
        </Chat.Messages>
      </Chat.Root>
    </Card.Root>
  );
}
