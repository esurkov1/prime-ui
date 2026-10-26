/** A client's history in chapters by deal: each section names its deal with the deal's number and stage on the heading's line, a link to the deal at its end, the deal's events under it — `Drawer.Section`, `number`, `Drawer.Badges`, `Drawer.Actions`. */
import { Badge, Button, Drawer, LinkButton, Timeline } from "prime-ui-kit";

const DEALS = [
  {
    id: 852,
    name: "Сделка 15 окт",
    stage: { label: "Аренда", color: "blue" },
    events: [
      { id: 1, title: "Продление на 7 дней", date: "21.10.26", time: "14:20" },
      { id: 2, title: "Оплата аренды", date: "15.10.26", time: "09:05" },
      { id: 3, title: "Выдача автомобиля", date: "15.10.26", time: "08:40" },
    ],
  },
  {
    id: 799,
    name: "Сделка 2 авг",
    stage: { label: "Закрыта", color: "gray" },
    events: [
      { id: 4, title: "Возврат залога", date: "30.08.26", time: "17:10" },
      { id: 5, title: "Приёмка автомобиля", date: "30.08.26", time: "16:45" },
    ],
  },
] as const;

export default function DrawerHistoryExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          История клиента
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Анна Соколова</Drawer.Title>
          <Drawer.Description>2 сделки · 5 событий</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          {DEALS.map((deal) => (
            <Drawer.Section key={deal.id} label={deal.name} number={`#${deal.id}`}>
              <Drawer.Badges>
                <Badge.Root color={deal.stage.color}>{deal.stage.label}</Badge.Root>
              </Drawer.Badges>
              <Drawer.Actions>
                <LinkButton href={`#deal-${deal.id}`}>Открыть</LinkButton>
              </Drawer.Actions>
              <Timeline.Root>
                {deal.events.map((event) => (
                  <Timeline.Item key={event.id}>
                    <Timeline.ItemTitle>{event.title}</Timeline.ItemTitle>
                    <Timeline.ItemMeta>{event.date}</Timeline.ItemMeta>
                    <Timeline.ItemValue>{event.time}</Timeline.ItemValue>
                  </Timeline.Item>
                ))}
              </Timeline.Root>
            </Drawer.Section>
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
