/** A row of status filters in a 320 px strip: tags reorder sideways and the strip scrolls when a tag is held near its edge — `axis`. */
import { Badge, Dnd, moveBefore, ScrollContainer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FILTERS = [
  { id: "all", title: "Все заказы" },
  { id: "new", title: "Новые" },
  { id: "paid", title: "Оплаченные" },
  { id: "shipping", title: "В доставке" },
  { id: "done", title: "Доставленные" },
  { id: "refund", title: "Возвраты" },
];

export default function DndNarrowExample() {
  const [filters, setFilters] = React.useState(FILTERS);

  return (
    <Dnd.Root>
      <ScrollContainer axis="horizontal" fade className={styles.strip}>
        <Dnd.Sortable
          axis="x"
          as="ul"
          aria-label="Порядок фильтров"
          className={styles.chips}
          items={filters}
          getId={(filter) => filter.id}
          getLabel={(filter) => filter.title}
          onReorder={(id, beforeId) =>
            setFilters((current) => moveBefore(current, id, beforeId, (filter) => filter.id))
          }
          renderItem={(filter) => (
            <Dnd.SortableItem id={filter.id} className={styles.chip}>
              <Badge.Root>{filter.title}</Badge.Root>
            </Dnd.SortableItem>
          )}
        />
      </ScrollContainer>
    </Dnd.Root>
  );
}
