/** Controlled value with a clear button and a character counter in the support row. Use it for search fields and length-limited text. */
import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX = 60;

export default function InputControlledExample() {
  const [query, setQuery] = React.useState("");
  const [title, setTitle] = React.useState("Еженедельный отчёт по продажам");

  return (
    <div className={styles.stack}>
      <Input.Root label="Поиск по каталогу">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="action.search" tone="secondary" />
          </Input.Icon>
          <Input.Field
            placeholder="Название или артикул"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="Название отчёта"
        hint="Видно всем участникам"
        error={title.length > MAX ? "Слишком длинное название" : undefined}
        counter={<Input.Counter current={title.length} max={MAX} />}
      >
        <Input.Wrapper>
          <Input.Field value={title} onChange={(e) => setTitle(e.target.value)} />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
