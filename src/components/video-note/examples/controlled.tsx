/** The parent knows what plays and marks the report as watched on the first play — `playing`, `onPlayingChange`, `unplayed`. */
import { Typography, VideoNote } from "prime-ui-kit";
import * as React from "react";

const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function VideoNoteControlledExample() {
  const [playing, setPlaying] = React.useState(false);
  const [unplayed, setUnplayed] = React.useState(true);

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
      />
      <Typography as="p" variant="body-s" tone="secondary">
        {playing ? "Воспроизводится" : unplayed ? "Ещё не просмотрено" : "Просмотрено"}
      </Typography>
    </>
  );
}
