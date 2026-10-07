/** Pressable badges with a reveal action: `onPress` + `pressed` make the badge a toggle (show only this value), and `Badge.Action` adds a «−» segment that slides in on hover and focus without changing the badge width. `persistent` keeps it shown while the value is hidden. Use for filter values with show / hide. */
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
