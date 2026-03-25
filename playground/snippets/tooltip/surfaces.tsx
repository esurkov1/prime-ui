import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";

function Panel({
  label,
  style,
  children,
}: {
  label: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--prime-sys-spacing-m)",
        justifyItems: "center",
        padding: "var(--prime-sys-spacing-l)",
        borderRadius: "var(--prime-sys-radius-m)",
        ...style,
      }}
    >
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** Один визуальный стиль подсказки на разных фонах интерфейса (токены темы). */
export default function TooltipSurfacesSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "stretch",
      }}
    >
      <Panel
        label="Фон surface-default"
        style={{ background: "var(--prime-sys-color-surface-default)" }}
      >
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
      <Panel
        label="Фон surface-raised"
        style={{
          background: "var(--prime-sys-color-surface-raised)",
          boxShadow: "var(--prime-sys-elevation-shadow-surface)",
        }}
      >
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
