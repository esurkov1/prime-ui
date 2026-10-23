/** Hidden edges fade over any background, take a soft shadow on a filled surface, or stay plain — `edges`. */
import { Card, List, ScrollContainer, type ScrollContainerEdges } from "prime-ui-kit";

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
            <Card.Description>{edges}</Card.Description>
          </Card.Header>
          <Card.Body>
            <ScrollContainer edges={edges}>
              <List.Root aria-label="События">
                {EVENTS.map((event) => (
                  <List.Item key={event}>
                    <List.ItemText>{event}</List.ItemText>
                  </List.Item>
                ))}
              </List.Root>
            </ScrollContainer>
          </Card.Body>
        </Card.Root>
      ))}
    </div>
  );
}
