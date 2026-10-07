/** Reorderable list: the whole row is the grip. `Dnd.Root` once above, `Dnd.Sortable` with `getId` and `onReorder`, and `moveBefore` to apply the move. Use for ordered settings, priorities and menus. Alt+↑/↓ moves the focused row from the keyboard. */
import { Card, Dnd, Kbd, moveBefore, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

const INITIAL = [
  { id: "brief", title: "Согласовать бриф", meta: "Сегодня" },
  { id: "design", title: "Макеты главной страницы", meta: "Завтра" },
  { id: "build", title: "Вёрстка и интеграция", meta: "Через 3 дня" },
  { id: "review", title: "Ревью и правки", meta: "Через неделю" },
  { id: "launch", title: "Запуск", meta: "Через 2 недели" },
];

export default function DndSortableListExample() {
  const [items, setItems] = useState(INITIAL);

  return (
    <Dnd.Root>
      <Card.Root className={styles.card}>
        <Card.SectionHeader>
          <Card.SectionTitle>Порядок задач</Card.SectionTitle>
        </Card.SectionHeader>
        <Card.Body>
          <Dnd.Sortable
            as="ul"
            aria-label="Задачи проекта"
            items={items}
            getId={(item) => item.id}
            getLabel={(item) => item.title}
            onReorder={(id, beforeId) =>
              setItems((current) => moveBefore(current, id, beforeId, (item) => item.id))
            }
            renderItem={(item) => (
              <Dnd.SortableItem id={item.id} className={styles.row}>
                <span className={styles.rowText}>
                  <Typography.Root as="span" variant="body-m" truncate>
                    {item.title}
                  </Typography.Root>
                  <Typography.Root as="span" variant="caption" tone="muted">
                    {item.meta}
                  </Typography.Root>
                </span>
              </Dnd.SortableItem>
            )}
          />
          <Typography.Root as="p" variant="caption" tone="muted" className={styles.hint}>
            С клавиатуры: <Kbd.Root>Alt</Kbd.Root> + <Kbd.Root>↑</Kbd.Root> / <Kbd.Root>↓</Kbd.Root>
          </Typography.Root>
        </Card.Body>
      </Card.Root>
    </Dnd.Root>
  );
}
