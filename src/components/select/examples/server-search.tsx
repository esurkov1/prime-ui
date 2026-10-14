/** A client out of thousands: the parent searches on the server as the query changes and loads the next page at the end of the list — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`. */
import { Select } from "prime-ui-kit";
import * as React from "react";

type Client = { id: string; name: string; inn: string };

const NAMES = [
  "Вектор",
  "Северсталь-Сервис",
  "Альфа-Логистик",
  "Балтийский берег",
  "Гранит",
  "Деловые линии",
  "Енисей-Агро",
  "Звезда",
  "Империя вкуса",
  "Кедр",
  "Ладога",
  "Меридиан",
];
const FORMS = ["ООО", "АО", "ИП"];
const REGIONS = ["Москва", "Казань", "Пермь", "Тула", "Омск"];
const PAGE_SIZE = 15;
const LATENCY_MS = 500;

const CLIENTS: Client[] = Array.from({ length: NAMES.length * REGIONS.length }, (_, i) => ({
  id: `client-${i + 1}`,
  name: `${FORMS[i % FORMS.length]} «${NAMES[i % NAMES.length]}», ${REGIONS[Math.floor(i / NAMES.length)]}`,
  inn: String(7701000000 + i * 7919),
}));

/** What the server answers: clients whose name or INN contain the query. */
function findClients(query: string): Client[] {
  const text = query.trim().toLocaleLowerCase();
  return CLIENTS.filter(
    (client) => client.name.toLocaleLowerCase().includes(text) || client.inn.includes(text),
  );
}

export default function SelectServerSearchExample() {
  const [search, setSearch] = React.useState("");
  const [clients, setClients] = React.useState<Client[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const pageTimer = React.useRef(0);

  // A new query asks the server after a pause; the results on screen stay until the answer. A
  // next page still on its way belongs to the old query: it is dropped.
  React.useEffect(() => {
    window.clearTimeout(pageTimer.current);
    setLoadingMore(false);
    setLoading(true);
    const timer = window.setTimeout(() => {
      const found = findClients(search);
      setClients(found.slice(0, PAGE_SIZE));
      setTotal(found.length);
      setLoading(false);
    }, LATENCY_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadMore = () => {
    setLoadingMore(true);
    pageTimer.current = window.setTimeout(() => {
      setClients((shown) => findClients(search).slice(0, shown.length + PAGE_SIZE));
      setLoadingMore(false);
    }, LATENCY_MS);
  };

  return (
    <Select.Root
      label="Клиент"
      placeholder="Выберите клиента"
      search={search}
      onSearchChange={setSearch}
      filter={false}
      loading={loading}
      hasMore={clients.length < total}
      loadingMore={loadingMore}
      onLoadMore={loadMore}
      labels={{ search: "Название или ИНН" }}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content searchable>
        {clients.map((client) => (
          <Select.Item key={client.id} value={client.id} label={client.name}>
            <Select.ItemText>{client.name}</Select.ItemText>
            <Select.ItemDescription>ИНН {client.inn}</Select.ItemDescription>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
