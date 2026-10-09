/** The other side's status line follows what you do: typing, recording a voice or a video message, then nothing — `onActivityChange`. */
import { Composer, type ComposerActivity, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ACTIVITY_TEXT: Record<ComposerActivity, string> = {
  typing: "Анна видит: «печатает…»",
  voice: "Анна видит: «записывает голосовое…»",
  video: "Анна видит: «записывает видео…»",
};

export default function ComposerTypingExample() {
  const [activity, setActivity] = React.useState<ComposerActivity | null>(null);

  return (
    <div className={styles.chat}>
      <Typography as="p" variant="body-s" tone="secondary" aria-live="polite">
        {activity ? ACTIVITY_TEXT[activity] : "Анна видит: «в сети»"}
      </Typography>
      <Composer.Root onActivityChange={setActivity} onSend={() => {}} onSendVoice={() => {}} />
    </div>
  );
}
