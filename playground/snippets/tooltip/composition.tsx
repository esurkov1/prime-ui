import { Button } from "@/components/button/Button";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

import styles from "./snippets.module.css";

export default function TooltipCompositionSnippet() {
  return (
    <div className={styles.rowWrapXlCenter}>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <LinkButton.Root href="#" onClick={(e) => e.preventDefault()}>
              Условия акции
            </LinkButton.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography.Root variant="body-small" as="p" className={styles.tooltipContentP}>
              Скидка действует до конца месяца при заказе от 3000 ₽.
            </Typography.Root>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root
              type="button"
              variant="neutral"
              mode="ghost"
              aria-label="Копировать ссылку"
            >
              <Button.Icon>
                <Icon name="action.copy" size="s" tone="subtle" />
              </Button.Icon>
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size="s">Копировать ссылку в буфер</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
