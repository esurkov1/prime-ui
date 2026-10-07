/** There is no `open` prop: the parent mounts and unmounts the banner. `onDismiss` adds the close button itself; `Banner.CloseButton` (a direct child of Root) is for a custom accessible name. Use it for dismissible notices. */
import { MailWarning, Sparkles } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function BannerDismissExample() {
  const [auto, setAuto] = React.useState(true);
  const [custom, setCustom] = React.useState(true);

  return (
    <div className={styles.stack}>
      {auto ? (
        <Banner.Root tone="warning" variant="soft" onDismiss={() => setAuto(false)}>
          <Banner.Content>
            <Banner.Icon as={MailWarning} aria-hidden />
            <Banner.Title>Подтвердите email, чтобы получать уведомления</Banner.Title>
          </Banner.Content>
        </Banner.Root>
      ) : null}
      {custom ? (
        <Banner.Root tone="accent" variant="soft">
          <Banner.Content>
            <Banner.Icon as={Sparkles} aria-hidden />
            <Banner.Title>Тёмная тема</Banner.Title>
            <Banner.Description>Включается в настройках профиля.</Banner.Description>
          </Banner.Content>
          <Banner.CloseButton aria-label="Скрыть объявление" onClick={() => setCustom(false)} />
        </Banner.Root>
      ) : null}
      {!auto || !custom ? (
        <Button.Root
          variant="outline"
          tone="neutral"
          className={styles.restore}
          size="s"
          onClick={() => {
            setAuto(true);
            setCustom(true);
          }}
        >
          Вернуть баннеры
        </Button.Root>
      ) : null}
    </div>
  );
}
