/** An open set of twenty services, degraded ones marked with an icon, collapsed after eight; typing narrows the panel and underlines the match — `finite`, `icon`, `collapsedLimit`. */
import { Icon, SmartFilter, type SmartFilterField } from "prime-ui-kit";

const SERVICES = [
  "access-policy",
  "billing",
  "catalog",
  "checkout",
  "conformance",
  "delivery",
  "events",
  "go-events",
  "http-gateway",
  "inventory",
  "loyalty",
  "notifications",
  "orders",
  "payments",
  "pricing",
  "reports",
  "rpc-gateway",
  "search",
  "users",
  "workflow",
];

const DEGRADED = new Set(["checkout", "events", "pricing"]);

const FIELDS: SmartFilterField[] = [
  {
    key: "service",
    label: "Сервис",
    finite: false,
    options: SERVICES.map((name) => ({
      value: name,
      label: name,
      icon: DEGRADED.has(name) ? <Icon name="status.warning" tone="warning" /> : undefined,
    })),
  },
];

export default function SmartFilterManyValuesExample() {
  return (
    <SmartFilter.Root
      fields={FIELDS}
      collapsedLimit={8}
      defaultValue={{ service: { include: [], exclude: ["events"] } }}
    >
      <SmartFilter.Toolbar />
      <SmartFilter.Chips />
    </SmartFilter.Root>
  );
}
