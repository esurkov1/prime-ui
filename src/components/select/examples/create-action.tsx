/** A client search with a pinned "new client" action: it stays under the list whatever the query, the arrows reach it after the last client, and it opens the form that adds and picks the new client — `Select.Action`, `searchable`. */
import { Button, Icon, Input, Modal, Select } from "prime-ui-kit";
import * as React from "react";

type Client = { value: string; name: string; city: string };

const CLIENTS: Client[] = [
  { value: "romashka", name: "ООО «Ромашка»", city: "Москва" },
  { value: "vector", name: "АО «Вектор»", city: "Санкт-Петербург" },
  { value: "severstroy", name: "ООО «Северстрой»", city: "Мурманск" },
  { value: "techno", name: "ИП Технопарк", city: "Казань" },
];

export default function SelectCreateActionExample() {
  const formId = React.useId();
  const [clients, setClients] = React.useState(CLIENTS);
  const [client, setClient] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string>();

  const startCreate = () => {
    // The query the person typed becomes the name to start from.
    setDraft(query.trim());
    setError(undefined);
    setCreating(true);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.trim();
    if (!name) {
      setError("Введите название клиента");
      return;
    }
    const value = `client-${clients.length + 1}`;
    setClients((current) => [...current, { value, name, city: "Город не указан" }]);
    setClient(value);
    setCreating(false);
  };

  return (
    <>
      <Select.Root
        label="Клиент"
        placeholder="Выберите клиента"
        value={client}
        onValueChange={setClient}
        search={query}
        onSearchChange={setQuery}
        labels={{ search: "Найти клиента" }}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          {clients.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              <Select.ItemText>{item.name}</Select.ItemText>
              <Select.ItemDescription>{item.city}</Select.ItemDescription>
            </Select.Item>
          ))}
          <Select.Action onSelect={startCreate}>
            <Select.ItemIcon>
              <Icon name="action.add" />
            </Select.ItemIcon>
            Новый клиент
          </Select.Action>
        </Select.Content>
      </Select.Root>
      <Modal.Root open={creating} onOpenChange={setCreating}>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Новый клиент</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id={formId} noValidate onSubmit={submit}>
              <Input.Root label="Название" required error={error}>
                <Input.Wrapper>
                  <Input.Field
                    value={draft}
                    autoFocus
                    onValueChange={(next) => {
                      setDraft(next);
                      setError(undefined);
                    }}
                  />
                </Input.Wrapper>
              </Input.Root>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="soft" tone="neutral">
                Отмена
              </Button.Root>
            </Modal.Close>
            <Button.Root type="submit" form={formId}>
              Добавить
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
