/** A contract's approval route: a step already signed stays where it is while the rest reorder around it, and once the route is approved the whole list holds still — `Dnd.SortableItem`, `Dnd.Sortable`, `disabled`. */
import { Badge, Dnd, moveBefore, Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Step = { id: string; title: string; person: string; signed?: boolean };

const ROUTE: Step[] = [
  { id: "lawyer", title: "Юрист", person: "Ольга Белова", signed: true },
  { id: "finance", title: "Финансовый отдел", person: "Илья Петров" },
  { id: "security", title: "Служба безопасности", person: "Марат Хасанов" },
  { id: "director", title: "Директор", person: "Анна Климова" },
];

export default function DndStatesExample() {
  const [steps, setSteps] = React.useState(ROUTE);
  const [approved, setApproved] = React.useState(false);

  return (
    <div className={styles.stage}>
      <Switch.Root checked={approved} onCheckedChange={setApproved}>
        <Switch.Label>Маршрут утверждён</Switch.Label>
      </Switch.Root>
      <Dnd.Root>
        <Dnd.Sortable
          as="ol"
          aria-label="Маршрут согласования"
          className={styles.list}
          disabled={approved}
          items={steps}
          getId={(step) => step.id}
          getLabel={(step) => step.title}
          onReorder={(id, beforeId) =>
            setSteps((current) => moveBefore(current, id, beforeId, (step) => step.id))
          }
          renderItem={(step) => (
            <Dnd.SortableItem id={step.id} disabled={step.signed} className={styles.row}>
              <span className={styles.rowText}>
                <Typography as="span" variant="body-m">
                  {step.title}
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                  {step.person}
                </Typography>
              </span>
              {step.signed ? <Badge.Root color="green">Подписано</Badge.Root> : null}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    </div>
  );
}
