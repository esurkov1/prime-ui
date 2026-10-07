/** Hover / focus trigger, a disabled button wrapped in a focusable span, and an inline term in text. Use to explain why an action is unavailable or what a term means. */
import { Button, Tooltip, Typography } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TooltipStatesExample() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.row}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Наведите или Tab
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Черновик сохранится на сервере</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger>
            {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the wrapper must be focusable to explain the disabled button */}
            <span className={styles.disabledWrap} tabIndex={0}>
              <Button.Root variant="soft" tone="neutral" disabled>
                Опубликовать
              </Button.Root>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content>Заполните обязательные поля, чтобы опубликовать</Tooltip.Content>
        </Tooltip.Root>

        <Typography.Root variant="body-m" tone="secondary">
          Конверсия{" "}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button type="button" className={styles.inlineHelpTrigger}>
                CR
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Доля посетителей, совершивших покупку</Tooltip.Content>
          </Tooltip.Root>{" "}
          выросла на 4%
        </Typography.Root>
      </div>
    </Tooltip.Provider>
  );
}
