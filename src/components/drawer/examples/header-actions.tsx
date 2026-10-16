/** The one header of a record: the avatar, the name, its statuses leading the line under it, and only buttons at the end — `Drawer.Icon`, `Drawer.Description`, `Drawer.Actions`. */
import {
  Avatar,
  Badge,
  Button,
  DescriptionList,
  Drawer,
  Dropdown,
  Icon,
  Tooltip,
} from "prime-ui-kit";

const MEMBER = {
  name: "Анна Соколова",
  initials: "АС",
  email: "a.sokolova@severnyveter.ru",
  role: "Менеджер",
  team: "Продажи",
  since: "12 марта 2024",
};

export default function DrawerHeaderActionsExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть сотрудника
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Icon>
            <Avatar.Root color="purple">
              <Avatar.Fallback>{MEMBER.initials}</Avatar.Fallback>
            </Avatar.Root>
          </Drawer.Icon>
          <Drawer.Title>{MEMBER.name}</Drawer.Title>
          <Drawer.Description>
            <Badge.Root color="blue">{MEMBER.role}</Badge.Root>
            <Badge.Root tone="success">Активна</Badge.Root>
            {MEMBER.email}
          </Drawer.Description>
          <Drawer.Actions>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Скопировать ссылку">
                  <Button.Icon>
                    <Icon name="action.copy" />
                  </Button.Icon>
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content>Скопировать ссылку</Tooltip.Content>
            </Tooltip.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия с сотрудником">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Сменить роль</Dropdown.Item>
                <Dropdown.Item>Сбросить пароль</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger">Отключить доступ</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Команда">{MEMBER.team}</DescriptionList.Item>
            <DescriptionList.Item label="В компании с">{MEMBER.since}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
