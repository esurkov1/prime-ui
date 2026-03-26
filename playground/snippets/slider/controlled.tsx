import * as React from "react";

import { Slider } from "@/components/slider/Slider";

import styles from "./snippets.module.css";

/** Внешнее состояние: `value` и `onChange`; значение дублируется в подписи рядом. */
export default function SliderControlledSnippet() {
  const [level, setLevel] = React.useState(62);

  return (
    <div className={styles.controlledColumn}>
      <Slider.Root
        label="Уровень запаса"
        value={level}
        onChange={setLevel}
        min={0}
        max={100}
        step={1}
      />
      <span className={styles.valueHint}>Текущее значение: {level}%</span>
    </div>
  );
}
