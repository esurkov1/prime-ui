/** The parent owns visibility: the close button calls back, the banner closes up and focus moves to the restore button; the button name comes from labels — `onDismiss`, `labels`. */
import { Banner, Button, Crossfade, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function BannerDismissibleExample() {
  const [visible, setVisible] = React.useState(true);
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLButtonElement>(null);
  const toggled = React.useRef(false);

  // The pressed button leaves with its block: focus goes to the control that takes its place.
  React.useEffect(() => {
    if (!toggled.current) return;
    if (visible) bannerRef.current?.querySelector("button")?.focus();
    else restoreRef.current?.focus();
  }, [visible]);

  const toggle = (next: boolean) => {
    toggled.current = true;
    setVisible(next);
  };

  return (
    <Crossfade state={visible ? "banner" : "restore"} className={styles.region}>
      {visible ? (
        <Banner.Root
          ref={bannerRef}
          tone="accent"
          onDismiss={() => toggle(false)}
          labels={{ dismiss: "Скрыть объявление" }}
        >
          <Banner.Content>
            <Banner.Icon>
              <Icon name="status.info" />
            </Banner.Icon>
            <Banner.Title>Тёмная тема</Banner.Title>
            <Banner.Description>Включается в настройках профиля.</Banner.Description>
          </Banner.Content>
        </Banner.Root>
      ) : (
        <Button.Root ref={restoreRef} variant="outline" tone="neutral" onClick={() => toggle(true)}>
          Вернуть баннер
        </Button.Root>
      )}
    </Crossfade>
  );
}
