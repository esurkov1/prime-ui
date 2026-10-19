/** Rental deals as rich cards: a title row with the number and the owner, the vehicles with their terms, the next step as a plate, the facts, the source; the view menu hides card fields — `Kanban.ItemSection`, `Kanban.ItemTitle`, `Kanban.ItemResource`, `Kanban.ItemFact`, `KanbanFieldsMenu`. */
import {
  Avatar,
  Badge,
  Icon,
  Kanban,
  KanbanFieldsMenu,
  type PaletteColor,
  ProgressCircle,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Vehicle = {
  name: string;
  term: string;
  left: string;
  days: string;
  elapsed: number;
  overdue?: boolean;
};

type Deal = {
  id: string;
  number: string;
  client: string;
  owner: { initials: string; name: string; color: PaletteColor };
  vehicles: Vehicle[];
  task?: string;
  delivery: string;
  total: string;
  debt?: string;
  deposit: string;
  source: string;
  created: string;
};

const COLUMNS = [
  { id: "booked", title: "Забронировано", color: "blue" as const },
  { id: "issued", title: "Выдано", color: "green" as const },
];

const FIELDS = [
  { id: "vehicles", label: "Транспорт" },
  { id: "task", label: "Следующий шаг" },
  { id: "facts", label: "Доставка и оплата" },
  { id: "source", label: "Источник" },
];

const OWNER = { initials: "ЕС", name: "Евгений Смирнов", color: "green" as const };

const DEALS: Deal[] = [
  {
    id: "d866",
    number: "#866",
    client: "Bilal Rahman",
    owner: OWNER,
    vehicles: [
      {
        name: "Honda X-ADV 750 · ภข 1234",
        term: "10 окт → 10 дек",
        left: "ещё 52 дн.",
        days: "52 д",
        elapsed: 15,
      },
      {
        name: "Honda PCX 160 · ภก 5678",
        term: "20 окт → 27 окт",
        left: "через 1 дн.",
        days: "1 д",
        elapsed: 0,
      },
    ],
    task: "Выдать Honda PCX 160 завтра в 06:00",
    delivery: "Доставка · Аэропорт Пхукета, Банг Тао",
    total: "39 600 ฿",
    debt: "21 000 ฿",
    deposit: "Депозит 300 $",
    source: "Посев · Пхукет Аренда Авто, рекламная кампания октября",
    created: "15 окт",
  },
  {
    id: "d871",
    number: "#871",
    client: "Анна Кравец",
    owner: { initials: "ОБ", name: "Ольга Белова", color: "purple" },
    vehicles: [
      {
        name: "Yamaha NMAX 155 · กข 4410",
        term: "1 окт → 18 окт",
        left: "просрочен на 2 дн.",
        days: "−2 д",
        elapsed: 100,
        overdue: true,
      },
    ],
    task: "Забрать Yamaha NMAX — просрочен возврат",
    delivery: "Самовывоз · Офис Патонг",
    total: "8 500 ฿",
    deposit: "Депозит 5 000 ฿",
    source: "Сайт · Форма бронирования",
    created: "29 сен",
  },
];

const PLACEMENT = { booked: ["d866"], issued: ["d871"] };

export default function KanbanDealCardsExample() {
  const [hiddenFields, setHiddenFields] = React.useState<readonly string[]>([]);
  const shown = (field: string) => !hiddenFields.includes(field);
  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <span className={styles.spacer} />
        <KanbanFieldsMenu
          fields={FIELDS}
          hiddenFields={hiddenFields}
          onHiddenFieldsChange={setHiddenFields}
        />
      </div>
      <Kanban.Root
        aria-label="Сделки аренды"
        className={styles.board}
        columns={COLUMNS}
        items={DEALS}
        getId={(deal) => deal.id}
        getLabel={(deal) => `${deal.client}, сделка ${deal.number}`}
        defaultValue={PLACEMENT}
        renderItem={(deal) => (
          <Kanban.Item>
            <Kanban.ItemSection>
              <Kanban.ItemTitle number={deal.number}>
                {deal.client}
                <Avatar.Root size="s" color={deal.owner.color} aria-label={deal.owner.name}>
                  <Avatar.Fallback>{deal.owner.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Kanban.ItemTitle>
              {shown("vehicles")
                ? deal.vehicles.map((vehicle) => (
                    <Kanban.ItemResource
                      key={vehicle.name}
                      label={vehicle.name}
                      description={
                        <>
                          {vehicle.term} ·{" "}
                          {vehicle.overdue ? (
                            <Typography as="span" variant="caption" tone="danger">
                              {vehicle.left}
                            </Typography>
                          ) : (
                            vehicle.left
                          )}
                        </>
                      }
                    >
                      <ProgressCircle
                        value={vehicle.elapsed}
                        tone={vehicle.overdue ? "danger" : "accent"}
                        aria-label={`Срок аренды ${vehicle.name}`}
                      >
                        {vehicle.days}
                      </ProgressCircle>
                    </Kanban.ItemResource>
                  ))
                : null}
            </Kanban.ItemSection>
            <Kanban.ItemSection>
              {shown("task") && deal.task ? (
                <Badge.Root
                  fullWidth
                  tone={deal.vehicles.some((v) => v.overdue) ? "danger" : "warning"}
                >
                  {deal.task}
                </Badge.Root>
              ) : null}
              {shown("facts") ? (
                <>
                  <Kanban.ItemFact>
                    <Icon name="object.truck" />
                    {deal.delivery}
                  </Kanban.ItemFact>
                  <Kanban.ItemFact>
                    <Icon name="object.wallet" />
                    {deal.total} ·{" "}
                    {deal.debt ? (
                      <Typography as="span" variant="caption" tone="warning">
                        остаток {deal.debt}
                      </Typography>
                    ) : (
                      <Typography as="span" variant="caption" tone="success">
                        оплачено
                      </Typography>
                    )}
                  </Kanban.ItemFact>
                  <Kanban.ItemFact>
                    <Icon name="status.locked" />
                    {deal.deposit}
                  </Kanban.ItemFact>
                </>
              ) : null}
            </Kanban.ItemSection>
            <Kanban.ItemSection>
              {shown("source") ? (
                <Kanban.ItemFooter>
                  <Kanban.ItemCount>
                    <Icon name="object.globe" />
                  </Kanban.ItemCount>
                  <span>{deal.source}</span>
                  <span>{deal.created}</span>
                </Kanban.ItemFooter>
              ) : null}
            </Kanban.ItemSection>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
