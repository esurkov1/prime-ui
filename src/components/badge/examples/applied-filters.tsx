/** Applied filters: each badge drops its filter and names it for screen readers — `onRemove`, `labels`. */
import { Badge, Button, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INITIAL = ["Москва", "Санкт-Петербург", "Есть в наличии", "До 5 000 ₽"];

export default function BadgeAppliedFiltersExample() {
  const [filters, setFilters] = React.useState(INITIAL);
  const titleId = React.useId();

  return (
    <section className={styles.filters} aria-labelledby={titleId}>
      <div className={styles.filtersHeader}>
        <Typography.Root as="h3" variant="title-s" id={titleId}>
          Фильтры
        </Typography.Root>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size="s"
          onClick={() => setFilters(filters.length > 0 ? [] : INITIAL)}
        >
          {filters.length > 0 ? "Сбросить все" : "Вернуть"}
        </Button.Root>
      </div>
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
        </div>
      ) : (
        <Typography.Root variant="body-s" tone="muted">
          Фильтры не выбраны — показаны все товары.
        </Typography.Root>
      )}
    </section>
  );
}
