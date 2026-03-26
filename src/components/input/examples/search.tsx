import * as React from "react";
import { Icon, Input } from "prime-ui-kit";

/**
 * Поиск: контролируемое значение и иконка слева.
 */
export default function SearchExample() {
  const [query, setQuery] = React.useState("");

  return (
    <Input.Root
      size="m"
      label="Поиск по каталогу"
      hint={query ? `Запрос: «${query}»` : "Введите название или артикул"}
    >
      <Input.Wrapper>
        <Input.Icon side="start">
          <Icon name="nav.layoutGrid" size="s" tone="subtle" />
        </Input.Icon>
        <Input.Field
          type="search"
          name="q"
          placeholder="Название или артикул"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Input.Wrapper>
    </Input.Root>
  );
}
