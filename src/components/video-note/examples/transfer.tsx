/** One look for a round video on its way in either direction: the foreman's report waits to be fetched and then arrives, the engineer's answer is being sent — the disk in the middle with the ring of the share, the cross cancels, a dropped connection offers a retry, the circle plays once it is through — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. */
import { Message, type TransferState, VideoNote } from "prime-ui-kit";
import * as React from "react";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const TICK_MS = 400;
const STEP = 0.08;
/** The stand-in network drops the first attempt to send past this share. */
const DROP_AT = 0.6;

type Transfer = { state: TransferState; progress: number; attempt: number };

const REMOTE: Transfer = { state: "remote", progress: 0, attempt: 0 };
const SENDING: Transfer = { state: "loading", progress: 0, attempt: 1 };

/** One step of a stand-in transfer; `drops` fails its first attempt past `DROP_AT`. */
function advance(transfer: Transfer, drops: boolean): Transfer {
  if (transfer.state !== "loading") return transfer;
  const progress = Math.min(1, transfer.progress + STEP);
  if (drops && transfer.attempt === 1 && progress > DROP_AT)
    return { ...transfer, state: "failed" };
  return { ...transfer, progress, state: progress === 1 ? "done" : "loading" };
}

const start = (transfer: Transfer): Transfer => ({
  state: "loading",
  progress: 0,
  attempt: transfer.attempt + 1,
});

const messageStatus = (transfer: Transfer) =>
  transfer.state === "done" ? "sent" : transfer.state === "failed" ? "failed" : "sending";

export default function VideoNoteTransferExample() {
  const [report, setReport] = React.useState(REMOTE);
  const [answer, setAnswer] = React.useState(SENDING);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setReport((transfer) => advance(transfer, false));
      setAnswer((transfer) => advance(transfer, true));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Message.Group aria-label="Чат выездной бригады">
      <Message.Root direction="incoming" time="16:02">
        <VideoNote
          src={VIDEO_URL}
          duration={6}
          unplayed
          transfer={report.state}
          transferProgress={report.progress}
          transferDirection="download"
          onDownload={() => setReport(start)}
          onCancel={() => setReport(REMOTE)}
          onRetry={() => setReport(start)}
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="16:05" status={messageStatus(answer)}>
        <VideoNote
          src={VIDEO_URL}
          duration={6}
          transfer={answer.state}
          transferProgress={answer.progress}
          onCancel={() => setAnswer((transfer) => ({ ...transfer, state: "failed" }))}
          onRetry={() => setAnswer(start)}
        />
      </Message.Root>
    </Message.Group>
  );
}
