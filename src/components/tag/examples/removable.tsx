import { Button, Tag } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** One tag dismisses from state; a stroke button restores it; second row shows static remove UI. */
export default function TagExampleRemovable() {
  const [withRemove, setWithRemove] = React.useState(true);

  return (
    <div className={styles.chipRow}>
      {withRemove ? (
        <Tag.Root onRemove={() => setWithRemove(false)}>Dismiss me</Tag.Root>
      ) : (
        <Button.Root variant="neutral" mode="stroke" onClick={() => setWithRemove(true)}>
          Show tag again
        </Button.Root>
      )}
      <Tag.Root onRemove={() => undefined}>Static remove UI</Tag.Root>
    </div>
  );
}
