import type { ReactNode } from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { cx } from "@/internal/cx";

import styles from "./snippets.module.css";

function Panel({
  label,
  variant,
  children,
}: {
  label: string;
  variant: "default" | "raised";
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        styles.surfacePanel,
        variant === "default" ? styles.surfaceDefault : styles.surfaceRaised,
      )}
    >
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** Один визуальный стиль подсказки на разных фонах интерфейса (токены темы). */
export default function TooltipSurfacesSnippet() {
  return (
    <div className={styles.rowWrapMStretch}>
      <Panel label="Фон surface-default" variant="default">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Наведите
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Подсказка на нейтральном фоне страницы</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Panel>
      <Panel label="Фон surface-raised" variant="raised">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Наведите
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Подсказка на приподнятой карточке</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Panel>
    </div>
  );
}
