/** The box alone on selectable tiles: `selected` on the card marks its toggle button and the box shows it — `Card.Indicator`, `selected`. */
import { Card } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MODULES = [
  { value: "crm", label: "CRM и сделки", price: "2 400 ₽" },
  { value: "stock", label: "Складской учёт", price: "1 900 ₽" },
  { value: "edo", label: "Электронный документооборот", price: "1 200 ₽" },
];

export default function CheckboxIndicatorExample() {
  const [selected, setSelected] = React.useState<string[]>(["crm"]);

  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );

  return (
    <div className={styles.tiles}>
      {MODULES.map((module) => {
        const pressed = selected.includes(module.value);
        return (
          <Card.Root key={module.value} asChild selected={pressed}>
            <button type="button" onClick={() => toggle(module.value)}>
              <Card.Header>
                <Card.Title>{module.label}</Card.Title>
                <Card.Description>{module.price} в месяц</Card.Description>
                <Card.Indicator type="checkbox" />
              </Card.Header>
            </button>
          </Card.Root>
        );
      })}
    </div>
  );
}
