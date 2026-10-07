/** 0, partial and 100; every `tone`; `max` for a "3 of 5 steps" scale. Use the tone to show the outcome, not the progress itself. */
import { ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ProgressBarValuesAndTonesExample() {
  return (
    <div className={styles.stack}>
      <ProgressBar.Root value={0} label="Ещё не начато" showValue />
      <ProgressBar.Root value={42} label="Загрузка" showValue />
      <ProgressBar.Root value={100} tone="success" label="Готово" showValue />
      <ProgressBar.Root value={86} tone="warning" label="Квота почти исчерпана" showValue />
      <ProgressBar.Root value={30} tone="danger" label="Импорт прерван" showValue />
      <ProgressBar.Root value={55} tone="neutral" label="Индексация в фоне" showValue />
      <ProgressBar.Root value={20} tone="info" label="Синхронизация справочников" showValue />
      <ProgressBar.Root value={3} max={5} label="Профиль: 3 из 5 шагов" />
    </div>
  );
}
