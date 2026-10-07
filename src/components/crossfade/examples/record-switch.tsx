/** A detail panel keyed by the record id: picking another client cross-fades the details of a different height — `state`. */
import { Card, Crossfade, SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CLIENTS = [
  {
    id: "granit",
    name: "ООО «Гранит»",
    facts: [
      ["ИНН", "7704123456"],
      ["Договор", "№ 14/26 от 12.01.2026"],
    ],
  },
  {
    id: "orlov",
    name: "ИП Орлов Д. С.",
    facts: [["ИНН", "502712345678"]],
  },
  {
    id: "alfa",
    name: "АО «Альфа Медиа»",
    facts: [
      ["ИНН", "7812345670"],
      ["Договор", "№ 3-РК от 01.03.2025"],
      ["Менеджер", "Ирина Соколова"],
      ["Отсрочка", "30 дней"],
    ],
  },
];

export default function CrossfadeRecordSwitchExample() {
  const [clientId, setClientId] = React.useState(CLIENTS[0].id);
  const client = CLIENTS.find((item) => item.id === clientId) ?? CLIENTS[0];

  return (
    <div className={styles.stack}>
      <SegmentedControl.Root value={clientId} onValueChange={setClientId} aria-label="Клиент">
        {CLIENTS.map((item) => (
          <SegmentedControl.Item key={item.id} value={item.id}>
            {item.name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>

      <Card.Root variant="panel">
        <Card.Body>
          <Crossfade state={client.id}>
            <ul className={styles.facts} aria-label={client.name}>
              {client.facts.map(([term, value]) => (
                <li key={term} className={styles.fact}>
                  <Typography as="span" variant="body-s" tone="secondary">
                    {term}
                  </Typography>
                  <Typography as="span" variant="body-m">
                    {value}
                  </Typography>
                </li>
              ))}
            </ul>
          </Crossfade>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
