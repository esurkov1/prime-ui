/** The required asterisk, the optional marker and an inline clarification — `required`, `optional`, `Label.Description`. */
import { Label, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LabelStructureExample() {
  return (
    <div className={styles.structure}>
      <div className={styles.field}>
        <Label.Root required>ИНН</Label.Root>
        <Typography as="span" variant="caption" tone="muted">
          required
        </Typography>
      </div>
      <div className={styles.field}>
        <Label.Root optional>КПП</Label.Root>
        <Typography as="span" variant="caption" tone="muted">
          optional
        </Typography>
      </div>
      <div className={styles.field}>
        <Label.Root>
          Бюджет
          <Label.Description>₽, без НДС</Label.Description>
        </Label.Root>
        <Typography as="span" variant="caption" tone="muted">
          Label.Description
        </Typography>
      </div>
    </div>
  );
}
