/** Stickers in a conversation: a picture by its address and a video sticker in your own player, no bubble, the time on a pill over the corner — `Message.Sticker`, `src`, `loading`. */
import { Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const THUMBS_UP = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.webp";
const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function MessageStickerExample() {
  const [clipReady, setClipReady] = React.useState(false);

  return (
    <div className={styles.thread}>
      <Message.Root value="sticker-text" time="10:42">
        <Message.Text>Отгрузку подтвердили, машина выезжает в 14:00.</Message.Text>
      </Message.Root>
      <Message.Root value="sticker-image" direction="outgoing" time="10:43" status="read">
        <Message.Sticker src={THUMBS_UP} aria-label="Стикер «Класс»" />
      </Message.Root>
      <Message.Root value="sticker-video" time="10:44">
        <Message.Sticker aria-label="Видеостикер «Цветок»" loading={!clipReady}>
          <video
            src={CLIP}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setClipReady(true)}
          />
        </Message.Sticker>
      </Message.Root>
    </div>
  );
}
