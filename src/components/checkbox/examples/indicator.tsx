/** The box alone on selectable tiles: the toggle button carries `aria-pressed`, the box only shows it — `Checkbox.Indicator`. */
import { Card, Checkbox } from "prime-ui-kit";
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
          <Card.Root key={module.value} variant="mini" asChild>
            <button type="button" aria-pressed={pressed} onClick={() => toggle(module.value)}>
              <Checkbox.Indicator checked={pressed} />
              <Card.Label>{module.label}</Card.Label>
              <Card.Meta>{module.price} в месяц</Card.Meta>
            </button>
          </Card.Root>
        );
      })}
    </div>
  );
}
