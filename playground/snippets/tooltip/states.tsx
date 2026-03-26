import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";

import styles from "./snippets.module.css";

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demoItem}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

export default function TooltipStatesSnippet() {
  return (
    <div className={styles.rowWrapXlJustifyCenter}>
      <Block label="Обычная кнопка — hover и фокус">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Сохранить
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Отправить черновик на сервер</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
      <Block label="Кнопка disabled — hover не открывает подсказку">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m" disabled>
                Недоступно
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Этот текст не появится при наведении на нативный disabled
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
      <Block label="Фокус с клавиатуры — кнопка без оформления">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button type="button" className={styles.inlineHelpTrigger}>
                Сокращение KPI
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Key performance indicator — ключевой показатель эффективности
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
    </div>
  );
}
