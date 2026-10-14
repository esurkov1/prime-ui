/** Documents of a deal: a drop zone, the files already attached as rows whose names open them, and new files uploading through a queue with progress, a reason and a retry — `label`, `hint`, `multiple`, `defaultValue`, `href`, `queue`. */
import { FileUpload, type FileUploadFile, type UploadContext, useUploadQueue } from "prime-ui-kit";

import styles from "./examples.module.css";

const MAX_SIZE = 10 * 1024 * 1024;

/** The zone names the limit the stand-in server holds. */
const ZONE_LABELS = { description: "Любые файлы до 10 МБ" };

const ATTACHED: readonly FileUploadFile[] = [
  {
    id: "deal-contract",
    name: "Договор № 48-П.pdf",
    size: 1_840_000,
    type: "application/pdf",
    href: "https://files.example.com/deals/48-P/contract.pdf",
  },
  {
    id: "deal-estimate",
    name: "Смета.xlsx",
    size: 240_000,
    href: "https://files.example.com/deals/48-P/estimate.xlsx",
  },
];

/** A stand-in for the server: sends a file in a few steps and answers with its address. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_SIZE) {
      reject(new Error("Файл больше 10 МБ"));
      return;
    }
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.12 + Math.random() * 0.12);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(`https://files.example.com/deals/${encodeURIComponent(file.name)}`);
    }, 300);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

export default function FileUploadOverviewExample() {
  const queue = useUploadQueue({ upload: sendFile, concurrency: 2 });

  return (
    <div className={styles.column}>
      <FileUpload.Root
        label="Документы сделки"
        hint="Договор, смета и акты по сделке; можно несколько сразу"
        labels={ZONE_LABELS}
        multiple
        defaultValue={ATTACHED}
        queue={queue}
      />
    </div>
  );
}
