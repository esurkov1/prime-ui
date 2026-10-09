/** Documents in a chat: a download link, a file with a picture, a large file fetched from its tile, an upload in flight with its share and cancel, and a failed one with a retry — `Message.File`, `href`, `preview`, `transfer`, `transferProgress`, `transferDirection`, `onDownload`. */
import { Message, type TransferState } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function MessageFileExample() {
  const [progress, setProgress] = React.useState(0.1);
  const [failed, setFailed] = React.useState(true);
  const [estimate, setEstimate] = React.useState<TransferState>("remote");

  React.useEffect(() => {
    const timer = window.setInterval(
      () => setProgress((current) => (current >= 1 ? 0.1 : current + 0.15)),
      700,
    );
    return () => window.clearInterval(timer);
  }, []);

  // The stand-in fetch of the estimate: in flight for a moment, then through.
  React.useEffect(() => {
    if (estimate !== "loading") return;
    const timer = window.setTimeout(() => setEstimate("done"), 2400);
    return () => window.clearTimeout(timer);
  }, [estimate]);

  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="15:02">
        <Message.File
          name="Договор поставки №418.pdf"
          fileSize={1_258_291}
          href="https://prime.app/files/contract-418.pdf"
        />
      </Message.Root>
      <Message.Root direction="incoming" time="15:03">
        <Message.File
          name="Схема проезда.png"
          fileSize={482_000}
          href="https://prime.app/files/route.png"
          preview="https://picsum.photos/seed/route-map/160/160"
        />
      </Message.Root>
      <Message.Root direction="incoming" time="15:05">
        <Message.File
          name="Смета на монтаж.xlsx"
          fileSize={24_117_248}
          href={estimate === "done" ? "https://prime.app/files/estimate.xlsx" : undefined}
          transfer={estimate}
          transferDirection="download"
          onDownload={() => setEstimate("loading")}
          onCancel={() => setEstimate("remote")}
        />
      </Message.Root>
      <Message.Root direction="outgoing" position="first" time="15:10" status="sending">
        <Message.File
          name="Спецификация к договору.xlsx"
          fileSize={3_670_016}
          transfer="loading"
          transferProgress={Math.min(progress, 1)}
          onCancel={() => setProgress(0.1)}
        />
      </Message.Root>
      <Message.Root
        direction="outgoing"
        position="last"
        time="15:11"
        status={failed ? "failed" : "sent"}
      >
        <Message.File
          name="Акт приёмки.docx"
          fileSize={96_000}
          transfer={failed ? "failed" : "done"}
          onRetry={() => setFailed(false)}
        />
      </Message.Root>
    </div>
  );
}
