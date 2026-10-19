/** The stage of a deal as a badge that opens the stage picker: the chevron turns while the menu is open, the badge takes the picked stage's color — `Badge.Root`, `Dropdown.Trigger`, `color`. */
import { Badge, Dropdown, type PaletteColor, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Stage = { id: string; title: string; color: PaletteColor };

const STAGES: Stage[] = [
  { id: "new", title: "Новая заявка", color: "blue" },
  { id: "offer", title: "Предложение", color: "purple" },
  { id: "booked", title: "Бронь", color: "yellow" },
  { id: "active", title: "В аренде", color: "green" },
  { id: "closed", title: "Закрыта", color: "gray" },
];

export default function BadgeTriggerExample() {
  const [stageId, setStageId] = React.useState("booked");
  const stage = STAGES.find((item) => item.id === stageId) ?? STAGES[0];

  return (
    <div className={styles.badges}>
      <Typography as="span" variant="caption" tone="muted">
        Сделка DL-412 · ООО «Север»
      </Typography>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Badge.Root color={stage?.color}>{stage?.title}</Badge.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {STAGES.map((item) => (
            <Dropdown.Item key={item.id} onSelect={() => setStageId(item.id)}>
              {item.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
