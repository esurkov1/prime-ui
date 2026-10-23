/** A profile panel: Sign out, a neutral button, stands apart at the start of the footer, the main action keeps the end; on a phone the column puts it first and the main action last — `Drawer.Footer`, `Drawer.Actions`. */
import { Avatar, Button, DescriptionList, Drawer, Icon } from "prime-ui-kit";

const PROFILE = {
  name: "Игорь Лебедев",
  role: "Менеджер по продажам",
  email: "i.lebedev@sev-veter.ru",
  team: "Продажи · Москва",
};

export default function DrawerFooterActionsExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть профиль
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header>
          <Drawer.Icon>
            <Avatar.Root color="green">
              <Avatar.Fallback>ИЛ</Avatar.Fallback>
            </Avatar.Root>
          </Drawer.Icon>
          <Drawer.Title>{PROFILE.name}</Drawer.Title>
          <Drawer.Description>{PROFILE.role}</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Почта">{PROFILE.email}</DescriptionList.Item>
            <DescriptionList.Item label="Команда">{PROFILE.team}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.logout" />
              </Button.Icon>
              Выйти
            </Button.Root>
          </Drawer.Actions>
          <Button.Root>Изменить</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
