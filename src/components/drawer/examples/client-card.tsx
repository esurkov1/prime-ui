/** A client card from the list: the contact's avatar heads the panel in place of an icon tile, then the details in titled sections, one with its own action — `Drawer.Icon`, `Avatar.Root`, `Drawer.Section`, `Drawer.Actions`. */
import { Avatar, Button, DescriptionList, Drawer, Icon } from "prime-ui-kit";

const CLIENT = {
  name: "Анна Соколова",
  company: "ООО «Северный ветер»",
  role: "Финансовый директор",
  phone: "+7 495 120-44-18",
  email: "a.sokolova@sev-veter.ru",
  manager: "Игорь Лебедев",
};

const DEALS = [
  { id: "D-2041", title: "Поставка серверов", amount: "1 240 000 ₽" },
  { id: "D-2057", title: "Сервисный контракт на год", amount: "380 000 ₽" },
];

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
          <Drawer.Section label="Контакт">
            <DescriptionList.Root>
              <DescriptionList.Item label="Должность">{CLIENT.role}</DescriptionList.Item>
              <DescriptionList.Item label="Телефон">{CLIENT.phone}</DescriptionList.Item>
              <DescriptionList.Item label="Почта">{CLIENT.email}</DescriptionList.Item>
              <DescriptionList.Item label="Менеджер">{CLIENT.manager}</DescriptionList.Item>
            </DescriptionList.Root>
          </Drawer.Section>
          <Drawer.Section label="Открытые сделки" description="2 сделки на 1 620 000 ₽">
            <Drawer.Actions>
              <Button.Root variant="soft" tone="neutral">
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                Сделка
              </Button.Root>
            </Drawer.Actions>
            <DescriptionList.Root>
              {DEALS.map((deal) => (
                <DescriptionList.Item key={deal.id} label={deal.title}>
                  {deal.amount}
                </DescriptionList.Item>
              ))}
            </DescriptionList.Root>
          </Drawer.Section>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="soft" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Написать</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
