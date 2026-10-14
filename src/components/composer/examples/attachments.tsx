/** Warehouse photos and documents for a client go through an upload queue: the paperclip opens the file picker for photos, videos and office documents, a paste or a drop adds files too, every attachment is a tile of one strip that drags into its order, and send waits until the uploads finish — `queue`, `Composer.Attach`, `accept`, `useUploadQueue`. */
import { Composer, type UploadContext, useUploadQueue } from "prime-ui-kit";

import styles from "./examples.module.css";

const TICK_MS = 300;

/** A stand-in for the file server: sends a file in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.15 + Math.random() * 0.15);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(`https://files.example.com/chat/${encodeURIComponent(file.name)}`);
    }, TICK_MS);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

export default function ComposerAttachmentsExample() {
  const queue = useUploadQueue({ upload: sendFile, concurrency: 2 });

  return (
    <div className={styles.chat}>
      <Composer.Root queue={queue} onSend={() => {}}>
        <Composer.Attach accept="image/*,video/*,.pdf,.docx,.xlsx" />
      </Composer.Root>
    </div>
  );
}
