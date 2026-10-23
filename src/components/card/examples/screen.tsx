/** An orders page of cards: the title with its line of data, the status filter and the new-order button in the top bar, one grid of record cards that cross-fades when the filter changes and loads as skeleton cards of the same geometry — `Page.TopBar`, `Crossfade`, `Skeleton`, `Card.Link`. */
import {
  Badge,
  Button,
  Card,
  Crossfade,
  DescriptionList,
  Dropdown,
  Icon,
  Page,
  SegmentedControl,
  Skeleton,
  StatusDot,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Filter = "all" | "unpaid" | "paid";
type Order = {
  id: string;
  client: string;
  manager: string;
  date: string;
  items: number;
  sum: string;
  paid: boolean;
  urgent: boolean;
};

const LOAD_MS = 1200;

const ORDERS: Order[] = [
  {
    id: "4821",
    client: "ООО «Северный ветер»",
    manager: "Анна Котова",
    date: "7 окт.",
    items: 12,
    sum: "184 500 ₽",
    paid: false,
    urgent: true,
  },
  {
    id: "4820",
    client: "ООО «Гранит»",
    manager: "Илья Соколов",
    date: "7 окт.",
    items: 4,
    sum: "256 000 ₽",
    paid: true,
    urgent: false,
  },
  {
    id: "4819",
    client: "ИП Козлов",
    manager: "Мария Морозова",
    date: "6 окт.",
    items: 2,
    sum: "12 000 ₽",
    paid: false,
    urgent: false,
  },
  {
    id: "4818",
    client: "ООО «Лето»",
    manager: "Анна Котова",
    date: "5 окт.",
    items: 31,
    sum: "412 300 ₽",
    paid: true,
    urgent: false,
  },
  {
    id: "4817",
    client: "АО «Волга-Энерго»",
    manager: "Илья Соколов",
    date: "3 окт.",
    items: 7,
    sum: "95 800 ₽",
    paid: false,
    urgent: false,
  },
  {
    id: "4816",
    client: "ООО «Мостострой»",
    manager: "Мария Морозова",
    date: "2 окт.",
    items: 9,
    sum: "128 400 ₽",
    paid: true,
    urgent: false,
  },
];

const SKELETON_CARDS = ["a", "b", "c", "d", "e", "f"];

export default function CardScreenExample() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const shown = ORDERS.filter((order) => filter === "all" || (filter === "paid") === order.paid);
  const unpaid = ORDERS.filter((order) => !order.paid).length;

  return (
    <Page.Root>
      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Заказы</Page.Title>
          <Page.Description loading={loading}>
            {ORDERS.length} за неделю · {unpaid} ждут оплаты
          </Page.Description>
        </Page.Heading>
        <Page.Tools aria-label="Заказы">
          <SegmentedControl.Root
            aria-label="Статус оплаты"
            value={filter}
            onValueChange={(next) => setFilter(next as Filter)}
          >
            <SegmentedControl.Item value="all">Все</SegmentedControl.Item>
            <SegmentedControl.Item value="unpaid">Ждут оплаты</SegmentedControl.Item>
            <SegmentedControl.Item value="paid">Оплачены</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Page.Tools>
        <Page.Actions>
          <Button.Root>
            <Button.Icon>
              <Icon name="object.package" />
            </Button.Icon>
            Новый заказ
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
      <Page.Body>
        <Crossfade state={loading ? "loading" : filter}>
          {loading ? (
            <div className={styles.grid} aria-busy="true">
              {SKELETON_CARDS.map((key) => (
                <Card.Root key={key}>
                  <Card.Header>
                    <Card.Title as="span">
                      <Skeleton />
                    </Card.Title>
                    <Card.Description>
                      <Skeleton />
                    </Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <Skeleton lines={3} />
                  </Card.Body>
                  <Card.Footer>
                    <Skeleton />
                  </Card.Footer>
                </Card.Root>
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {shown.map((order) => (
                <Card.Root key={order.id}>
                  <Card.Header>
                    <Card.Icon>
                      <Icon name="object.package" />
                    </Card.Icon>
                    <Card.Title>
                      <Card.Link href={`#order-${order.id}`}>Заказ № {order.id}</Card.Link>
                    </Card.Title>
                    {order.urgent ? (
                      <Card.Badges>
                        <Badge.Root tone="warning">Срочно</Badge.Root>
                      </Card.Badges>
                    ) : null}
                    <Card.Description>
                      <StatusDot tone={order.paid ? "success" : "warning"}>
                        {order.paid ? "Оплачен" : "Ждёт оплаты"}
                      </StatusDot>
                      {order.date}
                    </Card.Description>
                    <Card.Actions>
                      <Dropdown.Root>
                        <Dropdown.Trigger>
                          <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                            <Button.Icon>
                              <Icon name="action.more" />
                            </Button.Icon>
                          </Button.Root>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="end">
                          <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
                          <Dropdown.Item>Скачать накладную</Dropdown.Item>
                        </Dropdown.Content>
                      </Dropdown.Root>
                    </Card.Actions>
                  </Card.Header>
                  <Card.Body>
                    <DescriptionList.Root align="end">
                      <DescriptionList.Item label="Клиент">{order.client}</DescriptionList.Item>
                      <DescriptionList.Item label="Менеджер">{order.manager}</DescriptionList.Item>
                      <DescriptionList.Item label="Позиций">{order.items}</DescriptionList.Item>
                    </DescriptionList.Root>
                  </Card.Body>
                  <Card.Footer>
                    <Card.Total
                      label={order.paid ? "Оплачено" : "К оплате"}
                      tone={order.paid ? "success" : "warning"}
                    >
                      {order.sum}
                    </Card.Total>
                    {order.paid ? null : (
                      <Card.Actions>
                        <Button.Root>Выставить счёт</Button.Root>
                      </Card.Actions>
                    )}
                  </Card.Footer>
                </Card.Root>
              ))}
            </div>
          )}
        </Crossfade>
      </Page.Body>
    </Page.Root>
  );
}
