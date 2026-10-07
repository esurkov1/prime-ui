/** In a narrow column the swatches wrap by themselves and the arrows move by the visual rows. */
import { ColorSwatches } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ColorSwatchesWrappingExample() {
  return (
    <div className={styles.narrow}>
      <ColorSwatches label="Цвет этапа" defaultValue="#14b8a6" />
    </div>
  );
}
