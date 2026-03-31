import * as React from "react";

import type { TagSelectOption } from "@/components/tag-select/TagSelect";
import { TagSelect } from "@/components/tag-select/TagSelect";

const initialOptions: TagSelectOption[] = [
  { value: "telegram", label: "telegram", color: "blue" },
  { value: "whatsapp", label: "whatsapp", color: "green" },
  { value: "facebook", label: "facebook", color: "purple" },
  { value: "viber", label: "viber", color: "pink" },
];

export default function TagSelectFeaturesSnippet() {
  const [value, setValue] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState<TagSelectOption[]>(initialOptions);

  return (
    <div style={{ width: "100%", maxWidth: "22rem" }}>
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
        placeholder="Канал…"
        aria-label="Каналы связи"
      />
    </div>
  );
}
