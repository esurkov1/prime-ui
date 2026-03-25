import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";

function TooltipDemoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "var(--prime-sys-spacing-s)", justifyItems: "center" }}>
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
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Подробнее
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size="m">
            Пароль должен быть не короче 12 символов, содержать буквы разного регистра и цифры. Не
            используйте пароли от других сервисов.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </TooltipDemoItem>
  );
}
