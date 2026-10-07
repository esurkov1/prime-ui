/** The parent owns the value: a clear button and a character counter follow it — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`. */
import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

const TITLE_LIMIT = 60;

export default function InputControlledExample() {
  const [query, setQuery] = React.useState("");
  const [title, setTitle] = React.useState("Еженедельный отчёт по продажам");

  return (
    <>
      <Input.Root label="Поиск по каталогу">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="action.search" tone="secondary" />
          </Input.Icon>
          <Input.Field
            type="search"
            placeholder="Название или артикул"
            value={query}
            onValueChange={setQuery}
          />
          {query ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="Название отчёта"
        hint="Видно всем участникам"
        error={title.length > TITLE_LIMIT ? "Сократите название до 60 символов" : undefined}
        counter={<Input.Counter current={title.length} max={TITLE_LIMIT} />}
      >
        <Input.Wrapper>
          <Input.Field value={title} onValueChange={setTitle} />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
