/** A search field with `focusRing={false}`: the caret and the lighter fill show focus. Use it only for a single search field where focus is otherwise obvious. */
import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

export default function InputSearchWithoutFocusRingExample() {
  const [query, setQuery] = React.useState("");

  return (
    <Input.Root focusRing={false}>
      <Input.Wrapper>
        <Input.Icon side="start">
          <Icon name="action.search" tone="secondary" />
        </Input.Icon>
        <Input.Field
          type="search"
          aria-label="Поиск"
          placeholder="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
      </Input.Wrapper>
    </Input.Root>
  );
}
