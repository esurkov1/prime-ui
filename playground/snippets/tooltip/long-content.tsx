import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";

import styles from "./snippets.module.css";

function TooltipDemoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demoItem}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** Многострочный контент, ограничение по max-width из стилей, перенос слов. */
export default function TooltipLongContentSnippet() {
  return (
    <TooltipDemoItem label="Длинный текст, size m">
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke">
              Подробнее
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            Пароль должен быть не короче 12 символов, содержать буквы разного регистра и цифры. Не
            используйте пароли от других сервисов.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </TooltipDemoItem>
  );
}
