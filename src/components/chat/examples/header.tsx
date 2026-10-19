/** A conversation with a client as a record header of two lines: the avatar, the name with its number over a line of badges — the stage and the assignee as pickers, the AI's state beside them — and at the end the AI switch, search and ⋯ — `Chat.Title`, `number`, `Chat.Badges`, `Chat.Actions`. */
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
  Tooltip,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Stage = { id: string; title: string; tone: "info" | "warning" | "success" | "neutral" };
type Manager = { id: string; name: string; initials: string; color: PaletteColor };

const STAGES: Stage[] = [
  { id: "new", title: "Новая", tone: "info" },
  { id: "progress", title: "В работе", tone: "warning" },
  { id: "paid", title: "Оплачено", tone: "success" },
  { id: "closed", title: "Закрыта", tone: "neutral" },
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
  const stage = STAGES.find((item) => item.id === stageId) ?? STAGES[0];
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
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Badge.Root tone={stage?.tone} aria-label={`Этап: ${stage?.title}`}>
                  {stage?.title}
                </Badge.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {STAGES.map((item) => (
                  <Dropdown.Item key={item.id} onSelect={() => setStageId(item.id)}>
                    {item.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                {manager ? (
                  <Badge.Root aria-label={`Ответственный: ${manager.name}`}>
                    <Badge.Avatar>
                      <Avatar.Root color={manager.color}>
                        <Avatar.Fallback>{manager.initials}</Avatar.Fallback>
                      </Avatar.Root>
                    </Badge.Avatar>
                    {manager.name}
                  </Badge.Root>
                ) : (
                  <Badge.Root variant="outline">Назначить</Badge.Root>
                )}
              </Dropdown.Trigger>
              <Dropdown.Content>
                {MANAGERS.map((item) => (
                  <Dropdown.Item key={item.id} onSelect={() => setManagerId(item.id)}>
                    {item.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Separator />
                <Dropdown.Item onSelect={() => setManagerId(null)}>
                  Снять ответственного
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
            <Badge.Root tone={ai ? "info" : "neutral"}>
              <Badge.Dot />
              {ai ? "AI отвечает" : "AI выключен"}
            </Badge.Root>
          </Chat.Badges>
          <Chat.Actions>
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
