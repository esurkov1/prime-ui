import * as React from "react";
import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function InputControlledSnippet() {
  const [query, setQuery] = React.useState("");

  return (
    <Input.Root
      label="Поиск по каталогу"
      hint={query ? `Сейчас в поле: «${query}»` : "Значение хранится в useState родителя"}
    >
      <Input.Wrapper>
        <Input.Icon side="start">
          <Icon name="nav.layoutGrid" size="s" tone="subtle" />
        </Input.Icon>
        <Input.Field
          placeholder="Название или артикул"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по каталогу"
        />
      </Input.Wrapper>
    </Input.Root>
  );
}
