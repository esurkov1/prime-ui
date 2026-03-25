import { Tag } from "@/components/tag/Tag";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";

export default function TagContextSizeSnippet() {
  return (
    <div className="row rowGapTight rowAlignCenter">
      <ControlSizeProvider value="s">
        <Tag.Root>Без size — из контекста s</Tag.Root>
      </ControlSizeProvider>
      <ControlSizeProvider value="l">
        <Tag.Root>Без size — из контекста l</Tag.Root>
      </ControlSizeProvider>
    </div>
  );
}
