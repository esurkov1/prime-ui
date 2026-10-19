/** The one header of a record: the name with its number, one line of data under it, then the badges — the status and the assignee as pickers, the other statuses after them — and only buttons at the end — `Drawer.Title`, `number`, `Drawer.Description`, `Drawer.Badges`, `Badge.Avatar`, `Drawer.Actions`. */
import {
  Avatar,
  Badge,
  Button,
  DescriptionList,
  Drawer,
  Dropdown,
  Icon,
  type PaletteColor,
  Tooltip,
} from "prime-ui-kit";
import * as React from "react";

type Status = { id: string; title: string; tone: "info" | "warning" | "success" | "neutral" };
type Manager = { id: string; name: string; initials: string; color: PaletteColor };

const STATUSES: Status[] = [
  { id: "new", title: "Новая", tone: "info" },
  { id: "progress", title: "В работе", tone: "warning" },
  { id: "won", title: "Бронь оплачена", tone: "success" },
  { id: "closed", title: "Закрыта", tone: "neutral" },
];

const MANAGERS: Manager[] = [
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
];

const LEAD = {
  name: "Александра",
  number: "#678",
  summary: "Аренда байка Пхукет · заявка 19 сент, 06:37",
  phone: "+66 81 234 56 78",
  dates: "21–28 сентября",
};

export default function DrawerHeaderActionsExample() {
  const [statusId, setStatusId] = React.useState("new");
  const [managerId, setManagerId] = React.useState<string | null>("kotova");
  const status = STATUSES.find((item) => item.id === statusId) ?? STATUSES[0];
  const manager = MANAGERS.find((item) => item.id === managerId);

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть заявку
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title number={LEAD.number}>{LEAD.name}</Drawer.Title>
          <Drawer.Description>{LEAD.summary}</Drawer.Description>
          <Drawer.Badges>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Badge.Root tone={status?.tone} aria-label={`Статус: ${status?.title}`}>
                  {status?.title}
                </Badge.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {STATUSES.map((item) => (
                  <Dropdown.Item key={item.id} onSelect={() => setStatusId(item.id)}>
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
            <Badge.Root color="sky">Telegram</Badge.Root>
            <Badge.Root tone="warning">Ждёт человека</Badge.Root>
            <Badge.Root color="purple">VIP</Badge.Root>
          </Drawer.Badges>
          <Drawer.Actions>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Диалог">
                  <Button.Icon>
                    <Icon name="object.message" />
                  </Button.Icon>
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>Диалог</Tooltip.Content>
            </Tooltip.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия с заявкой">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
                <Dropdown.Item>Объединить с другой заявкой</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger">Удалить заявку</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Телефон">{LEAD.phone}</DescriptionList.Item>
            <DescriptionList.Item label="Даты">{LEAD.dates}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="soft" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
