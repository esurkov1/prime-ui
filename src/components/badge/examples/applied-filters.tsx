/** Applied filters: each badge drops its filter and names it for screen readers — `onRemove`, `labels`. */
import { Badge, Button, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INITIAL = ["Москва", "Санкт-Петербург", "Есть в наличии", "До 5 000 ₽"];

export default function BadgeAppliedFiltersExample() {
  const [filters, setFilters] = React.useState(INITIAL);

  return (
    <div className={styles.filters}>
      {filters.length > 0 ? (
        <div className={styles.badges}>
          {filters.map((label) => (
            <Badge.Root
              labels={{ remove: `Убрать фильтр «${label}»` }}
              key={label}
              onRemove={() => setFilters((prev) => prev.filter((item) => item !== label))}
            >
              {label}
            </Badge.Root>
          ))}
          <Button.Root variant="soft" tone="neutral" size="s" onClick={() => setFilters([])}>
            Сбросить все
          </Button.Root>
        </div>
      ) : (
        <div className={styles.badges}>
          <Typography variant="body-s" tone="muted">
            Фильтры не выбраны — показаны все товары.
          </Typography>
          <Button.Root variant="soft" tone="neutral" size="s" onClick={() => setFilters(INITIAL)}>
            Вернуть
          </Button.Root>
        </div>
      )}
    </div>
  );
}
