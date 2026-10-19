/** Documents of a deal in one list: the files already on the server and new uploads after them, saved on every change, and a button brings back the saved set — `value`, `onValueChange`, `queue`. */
import {
  Button,
  FileUpload,
  type FileUploadFile,
  Typography,
  type UploadContext,
  useUploadQueue,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SAVED: readonly FileUploadFile[] = [
  { id: "deal-contract", name: "Договор № 48-П.pdf", size: 1_840_000, type: "application/pdf" },
  {
    id: "deal-site",
    name: "Площадка.jpg",
    size: 620_000,
    type: "image/jpeg",
    src: "https://picsum.photos/seed/deal-site/160/160",
  },
  { id: "deal-estimate", name: "Смета.xlsx", size: 240_000 },
];

/** A stand-in for the server: sends a file in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.15);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(file.name);
    }, 300);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

export default function FileUploadControlledExample() {
  const queue = useUploadQueue({ upload: sendFile });
  const [documents, setDocuments] = React.useState<readonly FileUploadFile[]>(SAVED);
  const { clear } = queue;

  return (
    <div className={styles.column}>
      <div className={styles.toolbar}>
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {documents === SAVED ? "Сохранённый набор" : `Файлов в сделке: ${documents.length}`}
        </Typography>
        <div className={styles.spacer} />
        <Button.Root
          variant="soft"
          tone="neutral"
          disabled={documents === SAVED}
          onClick={() => {
            clear();
            setDocuments(SAVED);
          }}
        >
          Вернуть
        </Button.Root>
      </div>
      <FileUpload.Root
        label="Документы сделки"
        multiple
        value={documents}
        onValueChange={setDocuments}
        queue={queue}
      />
    </div>
  );
}
