/** Voice messages with a transcript: one known, one asked for on the first open — `transcript`, `onTranscribe`. */
import { Message, VoicePlayer } from "prime-ui-kit";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const CLIENT_WAVEFORM = [
  0.24, 0.4, 0.66, 0.82, 0.58, 0.34, 0.5, 0.76, 0.92, 0.7, 0.46, 0.28, 0.54, 0.8, 0.62, 0.36, 0.22,
  0.44, 0.7, 0.86, 0.6, 0.32,
];

const AGENT_WAVEFORM = [
  0.3, 0.56, 0.74, 0.5, 0.28, 0.62, 0.88, 0.72, 0.42, 0.26, 0.48, 0.68, 0.84, 0.58, 0.36, 0.52,
  0.78, 0.64, 0.4, 0.2,
];

const CLIENT_TRANSCRIPT =
  "Добрый день! По заказу 4821 пришли две коробки вместо трёх, в накладной указаны три места. Подскажите, когда довезут остальное?";

const AGENT_TRANSCRIPT =
  "Третья коробка уехала отдельной машиной, она будет у вас завтра до обеда. Трек-номер пришлю сообщением.";

/** The speech service answers in a moment. */
function transcribeAgentVoice(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(AGENT_TRANSCRIPT), 1200));
}

export default function VoicePlayerTranscriptExample() {
  return (
    <Message.Group aria-label="Чат с клиентом: заказ № 4821">
      <Message.Root direction="incoming" time="14:20">
        <VoicePlayer
          src={VOICE_URL}
          waveform={CLIENT_WAVEFORM}
          duration={18}
          transcript={CLIENT_TRANSCRIPT}
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="14:22" status="read">
        <VoicePlayer
          src={VOICE_URL}
          waveform={AGENT_WAVEFORM}
          duration={11}
          onTranscribe={transcribeAgentVoice}
        />
      </Message.Root>
    </Message.Group>
  );
}
