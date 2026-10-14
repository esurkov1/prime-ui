/** Videos in the frame: a walkthrough without a poster shows its first frame, a play mark and the duration; a briefing shows its poster and its own duration format; a short clip loops muted like a GIF; a video message plays in place with its controls — `Thumbnail.Video`, `poster`, `formatDuration`, `autoPlay`, `controls`. */
import { Icon, Thumbnail, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const POSTER = "https://picsum.photos/seed/safety-briefing/640/360";

const formatSeconds = (seconds: number) => `${Math.round(seconds)} с`;

export default function ThumbnailVideoExample() {
  return (
    <div className={styles.media}>
      <div className={styles.cardContent}>
        <Thumbnail.Root fullWidth ratio="16:9">
          <Thumbnail.Video src={CLIP} aria-label="Обход склада, запись" />
          <Thumbnail.Fallback>
            <Icon name="action.play" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography variant="caption" tone="muted">
          Обход склада · без обложки
        </Typography>
      </div>
      <div className={styles.cardContent}>
        <Thumbnail.Root fullWidth ratio="16:9">
          <Thumbnail.Video
            src={CLIP}
            poster={POSTER}
            formatDuration={formatSeconds}
            aria-label="Инструктаж по технике безопасности"
          />
          <Thumbnail.Fallback>
            <Icon name="action.play" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography variant="caption" tone="muted">
          Инструктаж · обложка, длительность в секундах
        </Typography>
      </div>
      <div className={styles.cardContent}>
        <Thumbnail.Root fullWidth ratio="16:9">
          <Thumbnail.Video src={CLIP} autoPlay aria-label="Как собрать заказ, ролик" />
          <Thumbnail.Fallback>
            <Icon name="action.play" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography variant="caption" tone="muted">
          Как собрать заказ · по кругу
        </Typography>
      </div>
      <div className={styles.cardContent}>
        <Thumbnail.Root fullWidth ratio="16:9">
          <Thumbnail.Video src={CLIP} controls aria-label="Видеосообщение от клиента" />
          <Thumbnail.Fallback>
            <Icon name="action.play" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography variant="caption" tone="muted">
          Сообщение клиента · с контролами
        </Typography>
      </div>
    </div>
  );
}
