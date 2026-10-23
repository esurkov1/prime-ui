/** Leading avatars of clients, icons of queues, devices of sessions, rental terms and colour dots of projects; beside two lines an avatar and a ring are as tall as the lines and an icon stands on a tile, a dot in an icon-wide box — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Badge.Dot`. */
import { Avatar, Badge, Icon, List, ProgressCircle, Typography } from "prime-ui-kit";

const CLIENTS = [
  { id: "belova", name: "Ирина Белова", company: "ООО «Гранит»", initials: "ИБ", color: "blue" },
  { id: "orlov", name: "Павел Орлов", company: "ООО «Лето»", initials: "ПО", color: "green" },
  { id: "kozlov", name: "Сергей Козлов", company: "ИП Козлов", initials: "СК", color: "orange" },
] as const;

const SESSIONS = [
  {
    id: "mac",
    device: "Chrome · macOS",
    place: "Москва · это устройство",
    icon: "viewport.desktop",
  },
  {
    id: "iphone",
    device: "Safari · iPhone",
    place: "Казань · вчера в 21:40",
    icon: "viewport.mobile",
  },
] as const;

const RENTALS = [
  { id: "nmax", bike: "Yamaha NMAX 155", left: "Осталось 8 дней", term: 72 },
  { id: "adv", bike: "Honda ADV 350", left: "Осталось 2 дня", term: 93 },
] as const;

const PROJECTS = [
  { id: "crm", name: "Внедрение CRM", color: "purple" },
  { id: "portal", name: "Клиентский портал", color: "teal" },
  { id: "billing", name: "Биллинг", color: "orange" },
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
        <div>
          <List.Root aria-label="Сеансы">
            {SESSIONS.map((session) => (
              <List.Item key={session.id}>
                <List.ItemIcon>
                  <Icon name={session.icon} />
                </List.ItemIcon>
                <List.ItemText>{session.device}</List.ItemText>
                <List.ItemDescription>{session.place}</List.ItemDescription>
              </List.Item>
            ))}
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Icon · ItemDescription
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Аренды">
            {RENTALS.map((rental) => (
              <List.Item key={rental.id}>
                <List.ItemIcon>
                  <ProgressCircle value={rental.term} aria-label={`Срок аренды: ${rental.term}%`} />
                </List.ItemIcon>
                <List.ItemText>{rental.bike}</List.ItemText>
                <List.ItemDescription>{rental.left}</List.ItemDescription>
              </List.Item>
            ))}
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            ProgressCircle · ItemDescription
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Проекты">
            {PROJECTS.map((project, index) => (
              <List.Item key={project.id} current={index === 0}>
                <List.ItemIcon>
                  <Badge.Dot color={project.color} />
                </List.ItemIcon>
                <List.ItemText>{project.name}</List.ItemText>
              </List.Item>
            ))}
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Badge.Dot
          </Typography>
        </div>
      </div>
    </div>
  );
}
