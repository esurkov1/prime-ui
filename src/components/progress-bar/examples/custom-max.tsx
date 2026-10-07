/** A scale of steps instead of percent: 3 of 5 profile steps — `max`. */
import { ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ProgressBarCustomMaxExample() {
  return (
    <div className={styles.column}>
      <ProgressBar value={3} max={5} label="Профиль: 3 из 5 шагов" />
    </div>
  );
}
