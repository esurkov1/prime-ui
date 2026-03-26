import { ProgressBar } from "@/components/progress-bar/ProgressBar";

import styles from "./bar-snippets.module.css";

/** Корень полосы на всю ширину родителя: сравнение узкого и широкого контейнера. */
export default function ProgressBarFullWidthSnippet() {
  return (
    <div className={styles.fullWidthCompare}>
      <div className={styles.fullWidthNarrow}>
        <ProgressBar.Root value={55} label="Контейнер 200px" size="m" />
      </div>
      <div className={styles.fullWidthFlexible}>
        <ProgressBar.Root value={55} label="Гибкий контейнер" size="m" />
      </div>
    </div>
  );
}
