/** Funnel stages with their own controls: a colour dot names the stage's hue, a switch shows it on the board and a menu edits it, all beside the row that opens the stage — `List.ItemActions`, `Badge.Dot`. */
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
  const [current, setCurrent] = React.useState("lead");

  const patch = (id: string, next: Partial<Stage>) =>
    setStages((list) => list.map((stage) => (stage.id === id ? { ...stage, ...next } : stage)));

  return (
    <Card.Root className={styles.pane}>
      <List.Root aria-label="Этапы воронки">
        {stages.map((stage) => (
          <List.Item
            key={stage.id}
            value={stage.id}
            current={current === stage.id}
            onClick={() => setCurrent(stage.id)}
          >
            <List.ItemIcon>
              <Badge.Dot color={stage.color} />
            </List.ItemIcon>
            <List.ItemText>{stage.name}</List.ItemText>
            <List.ItemCount>{stage.deals}</List.ItemCount>
            <List.ItemActions>
              <Switch.Root
                aria-label={`Показывать «${stage.name}» на доске`}
                checked={stage.shown}
                onCheckedChange={(shown) => patch(stage.id, { shown })}
              />
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
                  <Dropdown.Item onSelect={() => setCurrent(stage.id)}>Открыть</Dropdown.Item>
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
            </List.ItemActions>
          </List.Item>
        ))}
      </List.Root>
    </Card.Root>
  );
}
