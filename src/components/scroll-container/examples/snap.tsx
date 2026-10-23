/** A strip of warehouse cards that always comes to rest on a card's start, scrolled by touch, a trackpad or the mouse wheel — `snap`, `axis`. */
import { Card, ScrollContainer } from "prime-ui-kit";

import styles from "./examples.module.css";

const WAREHOUSES = [
  { id: "msk", city: "Москва", stock: "12 480 позиций" },
  { id: "spb", city: "Санкт-Петербург", stock: "8 215 позиций" },
  { id: "kzn", city: "Казань", stock: "4 030 позиций" },
  { id: "ekb", city: "Екатеринбург", stock: "5 772 позиции" },
  { id: "nsk", city: "Новосибирск", stock: "3 118 позиций" },
  { id: "krd", city: "Краснодар", stock: "2 904 позиции" },
];

export default function ScrollContainerSnapExample() {
  return (
    <ScrollContainer axis="horizontal" snap="mandatory" scrollbar="hidden" aria-label="Склады">
      <ul className={styles.tiles}>
        {WAREHOUSES.map((warehouse) => (
          <li key={warehouse.id} className={styles.tile}>
            <Card.Root>
              <Card.Header>
                <Card.Title>{warehouse.city}</Card.Title>
                <Card.Description>{warehouse.stock}</Card.Description>
              </Card.Header>
            </Card.Root>
          </li>
        ))}
      </ul>
    </ScrollContainer>
  );
}
