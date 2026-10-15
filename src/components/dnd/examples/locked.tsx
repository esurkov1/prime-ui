/** Sections of a workspace menu: the home section is pinned first with a lock in place of its grip, the rest reorder around nothing past it; each row is named by its visible title — `locked`, `handle`, `aria-labelledby`. */
import { Dnd, moveBefore, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Section = { id: string; title: string; description: string; pinned?: boolean };

const SECTIONS: Section[] = [
  { id: "home", title: "Главная", description: "Всегда первая в меню", pinned: true },
  { id: "orders", title: "Заказы", description: "Новые и в работе" },
  { id: "invoices", title: "Счета", description: "Выставленные и оплаченные" },
  { id: "clients", title: "Клиенты", description: "Компании и контакты" },
  { id: "reports", title: "Отчёты", description: "Продажи и склад" },
];

export default function DndLockedExample() {
  const [sections, setSections] = React.useState(SECTIONS);
  const uid = React.useId();

  return (
    <Dnd.Root>
      <Dnd.Sortable
        as="ul"
        handle
        aria-label="Порядок разделов меню"
        className={styles.list}
        items={sections}
        getId={(section) => section.id}
        getLabel={(section) => section.title}
        onReorder={(id, beforeId) =>
          setSections((current) => moveBefore(current, id, beforeId, (section) => section.id))
        }
        renderItem={(section) => (
          <Dnd.SortableItem
            id={section.id}
            locked={section.pinned ?? false}
            className={styles.handleRow}
            // Named and described by what it shows: `aria-label` here would hide the row's text.
            aria-labelledby={`${uid}-${section.id}`}
            aria-describedby={`${uid}-${section.id}-note`}
          >
            <span className={styles.rowText}>
              <Typography as="span" variant="body-m" id={`${uid}-${section.id}`}>
                {section.title}
              </Typography>
              <Typography as="span" variant="caption" tone="muted" id={`${uid}-${section.id}-note`}>
                {section.description}
              </Typography>
            </span>
            <Dnd.Handle aria-label={`Переместить раздел «${section.title}»`} />
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}
