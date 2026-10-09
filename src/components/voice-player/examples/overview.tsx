/** A client's voice message to support, ready to play — `src`, `waveform`, `duration`. */
import { VoicePlayer } from "prime-ui-kit";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const WAVEFORM = [
  0.18, 0.32, 0.55, 0.72, 0.48, 0.3, 0.62, 0.88, 0.95, 0.7, 0.42, 0.26, 0.5, 0.78, 0.64, 0.38, 0.2,
  0.44, 0.69, 0.83, 0.58, 0.34, 0.22, 0.4, 0.66, 0.9, 0.76, 0.5, 0.28, 0.16,
];

export default function VoicePlayerOverviewExample() {
  return <VoicePlayer src={VOICE_URL} waveform={WAVEFORM} duration={37} />;
}
