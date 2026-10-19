/** The parent owns visibility: the close button calls back, the banner fades into the restore button and focus follows it; the button name comes from labels — `onDismiss`, `labels`. */
import { Banner, Button, Crossfade, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function BannerDismissibleExample() {
  const [visible, setVisible] = React.useState(true);

  return (
    <Crossfade state={visible ? "banner" : "restore"} className={styles.region}>
      {visible ? (
        <Banner.Root
          tone="accent"
          onDismiss={() => setVisible(false)}
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
        <Button.Root variant="soft" tone="neutral" onClick={() => setVisible(true)}>
          Вернуть баннер
        </Button.Root>
      )}
    </Crossfade>
  );
}
