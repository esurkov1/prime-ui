/** `axis="x"`: a single row of `Badge` chips reordered by dragging sideways. The item wraps a Badge and takes its radius, so the drop gap has the badge's shape. Use for filters, keywords and tag strips whose order matters. */
import { Badge, Dnd, moveBefore } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

const INITIAL = [
  { id: "all", title: "Все" },
  { id: "new", title: "Новые" },
  { id: "doing", title: "В работе" },
  { id: "review", title: "На ревью" },
  { id: "done", title: "Готово" },
  { id: "archive", title: "Архив" },
];

export default function DndHorizontalExample() {
  const [tags, setTags] = useState(INITIAL);

  return (
    <Dnd.Root>
      <Dnd.Sortable
        axis="x"
        as="ul"
        aria-label="Порядок фильтров"
        className={styles.chips}
        items={tags}
        getId={(tag) => tag.id}
        getLabel={(tag) => tag.title}
        onReorder={(id, beforeId) =>
          setTags((current) => moveBefore(current, id, beforeId, (tag) => tag.id))
        }
        renderItem={(tag) => (
          <Dnd.SortableItem id={tag.id} className={styles.tagItem}>
            <Badge.Root>{tag.title}</Badge.Root>
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}
