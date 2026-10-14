/** The parent knows what plays, marks the message as listened on the first play and as heard to the end when it ends, keeps the speed and keeps the transcript open — `playing`, `onPlayingChange`, `unplayed`, `onEnded`, `rate`, `onRateChange`, `transcriptExpanded`, `onTranscriptExpandedChange`. */
import { Typography, VoicePlayer, type VoicePlayerRate } from "prime-ui-kit";
import * as React from "react";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const WAVEFORM = [
  0.3, 0.52, 0.76, 0.6, 0.36, 0.24, 0.48, 0.82, 0.92, 0.68, 0.44, 0.3, 0.56, 0.74, 0.5, 0.28, 0.42,
  0.64, 0.86, 0.58, 0.32, 0.2,
];

const TRANSCRIPT =
  "Добрый день! Машина с заказом 4821 будет у склада в девять, водитель позвонит за полчаса.";

export default function VoicePlayerControlledExample() {
  const [playing, setPlaying] = React.useState(false);
  const [unplayed, setUnplayed] = React.useState(true);
  const [heard, setHeard] = React.useState(false);
  const [rate, setRate] = React.useState<VoicePlayerRate>(1.5);
  const [transcriptOpen, setTranscriptOpen] = React.useState(false);

  const state = playing
    ? "Воспроизводится"
    : heard
      ? "Дослушано до конца"
      : unplayed
        ? "Ещё не прослушано"
        : "Прослушано";

  return (
    <>
      <VoicePlayer
        src={VOICE_URL}
        waveform={WAVEFORM}
        duration={52}
        unplayed={unplayed}
        playing={playing}
        onPlayingChange={(next) => {
          setPlaying(next);
          if (next) setUnplayed(false);
        }}
        onEnded={() => setHeard(true)}
        rate={rate}
        onRateChange={setRate}
        transcript={TRANSCRIPT}
        transcriptExpanded={transcriptOpen}
        onTranscriptExpandedChange={setTranscriptOpen}
      />
      <Typography as="p" variant="body-s" tone="secondary">
        {state} · скорость {String(rate).replace(".", ",")}× · расшифровка{" "}
        {transcriptOpen ? "открыта" : "свёрнута"}
      </Typography>
    </>
  );
}
