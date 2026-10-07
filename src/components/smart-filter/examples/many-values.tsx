/** An open set of values (`finite: false`): twenty services with a status dot (`leading`), collapsed to «Ещё N» after `collapsedLimit`. Hiding every value is allowed because the set changes under the selection. Typing narrows the panel and underlines the match. Use for services, users, projects. */
import { SmartFilter, type SmartFilterField } from "prime-ui-kit";

import styles from "./examples.module.css";

const SERVICES = [
  "access-policy-1",
  "access-policy-2",
  "access-policy-3",
  "conformance-1",
  "conformance-2",
  "conformance-3",
  "events-1",
  "events-2",
  "events-3",
  "go-events-1",
  "go-events-2",
  "go-events-3",
  "http-1",
  "http-2",
  "http-3",
  "rpc-1",
  "rpc-2",
  "rpc-3",
  "workflow-1",
  "workflow-2",
];

const FIELDS: SmartFilterField[] = [
  {
    key: "service",
    label: "Сервис",
    finite: false,
    options: SERVICES.map((name, i) => ({
      value: name,
      label: `e2e-${name}`,
      leading: (
        <span className={styles.dot} data-online={i % 4 !== 3 || undefined} aria-hidden="true" />
      ),
    })),
  },
];

export default function SmartFilterManyValuesExample() {
  return (
    <div className={styles.stack}>
      <SmartFilter.Root
        fields={FIELDS}
        collapsedLimit={8}
        defaultValue={{ service: { include: [], exclude: ["events-1"] } }}
      >
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
    </div>
  );
}
