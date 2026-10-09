/** One look for a recording on its way in either direction: the client's voice message waits to be fetched and then arrives, the reply is being sent — the play disk itself carries the cross and the ring of the share, a dropped connection offers a retry, and the play glyph comes back once it is through — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. */
import { Message, type TransferState, VoicePlayer } from "prime-ui-kit";
import * as React from "react";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const CLIENT_WAVEFORM = [
  0.24, 0.4, 0.66, 0.82, 0.58, 0.34, 0.5, 0.76, 0.92, 0.7, 0.46, 0.28, 0.54, 0.8, 0.62, 0.36, 0.22,
  0.44, 0.7, 0.86, 0.6, 0.32,
];

const REPLY_WAVEFORM = [
  0.3, 0.56, 0.74, 0.5, 0.28, 0.62, 0.88, 0.72, 0.42, 0.26, 0.48, 0.68, 0.84, 0.58, 0.36, 0.52,
  0.78, 0.64, 0.4, 0.2,
];

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

export default function VoicePlayerTransferExample() {
  const [incoming, setIncoming] = React.useState(REMOTE);
  const [reply, setReply] = React.useState(SENDING);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setIncoming((transfer) => advance(transfer, false));
      setReply((transfer) => advance(transfer, true));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Message.Group aria-label="Чат с клиентом: заказ № 4821">
      <Message.Root direction="incoming" time="14:20">
        <VoicePlayer
          src={VOICE_URL}
          waveform={CLIENT_WAVEFORM}
          duration={18}
          unplayed
          transfer={incoming.state}
          transferProgress={incoming.progress}
          transferDirection="download"
          onDownload={() => setIncoming(start)}
          onCancel={() => setIncoming(REMOTE)}
          onRetry={() => setIncoming(start)}
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="14:22" status={messageStatus(reply)}>
        <VoicePlayer
          src={VOICE_URL}
          waveform={REPLY_WAVEFORM}
          duration={11}
          transfer={reply.state}
          transferProgress={reply.progress}
          onCancel={() => setReply((transfer) => ({ ...transfer, state: "failed" }))}
          onRetry={() => setReply(start)}
        />
      </Message.Root>
    </Message.Group>
  );
}
