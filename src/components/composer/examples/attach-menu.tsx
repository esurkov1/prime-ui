/** The paperclip as a menu of attachment kinds: photos and videos, documents, any file, and an invoice from the system that puts its link into the message and returns the focus to the field — `Composer.Item`, `Composer.ItemIcon`, `accept`, `onSelect`, `inputRef`. */
import { Composer, Icon, type UploadContext, useUploadQueue } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TICK_MS = 300;

const INVOICE_LINK = "Счёт INV-2051 на 184 000 ₽: https://prime.app/invoices/2051";

/** A stand-in for the file server: sends a file in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.25);
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

export default function ComposerAttachMenuExample() {
  const queue = useUploadQueue({ upload: sendFile });
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const attachInvoice = () => {
    setDraft((current) => (current ? `${current}\n${INVOICE_LINK}` : INVOICE_LINK));
    // The menu returns the focus to the paperclip; the reader goes on typing in the field.
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className={styles.chat}>
      <Composer.Root
        value={draft}
        onValueChange={setDraft}
        inputRef={inputRef}
        queue={queue}
        onSend={() => setDraft("")}
      >
        <Composer.Attach>
          <Composer.Item accept="image/*,video/*">
            <Composer.ItemIcon>
              <Icon name="object.image" />
            </Composer.ItemIcon>
            Фото и видео
          </Composer.Item>
          <Composer.Item accept=".pdf,.docx,.xlsx">
            <Composer.ItemIcon>
              <Icon name="object.document" />
            </Composer.ItemIcon>
            Документ
          </Composer.Item>
          <Composer.Item accept="">
            <Composer.ItemIcon>
              <Icon name="object.file" />
            </Composer.ItemIcon>
            Любой файл
          </Composer.Item>
          <Composer.Item onSelect={attachInvoice}>
            <Composer.ItemIcon>
              <Icon name="object.receipt" />
            </Composer.ItemIcon>
            Счёт из системы
          </Composer.Item>
        </Composer.Attach>
      </Composer.Root>
    </div>
  );
}
