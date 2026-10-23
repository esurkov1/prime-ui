/** Funnel stages in one list: the switches end the rows; a reorder mode swaps them for the grips, the team's stages move by the grip or Alt+arrows and are saved on the server, the system ones hold their places with a lock — `onReorder`, `value`, `locked`, `List.ItemActions`. */
import { Button, Card, Icon, List, moveBefore, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STAGES = [
  {
    id: "new",
    name: "Новая",
    description: "Сюда попадает каждая заявка",
    deals: 57,
    shown: true,
    system: true,
  },
  {
    id: "lead",
    name: "Новый лид",
    description: "Заявка с сайта или от партнёра",
    deals: 42,
    shown: true,
    system: false,
  },
  {
    id: "qualified",
    name: "Квалификация",
    description: "Бюджет и сроки подтверждены",
    deals: 18,
    shown: true,
    system: false,
  },
  {
    id: "proposal",
    name: "Коммерческое предложение",
    description: "КП отправлено",
    deals: 11,
    shown: true,
    system: false,
  },
  {
    id: "contract",
    name: "Договор",
    description: "Согласование с юристами",
    deals: 6,
    shown: true,
    system: false,
  },
  {
    id: "won",
    name: "Успешно",
    description: "Сделка закрыта",
    deals: 24,
    shown: false,
    system: true,
  },
  {
    id: "lost",
    name: "Отказ",
    description: "Сделка не состоялась",
    deals: 9,
    shown: false,
    system: true,
  },
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
  const [reordering, setReordering] = React.useState(false);

  return (
    <>
      <Button.Root
        variant="soft"
        tone="neutral"
        onClick={() => setReordering((current) => !current)}
      >
        <Button.Icon>
          <Icon name={reordering ? "action.check" : "sort.none"} />
        </Button.Icon>
        {reordering ? "Готово" : "Изменить порядок"}
      </Button.Root>
      <Card.Root className={styles.pane}>
        <List.Root
          aria-label="Этапы воронки"
          onReorder={
            reordering
              ? async (id, beforeId) => {
                  await saveOrder();
                  setStages((current) => moveBefore(current, id, beforeId, (stage) => stage.id));
                }
              : undefined
          }
        >
          {stages.map((stage) => (
            <List.Item key={stage.id} value={stage.id} locked={stage.system}>
              <List.ItemText>{stage.name}</List.ItemText>
              <List.ItemDescription>{stage.description}</List.ItemDescription>
              <List.ItemCount>{stage.deals}</List.ItemCount>
              {!reordering && (
                <List.ItemActions>
                  <Switch.Root
                    aria-label={`Показывать «${stage.name}» на доске`}
                    checked={stage.shown}
                    onCheckedChange={(shown) =>
                      setStages((current) =>
                        current.map((item) => (item.id === stage.id ? { ...item, shown } : item)),
                      )
                    }
                  />
                </List.ItemActions>
              )}
            </List.Item>
          ))}
        </List.Root>
      </Card.Root>
    </>
  );
}
