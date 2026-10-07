/** A single search field where the caret and the lighter fill show focus — `focusRing`. */
import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

export default function InputWithoutFocusRingExample() {
  const [query, setQuery] = React.useState("");

  return (
    <Input.Root focusRing={false}>
      <Input.Wrapper>
        <Input.Icon side="start">
          <Icon name="action.search" tone="secondary" />
        </Input.Icon>
        <Input.Field
          type="search"
          aria-label="Поиск по заказам"
          placeholder="Поиск по заказам"
          value={query}
          onValueChange={setQuery}
        />
        {query ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
      </Input.Wrapper>
    </Input.Root>
  );
}
