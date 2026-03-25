import { Tag } from "@/components/tag/Tag";

export default function TagDisabledSnippet() {
  return (
    <div className="row rowGapTight">
      <Tag.Root disabled>Read-only</Tag.Root>
      <Tag.Root disabled onRemove={() => undefined}>
        Cannot remove
      </Tag.Root>
    </div>
  );
}
