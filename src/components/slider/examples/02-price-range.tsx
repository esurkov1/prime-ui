import { Hint, Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Catalog filter: single-thumb “up to” price on a stepped currency scale (one dimension of a range UI).
 */
export default function SliderExamplePriceRange() {
  return (
    <div className={styles.stack}>
      <Slider.Root label="Maximum price" min={0} max={500} step={5} defaultValue={250} size="m" />
      <Hint.Root size="s" variant="default">
        Results update when you release the thumb or finish keyboard adjustment. Pair with a second
        control if you need an explicit minimum.
      </Hint.Root>
    </div>
  );
}
