/** A reply to a client in a support chat: Enter sends, Shift+Enter breaks the line, the paperclip attaches files and an empty field records a voice message — `onSend`, `onSendVoice`, `queue`, `Composer.Attach`. */
import { Composer, type UploadContext, useUploadQueue } from "prime-ui-kit";

import styles from "./examples.module.css";

const SEND_MS = 600;

/** A stand-in for the server: sends a file in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.25);
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(file.name);
    }, 250);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

/** A stand-in for the chat API: the message reaches the server after a moment. */
const deliver = () => new Promise<void>((resolve) => window.setTimeout(resolve, SEND_MS));

export default function ComposerOverviewExample() {
  const queue = useUploadQueue({ upload: sendFile });

  return (
    <div className={styles.chat}>
      <Composer.Root queue={queue} onSend={deliver} onSendVoice={deliver}>
        <Composer.Attach />
      </Composer.Root>
    </div>
  );
}
