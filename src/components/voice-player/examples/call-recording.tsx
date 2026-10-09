/** A sales call recording on a deal card: the player takes the card's width — `className`. */
import { Card, Typography, VoicePlayer } from "prime-ui-kit";

import styles from "./examples.module.css";

const RECORDING_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const WAVEFORM = [
  0.2, 0.34, 0.5, 0.42, 0.6, 0.78, 0.66, 0.4, 0.3, 0.52, 0.7, 0.86, 0.74, 0.48, 0.36, 0.58, 0.8,
  0.62, 0.38, 0.26, 0.44, 0.68, 0.9, 0.72, 0.5, 0.32, 0.46, 0.64, 0.54, 0.3, 0.22, 0.4, 0.6, 0.76,
  0.56, 0.34,
];

export default function VoicePlayerCallRecordingExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body className={styles.body}>
        <Typography as="p" variant="body-m" weight="medium">
          Звонок с ООО «Северный ветер»
        </Typography>
        <Typography as="p" variant="caption" tone="muted">
          12 сентября, 14:20 · Анна Морозова
        </Typography>
        <VoicePlayer
          className={styles.player}
          src={RECORDING_URL}
          waveform={WAVEFORM}
          duration={754}
          aria-label="Запись звонка"
        />
      </Card.Body>
    </Card.Root>
  );
}
