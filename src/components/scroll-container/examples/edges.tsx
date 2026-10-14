/** Hidden edges fade over any background, take a soft shadow on a filled surface, or stay plain — `edges`. */
import { Card, ScrollContainer, type ScrollContainerEdges, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  "Заказ № 1040 оплачен",
  "Счёт № 318 выставлен",
  "Заказ № 1041 передан в доставку",
  "Возврат по заказу № 1032 одобрен",
  "Заказ № 1042 оплачен",
  "Акт № 77 подписан",
  "Заказ № 1043 отменён клиентом",
  "Счёт № 319 оплачен",
  "Заказ № 1044 собран на складе",
  "Заказ № 1045 оплачен",
];
const EDGES: ScrollContainerEdges[] = ["fade", "shadow", "none"];

export default function ScrollContainerEdgesExample() {
  return (
    <div className={styles.layout}>
      {EDGES.map((edges) => (
        <Card.Root key={edges} role="region" className={styles.card} aria-label={`Лента: ${edges}`}>
          <Card.Header>
            <Card.Title>Лента событий</Card.Title>
            <Typography as="span" variant="caption" tone="muted">
              {edges}
            </Typography>
          </Card.Header>
          <ScrollContainer edges={edges}>
            <Card.List>
              {EVENTS.map((event) => (
                <Card.ListItem key={event}>
                  <Typography as="span" variant="body-m" tone="secondary">
                    {event}
                  </Typography>
                </Card.ListItem>
              ))}
            </Card.List>
          </ScrollContainer>
        </Card.Root>
      ))}
    </div>
  );
}
