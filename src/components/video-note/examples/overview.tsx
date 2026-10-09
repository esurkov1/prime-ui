/** A foreman's round video report: its still first frame with the play disk and the duration, played with sound on a press — `src`, `duration`. */
import { VideoNote } from "prime-ui-kit";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function VideoNoteOverviewExample() {
  return <VideoNote src={VIDEO_URL} duration={6} />;
}
