/** Round video messages in a field crew chat: the circle is the message itself, the time stands on its pill, the reply follows as text and the answer circle shows the cover its server made — `Message.Root`, `time`, `status`, `poster`. */
import { Message, VideoNote } from "prime-ui-kit";

import styles from "./examples.module.css";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

/** The cover the media server made for the reply: shown at once, before the first frame. */
const POSTER_URL = "https://picsum.photos/seed/server-rack/480/480";

export default function VideoNoteInMessageExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="13:48">
        <VideoNote src={VIDEO_URL} duration={6} unplayed />
      </Message.Root>
      <Message.Root direction="outgoing" time="13:50" status="read">
        <Message.Text>Вижу, стойка собрана. Подключайте питание.</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="13:51" status="read">
        <VideoNote src={VIDEO_URL} duration={6} poster={POSTER_URL} />
      </Message.Root>
    </div>
  );
}
