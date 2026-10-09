/** Materials of a warehouse inspection as cards: photos and documents in one grid, each with its picture or format and the name with the size; new files upload in their cards and the order is set by drag or Alt + arrows — `trigger`, `layout`, `defaultValue`, `queue`. */
import { FileUpload, type FileUploadFile, type UploadContext, useUploadQueue } from "prime-ui-kit";

import styles from "./examples.module.css";

const MATERIALS: readonly FileUploadFile[] = [
  {
    id: "insp-gate",
    name: "Въезд на склад.jpg",
    type: "image/jpeg",
    size: 820_000,
    src: "https://picsum.photos/seed/insp-gate/480/480",
  },
  {
    id: "insp-act",
    name: "Акт проверки.pdf",
    type: "application/pdf",
    size: 1_240_000,
  },
  {
    id: "insp-racks",
    name: "Стеллажи, ряд 4.jpg",
    type: "image/jpeg",
    size: 760_000,
    src: "https://picsum.photos/seed/insp-racks/480/480",
  },
  { id: "insp-stock", name: "Остатки на 12 марта.xlsx", size: 96_000 },
];

/** A stand-in for the server: sends a file in a few steps and answers with its address. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.1 + Math.random() * 0.15);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(`https://files.example.com/inspections/${encodeURIComponent(file.name)}`);
    }, 300);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

export default function FileUploadFileCardsExample() {
  const queue = useUploadQueue({ upload: sendFile, concurrency: 2 });

  return (
    <div className={styles.wide}>
      <FileUpload.Root
        label="Материалы проверки склада"
        hint="Фото, видео и документы; порядок карточек — порядок в отчёте"
        trigger="tile"
        layout="grid"
        multiple
        defaultValue={MATERIALS}
        queue={queue}
      />
    </div>
  );
}
