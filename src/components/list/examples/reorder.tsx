/** Funnel stages in the team's order: a stage moves by its handle or Alt+arrows and is saved on the server — `onReorder`, `value`. */
import { Card, List, moveBefore } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STAGES = [
  { id: "lead", name: "Новый лид", description: "Заявка с сайта или от партнёра", deals: 42 },
  { id: "qualified", name: "Квалификация", description: "Бюджет и сроки подтверждены", deals: 18 },
  { id: "proposal", name: "Коммерческое предложение", description: "КП отправлено", deals: 11 },
  { id: "contract", name: "Договор", description: "Согласование с юристами", deals: 6 },
  { id: "won", name: "Оплата", description: "Счёт выставлен", deals: 3 },
];

const SAVE_DELAY_MS = 600;

/** A stand-in for the request that stores the new order. */
function saveOrder(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, SAVE_DELAY_MS);
  });
}

export default function ListReorderExample() {
  const [stages, setStages] = React.useState(STAGES);

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root
          aria-label="Этапы воронки"
          onReorder={async (id, beforeId) => {
            await saveOrder();
            setStages((current) => moveBefore(current, id, beforeId, (stage) => stage.id));
          }}
        >
          {stages.map((stage) => (
            <List.Item key={stage.id} value={stage.id}>
              <List.ItemText>{stage.name}</List.ItemText>
              <List.ItemDescription>{stage.description}</List.ItemDescription>
              <List.ItemCount>{stage.deals}</List.ItemCount>
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
