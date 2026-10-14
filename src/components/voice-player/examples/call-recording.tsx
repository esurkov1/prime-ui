/** A sales call recording on a deal card: the telephony stores no levels, so the waveform is read from the audio itself and the calm flat row fills in once it is ready; the player takes the card's width — `getWaveform`, `waveform`, `className`. */
import { Card, getWaveform, Typography, VoicePlayer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const RECORDING_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

export default function VoicePlayerCallRecordingExample() {
  const [waveform, setWaveform] = React.useState<number[]>();

  React.useEffect(() => {
    let current = true;
    getWaveform(RECORDING_URL)
      .then((levels) => {
        if (current) setWaveform([...levels]);
      })
      // Without levels the player keeps its flat row: the recording still plays.
      .catch(() => {});
    return () => {
      current = false;
    };
  }, []);

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
          waveform={waveform}
          duration={754}
          aria-label="Запись звонка"
        />
      </Card.Body>
    </Card.Root>
  );
}
