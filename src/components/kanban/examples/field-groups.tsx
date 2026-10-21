/** Rental deals whose view menu groups the card fields by zone of the card: each group has its heading, a field moves only within its group, and each zone of a card draws its shown fields in their order — `KanbanFieldsMenu`, `fields`, `fieldOrder`, `Kanban.ItemSection`. */
import { Badge, Icon, Kanban, type KanbanField, KanbanFieldsMenu } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Deal = {
  id: string;
  number: string;
  client: string;
  vehicle: string;
  step: string;
  total: string;
  deposit: string;
  source: string;
};

const COLUMNS = [
  { id: "booked", title: "Забронировано", color: "blue" as const },
  { id: "issued", title: "Выдано", color: "green" as const },
];

/** The groups are the zones of a card: «Сделка» on top, «Деньги» under it. */
const FIELDS: KanbanField[] = [
  { id: "vehicle", label: "Транспорт", group: "Сделка" },
  { id: "step", label: "Следующий шаг", group: "Сделка" },
  { id: "source", label: "Источник", group: "Сделка" },
  { id: "total", label: "Сумма", group: "Деньги" },
  { id: "deposit", label: "Депозит", group: "Деньги" },
];

const FIELD_IDS = FIELDS.map((field) => field.id);
const DEAL_ZONE = new Set(["vehicle", "step", "source"]);

const DEALS: Deal[] = [
  {
    id: "d866",
    number: "#866",
    client: "Bilal Rahman",
    vehicle: "Honda PCX 160 · 20 окт → 27 окт",
    step: "Выдать завтра в 10:00",
    total: "8 500 ฿",
    deposit: "Депозит 5 000 ฿",
    source: "Сайт · Форма бронирования",
  },
  {
    id: "d871",
    number: "#871",
    client: "Анна Котова",
    vehicle: "Honda X-ADV 750 · 10 окт → 10 дек",
    step: "Продлить договор",
    total: "39 600 ฿",
    deposit: "Депозит 300 $",
    source: "Посев · Пхукет Аренда Авто",
  },
];

const PLACEMENT = { booked: ["d866"], issued: ["d871"] };

/** One card part by its field id. */
function fieldPart(field: string, deal: Deal) {
  if (field === "step") {
    return (
      <Badge.Root key={field} fullWidth tone="warning">
        {deal.step}
      </Badge.Root>
    );
  }
  const icon =
    field === "vehicle"
      ? "object.motorbike"
      : field === "source"
        ? "object.globe"
        : field === "total"
          ? "object.wallet"
          : "status.locked";
  return (
    <Kanban.ItemFact key={field}>
      <Icon name={icon} />
      {deal[field as "vehicle" | "source" | "total" | "deposit"]}
    </Kanban.ItemFact>
  );
}

export default function KanbanFieldGroupsExample() {
  const [hiddenFields, setHiddenFields] = React.useState<readonly string[]>(["source"]);
  const [fieldOrder, setFieldOrder] = React.useState<readonly string[]>([]);
  const order = fieldOrder.length > 0 ? fieldOrder : FIELD_IDS;
  const shown = order.filter((field) => !hiddenFields.includes(field));

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <span className={styles.spacer} />
        <KanbanFieldsMenu
          fields={FIELDS}
          hiddenFields={hiddenFields}
          defaultHiddenFields={["source"]}
          onHiddenFieldsChange={setHiddenFields}
          fieldOrder={fieldOrder}
          onFieldOrderChange={setFieldOrder}
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
              <Kanban.ItemTitle number={deal.number}>{deal.client}</Kanban.ItemTitle>
              {shown.filter((field) => DEAL_ZONE.has(field)).map((field) => fieldPart(field, deal))}
            </Kanban.ItemSection>
            <Kanban.ItemSection>
              {shown
                .filter((field) => !DEAL_ZONE.has(field))
                .map((field) => fieldPart(field, deal))}
            </Kanban.ItemSection>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
