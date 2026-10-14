import type * as React from "react";

import styles from "./ScreenStage.module.css";

/**
 * The content panel of an app (the AppShell panel: the page itself, cards on it are layer 1) inside
 * the preview stage: a `screen` example renders only its page, exactly as it would in a consumer
 * app. A screen that fills the panel's height gets a viewport-high column (see the CSS).
 */
export function ScreenStage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.screenFrame}>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}

export const screenStage = (preview: React.ReactNode) => <ScreenStage>{preview}</ScreenStage>;
