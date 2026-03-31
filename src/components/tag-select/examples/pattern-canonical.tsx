import type { TagSelectOption } from "prime-ui-kit";
import { TagSelect, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const initialOptions: TagSelectOption[] = [
  { value: "telegram", label: "Telegram", color: "blue" },
  { value: "whatsapp", label: "WhatsApp", color: "green" },
  { value: "facebook", label: "Facebook", color: "purple" },
  { value: "viber", label: "Viber", color: "pink" },
];

/**
 * Full surface: controlled **`options`**, **`creatable`**, **`optionManagement`** (⋯ rename, colors, delete).
 * New tags stay in the list until refresh; **`onUpdate`** must append when **`value`** is not yet in **`options`**.
 */
export default function TagSelectPatternCanonicalExample() {
  const [value, setValue] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState<TagSelectOption[]>(initialOptions);

  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <TagSelect.Root
        options={options}
        value={value}
        onValueChange={setValue}
        creatable
        optionManagement={{
          onUpdate: (tagValue, updates) => {
            setOptions((prev) => {
              const i = prev.findIndex((o) => o.value === tagValue);
              if (i === -1) {
                return [
                  ...prev,
                  {
                    value: tagValue,
                    label: updates.label ?? tagValue,
                    color: updates.color ?? "gray",
                  },
                ];
              }
              return prev.map((o) =>
                o.value === tagValue
                  ? {
                      ...o,
                      ...(updates.label !== undefined ? { label: updates.label } : {}),
                      ...(updates.color !== undefined ? { color: updates.color } : {}),
                    }
                  : o,
              );
            });
          },
          onDelete: (tagValue) => {
            setOptions((prev) => prev.filter((o) => o.value !== tagValue));
          },
          colorsSectionLabel: "Colors",
          deleteLabel: "Delete",
        }}
        placeholder="Channel…"
        aria-label="Contact channels"
      />
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Filter, create tags, use ⋯ to rename, pick a color, or remove from the list. Selected:{" "}
        <code>{value.join(", ") || "—"}</code>
      </Typography.Root>
    </div>
  );
}
