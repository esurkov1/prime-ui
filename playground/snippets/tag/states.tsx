import { Tag } from "@/components/tag/Tag";

export default function TagStatesSnippet() {
  return (
    <div className="row rowGapTight rowAlignCenter">
      <Tag.Root>Обычный</Tag.Root>
      <Tag.Root onRemove={() => undefined}>С кнопкой снятия</Tag.Root>
      <Tag.Root disabled>Отключён</Tag.Root>
      <Tag.Root disabled onRemove={() => undefined}>
        Отключён, крестик неактивен
      </Tag.Root>
    </div>
  );
}
