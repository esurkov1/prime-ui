/** The options failed to load: the list says so in place and a retry loads them again — `loadError`, `onRetry`, `loading`. */
import { Select } from "prime-ui-kit";
import * as React from "react";

type LoadState = "error" | "loading" | "ready";

const WAREHOUSES = [
  { value: "msk-1", label: "Москва, Южный порт" },
  { value: "spb-1", label: "Санкт-Петербург, Шушары" },
  { value: "ekb-1", label: "Екатеринбург, Кольцово" },
  { value: "kzn-1", label: "Казань, Зеленодольск" },
];
const LATENCY_MS = 800;

export default function SelectLoadErrorExample() {
  const [state, setState] = React.useState<LoadState>("error");

  const retry = () => {
    setState("loading");
    window.setTimeout(() => setState("ready"), LATENCY_MS);
  };

  return (
    <Select.Root
      label="Склад отгрузки"
      placeholder="Выберите склад"
      loading={state === "loading"}
      loadError={state === "error" ? "Не удалось загрузить склады" : undefined}
      onRetry={retry}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {state === "ready"
          ? WAREHOUSES.map((warehouse) => (
              <Select.Item key={warehouse.value} value={warehouse.value}>
                {warehouse.label}
              </Select.Item>
            ))
          : null}
      </Select.Content>
    </Select.Root>
  );
}
