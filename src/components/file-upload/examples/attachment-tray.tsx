/** A reply to a client with a paperclip instead of a drop zone: the icon-only picker button, and the attachments as one scrolling row of tiles above the message — `trigger`, `aria-label`, `FileUpload.Queue`, `layout`. */
import {
  Button,
  FileUpload,
  type FileUploadFile,
  Icon,
  Input,
  type UploadContext,
  useUploadQueue,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Files attached to the draft before it was reopened. */
const DRAFT: readonly FileUploadFile[] = [
  {
    id: "draft-box",
    name: "Повреждённая коробка.jpg",
    type: "image/jpeg",
    size: 540_000,
    src: "https://picsum.photos/seed/draft-box/320/320",
  },
  { id: "draft-claim", name: "Претензия № 4821.pdf", type: "application/pdf", size: 180_000 },
];

/** A stand-in for the server: sends a file in a few steps. */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.2);
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

export default function FileUploadAttachmentTrayExample() {
  const queue = useUploadQueue({ upload: sendFile });
  const [attachments, setAttachments] = React.useState<readonly FileUploadFile[]>(DRAFT);
  const [message, setMessage] = React.useState("");
  const uploading = queue.items.some(
    (item) => item.status === "queued" || item.status === "loading",
  );
  const empty = message.trim() === "" && attachments.length === 0 && queue.items.length === 0;

  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setAttachments([]);
    queue.clear();
  };

  return (
    <form className={styles.composer} onSubmit={send}>
      <FileUpload.Queue
        layout="strip"
        aria-label="Вложения"
        value={attachments}
        onValueChange={setAttachments}
        queue={queue}
      />
      <div className={styles.composerRow}>
        <FileUpload.Root
          trigger="button"
          multiple
          aria-label="Прикрепить файл"
          onFilesChange={queue.add}
        >
          <Button.Icon>
            <Icon name="action.attach" />
          </Button.Icon>
        </FileUpload.Root>
        <Input.Root className={styles.composerField}>
          <Input.Wrapper>
            <Input.Field
              aria-label="Сообщение клиенту"
              placeholder="Ответ по заказу № 4821"
              value={message}
              onValueChange={setMessage}
            />
          </Input.Wrapper>
        </Input.Root>
        <Button.Root type="submit" aria-label="Отправить" disabled={uploading || empty}>
          <Button.Icon>
            <Icon name="action.send" />
          </Button.Icon>
        </Button.Root>
      </div>
    </form>
  );
}
