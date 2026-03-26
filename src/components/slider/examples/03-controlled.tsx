import { Slider, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled value: drive `value` / `onChange` from React state and mirror the number in UI copy.
 */
export default function SliderExampleControlled() {
  const [brightness, setBrightness] = React.useState(48);

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Slider.Root
          label="Brightness"
          value={brightness}
          onChange={setBrightness}
          min={0}
          max={100}
          step={1}
          size="m"
        />
        <Typography.Root as="span" variant="body-default" className={styles.muted}>
          {brightness}%
        </Typography.Root>
      </div>
    </div>
  );
}
