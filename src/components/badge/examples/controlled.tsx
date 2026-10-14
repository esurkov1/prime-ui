/** Delivery cities as toggle chips whose state the screen owns: the summary counts the chosen ones — `pressed`, `onPressedChange`. */
import { Badge, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CITIES = ["Москва", "Казань", "Екатеринбург", "Новосибирск"];

export default function BadgeControlledExample() {
  const [chosen, setChosen] = React.useState<string[]>(["Москва"]);
  const toggle = (city: string, pressed: boolean) =>
    setChosen((prev) => (pressed ? [...prev, city] : prev.filter((item) => item !== city)));

  return (
    <div className={styles.filters}>
      <div className={styles.badges}>
        {CITIES.map((city) => (
          <Badge.Root
            key={city}
            pressed={chosen.includes(city)}
            onPressedChange={(pressed) => toggle(city, pressed)}
          >
            {city}
          </Badge.Root>
        ))}
      </div>
      <Typography variant="body-s" tone="muted">
        {chosen.length > 0 ? `Доставка в: ${chosen.join(", ")}` : "Города доставки не выбраны"}
      </Typography>
    </div>
  );
}
