import { Slider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Disabled track: preset cannot be changed until the parent feature is unlocked or loading finishes.
 */
export default function SliderExampleDisabled() {
  return (
    <div className={styles.stack}>
      <Slider.Root
        label="Night mode dimming"
        min={0}
        max={100}
        step={5}
        defaultValue={40}
        disabled
        size="m"
      />
      <Typography.Root as="p" variant="body-small" className={styles.muted}>
        Available after you enable scheduled dark mode in settings.
      </Typography.Root>
    </div>
  );
}
