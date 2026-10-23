/** Funnel stages in one order: the grips are always there — at the end by default, at the start, or the whole row is dragged; the team's stages move and are saved on the server, the system ones hold their places with a lock — `onReorder`, `handle`, `value`, `locked`. */
import { Card, List, moveBefore, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STAGES = [
  { id: "new", name: "Новая", description: "Сюда попадает каждая заявка", deals: 57, system: true },
  {
    id: "lead",
    name: "Новый лид",
    description: "Заявка с сайта или от партнёра",
    deals: 42,
    system: false,
  },
  {
    id: "qualified",
    name: "Квалификация",
    description: "Бюджет и сроки подтверждены",
    deals: 18,
    system: false,
  },
  {
    id: "proposal",
    name: "Коммерческое предложение",
    description: "КП отправлено",
    deals: 11,
    system: false,
  },
  { id: "won", name: "Успешно", description: "Сделка закрыта", deals: 24, system: true },
];

const HANDLES = [
  { value: "end", label: "Ручка в конце" },
  { value: "start", label: "В начале" },
  { value: "row", label: "Вся строка" },
] as const;

const SAVE_DELAY_MS = 600;

/** A stand-in for the request that stores the new order. */
function saveOrder(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, SAVE_DELAY_MS);
  });
}

export default function ListReorderExample() {
  const [stages, setStages] = React.useState(STAGES);
  const [handle, setHandle] = React.useState<"end" | "start" | "row">("end");

  return (
    <>
      <SegmentedControl.Root
        aria-label="Где ручка"
        value={handle}
        onValueChange={(next) => setHandle(next as "end" | "start" | "row")}
      >
        {HANDLES.map((item) => (
          <SegmentedControl.Item key={item.value} value={item.value}>
            {item.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Card.Root className={styles.pane}>
        <Card.Body>
          <List.Root
            aria-label="Этапы воронки"
            handle={handle}
            onReorder={async (id, beforeId) => {
              await saveOrder();
              setStages((current) => moveBefore(current, id, beforeId, (stage) => stage.id));
            }}
          >
            {stages.map((stage) => (
              <List.Item key={stage.id} value={stage.id} locked={stage.system}>
                <List.ItemText>{stage.name}</List.ItemText>
                <List.ItemDescription>{stage.description}</List.ItemDescription>
                <List.ItemCount>{stage.deals}</List.ItemCount>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
    </>
  );
}
