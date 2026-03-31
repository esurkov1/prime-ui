import * as React from "react";

import { TagSelect } from "@/components/tag-select/TagSelect";

export default function TagSelectFeaturesSnippet() {
  const [value, setValue] = React.useState<string[]>(["telegram"]);

  return (
    <div style={{ maxWidth: "22rem" }}>
      <TagSelect.Root
        options={[
          { value: "telegram", label: "telegram", color: "blue" },
          { value: "whatsapp", label: "whatsapp", color: "green" },
          { value: "facebook", label: "facebook", color: "purple" },
          { value: "viber", label: "viber", color: "pink" },
        ]}
        value={value}
        onValueChange={setValue}
        creatable
        placeholder="Канал…"
        aria-label="Каналы связи"
      />
    </div>
  );
}
