/** The one header of a record: the name with its number and its plain statuses on one line, a line of data under it, the status and the assignee as a row of pickers under them, and in the title row only two icon buttons and the close — `Drawer.Title`, `number`, `Drawer.Badges`, `Drawer.Description`, `Drawer.Fields`, `Drawer.Actions`, `Select.Root`. */
import {
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  DescriptionList,
  Drawer,
  Icon,
  type PaletteColor,
  Select,
  Tooltip,
} from "prime-ui-kit";
import * as React from "react";

type Manager = { id: string; name: string; initials: string; color: PaletteColor };

const STATUSES = [
  { id: "new", title: "Новая" },
  { id: "progress", title: "В работе" },
  { id: "won", title: "Бронь оплачена" },
  { id: "closed", title: "Закрыта" },
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

/** Pretends to delete the lead on the server. */
function deleteLead() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function DrawerHeaderActionsExample() {
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [statusId, setStatusId] = React.useState("new");
  const [managerId, setManagerId] = React.useState("kotova");

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть заявку
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="l">
        <Drawer.Header>
          <Drawer.Title number={LEAD.number}>{LEAD.name}</Drawer.Title>
          <Drawer.Badges>
            <Badge.Root color="sky">Telegram</Badge.Root>
            <Badge.Root tone="warning">Ждёт человека</Badge.Root>
            <Badge.Root color="purple">VIP</Badge.Root>
          </Drawer.Badges>
          <Drawer.Description>{LEAD.summary}</Drawer.Description>
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
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button.Root
                  variant="ghost"
                  tone="danger"
                  aria-label="Удалить заявку"
                  onClick={() => setDeleting(true)}
                >
                  <Button.Icon>
                    <Icon name="action.delete" />
                  </Button.Icon>
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>Удалить заявку</Tooltip.Content>
            </Tooltip.Root>
          </Drawer.Actions>
          <Drawer.Fields>
            <Select.Root aria-label="Статус" value={statusId} onValueChange={setStatusId}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {STATUSES.map((item) => (
                  <Select.Item key={item.id} value={item.id}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Select.Root aria-label="Ответственный" value={managerId} onValueChange={setManagerId}>
              <Select.Trigger>
                <Select.Value
                  renderValue={({ value, label }) => (
                    <>
                      <Avatar.Root color={MANAGERS.find((item) => item.id === value)?.color}>
                        <Avatar.Fallback>
                          {MANAGERS.find((item) => item.id === value)?.initials}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Select.ItemText>{label}</Select.ItemText>
                    </>
                  )}
                />
              </Select.Trigger>
              <Select.Content>
                {MANAGERS.map((item) => (
                  <Select.Item key={item.id} value={item.id}>
                    <Avatar.Root color={item.color}>
                      <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                    </Avatar.Root>
                    <Select.ItemText>{item.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Drawer.Fields>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Телефон">{LEAD.phone}</DescriptionList.Item>
            <DescriptionList.Item label="Даты">{LEAD.dates}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
        <ConfirmDialog.Root
          open={deleting}
          onOpenChange={setDeleting}
          title="Удалить заявку?"
          description="Заявка и переписка пропадут без возможности восстановления."
          confirmLabel="Удалить"
          onConfirm={() => deleteLead().then(() => setOpen(false))}
        />
      </Drawer.Content>
    </Drawer.Root>
  );
}
