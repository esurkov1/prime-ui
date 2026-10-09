/** Round video messages in a field crew chat: the circle is the message itself, the time stands on its pill and the reply follows as text — `Message.Root`, `time`, `status`. */
import { Message, VideoNote } from "prime-ui-kit";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function VideoNoteInMessageExample() {
  return (
    <Message.Group aria-label="Чат выездной бригады">
      <Message.Root direction="incoming" time="13:48">
        <VideoNote src={VIDEO_URL} duration={6} unplayed />
      </Message.Root>
      <Message.Root direction="outgoing" time="13:50" status="read">
        <Message.Text>Вижу, стойка собрана. Подключайте питание.</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="13:51" status="read">
        <VideoNote src={VIDEO_URL} duration={6} />
      </Message.Root>
    </Message.Group>
  );
}
