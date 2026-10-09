/** Voice and round video messages: hold the button to record and release to send, slide left to cancel, slide up or tap to record hands-free; a double tap or double click switches voice and video — `onSendVoice`, `onSendVideoNote`, `recordMode`. */
import { Composer, type ComposerRecordMode } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ComposerVoiceExample() {
  const [recordMode, setRecordMode] = React.useState<ComposerRecordMode>("voice");

  return (
    <div className={`${styles.chat} ${styles.withPreview}`}>
      <Composer.Root
        recordMode={recordMode}
        onRecordModeChange={setRecordMode}
        onSendVoice={() => {}}
        onSendVideoNote={() => {}}
        onSend={() => {}}
      />
    </div>
  );
}
