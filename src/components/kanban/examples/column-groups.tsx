/** A deal board whose stages stand in phases, each phase titled over its columns, and a stage moves only within its phase — `columnGroups`, `reorderableColumns`, `columnOrder`, `onColumnOrderChange`. */
import { Kanban, type KanbanColumn, type KanbanColumnGroup, type KanbanValue } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Deal = { id: string; client: string; unit: string };

const COLUMNS: KanbanColumn[] = [
  { id: "new", title: "Новая заявка", color: "blue" },
  { id: "qualify", title: "Квалификация", color: "blue" },
  { id: "offer", title: "Предложение", color: "purple" },
  { id: "negotiation", title: "Согласование", color: "purple" },
  { id: "booked", title: "Бронь", color: "yellow" },
  { id: "active", title: "В аренде", color: "green" },
  { id: "extended", title: "Продление", color: "green" },
  { id: "closed", title: "Закрыта", color: "gray" },
  { id: "lost", title: "Отказ", color: "red" },
];

const GROUPS: KanbanColumnGroup[] = [
  { id: "fresh", title: "Новые", columnIds: ["new", "qualify"] },
  { id: "work", title: "В работе", columnIds: ["offer", "negotiation"] },
  { id: "booking", title: "Бронь", columnIds: ["booked"] },
  { id: "rent", title: "Аренда", columnIds: ["active", "extended"] },
  { id: "done", title: "Закрытые", columnIds: ["closed", "lost"] },
];

const DEALS: Deal[] = [
  { id: "DL-412", client: "ООО «Север»", unit: "Тягач MAN, 3 суток" },
  { id: "DL-409", client: "ИП Лебедев", unit: "Фургон Ford, неделя" },
  { id: "DL-405", client: "АО «Гранит»", unit: "Самосвал КамАЗ, месяц" },
  { id: "DL-398", client: "ООО «Вектор»", unit: "Манипулятор, 2 суток" },
  { id: "DL-391", client: "ГК «Меридиан»", unit: "Рефрижератор, неделя" },
  { id: "DL-377", client: "ООО «Логист»", unit: "Тягач Volvo, месяц" },
];

const PLACEMENT: KanbanValue = {
  new: ["DL-412"],
  qualify: ["DL-409"],
  offer: ["DL-405"],
  negotiation: ["DL-398"],
  booked: ["DL-391"],
  active: ["DL-377"],
};

export default function KanbanColumnGroupsExample() {
  const [placement, setPlacement] = React.useState<KanbanValue>(PLACEMENT);
  const [order, setOrder] = React.useState<readonly string[]>(COLUMNS.map((column) => column.id));

  return (
    <Kanban.Root
      aria-label="Сделки по фазам"
      className={styles.board}
      columns={COLUMNS}
      columnGroups={GROUPS}
      items={DEALS}
      getId={(deal) => deal.id}
      getLabel={(deal) => deal.client}
      value={placement}
      onValueChange={setPlacement}
      reorderableColumns
      columnOrder={order}
      onColumnOrderChange={setOrder}
      renderItem={(deal) => (
        <Kanban.Item>
          <Kanban.ItemTitle>{deal.client}</Kanban.ItemTitle>
          <Kanban.ItemDescription>
            {deal.id} · {deal.unit}
          </Kanban.ItemDescription>
        </Kanban.Item>
      )}
    />
  );
}
