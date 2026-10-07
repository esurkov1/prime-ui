/** Below 36rem of its own width the banner moves the actions under the text. */
import { Banner, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BannerNarrowExample() {
  return (
    <div className={styles.narrow}>
      <Banner.Root tone="warning" onDismiss={() => undefined}>
        <Banner.Content>
          <Banner.Icon>
            <Icon name="status.warning" />
          </Banner.Icon>
          <Banner.Title>Пробный период закончится 12 октября</Banner.Title>
          <Banner.Description>Выберите тариф, чтобы сохранить отчёты команды.</Banner.Description>
          <Banner.Actions>
            <Button.Root>Выбрать тариф</Button.Root>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>
    </div>
  );
}
