import { Slider } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Controlled pair `value` + `onChange`; mirror the current value in adjacent copy. */
export default function SliderControlledExample() {
  const [level, setLevel] = React.useState(62);

  return (
    <div className={styles.controlledColumn}>
      <Slider.Root
        label="Reserve level"
        value={level}
        onChange={setLevel}
        min={0}
        max={100}
        step={1}
      />
      <span className={styles.valueHint}>Current value: {level}%</span>
    </div>
  );
}
