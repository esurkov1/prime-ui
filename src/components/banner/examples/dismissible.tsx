/** The parent owns visibility: the close button calls back and the parent unmounts the banner; the button name comes from labels — `onDismiss`, `labels`. */
import { Banner, Button, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function BannerDismissibleExample() {
  const [visible, setVisible] = React.useState(true);

  return (
    <div className={styles.stack}>
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
        <Button.Root
          variant="outline"
          tone="neutral"
          className={styles.restore}
          onClick={() => setVisible(true)}
        >
          Вернуть баннер
        </Button.Root>
      )}
    </div>
  );
}
