import { Tag } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Selected values (skills, recipients): removable chips in a named group so the fixed
 * remove control `aria-label` has context from the page.
 */
export default function TagExampleRemovableSelectedValues() {
  const [skills, setSkills] = React.useState<string[]>([
    "Design systems",
    "React",
    "Accessibility",
  ]);

  const removeSkill = (label: string) => {
    setSkills((prev) => prev.filter((s) => s !== label));
  };

  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Required skills</legend>
      <div className={styles.chipRow}>
        {skills.map((label) => (
          <Tag.Root key={label} onRemove={() => removeSkill(label)}>
            {label}
          </Tag.Root>
        ))}
      </div>
    </fieldset>
  );
}
