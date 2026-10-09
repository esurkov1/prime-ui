/** Voice messages in a support chat: the player sits on the bubble fill and the bubble's time stands in its corner — `Message.Root`, `time`, `status`. */
import { Message, VoicePlayer } from "prime-ui-kit";

import styles from "./examples.module.css";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const CLIENT_WAVEFORM = [
  0.24, 0.4, 0.66, 0.82, 0.58, 0.34, 0.5, 0.76, 0.92, 0.7, 0.46, 0.28, 0.54, 0.8, 0.62, 0.36, 0.22,
  0.44, 0.7, 0.86, 0.6, 0.32,
];

const AGENT_WAVEFORM = [
  0.3, 0.56, 0.74, 0.5, 0.28, 0.62, 0.88, 0.72, 0.42, 0.26, 0.48, 0.68, 0.84, 0.58, 0.36, 0.52,
  0.78, 0.64, 0.4, 0.2,
];

export default function VoicePlayerInMessageExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="14:20">
        <VoicePlayer src={VOICE_URL} waveform={CLIENT_WAVEFORM} duration={18} unplayed />
      </Message.Root>
      <Message.Root direction="outgoing" time="14:22" status="read">
        <VoicePlayer src={VOICE_URL} waveform={AGENT_WAVEFORM} duration={11} />
      </Message.Root>
    </div>
  );
}
