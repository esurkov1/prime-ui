import * as React from "react";

import { ProgressBar } from "@/components/progress-bar/ProgressBar";

import styles from "./bar-snippets.module.css";

/** value задаётся из состояния родителя — полоса и подпись обновляются вместе. */
export default function ProgressBarControlledSnippet() {
  const [value, setValue] = React.useState(35);

  return (
    <>
      <ProgressBar.Root value={value} max={100} label={`Готово: ${value}%`} size="m" />
      <div className={styles.controlledActions}>
        <button type="button" onClick={() => setValue((v) => Math.max(0, v - 15))}>
          −15
        </button>
        <button type="button" onClick={() => setValue((v) => Math.min(100, v + 15))}>
          +15
        </button>
      </div>
    </>
  );
}
