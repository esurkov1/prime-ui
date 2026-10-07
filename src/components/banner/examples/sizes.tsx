/** Sizes xs–xl: padding, icon and title follow the control tier, the description is one step smaller; pass the same `size` to action buttons. Match the banner size to the density of the surrounding UI. */
import { Info } from "lucide-react";
import { Banner, Button, type ControlSize } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function BannerSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <Banner.Root key={size} size={size} variant="soft" onDismiss={() => {}}>
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>Размер {size}</Banner.Title>
            <Banner.Description>Описание на ступень мельче заголовка.</Banner.Description>
            <Banner.Actions>
              <Button.Root variant="outline" tone="neutral" size={size}>
                Подробнее
              </Button.Root>
            </Banner.Actions>
          </Banner.Content>
        </Banner.Root>
      ))}
    </div>
  );
}
