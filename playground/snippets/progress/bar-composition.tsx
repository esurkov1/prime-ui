import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Typography } from "@/components/typography/Typography";

/** Полоса рядом с заголовком и поясняющим текстом — как блок в мастере или отчёте. */
export default function ProgressBarCompositionSnippet() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-spacing-s)" }}>
      <Typography.Root size="l" weight="semibold">
        Создание отчёта
      </Typography.Root>
      <ProgressBar.Root value={72} max={100} size="m" label="Сбор данных" />
      <Typography.Root size="s" tone="muted">
        Обычно до пяти минут; можно вернуться к списку задач.
      </Typography.Root>
    </div>
  );
}
