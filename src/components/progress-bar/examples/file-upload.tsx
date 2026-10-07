/** Live file uploads in a card: progress grows, finished files turn `success`, a failed one `danger`. Use it for per-item progress of background operations. */
import { Button, ProgressBar, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Upload = { name: string; size: string; progress: number; failed?: boolean };

const initial: Upload[] = [
  { name: "отчёт-сентябрь.pdf", size: "2,4 МБ", progress: 100 },
  { name: "прайс-лист.xlsx", size: "860 КБ", progress: 35 },
  { name: "фото-склада.zip", size: "48 МБ", progress: 62, failed: true },
];

export default function ProgressBarFileUploadExample() {
  const [files, setFiles] = React.useState(initial);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.failed || f.progress >= 100 ? f : { ...f, progress: Math.min(100, f.progress + 7) },
        ),
      );
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Typography.Root as="h3" variant="title-s">
          Загрузка файлов
        </Typography.Root>
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => setFiles(initial)}>
          Заново
        </Button.Root>
      </div>
      {files.map((f) => {
        const tone = f.failed ? "danger" : f.progress >= 100 ? "success" : "accent";
        return (
          <div key={f.name} className={styles.file}>
            <ProgressBar.Root value={f.progress} tone={tone} label={f.name} showValue />
            <Typography.Root as="span" variant="caption" tone="muted" className={styles.meta}>
              {f.failed ? "Сбой соединения" : f.size}
            </Typography.Root>
          </div>
        );
      })}
    </div>
  );
}
