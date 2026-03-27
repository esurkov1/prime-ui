import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Typography } from "@/components/typography/Typography";

import styles from "./bar-snippets.module.css";

/** Полоса рядом с заголовком и поясняющим текстом — как блок в мастере или отчёте. */
export default function ProgressBarCompositionSnippet() {
  return (
    <div className={styles.compositionCard}>
      <Typography.Root variant="body-large" weight="semibold">
        Создание отчёта
      </Typography.Root>
      <ProgressBar.Root value={72} max={100} label="Сбор данных" />
      <Typography.Root variant="body-small" tone="muted">
        Обычно до пяти минут; можно вернуться к списку задач.
      </Typography.Root>
    </div>
  );
}
