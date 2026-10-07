/** Why an action is unavailable: a disabled button inside a focusable wrapper still shows its tooltip on hover and Tab — `Tooltip.Trigger`. */
import { Button, Tooltip } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TooltipDisabledTriggerExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the wrapper must be focusable to explain the disabled button */}
        <span className={styles.disabledWrap} tabIndex={0}>
          <Button.Root disabled>Опубликовать</Button.Root>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>Заполните обязательные поля, чтобы опубликовать</Tooltip.Content>
    </Tooltip.Root>
  );
}
