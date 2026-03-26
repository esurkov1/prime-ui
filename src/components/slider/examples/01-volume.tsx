import { Slider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Media or system volume: native range, default scale 0–100, optional readout beside the track.
 */
export default function SliderExampleVolume() {
  return (
    <div className={styles.stack}>
      <Slider.Root label="Volume" min={0} max={100} step={1} defaultValue={72} size="m" />
      <Typography.Root as="p" variant="body-small" className={styles.muted}>
        Drag to adjust loudness. Arrow keys step by one unit.
      </Typography.Root>
    </div>
  );
}
