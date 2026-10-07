/** `Input.ClearButton` in sizes s, m and l with a value already typed: the clear action is a full-height segment at the end edge, the whole segment is the hit area. Render it only while the field has a value. Use for search and filter fields. */
import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SIZES = ["s", "m", "l"] as const;

export default function InputClearButtonExample() {
  const [values, setValues] = React.useState<Record<string, string>>({
    s: "billing",
    m: "Еженедельный отчёт",
    l: "Москва, Тверская",
  });

  return (
    <div className={styles.stack}>
      {SIZES.map((size) => (
        <Input.Root key={size} size={size} label={`Поиск · ${size}`}>
          <Input.Wrapper>
            <Input.Icon side="start">
              <Icon name="action.search" tone="secondary" />
            </Input.Icon>
            <Input.Field
              type="search"
              placeholder="Поиск"
              value={values[size]}
              onValueChange={(value) => setValues((prev) => ({ ...prev, [size]: value }))}
            />
            {values[size] ? (
              <Input.ClearButton onClick={() => setValues((prev) => ({ ...prev, [size]: "" }))} />
            ) : null}
          </Input.Wrapper>
        </Input.Root>
      ))}
    </div>
  );
}
