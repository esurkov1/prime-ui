/** Filter values as toggles with a hide action that slides in without changing the width — `onPress`, `pressed`, `Badge.Action`, `persistent`. */
import { Badge } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Mode = "show" | "hide" | undefined;

const VALUES = ["Москва", "Казань", "Новосибирск", "Сочи"];

export default function BadgeFilterValuesExample() {
  const [modes, setModes] = React.useState<Record<string, Mode>>({ Казань: "show", Сочи: "hide" });
  const set = (value: string, mode: Exclude<Mode, undefined>) =>
    setModes((prev) => ({ ...prev, [value]: prev[value] === mode ? undefined : mode }));

  return (
    <div className={styles.badges}>
      {VALUES.map((value) => {
        const mode = modes[value];
        return (
          <Badge.Root
            key={value}
            color={mode === "show" ? "blue" : mode === "hide" ? "red" : "gray"}
            pressed={mode === "show"}
            onPress={() => set(value, "show")}
          >
            {mode === "hide" ? `НЕ ${value}` : value}
            <Badge.Action
              label={mode === "hide" ? `Не скрывать ${value}` : `Скрыть ${value}`}
              pressed={mode === "hide"}
              persistent={mode === "hide"}
              onClick={() => set(value, "hide")}
            />
          </Badge.Root>
        );
      })}
    </div>
  );
}
