/** Every state side by side, each labelled by its prop: the transfer is drawn on the play disk itself — in flight with the cross and the ring, failed with the retry, not fetched with the download arrow — `unplayed`, `transfer`, `transferProgress`, `disabled`. */
import { Typography, VideoNote } from "prime-ui-kit";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

/** Stand-ins for the chat's transfer service: the disks show their actions. */
const cancelTransfer = () => {};
const retryTransfer = () => {};
const fetchNote = () => {};

export default function VideoNoteStatesExample() {
  return (
    <>
      <div>
        <div>
          <VideoNote src={VIDEO_URL} duration={6} />
          <Typography as="span" variant="caption" tone="muted">
            default
          </Typography>
        </div>
        <div>
          <VideoNote src={VIDEO_URL} duration={6} unplayed />
          <Typography as="span" variant="caption" tone="muted">
            unplayed
          </Typography>
        </div>
        <div>
          <VideoNote src={VIDEO_URL} duration={6} disabled />
          <Typography as="span" variant="caption" tone="muted">
            disabled
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <VideoNote
            src={VIDEO_URL}
            duration={6}
            transfer="loading"
            transferProgress={0.45}
            onCancel={cancelTransfer}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · loading
          </Typography>
        </div>
        <div>
          <VideoNote
            src={VIDEO_URL}
            duration={6}
            transfer="failed"
            transferProgress={0.6}
            onRetry={retryTransfer}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · failed
          </Typography>
        </div>
        <div>
          <VideoNote
            src={VIDEO_URL}
            duration={6}
            transfer="remote"
            transferDirection="download"
            onDownload={fetchNote}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · remote
          </Typography>
        </div>
      </div>
    </>
  );
}
