/** Voice messages on their bubbles: the player keeps room for the time in the corner; a new one carries the unplayed dot until it is played — `VoicePlayer`, `unplayed`. */
import { Message, VoicePlayer } from "prime-ui-kit";
import * as React from "react";

const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const WAVE_IN = [
  0.2, 0.35, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9, 0.65, 0.4, 0.25, 0.55, 0.85, 0.7, 0.45, 0.3, 0.5, 0.75,
  0.6, 0.35, 0.2, 0.4, 0.65, 0.5, 0.3,
];

const WAVE_OUT = [
  0.3, 0.5, 0.4, 0.7, 0.9, 0.6, 0.35, 0.5, 0.8, 0.55, 0.3, 0.45, 0.7, 0.4, 0.25, 0.6, 0.8, 0.5, 0.3,
  0.2,
];

export default function MessageVoiceExample() {
  const [unplayed, setUnplayed] = React.useState(true);
  return (
    <Message.Group aria-label="Переписка с поставщиком">
      <Message.Root direction="incoming" time="10:41">
        <VoicePlayer
          src={AUDIO}
          waveform={WAVE_IN}
          duration={27}
          unplayed={unplayed}
          onPlayingChange={(playing) => {
            if (playing) setUnplayed(false);
          }}
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="10:44" status="read">
        <VoicePlayer src={AUDIO} waveform={WAVE_OUT} duration={14} />
      </Message.Root>
    </Message.Group>
  );
}
