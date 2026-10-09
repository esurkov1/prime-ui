/** Round video messages with a transcript: the button stands at the circle's top end like a voice message's, one text is known and one is asked for on the first open — `transcript`, `onTranscribe`. */
import { Message, VideoNote } from "prime-ui-kit";

import styles from "./examples.module.css";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const FOREMAN_TRANSCRIPT = "Стойка собрана, кабели уложены. Жду команду на подключение питания.";

const ENGINEER_TRANSCRIPT =
  "Питание подключайте после проверки заземления, протокол пришлю в этот чат.";

/** The speech service answers in a moment. */
function transcribeEngineerNote(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(ENGINEER_TRANSCRIPT), 1200));
}

export default function VideoNoteTranscriptExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="13:48">
        <VideoNote src={VIDEO_URL} duration={6} transcript={FOREMAN_TRANSCRIPT} />
      </Message.Root>
      <Message.Root direction="outgoing" time="13:52" status="read">
        <VideoNote src={VIDEO_URL} duration={6} onTranscribe={transcribeEngineerNote} />
      </Message.Root>
    </div>
  );
}
