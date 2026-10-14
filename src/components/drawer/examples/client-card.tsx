/** A client card from the list: the contact's avatar heads the panel in place of an icon tile, then the details — `Drawer.Icon`, `Avatar.Root`. */
import { Avatar, Button, DescriptionList, Drawer } from "prime-ui-kit";

const CLIENT = {
  name: "Анна Соколова",
  company: "ООО «Северный ветер»",
  role: "Финансовый директор",
  phone: "+7 495 120-44-18",
  email: "a.sokolova@sev-veter.ru",
  manager: "Игорь Лебедев",
};

export default function DrawerClientCardExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть клиента
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Icon>
            <Avatar.Root color="blue">
              <Avatar.Fallback>АС</Avatar.Fallback>
            </Avatar.Root>
          </Drawer.Icon>
          <Drawer.Title>{CLIENT.name}</Drawer.Title>
          <Drawer.Description>{CLIENT.company}</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Должность">{CLIENT.role}</DescriptionList.Item>
            <DescriptionList.Item label="Телефон">{CLIENT.phone}</DescriptionList.Item>
            <DescriptionList.Item label="Почта">{CLIENT.email}</DescriptionList.Item>
            <DescriptionList.Item label="Менеджер">{CLIENT.manager}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Написать</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
