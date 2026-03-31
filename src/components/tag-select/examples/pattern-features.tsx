import * as React from "react";

import { TagSelect } from "@/components/tag-select/TagSelect";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/** `creatable` + filter; mirrors `playground/snippets/tag-select/features.tsx`. */
export default function TagSelectPatternFeaturesExample() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
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
        placeholder="Channel…"
        aria-label="Contact channels"
      />
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Type to filter; add a new channel if it is not in the list.
      </Typography.Root>
    </div>
  );
}
