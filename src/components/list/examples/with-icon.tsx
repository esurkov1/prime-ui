/** Leading avatars of clients and icons of queues; an avatar takes the row tier — `List.ItemIcon`. */
import { Avatar, Icon, List, Typography } from "prime-ui-kit";

const CLIENTS = [
  { id: "belova", name: "Ирина Белова", company: "ООО «Гранит»", initials: "ИБ", color: "blue" },
  { id: "orlov", name: "Павел Орлов", company: "ООО «Лето»", initials: "ПО", color: "green" },
  { id: "kozlov", name: "Сергей Козлов", company: "ИП Козлов", initials: "СК", color: "orange" },
] as const;

export default function ListWithIconExample() {
  return (
    <div>
      <div>
        <div>
          <List.Root aria-label="Клиенты">
            {CLIENTS.map((client, index) => (
              <List.Item key={client.id} current={index === 0}>
                <List.ItemIcon>
                  <Avatar.Root color={client.color}>
                    <Avatar.Fallback>{client.initials}</Avatar.Fallback>
                  </Avatar.Root>
                </List.ItemIcon>
                <List.ItemText>{client.name}</List.ItemText>
                <List.ItemDescription>{client.company}</List.ItemDescription>
              </List.Item>
            ))}
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Avatar.Root
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Очереди">
            <List.Item current>
              <List.ItemIcon>
                <Icon name="object.headset" />
              </List.ItemIcon>
              <List.ItemText>Поддержка</List.ItemText>
              <List.ItemCount color="blue">8</List.ItemCount>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Icon name="object.receipt" />
              </List.ItemIcon>
              <List.ItemText>Биллинг</List.ItemText>
              <List.ItemCount>3</List.ItemCount>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Icon name="object.truck" />
              </List.ItemIcon>
              <List.ItemText>Доставка</List.ItemText>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Icon
          </Typography>
        </div>
      </div>
    </div>
  );
}
