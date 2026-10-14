/** The parent knows what plays, marks the report as watched on the first play and as seen to the end when it ends, and keeps the transcript open — `playing`, `onPlayingChange`, `unplayed`, `onEnded`, `transcriptExpanded`, `onTranscriptExpandedChange`. */
import { Typography, VideoNote } from "prime-ui-kit";
import * as React from "react";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const TRANSCRIPT =
  "Стойка собрана, кабели промаркированы. Жду подтверждения, чтобы включить питание.";

export default function VideoNoteControlledExample() {
  const [playing, setPlaying] = React.useState(false);
  const [unplayed, setUnplayed] = React.useState(true);
  const [seen, setSeen] = React.useState(false);
  const [transcriptOpen, setTranscriptOpen] = React.useState(true);

  const state = playing
    ? "Воспроизводится"
    : seen
      ? "Досмотрено до конца"
      : unplayed
        ? "Ещё не просмотрено"
        : "Просмотрено";

  return (
    <>
      <VideoNote
        src={VIDEO_URL}
        duration={6}
        unplayed={unplayed}
        playing={playing}
        onPlayingChange={(next) => {
          setPlaying(next);
          if (next) setUnplayed(false);
        }}
        onEnded={() => setSeen(true)}
        transcript={TRANSCRIPT}
        transcriptExpanded={transcriptOpen}
        onTranscriptExpandedChange={setTranscriptOpen}
      />
      <Typography as="p" variant="body-s" tone="secondary">
        {state} · расшифровка {transcriptOpen ? "открыта" : "свёрнута"}
      </Typography>
    </>
  );
}
