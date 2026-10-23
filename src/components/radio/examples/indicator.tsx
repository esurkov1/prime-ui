/** The circle alone on selectable tiles: `selected` on the card marks its button and the circle shows it — `Card.Indicator`, `selected`. */
import { Card, Fieldset } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PLANS = [
  { value: "start", label: "Старт", price: "0 ₽ в месяц" },
  { value: "team", label: "Команда", price: "2 400 ₽ в месяц" },
  { value: "business", label: "Бизнес", price: "7 900 ₽ в месяц" },
];

export default function RadioIndicatorExample() {
  const [plan, setPlan] = React.useState("team");

  return (
    <Fieldset label="Тариф">
      <div className={styles.tiles}>
        {PLANS.map((item) => {
          const selected = plan === item.value;
          return (
            <Card.Root key={item.value} asChild selected={selected}>
              <button type="button" onClick={() => setPlan(item.value)}>
                <Card.Header>
                  <Card.Title>{item.label}</Card.Title>
                  <Card.Description>{item.price}</Card.Description>
                  <Card.Indicator type="radio" />
                </Card.Header>
              </button>
            </Card.Root>
          );
        })}
      </div>
    </Fieldset>
  );
}
