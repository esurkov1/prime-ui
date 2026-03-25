import { Badge } from "@/components/badge/Badge";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";

/** Без явного size бейдж берёт размер из ControlSizeContext (как рядом с кнопкой или полем). */
export default function BadgeContextSizeSnippet() {
  return (
    <div className="stack" style={{ gap: "12px", alignItems: "flex-start" }}>
      <ControlSizeProvider value="s">
        <Badge.Root variant="light" color="gray">
          Контекст s
        </Badge.Root>
      </ControlSizeProvider>
      <ControlSizeProvider value="xl">
        <Badge.Root variant="light" color="gray">
          Контекст xl
        </Badge.Root>
      </ControlSizeProvider>
      <ControlSizeProvider value="xs">
        <Badge.Root variant="stroke" color="blue">
          xs → s
        </Badge.Root>
      </ControlSizeProvider>
    </div>
  );
}
