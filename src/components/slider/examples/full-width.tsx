import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Root stretches to the parent width — in a narrow column the track grows with the column. */
export default function SliderFullWidthExample() {
  return (
    <div className={styles.narrowColumn}>
      <Slider.Root label="Width inside a narrow column" defaultValue={40} />
    </div>
  );
}
