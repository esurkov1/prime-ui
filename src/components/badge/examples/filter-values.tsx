/** Filter values as toggles with a hide action that slides in without changing the width — `pressed`, `onPressedChange`, `Badge.Action`, `persistent`. */
import { Badge } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Mode = "show" | "hide" | undefined;

const VALUES = ["Москва", "Казань", "Новосибирск", "Сочи"];

export default function BadgeFilterValuesExample() {
  const [modes, setModes] = React.useState<Record<string, Mode>>({ Казань: "show", Сочи: "hide" });
  const set = (value: string, mode: Mode) => setModes((prev) => ({ ...prev, [value]: mode }));

  return (
    <div className={styles.badges}>
      {VALUES.map((value) => {
        const mode = modes[value];
        return (
          <Badge.Root
            key={value}
            pressed={mode === "show"}
            onPressedChange={(pressed) => set(value, pressed ? "show" : undefined)}
          >
            {mode === "hide" ? `НЕ ${value}` : value}
            <Badge.Action
              label={mode === "hide" ? `Не скрывать ${value}` : `Скрыть ${value}`}
              pressed={mode === "hide"}
              persistent={mode === "hide"}
              onClick={() => set(value, mode === "hide" ? undefined : "hide")}
            />
          </Badge.Root>
        );
      })}
    </div>
  );
}
