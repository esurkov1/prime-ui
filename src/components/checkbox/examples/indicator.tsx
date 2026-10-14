/** The box alone in a multi-select list: the option row carries `aria-selected`, the box only shows it — `Checkbox.Indicator`. */
import { Checkbox, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CITIES: { value: string; label: string; disabled?: boolean }[] = [
  { value: "msk", label: "Москва" },
  { value: "spb", label: "Санкт-Петербург" },
  { value: "kzn", label: "Казань" },
  { value: "tver", label: "Тверь · закрыт", disabled: true },
];

/** One tab stop: arrows move the focused row (wrapping), Home / End jump to the ends. */
function nextIndex(key: string, index: number, count: number): number | null {
  if (key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowUp") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}

export default function CheckboxIndicatorExample() {
  const [selected, setSelected] = React.useState<string[]>(["msk"]);
  const [active, setActive] = React.useState(0);
  const optionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (city: (typeof CITIES)[number]) => {
    if (city.disabled) return;
    setSelected((current) =>
      current.includes(city.value)
        ? current.filter((item) => item !== city.value)
        : [...current, city.value],
    );
  };

  return (
    <div
      role="listbox"
      aria-label="Города доставки"
      aria-multiselectable
      className={styles.optionList}
      onKeyDown={(event) => {
        const next = nextIndex(event.key, active, CITIES.length);
        if (next === null) return;
        event.preventDefault();
        setActive(next);
        optionRefs.current[next]?.focus();
      }}
    >
      {CITIES.map((city, index) => {
        const isSelected = selected.includes(city.value);
        return (
          <div
            key={city.value}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            role="option"
            aria-selected={isSelected}
            aria-disabled={city.disabled || undefined}
            tabIndex={index === active ? 0 : -1}
            className={styles.option}
            onFocus={() => setActive(index)}
            onClick={() => toggle(city)}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                toggle(city);
              }
            }}
          >
            <Checkbox.Indicator checked={isSelected} disabled={city.disabled} />
            <Typography as="span" variant="body-m" tone={city.disabled ? "muted" : undefined}>
              {city.label}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}
