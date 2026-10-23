/** Funnel stages with a switch at the end: a click anywhere on the row toggles it, the menu beside it is a ghost button so it does not argue with the switch — `List.ItemActions`, `List.ItemCount`, `Badge.Dot`. */
import { Badge, Button, Card, Dropdown, Icon, List, type PaletteColor, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Stage = { id: string; name: string; color: PaletteColor; deals: number; shown: boolean };

const STAGES: Stage[] = [
  { id: "lead", name: "Новый лид", color: "blue", deals: 42, shown: true },
  { id: "qualified", name: "Квалификация", color: "purple", deals: 18, shown: true },
  { id: "proposal", name: "Коммерческое предложение", color: "orange", deals: 11, shown: true },
  { id: "paused", name: "Отложено", color: "gray", deals: 7, shown: false },
];

export default function ListRowControlsExample() {
  const [stages, setStages] = React.useState(STAGES);

  const patch = (id: string, next: Partial<Stage>) =>
    setStages((list) => list.map((stage) => (stage.id === id ? { ...stage, ...next } : stage)));

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Этапы на доске">
          {stages.map((stage) => (
            <List.Item key={stage.id} value={stage.id}>
              <List.ItemIcon>
                <Badge.Dot color={stage.color} />
              </List.ItemIcon>
              <List.ItemText>{stage.name}</List.ItemText>
              <List.ItemCount>{stage.deals}</List.ItemCount>
              <List.ItemActions>
                <Dropdown.Root>
                  <Dropdown.Trigger>
                    <Button.Root
                      variant="ghost"
                      tone="neutral"
                      aria-label={`Действия с этапом «${stage.name}»`}
                    >
                      <Button.Icon>
                        <Icon name="action.more" />
                      </Button.Icon>
                    </Button.Root>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Item onSelect={() => patch(stage.id, { color: "green" })}>
                      Отметить зелёным
                    </Dropdown.Item>
                    <Dropdown.Separator />
                    <Dropdown.Item
                      tone="danger"
                      onSelect={() =>
                        setStages((list) => list.filter((item) => item.id !== stage.id))
                      }
                    >
                      Удалить этап
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Root>
                <Switch.Root
                  aria-label={`Показывать «${stage.name}» на доске`}
                  checked={stage.shown}
                  onCheckedChange={(shown) => patch(stage.id, { shown })}
                />
              </List.ItemActions>
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
