import { Tag } from "@/components/tag/Tag";

export default function TagBasicSnippet() {
  return (
    <div className="row rowGapTight">
      <Tag.Root>React</Tag.Root>
      <Tag.Root>TypeScript</Tag.Root>
      <Tag.Root>prime-ui-kit</Tag.Root>
    </div>
  );
}
