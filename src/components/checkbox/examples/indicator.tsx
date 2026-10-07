/** The box alone in a multi-select list: the option row carries `aria-selected`, the box only shows it — `Checkbox.Indicator`. */
import { Checkbox, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CITIES = [
  { value: "msk", label: "Москва" },
  { value: "spb", label: "Санкт-Петербург" },
  { value: "kzn", label: "Казань" },
];

export default function CheckboxIndicatorExample() {
  const [selected, setSelected] = React.useState<string[]>(["msk"]);

  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );

  return (
    <div
      role="listbox"
      aria-label="Города доставки"
      aria-multiselectable
      className={styles.optionList}
    >
      {CITIES.map((city) => {
        const isSelected = selected.includes(city.value);
        return (
          <div
            key={city.value}
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            className={styles.option}
            onClick={() => toggle(city.value)}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                toggle(city.value);
              }
            }}
          >
            <Checkbox.Indicator checked={isSelected} />
            <Typography.Root as="span" variant="body-m">
              {city.label}
            </Typography.Root>
          </div>
        );
      })}
    </div>
  );
}
